-- Fix the RLS policy for code_snippets to use the is_admin function
DROP POLICY IF EXISTS "Only admins can manage code snippets" ON public.code_snippets;

CREATE POLICY "Only admins can manage code snippets" 
ON public.code_snippets 
FOR ALL 
USING (is_admin());