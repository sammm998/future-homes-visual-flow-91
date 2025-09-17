-- Fix the incomplete URL reversion
-- Update all remaining Supabase URLs in property_image column
UPDATE properties 
SET property_image = REPLACE(property_image, 'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/', 'https://cdn.futurehomesturkey.com/uploads/property-images/')
WHERE property_image LIKE '%kiogiyemoqbnuvclneoe.supabase.co%';

-- Update all remaining Supabase URLs in property_images array column  
UPDATE properties 
SET property_images = (
  SELECT array_agg(REPLACE(unnest_img, 'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/', 'https://cdn.futurehomesturkey.com/uploads/property-images/'))
  FROM unnest(property_images) as unnest_img
)
WHERE property_images::text LIKE '%kiogiyemoqbnuvclneoe.supabase.co%';