-- Fix property images for Mersin and Dubai properties
-- Update Mersin properties with proper diverse images
UPDATE properties 
SET property_image = CASE 
  WHEN id = (SELECT id FROM properties WHERE location LIKE '%Mersin%' ORDER BY created_at LIMIT 1 OFFSET 0) 
    THEN 'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/6002/general/mersin-villa-marina.webp'
  WHEN id = (SELECT id FROM properties WHERE location LIKE '%Mersin%' ORDER BY created_at LIMIT 1 OFFSET 1) 
    THEN 'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/6001/general/mersin-apartment-city.webp'
  WHEN id = (SELECT id FROM properties WHERE location LIKE '%Mersin%' ORDER BY created_at LIMIT 1 OFFSET 2) 
    THEN 'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/6003/general/mersin-spacious-mezitli.webp'
  WHEN id = (SELECT id FROM properties WHERE location LIKE '%Mersin%' ORDER BY created_at LIMIT 1 OFFSET 3) 
    THEN 'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/6004/general/mersin-duplex-erdemli.webp'
  WHEN id = (SELECT id FROM properties WHERE location LIKE '%Mersin%' ORDER BY created_at LIMIT 1 OFFSET 4) 
    THEN 'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/6005/general/mersin-peaceful-erdemli.webp'
  ELSE property_image
END
WHERE location LIKE '%Mersin%';

-- Update Dubai properties with diverse images based on location
UPDATE properties 
SET property_image = CASE 
  WHEN location LIKE '%Dubai, Meydan%' 
    THEN 'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4596/general/apartment-320850.webp'
  WHEN location LIKE '%Dubai, Studio City%' 
    THEN '/lovable-uploads/2209cb13-f5ad-47af-ad83-fac59b9edd3b.png'
  WHEN location LIKE '%Dubai, Land Residence%' 
    THEN 'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4607/general/apartment-321008.webp'
  WHEN location LIKE '%Dubai, Marina%' 
    THEN 'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4636/general/apartment-321429.webp'
  WHEN location LIKE '%Dubai, Jumeirah Village Circle%' 
    THEN 'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4563/general/apartment-320190.webp'
  WHEN location LIKE '%Dubai, Investment Park%' 
    THEN '/lovable-uploads/2adcc5fd-ef6d-4fee-8ed8-cc57be79fccf.png'
  WHEN location LIKE '%Dubai, Islands%' 
    THEN '/lovable-uploads/dubai-4629-general-321336.webp'
  WHEN location LIKE '%Dubai, Downtown%' 
    THEN 'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4627/general/apartment-321298.webp'
  WHEN location LIKE '%Dubai, Al Warsan%' 
    THEN 'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4620/general/apartment-321192.webp'
  WHEN location LIKE '%Dubai, Motor City%' 
    THEN 'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4634/general/apartment-321416.webp'
  WHEN location LIKE '%Dubai, Jumeirah Village Triangle%' 
    THEN 'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4569/general/apartment-320355.webp'
  WHEN location LIKE '%Dubai, Al Jaddaf%' 
    THEN 'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4597/general/apartment-320877.webp'
  WHEN location LIKE '%Dubai, Dubailand%' 
    THEN 'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4658/general/apartment-321732.webp'
  WHEN location LIKE '%Dubai, Jumeirah Lake Towers%' 
    THEN 'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4657/general/apartment-321707.webp'
  ELSE property_image
END
WHERE location LIKE '%Dubai%';