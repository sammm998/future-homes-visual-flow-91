-- Update all old domain URLs to use the new Supabase storage domain
-- First, update property_image column
UPDATE properties 
SET property_image = REPLACE(property_image, 'https://cdn.futurehomesturkey.com/uploads/', 'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/')
WHERE property_image LIKE '%cdn.futurehomesturkey.com%';

-- Then, update property_images array column
UPDATE properties 
SET property_images = (
  SELECT array_agg(REPLACE(unnest_img, 'https://cdn.futurehomesturkey.com/uploads/', 'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/'))
  FROM unnest(property_images) as unnest_img
)
WHERE property_images::text LIKE '%cdn.futurehomesturkey.com%';