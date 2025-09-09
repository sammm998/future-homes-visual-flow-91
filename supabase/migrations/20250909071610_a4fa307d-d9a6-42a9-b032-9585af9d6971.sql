-- Fix security issues from the linter

-- 1. Fix any potential security definer views by recreating with security_invoker
-- Check if there are any views that need fixing and recreate the monitoring view properly
CREATE OR REPLACE VIEW public.property_insertion_monitoring 
WITH (security_invoker=on) AS
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
WHERE is_admin() -- Only show data if user is admin
ORDER BY pil.created_at DESC;

-- 2. Fix function search_path issues by updating functions to have proper search_path
-- Update the enhanced_normalize_property_data function
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
    IF recent_insertions >= 10 AND NOT public.is_admin(current_user_id) THEN
        rate_limit_exceeded := true;
    END IF;
    
    -- Check minute-level rate limiting (3 per minute)
    SELECT COUNT(*) INTO recent_insertions
    FROM public.property_insertion_log 
    WHERE user_id = current_user_id 
    AND created_at > NOW() - INTERVAL '1 minute';
    
    IF recent_insertions >= 3 AND NOT public.is_admin(current_user_id) THEN
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
        FROM public.properties 
        WHERE ref_no = NEW.ref_no 
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);
        
        IF duplicate_count > 0 THEN
            RAISE EXCEPTION 'Reference number "%" already exists in the database', NEW.ref_no;
        END IF;
    END IF;
    
    -- Check for title + location duplicates (case insensitive)
    SELECT COUNT(*) INTO duplicate_count
    FROM public.properties 
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

-- Update detect_suspicious_patterns function
CREATE OR REPLACE FUNCTION public.detect_suspicious_patterns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    recent_bulk_insertions INTEGER;
    current_user_id UUID;
BEGIN
    current_user_id := auth.uid();
    
    -- Skip some checks for admins
    IF public.is_admin(current_user_id) THEN
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
    
    RETURN NEW;
END;
$$;

-- Update auto_backup_before_bulk_changes function
CREATE OR REPLACE FUNCTION public.auto_backup_before_bulk_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    recent_changes INTEGER;
BEGIN
    -- Check if this might be part of a bulk operation
    SELECT COUNT(*) INTO recent_changes
    FROM public.property_insertion_log 
    WHERE created_at > NOW() - INTERVAL '1 minute';
    
    -- If more than 3 changes in the last minute, log it
    IF recent_changes >= 3 THEN
        RAISE LOG 'Auto-backup recommended: % property changes detected in last minute', recent_changes;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Log successful security fixes
DO $$
BEGIN
    RAISE LOG 'Security issues fixed: Views now use security_invoker, functions have proper search_path';
END
$$;