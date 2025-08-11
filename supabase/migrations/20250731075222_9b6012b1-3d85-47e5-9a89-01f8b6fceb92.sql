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