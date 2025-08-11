-- Fix image URL mappings to match correct customer names

-- First, swap the correctly named files between customers
-- Nikolaus should get nikolaus file, Abdulla should get abdulla file
UPDATE public.testimonials 
SET image_url = 'https://cdn.futurehomesturkey.com/resize/1200/uploads/files/abdulla.jpg'
WHERE customer_name = 'Abdulla';

UPDATE public.testimonials 
SET image_url = 'https://cdn.futurehomesturkey.com/resize/1200/uploads/files/nikolaus.jpg'
WHERE customer_name = 'Nikolaus';

-- Adam Ahmad Ismail should get his own file, Abouaoun should get abouaoun file
UPDATE public.testimonials 
SET image_url = 'https://cdn.futurehomesturkey.com/resize/1200/uploads/files/Adam%20Ahmad%20Ismail.jpg'
WHERE customer_name = 'Adam Ahmad Ismail';

UPDATE public.testimonials 
SET image_url = 'https://cdn.futurehomesturkey.com/resize/1200/uploads/files/Abouaoun%2C%20Sweden.jpg'
WHERE customer_name = 'Abouaoun';

-- Dollyz should get dollyz file, Omar should get omar file
UPDATE public.testimonials 
SET image_url = 'https://cdn.futurehomesturkey.com/resize/1200/uploads/happy_customer/dollyz.jpg'
WHERE customer_name = 'Dollyz';

UPDATE public.testimonials 
SET image_url = 'https://cdn.futurehomesturkey.com/resize/1200/uploads/happy_customer/omar-el-chak.jpg'
WHERE customer_name = 'Omar el chal';

-- Belhadef should get belhadef/sofiane file
UPDATE public.testimonials 
SET image_url = 'https://cdn.futurehomesturkey.com/resize/1200/uploads/files/belhadef-sofiane.jpg'
WHERE customer_name = 'Belhadef Sofiane Gaya';

-- Cansel should get cansel file
UPDATE public.testimonials 
SET image_url = 'https://cdn.futurehomesturkey.com/resize/1200/uploads/files/cansel-ihsan.jpg'
WHERE customer_name = 'Cansel Aykut';

-- Magomed should get magomed file
UPDATE public.testimonials 
SET image_url = 'https://cdn.futurehomesturkey.com/resize/1200/uploads/files/magomed%20-%20tesminatiols.jpg'
WHERE customer_name = 'Magomed and Asetta';

-- Haron should get haron file
UPDATE public.testimonials 
SET image_url = 'https://cdn.futurehomesturkey.com/resize/1200/uploads/files/haron-larisa.jpg'
WHERE customer_name = 'Haron and Larisa';

-- Blaine should get blaine file
UPDATE public.testimonials 
SET image_url = 'https://cdn.futurehomesturkey.com/resize/1200/uploads/files/mr-blain.jpg'
WHERE customer_name = 'Blaine';

-- Mohamed entries should get appropriate mohamed files
UPDATE public.testimonials 
SET image_url = 'https://cdn.futurehomesturkey.com/resize/1200/uploads/files/mohamed1.jpg'
WHERE customer_name = 'Mohamed' AND customer_country = 'Canada' AND location = 'Antalya, Altintas';

UPDATE public.testimonials 
SET image_url = 'https://cdn.futurehomesturkey.com/resize/1200/uploads/files/mohamed2.jpg'
WHERE customer_name = 'Mohamed' AND customer_country = 'Sweden';