-- Add more Dubai properties to the database

INSERT INTO properties (
  title, property_url, property_image, starting_price_eur, location, property_type, 
  bedrooms, facilities, ref_no, bathrooms, building_complete_date, sizes_m2, 
  description, distance_to_airport_km, distance_to_beach_km, property_images, 
  property_subtype, property_prices_by_room, property_district, property_facilities, price
) VALUES 

-- Property 1: Ready to move-in apartments in excellent location in Dubai, Al Jaddaf
(
  'Ready to move-in apartments in excellent location in Dubai, Al Jaddaf',
  'https://futurehomesturkey.com/en/estate/ad.php?id=4597',
  'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4597/general/apartment-320877.webp',
  '265000',
  'Dubai',
  'Apartments',
  '1+ <> 2+1',
  'For Residence Permit,Ready to Move',
  '10029',
  '1 <> 2',
  '01/01/2021',
  '34 <> 99',
  'Apartments for sale are located in Al Jaddaf, Dubai. Al Jaddaf is home to Dubai Healthcare City (DHCC). The DHCC area was established in 2002 to bring together the best medical and healthcare facilities in the region and around the world. Today, DHCC has more than 100 medical facilities with over 4,000 licensed professionals serving its people. The complexes located in the DHCC area stand out with their unique views of Dubai Creek and excellent location close to the city center.

The construction of the complex where the apartments for sale are located was completed in 2021. The complex, consisting of 18 floors, has a total of 587 apartments, including 116 Sudio, 436 1+1 and 35 2+1. The complex has facilities such as retail stores, cafes, restaurants, swimming pool, car park, fitness center, children''s playground.

The complex, which also stands out with its excellent location, is 10 minutes'' drive from Dubai city center, Burj Khalifa, Dubai Mall, 20 minutes from Palm Jumeirah and 10 minutes from Dubai International Airport.',
  '11',
  '8',
  ARRAY['https://cdn.futurehomesturkey.com/uploads/pages/4597/general/apartment-320884.webp','https://cdn.futurehomesturkey.com/uploads/pages/4597/general/apartment-320885.webp','https://cdn.futurehomesturkey.com/uploads/pages/4597/interior/apartment-320888.webp','https://cdn.futurehomesturkey.com/uploads/pages/4597/interior/apartment-320889.webp','https://cdn.futurehomesturkey.com/uploads/pages/4597/plan/apartment-320881.webp','https://cdn.futurehomesturkey.com/uploads/pages/4597/plan/apartment-320882.webp','https://cdn.futurehomesturkey.com/uploads/pages/4597/plan/apartment-320883.webp','https://cdn.futurehomesturkey.com/uploads/pages/4597/general/apartment-320877.webp','https://cdn.futurehomesturkey.com/uploads/pages/4597/general/apartment-320878.webp','https://cdn.futurehomesturkey.com/uploads/pages/4597/general/apartment-320876.webp','https://cdn.futurehomesturkey.com/uploads/pages/4597/general/apartment-320879.webp','https://cdn.futurehomesturkey.com/uploads/pages/4597/general/apartment-320880.webp','https://cdn.futurehomesturkey.com/uploads/pages/4597/general/apartment-320886.webp','https://cdn.futurehomesturkey.com/uploads/pages/4597/general/apartment-320887.webp'],
  'Flat',
  '1+ (Flat) - 34m² - €265,000; 1+1 (Flat) - 57m² - €425,000; 2+1 (Flat) - 99m² - €711,000',
  'Al Jaddaf',
  ARRAY['Fire Alarm','Security Alarm System','Security','Garden','Gym','Pool','Elevator','City view','Restaurant','Baby Pool','City Center','Garage','Fitness','Ready to Move','Hot Offer','From Developer','For Residence Permit','New Building'],
  '265000'
),

