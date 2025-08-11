-- Clear existing properties first to avoid duplicates
DELETE FROM public.properties;

-- Insert properties from the codebase data (sample of key properties)
INSERT INTO public.properties (
  title, location, price, starting_price_eur, property_type, bedrooms, bathrooms, 
  sizes_m2, description, agent_name, agent_phone_number, status, ref_no,
  building_complete_date, distance_to_airport_km, distance_to_beach_km,
  property_district, facilities
) VALUES
-- Cyprus Properties
('Modern designed seaside apartments in Cyprus, Tatlısu', 'Cyprus, Tatlısu', '€600,000', '600000', 'Apartments', '2+1 <> 3+1', '2', '110 <> 140', 'Modern designed seaside apartments with stunning sea views', 'Batuhan Kunt', '+905523032750', 'available', '8033', '01/01/2025', '45', '0.05', 'Tatlısu', 'Sea view, Swimming pool, Gym, Security'),
('Luxury villas and apartments in a perfect location in Cyprus, Esentepe', 'Cyprus, Esentepe', '€420,000', '420000', 'Apartments', '2+1 <> 3+1', '2', '89 <> 158', 'Luxury villas and apartments in perfect location', 'Batuhan Kunt', '+905523032750', 'available', '4504', '01/01/2025', '45', '0.1', 'Esentepe', 'Sea view, Swimming pool, Garden, Security'),
('Amazing sea view apartments in Cyprus, Tatlısu', 'Cyprus, Tatlısu', '€355,000', '355000', 'Apartments', '1+1 <> 2+1', '1-2', '52 <> 95', 'Amazing sea view apartments with modern amenities', 'Batuhan Kunt', '+905523032750', 'available', '4515', '01/01/2025', '45', '0.05', 'Tatlısu', 'Sea view, Beach access, Pool'),

-- Dubai Properties  
('Luxury Downtown Dubai Apartment', 'Dubai, Downtown', 'AED 2,500,000', '680000', 'Apartment', '2', '2', '120', 'Stunning luxury apartment in the heart of Downtown Dubai', 'Ahmed Al-Mansouri', '+971501234567', 'available', 'DUB001', '15/06/2024', '15', '25', 'Downtown', 'Pool, Gym, Concierge, Parking'),
('Marina View Penthouse', 'Dubai, Marina', 'AED 8,500,000', '2300000', 'Penthouse', '4', '4', '300', 'Exclusive penthouse with breathtaking marina views', 'Sarah Johnson', '+971507654321', 'available', 'DUB002', '01/12/2024', '20', '5', 'Marina', 'Private pool, Roof terrace, Butler service'),
('Business Bay Office Tower', 'Dubai, Business Bay', 'AED 15,000,000', '4080000', 'Commercial', '0', '8', '500', 'Prime commercial space in prestigious Business Bay', 'Mohammed Hassan', '+971509876543', 'available', 'DUB003', '30/09/2024', '12', '20', 'Business Bay', 'Reception, Meeting rooms, Parking'),

-- Antalya Properties
('Luxury Villa with Sea View', 'Antalya, Kalkan', '€1,250,000', '1250000', 'Villa', '4', '3', '250', 'Stunning villa with panoramic sea views in exclusive Kalkan', 'Mehmet Yılmaz', '+905321234567', 'available', 'ANT001', '15/08/2024', '120', '0.2', 'Kalkan', 'Private pool, Sea view, Garden, Parking'),
('Modern City Center Apartment', 'Antalya, City Center', '€185,000', '185000', 'Apartment', '2', '1', '85', 'Contemporary apartment in the heart of Antalya', 'Ayşe Demir', '+905339876543', 'available', 'ANT002', '01/10/2024', '15', '8', 'City Center', 'Balcony, Central location, Shopping nearby'),
('Beachfront Resort Residence', 'Antalya, Belek', '€420,000', '420000', 'Apartment', '2', '2', '110', 'Luxury resort-style living on the beach', 'Can Özkan', '+905356789012', 'available', 'ANT003', '20/12/2024', '30', '0.1', 'Belek', 'Beach access, Resort facilities, Golf course'),

-- Mersin Properties
('Seafront Luxury Complex', 'Mersin, Erdemli', '€275,000', '275000', 'Apartment', '3', '2', '130', 'Modern seafront complex with all amenities', 'Fatma Kaya', '+905447654321', 'available', 'MER001', '10/11/2024', '70', '0.05', 'Erdemli', 'Sea view, Pool, Gym, Security'),
('Mountain View Villa', 'Mersin, Tarsus', '€395,000', '395000', 'Villa', '4', '3', '200', 'Peaceful villa with stunning mountain views', 'Ali Şen', '+905558901234', 'available', 'MER002', '05/09/2024', '80', '15', 'Tarsus', 'Mountain view, Garden, Parking, Quiet area'),

-- France Properties
('Elegant Parisian Apartment', 'Paris, 7th Arrondissement', '€850,000', '850000', 'Apartment', '2', '1', '75', 'Charming Haussmannian apartment near Eiffel Tower', 'Pierre Dubois', '+33142567890', 'available', 'FR001', 'Existing Property', '25', '5', '7th Arrondissement', 'Historic building, High ceilings, Balcony'),
('Provence Country House', 'Provence, Aix-en-Provence', '€675,000', '675000', 'House', '3', '2', '180', 'Beautiful stone house in the heart of Provence', 'Marie Laurent', '+33490123456', 'available', 'FR002', 'Existing Property', '45', '60', 'Aix-en-Provence', 'Garden, Traditional architecture, Wine cellar'),
('Côte d\'Azur Villa', 'Nice, Côte d\'Azur', '€1,850,000', '1850000', 'Villa', '5', '4', '320', 'Luxury villa with Mediterranean sea views', 'Jean-Claude Martin', '+33493654321', 'available', 'FR003', 'Existing Property', '30', '0.5', 'Nice', 'Sea view, Private pool, Terrace, Garage');