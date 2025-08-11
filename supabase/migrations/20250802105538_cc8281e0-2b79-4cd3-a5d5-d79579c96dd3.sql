-- Create table for homepage testimonials
CREATE TABLE public.homepage_testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  review_text TEXT NOT NULL,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.homepage_testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Allow admin to manage homepage testimonials" 
ON public.homepage_testimonials 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create policy for public read access (for the website)
CREATE POLICY "Homepage testimonials are viewable by everyone" 
ON public.homepage_testimonials 
FOR SELECT 
USING (is_active = true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_homepage_testimonials_updated_at
BEFORE UPDATE ON public.homepage_testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for display order
CREATE INDEX idx_homepage_testimonials_display_order ON public.homepage_testimonials(display_order);
CREATE INDEX idx_homepage_testimonials_active ON public.homepage_testimonials(is_active);