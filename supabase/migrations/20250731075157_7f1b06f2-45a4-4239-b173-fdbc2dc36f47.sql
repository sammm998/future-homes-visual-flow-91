-- Create storage bucket for testimonials
INSERT INTO storage.buckets (id, name, public) VALUES ('testimonials', 'testimonials', true);

-- Create policies for testimonials bucket
CREATE POLICY "Anyone can view testimonial images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'testimonials');

CREATE POLICY "Authenticated users can upload testimonial images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'testimonials' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update testimonial images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'testimonials' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete testimonial images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'testimonials' AND auth.role() = 'authenticated');

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  property_type TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies for testimonials
CREATE POLICY "Anyone can view testimonials" 
ON public.testimonials 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage testimonials" 
ON public.testimonials 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON public.testimonials
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();