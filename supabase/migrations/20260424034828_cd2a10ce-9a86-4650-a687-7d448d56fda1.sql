ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS slug_es text,
  ADD COLUMN IF NOT EXISTS slug_de text,
  ADD COLUMN IF NOT EXISTS slug_fr text,
  ADD COLUMN IF NOT EXISTS slug_id text;

CREATE INDEX IF NOT EXISTS idx_properties_slug_es ON public.properties(slug_es);
CREATE INDEX IF NOT EXISTS idx_properties_slug_de ON public.properties(slug_de);
CREATE INDEX IF NOT EXISTS idx_properties_slug_fr ON public.properties(slug_fr);
CREATE INDEX IF NOT EXISTS idx_properties_slug_id ON public.properties(slug_id);