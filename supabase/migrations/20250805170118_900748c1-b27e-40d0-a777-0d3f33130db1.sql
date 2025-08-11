-- Create translations table for storing AI-generated translations
CREATE TABLE IF NOT EXISTS public.translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_text TEXT NOT NULL,
  language_code VARCHAR(5) NOT NULL,
  translated_text TEXT NOT NULL,
  page_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(original_text, language_code)
);

-- Enable Row Level Security
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Create policies for translations table
CREATE POLICY "Anyone can read translations" 
ON public.translations 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage translations" 
ON public.translations 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_translations_lookup ON public.translations(original_text, language_code);
CREATE INDEX IF NOT EXISTS idx_translations_page ON public.translations(page_name, language_code);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_translations_updated_at
BEFORE UPDATE ON public.translations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();