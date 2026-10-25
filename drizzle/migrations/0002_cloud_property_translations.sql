CREATE TABLE public.property_text_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id text NOT NULL,
  language_code text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  location text,
  source_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (property_id, language_code)
);
GRANT SELECT ON public.property_text_translations TO anon, authenticated;
GRANT ALL ON public.property_text_translations TO service_role;
ALTER TABLE public.property_text_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads property translations" ON public.property_text_translations
  FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX property_text_translations_lang_idx ON public.property_text_translations (language_code);
CREATE TRIGGER property_text_translations_updated_at BEFORE UPDATE ON public.property_text_translations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();