-- Fix Function Search Path Mutable security warning
-- Set search_path for functions that don't have it properly configured

-- Update generate_property_slug function
CREATE OR REPLACE FUNCTION public.generate_property_slug(title_param text, id_param uuid)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 0;
BEGIN
  -- Create base slug from title
  base_slug := lower(trim(regexp_replace(title_param, '[^a-zA-Z0-9\s]', '', 'g')));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  
  -- If base_slug is empty, use ID
  if base_slug = '' or base_slug is null then
    base_slug := id_param::text;
  end if;
  
  final_slug := base_slug;
  
  -- Check for duplicates and append counter if needed
  while exists (select 1 from public.properties where slug = final_slug and id != id_param) loop
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  end loop;
  
  return final_slug;
END;
$function$;

-- Update normalize_price_to_eur function
CREATE OR REPLACE FUNCTION public.normalize_price_to_eur(price_string text)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    numeric_value numeric;
    currency_symbol text;
    result text;
BEGIN
    -- Return empty if input is null or empty
    IF price_string IS NULL OR trim(price_string) = '' THEN
        RETURN price_string;
    END IF;
    
    -- Extract numeric value (remove all non-numeric except decimal points and commas)
    numeric_value := regexp_replace(price_string, '[^\d.,]', '', 'g');
    
    -- Handle European number format (comma as decimal separator)
    numeric_value := replace(numeric_value, '.', '');
    numeric_value := replace(numeric_value, ',', '.');
    numeric_value := numeric_value::numeric;
    
    -- Detect original currency and convert to EUR
    IF price_string ~ '\$' THEN
        -- Convert from USD to EUR (assuming 1 USD = 0.91 EUR)
        numeric_value := numeric_value * 0.91;
    ELSIF price_string ~ '£' THEN
        -- Convert from GBP to EUR (assuming 1 GBP = 1.18 EUR)
        numeric_value := numeric_value * 1.18;
    ELSIF price_string ~ '₺' THEN
        -- Convert from TRY to EUR (assuming 1 TRY = 0.031 EUR)
        numeric_value := numeric_value * 0.031;
    END IF;
    -- If EUR or no currency symbol, keep as is
    
    -- Format as EUR
    result := '€' || to_char(numeric_value, 'FM999,999,999');
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        -- If conversion fails, return original value
        RETURN price_string;
END;
$function$;

-- Update translate_text function
CREATE OR REPLACE FUNCTION public.translate_text(text_to_translate text, target_language text DEFAULT 'sv'::text)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- This is a placeholder function that will be enhanced with OpenAI integration
  -- For now, return the original text
  RETURN text_to_translate;
END;
$function$;

-- Update update_newsletter_updated_at function (this one was missing SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.update_newsletter_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;