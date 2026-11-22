CREATE TABLE public.course_progress (
  user_id uuid NOT NULL,
  module_id uuid NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  completed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, module_id)
);
GRANT SELECT, INSERT, DELETE ON public.course_progress TO authenticated;
GRANT ALL ON public.course_progress TO service_role;
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own progress read" ON public.course_progress FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own progress add" ON public.course_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own progress remove" ON public.course_progress FOR DELETE TO authenticated USING (auth.uid() = user_id);