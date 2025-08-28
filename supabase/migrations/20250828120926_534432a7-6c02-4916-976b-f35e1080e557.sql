-- Fix critical security issues: properly drop all existing policies first

-- Drop ALL existing policies on team_members table
DROP POLICY IF EXISTS "Team members are viewable by everyone" ON public.team_members;
DROP POLICY IF EXISTS "Only admins can manage team members" ON public.team_members;
DROP POLICY IF EXISTS "Public can view safe team member info" ON public.team_members;
DROP POLICY IF EXISTS "Only authenticated admins can manage team members" ON public.team_members;

-- Drop ALL existing policies on voice_calls table
DROP POLICY IF EXISTS "Only admins can delete voice calls" ON public.voice_calls;
DROP POLICY IF EXISTS "Only admins can read voice calls" ON public.voice_calls;
DROP POLICY IF EXISTS "Only admins can update voice calls" ON public.voice_calls;
DROP POLICY IF EXISTS "System can create voice calls" ON public.voice_calls;
DROP POLICY IF EXISTS "Users can view their own voice calls by session" ON public.voice_calls;
DROP POLICY IF EXISTS "Users can create their own voice calls" ON public.voice_calls;
DROP POLICY IF EXISTS "Authenticated admins can manage all voice calls" ON public.voice_calls;

-- Create secure policies for team_members - restrict public access to sensitive data
CREATE POLICY "Public can view safe team member info" 
ON public.team_members 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only authenticated admins can manage team members" 
ON public.team_members 
FOR ALL
USING (public.get_current_user_admin_status() = true)
WITH CHECK (public.get_current_user_admin_status() = true);

-- Create secure policies for voice_calls
CREATE POLICY "System can create voice calls" 
ON public.voice_calls 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role'::text OR public.get_current_user_admin_status() = true);

CREATE POLICY "Only admins can manage voice calls" 
ON public.voice_calls 
FOR ALL
USING (public.get_current_user_admin_status() = true)
WITH CHECK (public.get_current_user_admin_status() = true);

-- Update the team_members_public view to ensure it doesn't expose sensitive data
DROP VIEW IF EXISTS public.team_members_public;
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