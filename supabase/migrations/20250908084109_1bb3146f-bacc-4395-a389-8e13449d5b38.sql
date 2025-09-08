-- Insert one sample Bali property to test routing
INSERT INTO public.properties (
  title, location, price, bedrooms, bathrooms, sizes_m2, 
  property_type, property_subtype, description, status,
  property_image, property_images, property_facilities,
  ref_no, is_active, starting_price_eur, language_code
) VALUES
(
  'Luxury Beachfront Villa in Seminyak',
  'Bali, Seminyak', 
  '€850,000', 
  '4', 
  '5', 
  '450',
  'Villa',
  'Beachfront Villa',
  'Stunning beachfront villa in prestigious Seminyak area. Features private pool, ocean views, modern tropical design, and premium finishes throughout.',
  'available',
  '/lovable-uploads/4c6b5b9c-7b79-4474-b629-9e61e450f00b.png',
  ARRAY['/lovable-uploads/4c6b5b9c-7b79-4474-b629-9e61e450f00b.png', '/lovable-uploads/7335e4e2-249c-4b29-b83a-0101453f6878.png', '/lovable-uploads/aff7bebd-5943-45d9-84d8-a923abf07e24.png'],
  ARRAY['Private Pool', 'Ocean View', 'Garden', 'Security', 'Parking', 'Modern Kitchen'],
  '8001',
  true,
  '€850,000',
  'en'
);