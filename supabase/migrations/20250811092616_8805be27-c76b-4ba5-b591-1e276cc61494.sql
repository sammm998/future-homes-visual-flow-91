-- Remove duplicate Baris Kaya entries and clean up team members
DELETE FROM public.team_members WHERE id = '905a1b53-46b5-4484-8e4b-fd5effb1e671';

-- Update existing team members with proper image URLs and contact info
UPDATE public.team_members 
SET 
  image_url = '/lovable-uploads/291af508-aad0-496c-b587-75c602468e63.png',
  phone = '+905523032750',
  email = 'ali@futurehomesturkey.com'
WHERE name = 'Ali Hassan';

UPDATE public.team_members 
SET 
  image_url = '/lovable-uploads/946b687e-98e1-40d1-b419-f9e481a23292.png',
  phone = '+905454421886',
  email = 'elif@futurehomesturkey.com'
WHERE name = 'Elif Özkan';

UPDATE public.team_members 
SET 
  image_url = '/lovable-uploads/3d135184-c1fb-4e60-b81a-ae5a98808420.png',
  phone = '+905467879633',
  email = 'mehmet@futurehomesturkey.com'
WHERE name = 'Mehmet Demir';

UPDATE public.team_members 
SET 
  image_url = '/lovable-uploads/b560a0ff-8533-41e0-ad8e-c5e4f5e5b1cb.png',
  phone = '+4793289931',
  email = 'sarah@futurehomesturkey.com'
WHERE name = 'Sarah Johnson';