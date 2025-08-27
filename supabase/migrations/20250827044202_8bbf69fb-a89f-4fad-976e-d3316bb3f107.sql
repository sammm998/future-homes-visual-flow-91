-- Fix remaining security issues from linter

-- Enable leaked password protection
ALTER ROLE postgres SET auth.password_strength_checks = 'strong';

-- Fix function search path for existing functions
ALTER FUNCTION public.is_admin_user(uuid) SET search_path = public;
ALTER FUNCTION public.generate_property_slug(text) SET search_path = public;
ALTER FUNCTION public.normalize_price_to_eur(numeric, text) SET search_path = public;
ALTER FUNCTION public.translate_text(text, text, text) SET search_path = public;

-- Fix security definer view by creating a safer alternative
DROP VIEW IF EXISTS team_members_safe;
CREATE VIEW team_members_safe AS 
SELECT 
  id,
  name,
  role,
  bio,
  image_url,
  display_order,
  is_active
FROM team_members 
WHERE is_active = true;

-- Enable RLS on the view (this is safer than SECURITY DEFINER)
ALTER VIEW team_members_safe SET (security_barrier = true);

-- Grant public access to the safe view
GRANT SELECT ON team_members_safe TO anon, authenticated;