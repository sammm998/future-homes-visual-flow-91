-- Update RLS policies to be more secure and specific
-- First, let's update the overly permissive policies on scraped_content table

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow insert of scraped content" ON public.scraped_content;
DROP POLICY IF EXISTS "Allow public read access to scraped content" ON public.scraped_content;
DROP POLICY IF EXISTS "Allow update of scraped content" ON public.scraped_content;

-- Create more restrictive policies for scraped_content
-- Only allow reading active content
CREATE POLICY "Allow read of active scraped content" 
ON public.scraped_content 
FOR SELECT 
USING (is_active = true);

-- Only allow system inserts (for admin/backend operations)
CREATE POLICY "Allow system insert of scraped content" 
ON public.scraped_content 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- Only allow system updates (for admin/backend operations)
CREATE POLICY "Allow system update of scraped content" 
ON public.scraped_content 
FOR UPDATE 
USING (auth.role() = 'service_role');

-- Add a policy for deleting old inactive content (system only)
CREATE POLICY "Allow system delete of scraped content" 
ON public.scraped_content 
FOR DELETE 
USING (auth.role() = 'service_role');