-- Property 2: Modern designed apartments suitable for investment in Dubai, Studio City
(
  'Modern designed apartments suitable for investment in Dubai, Studio City',
  'https://futurehomesturkey.com/en/estate/ad.php?id=4598',
  'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4598/general/apartment-320890.webp',
  '255000',
  'Dubai',
  'Apartments',
  '1+1 <> 2+1',
  'Under Construction',
  '10030',
  '1 <> 2',
  '09/01/2026',
  '63 <> 97',
  'Apartments for sale are located in Studio City, Dubai. Studio City stands out with its location built right next to Sheikh Zayed Road, which connects every important point in the city center, such as Burj Khalifa, museums, restaurants, hotels, cafes. Daily needs such as schools, shopping malls and medical facilities are also easily accessible in the area. Public transportation centers in the area make the area attractive for families and residents.

The complex is a luxury housing project with studios and one and two-bedroom apartments. In the complex built with modern architecture, amenities such as a pool, fitness center and landscaped gardens are reserved only for residents. Offering its residents a combination of stylish design, seaside lifestyle, modern life and functionality, the complex offers its buyers a peaceful life opportunity that allows residents to just relax.

Built with an urban design within the city, all daily needs are easily accessible in every living center of Dubai. Studio City is one of the most suitable areas for investment in the city thanks to its urban master layout plan. The complex is 18 km from Dubai city centre, 14 km from the beach and 38 km from Dubai International Airport.',
  '38',
  '14',
  ARRAY['https://cdn.futurehomesturkey.com/uploads/pages/4598/general/apartment-320890.webp','https://cdn.futurehomesturkey.com/uploads/pages/4598/general/apartment-320891.webp','https://cdn.futurehomesturkey.com/uploads/pages/4598/general/apartment-320892.webp','https://cdn.futurehomesturkey.com/uploads/pages/4598/general/apartment-320893.webp','https://cdn.futurehomesturkey.com/uploads/pages/4598/general/apartment-320894.webp','https://cdn.futurehomesturkey.com/uploads/pages/4598/general/apartment-320895.webp','https://cdn.futurehomesturkey.com/uploads/pages/4598/general/apartment-320896.webp','https://cdn.futurehomesturkey.com/uploads/pages/4598/general/apartment-320897.webp','https://cdn.futurehomesturkey.com/uploads/pages/4598/general/apartment-320898.webp','https://cdn.futurehomesturkey.com/uploads/pages/4598/general/apartment-320899.webp','https://cdn.futurehomesturkey.com/uploads/pages/4598/interior/apartment-320900.webp','https://cdn.futurehomesturkey.com/uploads/pages/4598/interior/apartment-320901.webp','https://cdn.futurehomesturkey.com/uploads/pages/4598/interior/apartment-320902.webp','https://cdn.futurehomesturkey.com/uploads/pages/4598/interior/apartment-320903.webp','https://cdn.futurehomesturkey.com/uploads/pages/4598/interior/apartment-320904.webp','https://cdn.futurehomesturkey.com/uploads/pages/4598/interior/apartment-320905.webp','https://cdn.futurehomesturkey.com/uploads/pages/4598/interior/apartment-320906.webp','https://cdn.futurehomesturkey.com/uploads/pages/4598/interior/apartment-320907.webp','https://cdn.futurehomesturkey.com/uploads/pages/4598/interior/apartment-320908.webp','https://cdn.futurehomesturkey.com/uploads/pages/4598/interior/apartment-320909.webp','https://cdn.futurehomesturkey.com/uploads/pages/4598/plan/apartment-320910.webp','https://cdn.futurehomesturkey.com/uploads/pages/4598/plan/apartment-320911.webp'],
  'Flat',
  '1+1 (Flat) - 63m² - €255,000; 2+1 (Flat) - 97m² - €380,000',
  'Dubai',
  ARRAY['Fire Alarm','Security Alarm System','Security','Garden','Gym','Pool','Cable TV - Satellite','Elevator','Baby Pool','Caretaker','City Center','Barbeque','Smart-Home System','Fitness','Hot Offer','Luxury','From Developer','Under Construction'],
  '255000'
),

