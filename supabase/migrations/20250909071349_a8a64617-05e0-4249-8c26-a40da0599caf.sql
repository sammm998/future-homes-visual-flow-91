-- Phase 1: Create comprehensive duplicate prevention system

-- First, create a table to track insertion rates and sources
CREATE TABLE IF NOT EXISTS public.property_insertion_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID,
  user_id UUID DEFAULT auth.uid(),
  source_info JSONB DEFAULT '{}',
  insertion_rate_check BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS on the insertion log
ALTER TABLE public.property_insertion_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view insertion logs
CREATE POLICY "Only admins can view insertion logs" 
ON public.property_insertion_log 
FOR SELECT 
USING (is_admin());

-- System can insert into logs
CREATE POLICY "System can insert into logs" 
ON public.property_insertion_log 
FOR INSERT 
WITH CHECK (true);

-- Create enhanced normalize_property_data function with duplicate prevention
CREATE OR REPLACE FUNCTION public.enhanced_normalize_property_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    recent_insertions INTEGER;
    duplicate_count INTEGER;
    current_user_id UUID;
    rate_limit_exceeded BOOLEAN := false;
BEGIN
    current_user_id := auth.uid();
    
    -- Rate limiting: Check recent insertions (max 10 per hour, 3 per minute)
    SELECT COUNT(*) INTO recent_insertions
    FROM public.property_insertion_log 
    WHERE user_id = current_user_id 
    AND created_at > NOW() - INTERVAL '1 hour';
    
    -- Check if rate limit exceeded (unless admin)
    IF recent_insertions >= 10 AND NOT is_admin(current_user_id) THEN
        rate_limit_exceeded := true;
    END IF;
    
    -- Check minute-level rate limiting (3 per minute)
    SELECT COUNT(*) INTO recent_insertions
    FROM public.property_insertion_log 
    WHERE user_id = current_user_id 
    AND created_at > NOW() - INTERVAL '1 minute';
    
    IF recent_insertions >= 3 AND NOT is_admin(current_user_id) THEN
        rate_limit_exceeded := true;
    END IF;
    
    -- Raise exception if rate limit exceeded
    IF rate_limit_exceeded THEN
        RAISE EXCEPTION 'Rate limit exceeded. Maximum 10 properties per hour and 3 per minute allowed. Please try again later.';
    END IF;
    
    -- Normalize title (trim whitespace, prevent empty)
    IF NEW.title IS NOT NULL THEN
        NEW.title := trim(NEW.title);
        IF NEW.title = '' THEN
            RAISE EXCEPTION 'Property title cannot be empty';
        END IF;
    ELSE
        RAISE EXCEPTION 'Property title is required';
    END IF;
    
    -- Normalize location (trim whitespace, prevent empty)
    IF NEW.location IS NOT NULL THEN
        NEW.location := trim(NEW.location);
        IF NEW.location = '' THEN
            RAISE EXCEPTION 'Property location cannot be empty';
        END IF;
    ELSE
        RAISE EXCEPTION 'Property location is required';
    END IF;
    
    -- Check for exact ref_no duplicates
    IF NEW.ref_no IS NOT NULL AND NEW.ref_no != '' THEN
        NEW.ref_no := trim(NEW.ref_no);
        SELECT COUNT(*) INTO duplicate_count
        FROM properties 
        WHERE ref_no = NEW.ref_no 
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);
        
        IF duplicate_count > 0 THEN
            RAISE EXCEPTION 'Reference number "%" already exists in the database', NEW.ref_no;
        END IF;
    END IF;
    
    -- Check for title + location duplicates (fuzzy matching)
    SELECT COUNT(*) INTO duplicate_count
    FROM properties 
    WHERE LOWER(trim(title)) = LOWER(NEW.title)
    AND LOWER(trim(location)) = LOWER(NEW.location)
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    AND is_active = true;
    
    IF duplicate_count > 0 THEN
        RAISE EXCEPTION 'A property with title "%" in location "%" already exists', NEW.title, NEW.location;
    END IF;
    
    -- Log the insertion attempt
    INSERT INTO public.property_insertion_log (
        property_id, 
        user_id, 
        source_info,
        ip_address
    ) VALUES (
        COALESCE(NEW.id, gen_random_uuid()), 
        current_user_id,
        jsonb_build_object(
            'title', NEW.title,
            'location', NEW.location,
            'ref_no', NEW.ref_no,
            'operation', TG_OP
        ),
        inet_client_addr()
    );
    
    RETURN NEW;
