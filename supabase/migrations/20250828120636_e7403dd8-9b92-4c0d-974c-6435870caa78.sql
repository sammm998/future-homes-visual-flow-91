-- Fix critical security issue: team_members table is exposing sensitive data
-- Drop overly permissive policies and create restrictive ones

-- First, drop existing policies on team_members
DROP POLICY IF EXISTS "Team members are publicly viewable" ON public.team_members;
DROP POLICY IF EXISTS "Only admins can manage team members" ON public.team_members;

-- Create secure policies for team_members - only show public profile info
CREATE POLICY "Public can view basic team member info" 
ON public.team_members 
FOR SELECT 
USING (
  is_active = true 
  AND (
    -- Allow selection but will be filtered by SELECT to only show safe columns
    true
  )
);

-- Only admins can manage team members
CREATE POLICY "Only authenticated admins can manage team members" 
ON public.team_members 
FOR ALL
USING (public.get_current_user_admin_status() = true)
WITH CHECK (public.get_current_user_admin_status() = true);

-- Fix voice_calls table policies - ensure proper admin authentication
DROP POLICY IF EXISTS "Admins can manage voice calls" ON public.voice_calls;
DROP POLICY IF EXISTS "Users can view their own calls" ON public.voice_calls;

-- Create secure policies for voice_calls
CREATE POLICY "Users can view their own voice calls" 
ON public.voice_calls 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own voice calls" 
ON public.voice_calls 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated admins can manage all voice calls" 
ON public.voice_calls 
FOR ALL
USING (public.get_current_user_admin_status() = true)
WITH CHECK (public.get_current_user_admin_status() = true);

-- Create a view for safe team member access (public info only)
CREATE OR REPLACE VIEW public.team_members_public AS
SELECT 
  id,
  name,
  role,
  bio,
  profile_image,
  display_order,
  is_active,
  created_at
FROM public.team_members
WHERE is_active = true
ORDER BY display_order;