-- Property 3: Luxury apartments with stylish design in Dubai, Dubailand
(
  'Luxury apartments with stylish design in Dubai, Dubailand',
  'https://futurehomesturkey.com/en/estate/ad.php?id=4658',
  'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4658/general/apartment-321732.webp',
  '134000',
  'Dubai, Dubailand',
  'Apartments',
  '1+ <> 2+1',
  'Under Construction',
  '10052',
  '1 <> 2',
  '06/01/2028',
  '33 <> 108',
  'Apartments for sale are located in the City Of Arabia area at the entrance of Dubailand, Dubai. Located at the entrance of Dubai''s rapidly developing Dubailand area, City Of Arabia offers unique opportunities to investors with its strategic location and visionary projects. Thanks to its direct connection to Sheikh Mohammed Bin Zayed Road, it provides easy access to both the city center and important transportation points. Equipped with modern housing projects suitable for family life, themed shopping centers and entertainment areas, this region is a candidate to be the center of attraction not only for today but also for the future. With its developing infrastructure and high rental income potential, City Of Arabia is an ideal choice for those who want to make a solid and profitable investment in Dubai.

The complex has a swimming pool, fitness center, jogging and cycling paths, children''s playground, movie theater, barbecue area, tennis court, shopping centers, and 24/7 security.

The complex is located 27 km from Dubai International Airport, 29 km from Dubai Marina, 25 km from Dubai Mall, 30 km from Palm Jumeirah, 24 km from Burj Khalifa, and within walking distance to daily needs such as pharmacy, bakery, local markets, restaurants, health centers, and more.',
  '27',
  '29',
  ARRAY['https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321735.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321739.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321749.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321741.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321747.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321746.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321745.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321748.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321750.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321751.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321752.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321753.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/plan/apartment-321754.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/plan/apartment-321755.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/plan/apartment-321756.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321732.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321731.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321728.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321729.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321730.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321733.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321737.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321740.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321734.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321738.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321742.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321743.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321744.webp','https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321736.webp'],
  'Flat',
  '1+ (Flat) - 33m² - €134,000; 1+1 (Flat) - 70m² - €230,000; 2+1 (Flat) - 108m² - €400,000',
  'Dubailand',
  ARRAY['Security Alarm System','Security','Camera System','Backup Generator','Garden','Volleyball Court','Cinema','Open Car Park','Pool','Elevator','Baby Pool','Barbeque','Fitness','Hot Offer','Luxury','From Developer','New Building','Under Construction'],
  '134000'
),

-- Property 4: Luxury apartments with stylish design in Dubai, Motor City
(
  'Luxury apartments with stylish design in Dubai, Motor City',
  'https://futurehomesturkey.com/en/estate/ad.php?id=4633',
  'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4633/general/apartment-321400.webp',
  '242000',
  'Dubai, Motor City',
  'Apartments',
  '1+1 <> 2+1',
  'Under Construction',
  '10046',
  '1 <> 1',
  '12/01/2027',
  '50 <> 90',
  'Apartments for sale are located in Motor City, Dubai. Dubai Motor City has developed rapidly in recent years and has become an attractive area for investors. It offers its residents a high standard of living with modern infrastructure, spacious living areas, sports and entertainment facilities. An ideal location especially for families and car enthusiasts, Motor City is gaining more value with its proximity to Dubai''s central locations and the strengthening of transportation networks. In terms of investment, given the steady rise in real estate prices in the area and future development projects, Motor City stands out as a lucrative home purchase choice.

The complex has a fitness center, outdoor sports areas, jogging tracks, restaurants, super markets, retail shops, swimming pool, children''s playground, basketball court, tennis court, cycling track, and social areas.',
  '35',
  '15',
  ARRAY['https://cdn.futurehomesturkey.com/uploads/pages/4633/interior/apartment-321408.webp','https://cdn.futurehomesturkey.com/uploads/pages/4633/interior/apartment-321409.webp','https://cdn.futurehomesturkey.com/uploads/pages/4633/interior/apartment-321407.webp','https://cdn.futurehomesturkey.com/uploads/pages/4633/interior/apartment-321406.webp','https://cdn.futurehomesturkey.com/uploads/pages/4633/plan/apartment-321412.webp','https://cdn.futurehomesturkey.com/uploads/pages/4633/plan/apartment-321413.webp','https://cdn.futurehomesturkey.com/uploads/pages/4633/general/apartment-321400.webp','https://cdn.futurehomesturkey.com/uploads/pages/4633/general/apartment-321405.webp','https://cdn.futurehomesturkey.com/uploads/pages/4633/general/apartment-321403.webp','https://cdn.futurehomesturkey.com/uploads/pages/4633/general/apartment-321404.webp','https://cdn.futurehomesturkey.com/uploads/pages/4633/general/apartment-321402.webp','https://cdn.futurehomesturkey.com/uploads/pages/4633/general/apartment-321401.webp'],
  'Flat',
  '1+1 (Flat) - 50m² - €242,000; 2+1 (Flat) - 90m² - €439,000',
  'Dubai',
  ARRAY['Security Alarm System','Camera System','Backup Generator','Garden','Basketball Court','Tennis Court','Open Car Park','Pool','Elevator','Close to Bus Stop','Restaurant','Baby Pool','Barbeque','Spa','Fitness','Hot Offer','Luxury','From Developer','New Building','Under Construction'],
  '242000'
),

