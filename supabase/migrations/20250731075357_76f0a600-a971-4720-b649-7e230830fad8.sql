-- Add image_url column to existing testimonials table
ALTER TABLE public.testimonials 
ADD COLUMN image_url TEXT;