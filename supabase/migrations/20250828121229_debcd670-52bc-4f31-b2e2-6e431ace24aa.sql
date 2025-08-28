-- Fix security definer view issue by creating a regular view instead
DROP VIEW IF EXISTS public.team_members_public;

-- Create a regular view (not security definer) for safe team member access
CREATE VIEW public.team_members_public AS
SELECT 
  id,
  name,
  position,
  bio,
  image_url,
  linkedin_url,
  display_order,
  is_active,
  created_at
FROM public.team_members
WHERE is_active = true
ORDER BY display_order;