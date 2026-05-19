ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS interior_images TEXT[],
  ADD COLUMN IF NOT EXISTS interior_scanned_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_properties_interior_scanned
  ON public.properties (interior_scanned_at);