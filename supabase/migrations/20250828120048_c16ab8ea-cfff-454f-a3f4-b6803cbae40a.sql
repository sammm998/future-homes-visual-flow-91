-- Fix RLS recursive policy issue for admin_users table
-- 1. Create security definer function to check admin status without recursion
CREATE OR REPLACE FUNCTION public.get_current_user_admin_status()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE admin_users.user_id = auth.uid()
  );
$$;

-- 2. Drop existing problematic RLS policies on admin_users
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can insert admin users" ON public.admin_users;

-- 3. Create new secure RLS policies using the security definer function
CREATE POLICY "Admins can view admin users" 
ON public.admin_users 
FOR SELECT 
USING (public.get_current_user_admin_status());

CREATE POLICY "Admins can insert admin users" 
ON public.admin_users 
FOR INSERT 
WITH CHECK (public.get_current_user_admin_status());

CREATE POLICY "Admins can update admin users" 
ON public.admin_users 
FOR UPDATE 
USING (public.get_current_user_admin_status())
WITH CHECK (public.get_current_user_admin_status());

CREATE POLICY "Admins can delete admin users" 
ON public.admin_users 
FOR DELETE 
USING (public.get_current_user_admin_status());

-- 4. Secure blog_posts policies - only admins should modify
DROP POLICY IF EXISTS "Users can create blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Users can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Users can delete blog posts" ON public.blog_posts;

CREATE POLICY "Only admins can create blog posts" 
ON public.blog_posts 
FOR INSERT 
WITH CHECK (public.get_current_user_admin_status());

CREATE POLICY "Only admins can update blog posts" 
ON public.blog_posts 
FOR UPDATE 
USING (public.get_current_user_admin_status())
WITH CHECK (public.get_current_user_admin_status());

CREATE POLICY "Only admins can delete blog posts" 
ON public.blog_posts 
FOR DELETE 
USING (public.get_current_user_admin_status());

-- 5. Secure testimonials policies - only admins should modify
DROP POLICY IF EXISTS "Admin can manage testimonials" ON public.testimonials;

CREATE POLICY "Only admins can manage testimonials" 
ON public.testimonials 
FOR ALL
USING (public.get_current_user_admin_status())
WITH CHECK (public.get_current_user_admin_status());