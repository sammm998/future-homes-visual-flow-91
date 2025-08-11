-- Insert all Antalya properties from the frontend data into the properties table

-- Property 1: Stylish apartments with modern design in Antalya, Aksu
INSERT INTO properties (
  id, ref_no, title, location, price, description, property_type, bedrooms, bathrooms,
  sizes_m2, distance_to_airport_km, distance_to_beach_km, agent_name, agent_phone_number,
  property_images, property_facilities, status, building_complete_date, starting_price_eur,
  property_district, property_subtype
) VALUES (
  '3202-antalya-aksu-modern',
  '1278',
  'Stylish apartments with modern design in Antalya, Aksu',
  'Antalya, Aksu',
  '€147,000 - €210,000',
  'The project with apartments for sale is located in Antalya, Aksu region. Thanks to the fact that the housing projects it has will be completed in the near future, its infrastructure is developing rapidly, gaining value as it develops, and it is a region that has recently announced its name as the investment center of Antalya, and has attracted the attention of all domestic and foreign investors.',
  'Apartments',
  '1+1 to 2+1',
  '1 to 2',
  '60 - 100',
  '3',
  '4',
  'Batuhan Kunt',
  '+905523032750',
  ARRAY[
    'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3202/general/property-antalya-aksu-general-3202-0.webp',
    'https://cdn.futurehomesturkey.com/uploads/pages/3202/general/property-antalya-aksu-general-3202-18.webp',
    'https://cdn.futurehomesturkey.com/uploads/pages/3202/general/property-antalya-aksu-general-3202-2.webp',
    'https://cdn.futurehomesturkey.com/uploads/pages/3202/general/property-antalya-aksu-general-3202-3.webp'
  ],
  ARRAY['Pool', 'Open Car Park', 'Indoor Car Park', 'Fitness', 'Sauna', 'Elevator', 'Security Camera System', 'Generators', 'Reception', 'Children''s Playground'],
  'Ready to Move',
  '06/01/2024',
  '€147,000',
  'Aksu',
  'Modern Design'
);

-- Property 2: Spacious apartments suitable for investment in Antalya, Aksu
INSERT INTO properties (
  id, ref_no, title, location, price, description, property_type, bedrooms, bathrooms,
  sizes_m2, distance_to_airport_km, distance_to_beach_km, agent_name, agent_phone_number,
  property_images, property_facilities, status, building_complete_date, starting_price_eur,
  property_district, property_subtype
) VALUES (
  '3128-antalya-aksu-investment',
  '1212',
  'Spacious apartments suitable for investment in Antalya, Aksu',
  'Antalya, Aksu',
  '€135,000 - €175,000',
  'Apartments for sale are located in Antalya, Aksu. It is the new investment zone of the city of Antalya. Thanks to the housing constructions in the region, the infrastructure development of the region accelerated and allowed the region to be valued rapidly.',
  'Apartments',
  '1+1 to 2+1',
  '1 to 2',
  '75 - 104',
  '3',
  '5',
  'Batuhan Kunt',
  '+905523032750',
  ARRAY[
    'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3128/general/property-antalya-aksu-general-3128-0.webp',
    'https://cdn.futurehomesturkey.com/uploads/pages/3128/general/property-antalya-aksu-general-3128-17.webp',
    'https://cdn.futurehomesturkey.com/uploads/pages/3128/general/property-antalya-aksu-general-3128-18.webp',
    'https://cdn.futurehomesturkey.com/uploads/pages/3128/general/property-antalya-aksu-general-3128-2.webp'
  ],
  ARRAY['Fire Alarm', 'Camera System', 'Garden', 'Open Car Park', 'Pool', 'Elevator', 'City view', 'Close to Bus Stop'],
  'For Residence Permit, Ready to Move',
  '12/01/2023',
  '€135,000',
  'Aksu',
  'Investment'
);

