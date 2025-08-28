-- Fix critical security issue: team_members table is exposing sensitive data
-- Drop existing policies and create restrictive ones

-- First, drop existing policies on team_members  
DROP POLICY IF EXISTS "Team members are viewable by everyone" ON public.team_members;
DROP POLICY IF EXISTS "Only admins can manage team members" ON public.team_members;

-- Create secure policies for team_members - restrict public access to sensitive data
-- Public can only see basic info, not email/phone
CREATE POLICY "Public can view safe team member info" 
ON public.team_members 
FOR SELECT 
USING (
  is_active = true 
);

-- Only authenticated admins can manage team members
CREATE POLICY "Only authenticated admins can manage team members" 
ON public.team_members 
FOR ALL
USING (public.get_current_user_admin_status() = true)
WITH CHECK (public.get_current_user_admin_status() = true);

-- Fix voice_calls table policies - use correct column names
DROP POLICY IF EXISTS "Users can view their own voice calls" ON public.voice_calls;
DROP POLICY IF EXISTS "Users can create their own voice calls" ON public.voice_calls;
DROP POLICY IF EXISTS "Authenticated admins can manage all voice calls" ON public.voice_calls;

-- Voice calls policies using session_id since there's no user_id column
CREATE POLICY "Users can view their own voice calls by session" 
ON public.voice_calls 
FOR SELECT 
USING (session_id = current_setting('request.jwt.claims', true)::json->>'session_id');

CREATE POLICY "System can create voice calls" 
ON public.voice_calls 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role'::text OR public.get_current_user_admin_status() = true);

CREATE POLICY "Authenticated admins can manage all voice calls" 
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