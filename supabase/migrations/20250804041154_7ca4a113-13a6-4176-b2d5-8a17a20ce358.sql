-- Fix the RLS policy for code_snippets to use the is_admin function
DROP POLICY IF EXISTS "Only admins can manage code snippets" ON public.code_snippets;

CREATE POLICY "Only admins can manage code snippets" 
ON public.code_snippets 
FOR ALL 
USING (is_admin());

-- Also fix the search path issue mentioned in the security warnings
DROP FUNCTION IF EXISTS public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;