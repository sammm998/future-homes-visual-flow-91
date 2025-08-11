-- Add Baris Kaya to team members
INSERT INTO public.team_members (
  name,
  position,
  phone,
  email,
  image_url,
  display_order,
  is_active
) VALUES (
  'Baris Kaya',
  'Real Estate Consultant',
  '+90 (531) 664 89 35',
  'baris@futurehomesturkey.com',
  '/lovable-uploads/ab507559-f3b0-4bb9-aebe-d9a37e64b851.png',
  (SELECT COALESCE(MAX(display_order), 0) + 1 FROM public.team_members),
  true
);