-- Property 3: Spacious apartments in a modern designed project in Antalya, Altıntaş
INSERT INTO properties (
  id, ref_no, title, location, price, description, property_type, bedrooms, bathrooms,
  sizes_m2, distance_to_airport_km, distance_to_beach_km, agent_name, agent_phone_number,
  property_images, property_facilities, status, building_complete_date, starting_price_eur,
  property_district, property_subtype
) VALUES (
  '4410-antalya-altintas-modern',
  '1327',
  'Spacious apartments in a modern designed project in Antalya, Altıntaş',
  'Antalya, Aksu',
  '€202,000 - €280,000',
  'Apartments for sale are located in Altıntaş, which is connected to the Aksu district of Antalya. It is a district that hosts the city''s luxury and newest housing projects and will announce its name as one of the city''s Elite districts when these projects are completed.',
  'Apartments',
  '2+1 to 3+1',
  '1',
  '85 - 120',
  '4',
  '8',
  'Batuhan Kunt',
  '+905523032750',
  ARRAY[
    'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4410/general/property-antalya-aksu-general-4410-0.webp',
    'https://cdn.futurehomesturkey.com/uploads/pages/4410/general/property-antalya-aksu-general-4410-19.webp',
    'https://cdn.futurehomesturkey.com/uploads/pages/4410/general/property-antalya-aksu-general-4410-2.webp',
    'https://cdn.futurehomesturkey.com/uploads/pages/4410/general/property-antalya-aksu-general-4410-3.webp'
  ],
  ARRAY['Fire Alarm', 'Security', 'Camera System', 'Garden', 'Open Car Park', 'Pool', 'Elevator', 'Caretaker', 'Barbeque', 'Garage', 'Fitness', 'Luxury'],
  'Ready to Move',
  '08/01/2024',
  '€202,000',
  'Altıntaş',
  'Luxury'
);

-- Property 4: Ready to move-in luxury apartment close to daily amenities in Antalya, Altintas
INSERT INTO properties (
  id, ref_no, title, location, price, description, property_type, bedrooms, bathrooms,
  sizes_m2, distance_to_airport_km, distance_to_beach_km, agent_name, agent_phone_number,
  property_images, property_facilities, status, building_complete_date, starting_price_eur,
  property_district, property_subtype
) VALUES (
  '4630-antalya-altintas-luxury',
  '1381',
  'Ready to move-in luxury apartment close to daily amenities in Antalya, Altintas',
  'Antalya, Altintas',
  '€110,000',
  'The apartment for sale is located in Altintas, Antalya. Altintas region of Antalya attracts attention as a real estate region that has rapidly gained value in recent years. Its proximity to the airport, the development of transportation facilities, and the new housing projects around it are among the factors that increase the future value of the region.',
  'Apartments',
  '1+1',
  '1',
  '72',
  '5',
  '7',
  'Batuhan Kunt',
  '+905523032750',
  ARRAY[
    'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4630/general/property-antalya-altintas-general-4630-0.webp',
    'https://cdn.futurehomesturkey.com/uploads/pages/4630/general/property-antalya-altintas-general-4630-15.webp',
    'https://cdn.futurehomesturkey.com/uploads/pages/4630/general/property-antalya-altintas-general-4630-2.webp',
    'https://cdn.futurehomesturkey.com/uploads/pages/4630/general/property-antalya-altintas-general-4630-3.webp'
  ],
  ARRAY['Outdoor Swimming Pool', 'Children Swimming Pool', 'Indoor Swimming Pool', 'Turkish Bath', 'Sauna', 'Camellia', 'Children Park', 'Walking Path', 'Fitness Center', 'Basketball Court'],
  'Ready to Move',
  '12/01/2024',
  '€110,000',
  'Altintas',
  'Luxury'
);

-- Property 5: Modern apartments with smart home systems in Antalya, Kundu
INSERT INTO properties (
  id, ref_no, title, location, price, description, property_type, bedrooms, bathrooms,
  sizes_m2, distance_to_airport_km, distance_to_beach_km, agent_name, agent_phone_number,
  property_images, property_facilities, status, building_complete_date, starting_price_eur,
  property_district, property_subtype
) VALUES (
  '4646-antalya-kundu-smart',
  '1389',
  'Modern apartments with smart home systems in Antalya, Kundu',
  'Antalya, Kundu',
  '€285,000 - €450,000',
  'Apartments for sale are located in Kundu, Antalya. Kundu region is one of the most prestigious tourism districts of Antalya. The region, which has become the address of luxury hotels, restaurants and entertainment venues in recent years, is also the center of attention for residential investments.',
  'Apartments',
  '2+1 to 3+1',
  '2 to 3',
  '115 - 155',
  '2',
  '0.3',
  'Batuhan Kunt',
  '+905523032750',
  ARRAY[
    'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4646/general/property-antalya-kundu-general-4646-0.webp',
    'https://cdn.futurehomesturkey.com/uploads/pages/4646/general/property-antalya-kundu-general-4646-22.webp',
    'https://cdn.futurehomesturkey.com/uploads/pages/4646/general/property-antalya-kundu-general-4646-2.webp',
    'https://cdn.futurehomesturkey.com/uploads/pages/4646/general/property-antalya-kundu-general-4646-3.webp'
  ],
  ARRAY['Smart Home System', 'Pool', 'Beach Access', 'Spa', 'Fitness', 'Restaurants', 'Security', 'Valet Parking', 'Concierge', 'Private Beach'],
  'Ready to Move',
  '09/01/2024',
  '€285,000',
  'Kundu',
  'Smart Home'
);