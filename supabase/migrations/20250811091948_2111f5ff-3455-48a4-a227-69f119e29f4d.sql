-- Add Baris Kaya to team members
INSERT INTO team_members (name, position, phone, email, image_url, display_order, is_active) 
VALUES (
  'Baris Kaya',
  'Real Estate Consultant', 
  '+90 (531) 664 89 35',
  'baris@futurehomesturkey.com',
  '/lovable-uploads/719958d0-b8e6-4320-a7e1-1736f2806cce.png',
  (SELECT COALESCE(MAX(display_order), 0) + 1 FROM team_members),
  true
);