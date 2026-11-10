ALTER POLICY "public reads courses" ON public.courses USING (is_published = true);
ALTER POLICY "public reads course_modules" ON public.course_modules USING (is_published = true AND EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_modules.course_id AND c.is_published = true));
DROP POLICY "visitors add conversations" ON public.conversations;
REVOKE INSERT ON public.conversations FROM anon;
COMMENT ON TABLE public.conversations IS 'Legacy chat archive. New writes require administrator authorization; public chat has been retired.';