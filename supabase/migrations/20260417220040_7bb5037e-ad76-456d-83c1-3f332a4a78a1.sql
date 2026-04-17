
CREATE TABLE IF NOT EXISTS public.testimonial_translations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  testimonial_id uuid NOT NULL REFERENCES public.testimonials(id) ON DELETE CASCADE,
  language_code varchar(10) NOT NULL,
  review_text text NOT NULL,
  designation text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (testimonial_id, language_code)
);

CREATE INDEX IF NOT EXISTS idx_testimonial_translations_lang ON public.testimonial_translations(testimonial_id, language_code);

ALTER TABLE public.testimonial_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Translations viewable by everyone"
  ON public.testimonial_translations FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage translations"
  ON public.testimonial_translations FOR ALL
  USING (get_current_user_admin_status())
  WITH CHECK (get_current_user_admin_status());

CREATE TRIGGER update_testimonial_translations_updated_at
  BEFORE UPDATE ON public.testimonial_translations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
