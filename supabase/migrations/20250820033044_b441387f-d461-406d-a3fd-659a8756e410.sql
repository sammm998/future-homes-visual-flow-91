-- Update RLS policies for team_members table to allow public read access

-- Drop existing restrictive policy if it exists
DROP POLICY IF EXISTS "Admins can manage team members" ON public.team_members;

-- Create new policies for team_members table
CREATE POLICY "Team members are viewable by everyone" 
ON public.team_members 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only admins can manage team members" 
ON public.team_members 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());