-- Property 5: Elegant apartments in a modern living complex in Dubai, Jumeirah Village Triangle
(
  'Elegant apartments in a modern living complex in Dubai, Jumeirah Village Triangle',
  'https://futurehomesturkey.com/en/estate/ad.php?id=4570',
  'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4570/general/apartment-320387.webp',
  '296000',
  'Dubai',
  'Apartments',
  '1+1',
  'Under Construction',
  '10012',
  '1',
  '12/01/2026',
  '89',
  'Apartments for sale are located in Dubai, Jumeirah Village Triangle. Jumeirah Village Triangle is an area that offers its residents a quiet social life, attracts attention with its security and green areas. This area is famous as one of the most family-friendly areas of Dubai. In this area where modern life and green areas are intertwined, there are facilities that will meet all your daily needs. Jumeirah Village Triangle is among the first choices of those looking for a family-friendly, comfortable and quiet life in green areas.

The complex where the apartments for sale are located has a total of 167 apartments. In this complex, there are facilities such as a lobby with 7/24 concierge service, adult swimming pool, children''s swimming pool, children''s playroom, outdoor children''s playground, gym, outdoor yoga hall, sauna, game room, club house, prayer rooms, outdoor barbecue area, outdoor lounge area, outdoor restaurant.

There are facilities around the complex where luxury apartments are located that you can meet all your daily needs. The complex, which is 8 km from the beach, is 42 km from Dubai International Airport.',
  '42',
  '8',
  ARRAY['https://cdn.futurehomesturkey.com/uploads/pages/4570/general/apartment-320380.webp','https://cdn.futurehomesturkey.com/uploads/pages/4570/general/apartment-320382.webp','https://cdn.futurehomesturkey.com/uploads/pages/4570/general/apartment-320383.webp','https://cdn.futurehomesturkey.com/uploads/pages/4570/general/apartment-320384.webp','https://cdn.futurehomesturkey.com/uploads/pages/4570/general/apartment-320386.webp','https://cdn.futurehomesturkey.com/uploads/pages/4570/plan/apartment-320381.png','https://cdn.futurehomesturkey.com/uploads/pages/4570/plan/apartment-320379.png','https://cdn.futurehomesturkey.com/uploads/pages/4570/plan/apartment-320378.png','https://cdn.futurehomesturkey.com/uploads/pages/4570/general/apartment-320387.webp','https://cdn.futurehomesturkey.com/uploads/pages/4570/general/apartment-320385.webp','https://cdn.futurehomesturkey.com/uploads/pages/4570/general/apartment-320373.webp','https://cdn.futurehomesturkey.com/uploads/pages/4570/general/apartment-320374.webp','https://cdn.futurehomesturkey.com/uploads/pages/4570/general/apartment-320375.webp','https://cdn.futurehomesturkey.com/uploads/pages/4570/general/apartment-320376.webp','https://cdn.futurehomesturkey.com/uploads/pages/4570/general/apartment-320377.webp'],
  'Flat',
  '1+1 (Flat) - 89m² - €296,000',
  'Jumeirah Village Triangle',
  ARRAY['Fire Alarm','Security','Camera System','Furniture','White Goods','Air Conditioning','Garden','Gym','Sauna','Cinema','Pool','Cable TV - Satellite','Elevator','Mosque','Restaurant','Baby Pool','Barbeque','Garage','Pergolas','Conference room','Fitness','Hot Offer','Luxury','From Developer','Under Construction'],
  '296000'
);