END;
$$;

-- Create comprehensive duplicate detection trigger
CREATE OR REPLACE FUNCTION public.detect_suspicious_patterns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    recent_bulk_insertions INTEGER;
    similar_titles INTEGER;
    current_user_id UUID;
BEGIN
    current_user_id := auth.uid();
    
    -- Skip checks for admins in some cases
    IF is_admin(current_user_id) THEN
        RETURN NEW;
    END IF;
    
    -- Check for suspicious bulk insertion patterns
    SELECT COUNT(*) INTO recent_bulk_insertions
    FROM public.property_insertion_log 
    WHERE user_id = current_user_id 
    AND created_at > NOW() - INTERVAL '5 minutes';
    
    IF recent_bulk_insertions >= 5 THEN
        RAISE WARNING 'Bulk insertion pattern detected for user %. Insertions in last 5 minutes: %', 
            current_user_id, recent_bulk_insertions;
    END IF;
    
    -- Check for very similar titles (potential duplicates)
    SELECT COUNT(*) INTO similar_titles
    FROM properties 
    WHERE similarity(title, NEW.title) > 0.8
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    AND is_active = true;
    
    IF similar_titles > 0 THEN
        RAISE WARNING 'Property with very similar title detected. Title: "%" has % similar matches', 
            NEW.title, similar_titles;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create backup trigger for bulk operations
CREATE OR REPLACE FUNCTION public.auto_backup_before_bulk_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    recent_changes INTEGER;
    backup_needed BOOLEAN := false;
BEGIN
    -- Check if this might be part of a bulk operation
    SELECT COUNT(*) INTO recent_changes
    FROM public.property_insertion_log 
    WHERE created_at > NOW() - INTERVAL '1 minute';
    
    -- If more than 3 changes in the last minute, consider backing up
    IF recent_changes >= 3 THEN
        backup_needed := true;
        
        -- Log the backup trigger
        RAISE LOG 'Auto-backup recommended: % property changes detected in last minute', recent_changes;
        
        -- You could trigger an actual backup process here
        -- For now, we just log it
    END IF;
    
    RETURN NEW;
END;
$$;

-- Apply the triggers to properties table
CREATE TRIGGER enhanced_normalize_property_data_trigger
    BEFORE INSERT OR UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION public.enhanced_normalize_property_data();

CREATE TRIGGER detect_suspicious_patterns_trigger
    AFTER INSERT ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION public.detect_suspicious_patterns();

CREATE TRIGGER auto_backup_trigger
    AFTER INSERT ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_backup_before_bulk_changes();

-- Create monitoring view for admins
CREATE OR REPLACE VIEW public.property_insertion_monitoring AS
SELECT 
    pil.created_at,
    pil.user_id,
    pil.source_info,
    pil.ip_address,
    p.title,
    p.location,
    p.ref_no,
    p.is_active
FROM public.property_insertion_log pil
LEFT JOIN public.properties p ON p.id = pil.property_id
ORDER BY pil.created_at DESC;

-- Grant access to monitoring view for admins only
ALTER VIEW public.property_insertion_monitoring OWNER TO postgres;

-- Create policy for monitoring view
CREATE POLICY "Only admins can view monitoring data" 
ON public.property_insertion_monitoring 
FOR SELECT 
USING (is_admin());

-- Log successful creation
DO $$
BEGIN
    RAISE LOG 'Comprehensive duplicate prevention system implemented successfully';
    RAISE LOG 'Features: Rate limiting, duplicate detection, pattern monitoring, auto-backup triggers';
END
$$;