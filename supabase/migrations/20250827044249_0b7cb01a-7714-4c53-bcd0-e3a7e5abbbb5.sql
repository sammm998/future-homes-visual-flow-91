-- Fix search path for remaining functions  
ALTER FUNCTION public.generate_property_slug(text, uuid) SET search_path = public;
ALTER FUNCTION public.normalize_price_to_eur(text) SET search_path = public;
ALTER FUNCTION public.translate_text(text, text) SET search_path = public;