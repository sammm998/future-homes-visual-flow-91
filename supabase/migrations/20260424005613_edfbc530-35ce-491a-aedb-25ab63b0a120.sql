-- Create property_translations table for storing translated property content
CREATE TABLE public.property_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL,
  title TEXT,
  description TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(property_id, language_code)
);

-- Indexes for fast lookup
CREATE INDEX idx_property_translations_property_id ON public.property_translations(property_id);
CREATE INDEX idx_property_translations_language ON public.property_translations(language_code);
CREATE INDEX idx_property_translations_lookup ON public.property_translations(property_id, language_code);

-- Enable RLS
ALTER TABLE public.property_translations ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Property translations are viewable by everyone"
ON public.property_translations
FOR SELECT
USING (true);

-- Only admins can insert
CREATE POLICY "Only admins can insert property translations"
ON public.property_translations
FOR INSERT
WITH CHECK (get_current_user_admin_status());

-- Only admins can update
CREATE POLICY "Only admins can update property translations"
ON public.property_translations
FOR UPDATE
USING (get_current_user_admin_status())
WITH CHECK (get_current_user_admin_status());

-- Only admins can delete
CREATE POLICY "Only admins can delete property translations"
ON public.property_translations
FOR DELETE
USING (get_current_user_admin_status());

-- Service role bypasses RLS (for edge functions)
-- This allows the translate-properties edge function to write translations

-- Trigger for updated_at
CREATE TRIGGER update_property_translations_updated_at
BEFORE UPDATE ON public.property_translations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();