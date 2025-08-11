-- Clear all auto-generated properties with Unsplash images
DELETE FROM public.properties 
WHERE property_image LIKE '%unsplash%' 
   OR property_images::text LIKE '%unsplash%';