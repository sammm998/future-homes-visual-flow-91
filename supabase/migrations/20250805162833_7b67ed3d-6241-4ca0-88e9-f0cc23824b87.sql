-- Create table for page translations
CREATE TABLE public.page_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  translation_key TEXT NOT NULL,
  language_code TEXT NOT NULL,
  original_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(page_path, translation_key, language_code)
);

-- Enable Row Level Security
ALTER TABLE public.page_translations ENABLE ROW LEVEL SECURITY;

-- Create policies - only admins can manage translations
CREATE POLICY "Only admins can view translations" 
ON public.page_translations 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Only admins can insert translations" 
ON public.page_translations 
FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update translations" 
ON public.page_translations 
FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Only admins can delete translations" 
ON public.page_translations 
FOR DELETE 
USING (public.is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_page_translations_updated_at
BEFORE UPDATE ON public.page_translations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_page_translations_page_path ON public.page_translations(page_path);
CREATE INDEX idx_page_translations_language_code ON public.page_translations(language_code);
CREATE INDEX idx_page_translations_key ON public.page_translations(translation_key);