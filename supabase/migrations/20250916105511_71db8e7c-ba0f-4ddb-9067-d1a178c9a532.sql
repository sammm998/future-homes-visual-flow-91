-- Revert all URLs back to the old domain to test if images still exist there
-- First, revert property_image column
UPDATE properties 
SET property_image = REPLACE(property_image, 'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/', 'https://cdn.futurehomesturkey.com/uploads/')
WHERE property_image LIKE '%supabase%';

-- Then, revert property_images array column
UPDATE properties 
SET property_images = (
  SELECT array_agg(REPLACE(unnest_img, 'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/', 'https://cdn.futurehomesturkey.com/uploads/'))
  FROM unnest(property_images) as unnest_img
)
WHERE property_images::text LIKE '%supabase%';