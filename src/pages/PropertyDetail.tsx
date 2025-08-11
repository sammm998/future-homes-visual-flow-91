
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Timeline } from "@/components/ui/timeline";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone, Mail, ArrowLeft, ChevronLeft, ChevronRight, Bed, Bath, Square, Calendar, Car, Home, Plane, Waves, CheckCircle, Star, Award, Images, X } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useCurrency } from '@/contexts/CurrencyContext';
import { useProperty } from '@/hooks/useProperty';
import ervinaImage from '@/assets/ervina-koksel.png';
import { getAntalyaPropertyById } from '@/data/antalyaProperties';
import { getMersinPropertyById } from '@/data/mersinProperties';
import { getDubaiPropertyById } from '@/data/dubaiProperties';
import { getCyprusPropertyById } from '@/data/cyprusProperties';
import { getFrancePropertyById } from '@/data/franceProperties';
import { supabase } from '@/integrations/supabase/client';

// Agent data with images
const getAgentData = (agentName: string) => {
  const agents: Record<string, any> = {
     "Ervina Köksel": {
       name: "Ervina Köksel",
       image: ervinaImage,
       title: "Sales Office Supervisor",
       experience: "Experienced property specialist",
       specialties: ["Property Sales", "Customer Service", "Office Management"]
     }
  };
  return agents[agentName] || null;
};

// Get property data - check correct data sources based on context
const getPropertyData = async (id: string, fromLocation?: string) => {
  console.log('getPropertyData: Looking for property with ID:', id, 'from location:', fromLocation);
  
  // Check static data sources first if we know the source location
  if (fromLocation) {
    console.log('getPropertyData: Checking static sources first based on context:', fromLocation);
    
    if (fromLocation.includes('antalya')) {
      const antalyaProperty = getAntalyaPropertyById(id);
      if (antalyaProperty) {
        console.log('getPropertyData: Found Antalya property in static data:', antalyaProperty.title);
        return {
          ...antalyaProperty,
          pricing: [{ 
            type: antalyaProperty.bedrooms + " " + (antalyaProperty.propertyType || "Apartment"), 
            size: antalyaProperty.area + "m²", 
            price: antalyaProperty.price 
          }],
          facilities: antalyaProperty.features || [],
          agent: "Ervina Köksel",
          contactPhone: "+905523032750",
          contactEmail: "info@futurehomesturkey.com"
        };
      }
    }
    
    if (fromLocation.includes('mersin')) {
      const mersinProperty = getMersinPropertyById(id);
      if (mersinProperty) {
        console.log('getPropertyData: Found Mersin property in static data:', mersinProperty.title);
        return {
          ...mersinProperty,
          pricing: [{ 
            type: mersinProperty.bedrooms + " " + mersinProperty.propertyType, 
            size: mersinProperty.area + "m²", 
            price: mersinProperty.price 
          }],
          facilities: mersinProperty.features,
          images: [mersinProperty.image],
          agent: "Ervina Köksel",
          contactPhone: "+905523032750",
          contactEmail: "info@futurehomesturkey.com"
        };
      }
    }
    
    if (fromLocation.includes('dubai')) {
      const dubaiProperty = getDubaiPropertyById(id);
      if (dubaiProperty) {
        console.log('getPropertyData: Found Dubai property in static data:', dubaiProperty.title);
        return {
          ...dubaiProperty,
          propertyType: "Apartments",
          pricing: [{ 
            type: dubaiProperty.bedrooms + " Apartments", 
            size: dubaiProperty.area + "m²", 
            price: dubaiProperty.price 
          }],
          facilities: ["Pool", "Gym", "Security", "Parking"],
          images: (dubaiProperty as any).images || [dubaiProperty.image],
          features: ["Pool", "Gym", "Security", "Parking"],
          agent: "Ervina Köksel",
          contactPhone: "+905523032750",
          contactEmail: "info@futurehomesturkey.com"
        };
      }
    }
    
    if (fromLocation.includes('cyprus')) {
      const cyprusProperty = getCyprusPropertyById(id);
      if (cyprusProperty) {
        console.log('getPropertyData: Found Cyprus property in static data:', cyprusProperty.title);
        return {
          ...cyprusProperty,
          propertyType: cyprusProperty.propertyType || "Apartment",
          pricing: [{ 
            type: cyprusProperty.bedrooms + " " + cyprusProperty.propertyType, 
            size: cyprusProperty.area + "m²", 
            price: cyprusProperty.price 
          }],
          facilities: cyprusProperty.features || [],
          agent: "Ervina Köksel",
          contactPhone: "+905523032750",
          contactEmail: "info@futurehomesturkey.com"
        };
      }
    }
    
    if (fromLocation.includes('france')) {
      const franceProperty = getFrancePropertyById(id);
      if (franceProperty) {
        console.log('getPropertyData: Found France property in static data:', franceProperty.title);
        return {
          ...franceProperty,
          propertyType: franceProperty.propertyType || "Apartment",
          pricing: [{ 
            type: franceProperty.bedrooms + " " + franceProperty.propertyType, 
            size: franceProperty.area + "m²", 
            price: franceProperty.price 
          }],
          facilities: franceProperty.features || [],
          agent: "Ervina Köksel",
          contactPhone: "+905523032750",
          contactEmail: "info@futurehomesturkey.com"
        };
      }
    }
  }
  
  // Try all static data sources if no location context provided
  if (!fromLocation) {
    console.log('getPropertyData: No location context, checking all static sources');
    
    // Check Antalya first
    const antalyaProperty = getAntalyaPropertyById(id);
    if (antalyaProperty) {
      console.log('getPropertyData: Found property in Antalya static data:', antalyaProperty.title);
      return {
        ...antalyaProperty,
        pricing: [{ 
          type: antalyaProperty.bedrooms + " " + (antalyaProperty.propertyType || "Apartment"), 
          size: antalyaProperty.area + "m²", 
          price: antalyaProperty.price 
        }],
        facilities: antalyaProperty.features || [],
        agent: "Ervina Köksel",
        contactPhone: "+905523032750",
        contactEmail: "info@futurehomesturkey.com"
      };
    }
    
    // Check Mersin
    const mersinProperty = getMersinPropertyById(id);
    if (mersinProperty) {
      console.log('getPropertyData: Found property in Mersin static data:', mersinProperty.title);
      return {
        ...mersinProperty,
        pricing: [{ 
          type: mersinProperty.bedrooms + " " + mersinProperty.propertyType, 
          size: mersinProperty.area + "m²", 
          price: mersinProperty.price 
        }],
        facilities: mersinProperty.features,
        images: [mersinProperty.image],
        agent: "Ervina Köksel",
        contactPhone: "+905523032750",
        contactEmail: "info@futurehomesturkey.com"
      };
    }
    
    // Check Dubai
    const dubaiProperty = getDubaiPropertyById(id);
    if (dubaiProperty) {
      console.log('getPropertyData: Found property in Dubai static data:', dubaiProperty.title);
      return {
        ...dubaiProperty,
        propertyType: "Apartments",
        pricing: [{ 
          type: dubaiProperty.bedrooms + " Apartments", 
          size: dubaiProperty.area + "m²", 
          price: dubaiProperty.price 
        }],
        facilities: ["Pool", "Gym", "Security", "Parking"],
        images: (dubaiProperty as any).images || [dubaiProperty.image],
        features: ["Pool", "Gym", "Security", "Parking"],
        agent: "Ervina Köksel",
        contactPhone: "+905523032750",
        contactEmail: "info@futurehomesturkey.com"
      };
    }
    
    // Check Cyprus
    const cyprusProperty = getCyprusPropertyById(id);
    if (cyprusProperty) {
      console.log('getPropertyData: Found property in Cyprus static data:', cyprusProperty.title);
      return {
        ...cyprusProperty,
        propertyType: cyprusProperty.propertyType || "Apartment",
        pricing: [{ 
          type: cyprusProperty.bedrooms + " " + cyprusProperty.propertyType, 
          size: cyprusProperty.area + "m²", 
          price: cyprusProperty.price 
        }],
        facilities: cyprusProperty.features || [],
        agent: "Ervina Köksel",
        contactPhone: "+905523032750",
        contactEmail: "info@futurehomesturkey.com"
      };
    }
    
    // Check France
    const franceProperty = getFrancePropertyById(id);
    if (franceProperty) {
      console.log('getPropertyData: Found property in France static data:', franceProperty.title);
      return {
        ...franceProperty,
        propertyType: franceProperty.propertyType || "Apartment",
        pricing: [{ 
          type: franceProperty.bedrooms + " " + franceProperty.propertyType, 
          size: franceProperty.area + "m²", 
          price: franceProperty.price 
        }],
        facilities: franceProperty.features || [],
        agent: "Ervina Köksel",
        contactPhone: "+905523032750",
        contactEmail: "info@futurehomesturkey.com"
      };
    }
  }
  
  // Try database lookup for newer properties (only if not found in static data)
  try {
    // Try to find by ref_no first
    let { data: dbProperty, error } = await supabase
      .from('properties')
      .select('*')
      .eq('ref_no', id)
      .maybeSingle();

    console.log('getPropertyData: Database lookup by ref_no result:', { dbProperty, error });

    // If not found by ref_no, try by id (for UUID format)
    if (!dbProperty && !error) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(id)) {
        const result = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        
        dbProperty = result.data;
        error = result.error;
        console.log('getPropertyData: Database lookup by UUID result:', { dbProperty, error });
      }
    }

    if (!error && dbProperty) {
      console.log('getPropertyData: Found property in database:', dbProperty.title);
      // Parse the facilities array and convert to clean format
      let facilities: string[] = [];
      if (dbProperty.property_facilities && Array.isArray(dbProperty.property_facilities)) {
        facilities = dbProperty.property_facilities;
      } else if (typeof dbProperty.facilities === 'string') {
        facilities = dbProperty.facilities.split(',').map(f => f.trim());
      }
      
      // Clean up facilities - remove duplicates and empty values
      facilities = [...new Set(facilities.filter(f => f && f.trim()))];

      // Parse property images
      let images: string[] = [];
      if (dbProperty.property_images && Array.isArray(dbProperty.property_images)) {
        images = dbProperty.property_images;
      }
      if (dbProperty.property_image) {
        images = [dbProperty.property_image, ...images];
      }

      // Parse pricing from property_prices_by_room
      let pricing: any[] = [];
      if (dbProperty.property_prices_by_room) {
        const priceText = dbProperty.property_prices_by_room;
        const priceMatches = priceText.split(';');
        pricing = priceMatches.map((match: string) => {
          const parts = match.trim().split(' - ');
          if (parts.length >= 3) {
            return {
              type: parts[0].trim(),
              size: parts[1].trim(),
              price: parts[2].trim()
            };
          }
          return null;
        }).filter(Boolean);
      }

      return {
        id: dbProperty.ref_no,
        title: dbProperty.title,
        location: dbProperty.location,
        price: `€${dbProperty.price || dbProperty.starting_price_eur}`,
        bedrooms: dbProperty.bedrooms,
        bathrooms: dbProperty.bathrooms,
        area: dbProperty.sizes_m2,
        propertyType: dbProperty.property_type || "Apartments",
        refNo: dbProperty.ref_no,
        buildingComplete: dbProperty.building_complete_date,
        description: dbProperty.description,
        features: facilities,
        facilities: facilities,
        pricing: pricing,
        images: images,
        distanceToAirport: dbProperty.distance_to_airport_km ? `${dbProperty.distance_to_airport_km} km` : undefined,
        distanceToBeach: dbProperty.distance_to_beach_km ? `${dbProperty.distance_to_beach_km} km` : undefined,
        agent: "Ervina Köksel",
        contactPhone: "+905523032750",
        contactEmail: "info@futurehomesturkey.com"
      };
    }
  } catch (error) {
    console.error('Database lookup error:', error);
  }

  console.log('getPropertyData: No database match found, checking static data sources...');

  // Fallback to static data sources for older properties
  
  // Try Antalya properties
  const antalyaProperty = getAntalyaPropertyById(id);
  if (antalyaProperty) {
    return {
      ...antalyaProperty,
      pricing: [{ 
        type: antalyaProperty.bedrooms + " " + (antalyaProperty.propertyType || "Apartment"), 
        size: antalyaProperty.area + "m²", 
        price: antalyaProperty.price 
      }],
      facilities: antalyaProperty.features || [],
      agent: "Ervina Köksel",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com"
    };
  }

  // Try Mersin properties
  const mersinProperty = getMersinPropertyById(id);
  if (mersinProperty) {
    return {
      ...mersinProperty,
      pricing: [{ 
        type: mersinProperty.bedrooms + " " + mersinProperty.propertyType, 
        size: mersinProperty.area + "m²", 
        price: mersinProperty.price 
      }],
      facilities: mersinProperty.features,
      images: [mersinProperty.image],
      agent: "Ervina Köksel",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com"
    };
  }

  // Try Dubai properties from static data (fallback)
  const dubaiProperty = getDubaiPropertyById(id);
  if (dubaiProperty) {
    return {
      ...dubaiProperty,
      propertyType: "Apartments", // Default type for Dubai properties
      pricing: [{ 
        type: dubaiProperty.bedrooms + " Apartments", 
        size: dubaiProperty.area + "m²", 
        price: dubaiProperty.price 
      }],
      facilities: ["Pool", "Gym", "Security", "Parking"], // Default facilities for Dubai
      images: (dubaiProperty as any).images || [dubaiProperty.image],
      features: ["Pool", "Gym", "Security", "Parking"],
      agent: "Ervina Köksel",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com"
    };
  }

  // Try Cyprus properties
  const cyprusProperty = getCyprusPropertyById(id);
  if (cyprusProperty) {
    return {
      ...cyprusProperty,
      propertyType: cyprusProperty.propertyType || "Apartment", 
      pricing: [{ 
        type: cyprusProperty.bedrooms + " " + (cyprusProperty.propertyType || "Apartment"), 
        size: cyprusProperty.area + "m²", 
        price: cyprusProperty.price 
      }],
      facilities: cyprusProperty.features || [],
      images: (cyprusProperty as any).images || [cyprusProperty.image || ""],
      features: cyprusProperty.features || [],
      agent: "Ervina Köksel",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com"
    };
  }

  // Fallback to existing hardcoded data
  const properties: Record<string, any> = {
    "4547": {
      id: "4547",
      title: "Spacious apartments in a complex with pool in Antalya, Altıntaş",
      location: "Antalya, Turkey",
      price: "€141,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "66m²",
      propertyType: "Apartments",
      refNo: "6502",
      buildingComplete: "06/01/2025",
      description: "The apartments for sale are located in the Antalya region of Turkey. Antalya is one of the most popular cities of Turkey, with a year-round holiday life. The region is always preferred by local and foreign people for holiday and living. Antalya, which has all the needs and fun social facilities such as its own developed infrastructure, restaurants, cafes, hospitals, pharmacies, public transportation, shopping centers, also hosts the country's famous unique beaches and natural beauties such as Konyaaltı Beach, Lara Beach, and historic old town. The complex where the apartments for sale are located consists of a single block built on a 756 m² land. The complex, which offers its buyers a quiet and peaceful holiday life, also has facilities such as an outdoor swimming pool, outdoor car park, intercom, and elevator.",
      features: ["Under Construction", "Swimming Pool", "Outdoor Car Park", "Intercom", "Elevator", "Garden"],
      pricing: [{ type: "1+1 Flat", size: "66m²", price: "€141,000" }],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4547/general/apartment-319947.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4547/general/apartment-319933.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4547/general/apartment-319934.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4547/general/apartment-319935.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4547/general/apartment-319936.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4547/general/apartment-319937.webp"
      ],
          agent: "Ervina Köksel",
          contactPhone: "+905523032750",
          contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "49 km",
      distanceToBeach: "6 km",
      facilities: ["Garden", "Pool", "Cable TV - Satellite", "Elevator", "City view", "City Center", "Smart-Home System", "Fitness", "From Developer", "Under Construction"]
    },
    "4552": {
      id: "4552",
      title: "Apartments in a complex with a swimming pool in the city center of Antalya, Konyaaltı",
      location: "Antalya, Konyaaltı",
      price: "€167,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 2",
      area: "52 <> 102m²",
      propertyType: "Apartments",
      refNo: "6504",
      buildingComplete: "12/01/2023",
      description: "The apartments for sale are located in Konyaaltı, Antalya province. Antalya is one of the largest cities in the country, which includes the most touristic districts of Turkey. Konyaaltı district is one of the largest and most developed districts of Antalya province. It has all the daily needs such as shopping malls, intercity bus terminal, restaurants, cafes, hospitals, banks, pharmacies. The complex where the apartments are located has a land area of ​​1080 m². There are a total of 20 apartments in the complex, 10 1+1 apartments with independent apartment entrances on the ground floor and 10 2+1 apartments with duplex design on the first floor. The complex has facilities such as an outdoor swimming pool, landscaped garden, solar energy heating system, apartment intercom.",
      features: ["Ready to Move", "Swimming Pool", "Landscaped Garden", "Solar Energy", "Apartment Intercom"],
      pricing: [
        { type: "1+1 Flat", size: "52m²", price: "€167,000" },
        { type: "2+1 Duplex", size: "102m²", price: "€262,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4552/general/apartment-320003.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4552/general/apartment-320010.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4552/general/apartment-320011.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4552/general/apartment-320012.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4552/general/apartment-320013.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4552/general/apartment-320014.webp"
      ],
      agent: "Ervina Köksel",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "45 km",
      distanceToBeach: "2 km",
      facilities: ["Garden", "Pool", "Cable TV - Satellite", "City view", "City Center", "Smart-Home System", "Ready to Move", "Hot Offer", "From Developer", "New Building"]
    },
    "4543": {
      id: "4543",
      title: "Apartments in an award-winning complex within walking distance to the sea in Antalya, Lara",
      location: "Antalya, Lara",
      price: "€250,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 2",
      area: "65 <> 75m²",
      propertyType: "Apartments",
      refNo: "6500",
      buildingComplete: "02/01/2023",
      description: "The apartments for sale are located in Lara Neighborhood of Antalya district. The complex where the apartments for sale are located consists of 90 apartments. The complex, which resembles a holiday village, consists of 2-storey colorful units. Equipped with areas such as wide green areas, walking paths, bicycle paths, landscaped gardens, artificial lakes, a complex offers its buyers a peaceful feeling of life in nature. With such features, this complex has won the 'Best Housing Development Award'. The complex is only 400 meters away from the sea, is surrounded by the most luxurious villa complexes in the region.",
      features: ["For Residence Permit", "Ready to Move", "Award-Winning Complex", "Walking Distance to Sea", "Landscaped Gardens", "Artificial Lakes", "Gym", "24/7 Security"],
      pricing: [
        { type: "1+1 Flat", size: "65m²", price: "€250,000" },
        { type: "2+1 Flat", size: "75m²", price: "€350,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4543/general/apartment-319852.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4543/general/apartment-319858.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4543/general/apartment-319863.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4543/general/apartment-319862.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4543/general/apartment-319861.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4543/general/apartment-319860.webp"
      ],
      agent: "Ervina Köksel",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "48 km",
      distanceToBeach: "0.4 km",
      facilities: ["Garden", "Pool", "Gym", "Ready to Move", "Hot Offer", "From Developer", "New Building"]
    },
    "4544": {
      id: "4544",
      title: "Luxurious, specially designed villas close to the airport in Antalya, Milas",
      location: "Antalya, Milas",
      price: "€465,000",
      bedrooms: "2+1 <> 4+1",
      bathrooms: "2 <> 2",
      area: "160 <> 253m²",
      propertyType: "Villas",
      refNo: "6501",
      buildingComplete: "06/01/2024",
      description: "The villas for sale are located in the Belek district of Antalya province. Belek is a premium area that hosts an airport and is close to all holiday districts of Antalya. The complex where the villas for sale are located was designed with inspiration from the historical regional houses of Antalya. It was designed with a modern village/town concept. The complex, which hosts a total of 117 villas, was built on a 42,834 m² land. This project, which promises a life intertwined with nature, will include facilities such as olive groves, walking paths, activity areas, town square, restaurant, swimming pools, aquapark, multi-purpose sports field, barn and coop, barbecue areas, olive press house, children's playground and gym.",
      features: ["For Residence Permit", "Ready to Move", "Luxury Villas", "Modern Village Concept", "Olive Groves", "Restaurant", "Aquapark", "Sports Fields", "Turkish Citizenship"],
      pricing: [
        { type: "2+1 Villa", size: "160m²", price: "€465,000" },
        { type: "3+1 Villa", size: "225m²", price: "€530,000" },
        { type: "4+1 Villa", size: "253m²", price: "€553,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4544/general/apartment-319865.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4544/general/apartment-319889.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4544/general/apartment-319890.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4544/general/apartment-319891.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4544/general/apartment-319892.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4544/general/apartment-319875.webp"
      ],
      agent: "Ervina Köksel",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "5 km",
      distanceToBeach: "10 km",
      facilities: ["Garden", "Pool", "Football Field", "Basketball Court", "Tennis Court", "Open Car Park", "Nature view", "Restaurant", "Caretaker", "Barbeque", "Water Slide", "Turkish Citizenship", "Pergolas", "Fitness", "Ready to Move", "Hot Offer", "Luxury", "From Developer", "For Residence Permit", "New Building"]
    },
    "4549": {
      id: "4549",
      title: "Peaceful apartments close to the city center in Antalya, Belek",
      location: "Antalya, Belek",
      price: "€135,000",
      bedrooms: "1+1 <> 3+1",
      bathrooms: "1 <> 1",
      area: "52 <> 109m²",
      propertyType: "Apartments",
      refNo: "6503",
      buildingComplete: "01/01/2024",
      description: "The apartments for sale are located in the Belek district of Antalya. Belek attracts attention with its long Mediterranean beaches, mild climate throughout the year, unique natural beauties and being home to one of the most famous beaches in Turkey, Belek Beach. The complex where the apartments for sale are located consists of 2 blocks built on an area of ​​1617 m² and a total of 27 apartments in 1+1, 3+1 types. Features such as swimming pool, unique landscape, elevator in 2 blocks, intercom system, kitchen and bathroom cabinets, floor and wet floor coverings, interior doors and steel exterior doors are offered to buyers ready for use.",
      features: ["Ready to Move", "Swimming Pool", "Unique Landscape", "Elevator", "Intercom System", "Fully Furnished"],
      pricing: [
        { type: "1+1 Flat", size: "52m²", price: "€135,000" },
        { type: "3+1 Duplex", size: "109m²", price: "€225,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4549/general/apartment-319963.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4549/general/apartment-319969.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4549/general/apartment-319970.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4549/general/apartment-319971.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4549/general/apartment-319972.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4549/general/apartment-319973.webp"
      ],
      agent: "Ervina Köksel",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "50 km",
      distanceToBeach: "2.5 km",
      facilities: ["Garden", "Pool", "Cable TV - Satellite", "City view", "City Center", "Ready to Move", "Hot Offer", "From Developer", "New Building"]
    },
    "4493": {
      id: "4493",
      title: "Modern designed seaside apartments in Cyprus, Tatlısu",
      location: "Cyprus, Tatlısu",
      price: "€600,000",
      bedrooms: "2+1 <> 3+1",
      bathrooms: "2 <> 2",
      area: "110 <> 140m²",
      propertyType: "Apartments",
      refNo: "8015",
      buildingComplete: "01/01/2025",
      description: "Flats for sale are located in Tatlısu, Cyprus. This region, close to Famagusta, is always preferred by locals and investors. Luxury villas, apartments and hotels in the region are the residences that people prefer to stay throughout the year. Villas and apartments located in a quiet area away from the city are often preferred by holidaymakers. The project on the first coastline consists of 10 blocks with 1, 2 and 3 bedroom apartments and 5 private houses with direct sea views. The project is located in the Esentepe area, within walking distance to the beach and various restaurants. There will be a SPA center, gym, restaurant, outdoor gym, swimming pool, bar and restaurant on site. The location of the luxury project is 10 km from Tatlısu center, 36 km from Kyrenia center and 40 km from Ercan Airport.",
      features: ["Sea view", "For Residence Permit", "Under Construction", "SPA Center", "Gym", "Restaurant", "Beach Access"],
      pricing: [
        { type: "2+1 Flat", size: "110m²", price: "€600,000" },
        { type: "3+1 Flat", size: "140m²", price: "€700,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4493/general/apartment-319005.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4493/general/apartment-319019.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4493/general/apartment-319020.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4493/general/apartment-319021.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4493/general/apartment-319022.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4493/general/apartment-319023.webp"
      ],
      agent: "Ervina Köksel",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "40 km",
      distanceToBeach: "0.2 km",
      facilities: ["Garden", "Open Car Park", "Cable TV - Satellite", "Sea view", "Nature view", "Restaurant", "Pool bar", "Spa", "Fitness", "From Developer", "For Residence Permit", "Under Construction"]
    },
    "4504": {
      id: "4504",
      title: "Luxury villas and apartments in a perfect location in Cyprus, Esentepe",
      location: "Cyprus, Esentepe",
      price: "€420,000",
      bedrooms: "2+1 <> 3+1",
      bathrooms: "2 <> 2",
      area: "89 <> 158m²",
      propertyType: "Apartments",
      refNo: "8024",
      buildingComplete: "09/01/2025",
      description: "The complex with flats and villas for sale is located in Esentepe, Cyprus. Esentepe is a region known for its unique sea views, thanks to its gently sloping geographical structure. The 2 and 3-storey apartments and villas in the region add significant value. The area is also highly sought after by local and foreign tourists and investors due to its proximity to Nicosia city center, Kyrenia city center, the sea, and Ercan Airport. The complex features 3 different site designs and offers residences of various types and sizes, from studio apartments to luxury villas. Options include flats with private garden areas, private terraces, and large rooftop terraces, making it one of the largest complexes in the region. Facilities within the complex include swimming pools, a restaurant, a gym, a spa, a pool bar, car parking, landscaped gardens, and a 24/7 security system. It also offers easy access to daily necessities such as supermarkets, pharmacies, and a marina. The site is conveniently located just 600 meters from the sea, 16 km from Kyrenia, and 30 km from Ercan Airport.",
      features: ["Sea view", "Under Construction", "Swimming Pools", "Restaurant", "Gym", "Spa", "24/7 Security"],
      pricing: [
        { type: "2+1 Flat", size: "89m²", price: "€420,000" },
        { type: "3+1 Apartments", size: "158m²", price: "€584,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4504/general/apartment-319208.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4504/general/apartment-319216.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4504/general/apartment-319217.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4504/general/apartment-319209.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4504/general/apartment-319210.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4504/general/apartment-319211.webp"
      ],
      agent: "Ervina Köksel",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "30 km",
      distanceToBeach: "0.6 km",
      facilities: ["Fire Alarm", "Security", "Camera System", "Garden", "Open Car Park", "Pool", "Sea view", "Nature view", "Restaurant", "Caretaker", "Pool bar", "Spa", "Fitness", "From Developer", "Under Construction"]
    },
    "4645": {
      id: "4645",
      title: "Luxury apartments in a complex with pool in Antalya, Altintas",
      location: "Antalya, Altintas",
      price: "€100,000",
      bedrooms: "1+1 <> 4+1",
      bathrooms: "1 <> 2",
      area: "50 <> 130m²",
      propertyType: "Apartments",
      refNo: "1388",
      buildingComplete: "11/01/2025",
      description: "The apartments for sale are located in the Guzelyurt region next to Altintas neighborhood of Aksu, Antalya. The Guzelyurt region has become an attractive place for real estate investments as a rapidly developing and appreciating region in recent recent years. Altıntaş, which attracts attention with its modern housing projects and infrastructure investments, also offers great advantages with its proximity to the city center and easy access to the airport. The complex where the apartments for sale are located has a swimming pool, outdoor car park, smart elevator system, fitness center, camellia, and barbecue area. The complex is 8 km from Antalya Airport, 9 km from Lara Beach, 18 km from Antalya City Center and Mark Antalya Shopping Center, and within walking distance to daily needs such as pharmacy, bakery, restaurant, local markets, schools, health centers.",
      features: ["EXCLUSIVE", "Under Construction", "Swimming Pool", "Fitness Center", "Barbecue Area", "Smart Elevator"],
      pricing: [
        { type: "1+1 Flat", size: "50m²", price: "€100,000" },
        { type: "2+1 Flat", size: "74m²", price: "€180,000" },
        { type: "4+1 Duplex", size: "130m²", price: "€350,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4645/general/apartment-321557.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4645/general/apartment-321566.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4645/general/apartment-321567.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4645/general/apartment-321564.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4645/plan/luxury-apartments-in-a-complex-with-pool-in-antalya-altintas-321809.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4645/plan/luxury-apartments-in-a-complex-with-pool-in-antalya-altintas-321813.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "8 km",
      distanceToBeach: "9 km",
      facilities: ["Camera System", "Garden", "Open Car Park", "Pool", "Cable TV - Satellite", "Elevator", "Nature view", "Baby Pool", "Barbeque", "Disabled-Friendly", "Fitness", "Hot Offer", "Luxury", "From Developer", "New Building", "Under Construction", "EXCLUSIVE"]
    },
    "4530": {
      id: "4530",
      title: "Apartments suitable for investment in a perfect location in Antalya, Kepez",
      location: "Antalya, Kepez",
      price: "€95,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "55m²",
      propertyType: "Apartments",
      refNo: "1370",
      buildingComplete: "08/01/2026",
      description: "The apartments for sale are located in Altınova, which is affiliated to the Kepez district of Antalya. Altınova Neighborhood is an area that draws attention with its proximity to Antalya International Airport, and is home to the city's major shopping malls such as Mall of Antalya, Ikea, and Agora, and is also a 10-minute drive from the city center. Thanks to this excellent location of the area, it is frequently preferred by construction companies and investors. The project where the apartments are located consists of 2 blocks and 165 apartments. It is one of the largest and most prestigious complexes in Altınova. The project includes studio, 1+1 and 2+1 apartment types. The project will include facilities such as a basketball court, volleyball court and a field that can be used as a tennis court, swimming pool, water slide, open car park, closed car park, fitness, sauna, site attendant, 7/24 security, rental and tenant management service. The complex, which is only 1.5 km away from Antalya International Airport, is 9 km away from the historical Kaleiçi and 9 km away from Lara beaches.",
      features: ["Under Construction", "Basketball Court", "Volleyball Court", "Tennis Court", "Swimming Pool", "Water Slide", "Fitness", "Sauna", "24/7 Security"],
      pricing: [{ type: "1+1 Flat", size: "55m²", price: "€95,000" }],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4530/general/apartment-319644.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4530/general/apartment-319645.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4530/general/apartment-319646.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4530/general/apartment-319647.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4530/general/apartment-319648.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4530/general/apartment-319649.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "1.5 km",
      distanceToBeach: "9 km",
      facilities: ["Fire Alarm", "Security Alarm System", "Security", "Camera System", "Air Conditioning", "Garden", "Basketball Court", "Volleyball Court", "Gym", "Sauna", "Pool", "Cable TV - Satellite", "Elevator", "Turkish bath", "Caretaker", "City Center", "Water Slide", "Private Garden for apartment", "Disabled-Friendly", "Garage", "Smart-Home System", "Pergolas", "Fitness", "Hot Offer", "From Developer", "Under Construction"]
    },
    "4524": {
      id: "4524",
      title: "Ultra luxury new villas in nature in Antalya, Konyaaltı",
      location: "Antalya, Konyaalti",
      price: "€710,000",
      bedrooms: "5+1",
      bathrooms: "4",
      area: "270m²",
      propertyType: "Villas",
      refNo: "1365",
      buildingComplete: "05/01/2024",
      description: "Villas for sale are located in Geyikbayırı, Konyaaltı, Antalya. It stands out with its 25-minute distance to Geyikbayırı city center. It is a region surrounded by nature with a unique view. This region, which attracts attention with its luxury villas, is frequently preferred by everyone who is looking for a peaceful life in nature, away from city life. The villa, located in the complex with a total of 8 villas, was designed to have 5 bedrooms and 1 living room. Villas with a land area of 700 m² consist of 4 floors. In the villas, which have a total of 2 kitchens and 4 bathrooms, all features such as dressing room, terrace, kitchen cabinets, bathroom cabinets, bathroom fixtures and kitchen fixtures are ready for use. The villa complex is 18 km from Konyaaltı Beach, 25 km from Antalya city center, and 34 km from Antalya International Airport.",
      features: ["Sea view", "For Residence Permit", "Ready to Move", "Luxury Villas", "Nature Surroundings", "Dressing Room", "Terrace"],
      pricing: [{ type: "5+1 Villa", size: "270m²", price: "€710,000" }],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4524/general/apartment-319567.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4524/general/apartment-319575.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4524/general/apartment-319576.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4524/general/apartment-319577.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4524/general/apartment-319578.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4524/general/apartment-319579.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "34 km",
      distanceToBeach: "18 km",
      facilities: ["Garden", "Open Car Park", "Fire Alarm", "Caretaker", "Private Garden for apartment", "Dressing Room", "Luxury", "New Building"]
    },
    "4522": {
      id: "4522",
      title: "Newly completed apartments in the city center of Antalya, Muratpasa",
      location: "Antalya, Muratpasa",
      price: "€120,000",
      bedrooms: "2+1 <> 4+1",
      bathrooms: "1 <> 2",
      area: "80 <> 180m²",
      propertyType: "Apartments",
      refNo: "1363",
      buildingComplete: "03/01/2024",
      description: "Flats for sale are located in Üçgen District of Muratpaşa, Antalya. Üçgen neighborhood is at the center of all daily needs, with easy transportation facilities, and within walking distance of the city's major shopping malls and all daily needs. Surrounded by hospitals, tram stops, parks, market areas and large shopping malls, the region is always preferred by local people for living. The project, which consists of 2+1, 4+1 duplex flats and shops on the ground floor, has a closed parking lot. The flats in the newly completed project are equipped with many features such as spot lights, interior doors, bathroom fixtures, floor coverings, wet floor coverings, kitchen cabinets, PVC windows and are ready for use.",
      features: ["Ready to Move", "City Center", "Closed Parking", "Fully Equipped", "Shopping Mall Proximity"],
      pricing: [
        { type: "2+1 Flat", size: "80m²", price: "€120,000" },
        { type: "4+1 Duplex", size: "180m²", price: "€195,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4522/general/apartment-319546.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4522/general/apartment-319547.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4522/general/apartment-319548.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4522/general/apartment-319549.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4522/general/apartment-319550.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4522/general/apartment-319551.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "9 km",
      distanceToBeach: "5 km",
      facilities: ["Pool", "City view", "Private garage", "Ready to Move", "Hot Offer", "From Developer", "New Building"]
    },
    "4521": {
      id: "4521",
      title: "Flats for sale in a newly completed project in Antalya, Kepez",
      location: "Antalya, Kepez",
      price: "€160,000",
      bedrooms: "4+1",
      bathrooms: "2",
      area: "180m²",
      propertyType: "Apartments",
      refNo: "1362",
      buildingComplete: "03/01/2024",
      description: "Flats for sale are located in Çamlıbel District in Antalya, Kepez region. Kepez is one of the largest districts of Antalya. It is a region that contains all daily needs such as shopping malls, hospitals, public transportation stations and banks. Since the region is preferred by local people, it is suitable for renting all year round. The project with flats for sale consists of 2 blocks. The project, which includes 2+1 mezzanine and 4+1 duplex flats, has large, spacious flats. There are market areas, tram stops, markets and shops around the project. The project is 7 km away from Antalya city center, 9 km from Konyaaltı coast and 12 km from Antalya International Airport.",
      features: ["Ready to Move", "Large Spacious Flats", "2 Blocks", "Tram Access", "Shopping Areas"],
      pricing: [{ type: "4+1 Flat", size: "180m²", price: "€160,000" }],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4521/general/apartment-319539.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4521/general/apartment-319544.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4521/general/apartment-319545.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4521/general/apartment-319538.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4521/general/apartment-319542.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4521/general/apartment-319539.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "12 km",
      distanceToBeach: "9 km",
      facilities: ["Pool", "City view", "City Center", "Ready to Move", "Hot Offer", "From Developer", "New Building"]
    },
    "4469": {
      id: "4469",
      title: "Flats for sale in a modern designed project in Antalya, Altıntaş",
      location: "Antalya, Aksu",
      price: "€157,500",
      bedrooms: "1+1 <> 3+1",
      bathrooms: "1 <> 3",
      area: "45 <> 103m²",
      propertyType: "Apartments",
      refNo: "1353",
      buildingComplete: "12/01/2025",
      description: "Flats for sale are located in Altıntaş District of Aksu district of Antalya province. Altıntaş is the most famous investment area of the city. This area stands out with its excellent location right next to Antalya International Airport. It is estimated that Altıntaş will be one of the most elite districts of the city when the projects are completed in a few years, thanks to its proximity to the Lara district, Kundu district, the city's large shopping malls and the unique architectures of the projects in the region. The project, which includes flats for sale, will be built on an area of 35,000 m². A total of 406 flats of 7 floors and different types will be included in the project. The project will include hotel facilities such as swimming pool, fitness, sauna, Turkish bath, security, camera system, basketball, tennis courts, cinema, etc. The flats will be delivered to the buyers ready for use, with features such as kitchen cabinets, kitchen countertops, built-in kitchen trio, bathroom fixtures, cloakroom, air conditioners and natural gas installation. The project, which includes luxury apartments, is 7 km from Lara beach, 6 km from shopping centers such as Agora AVM, Ikea, Mall of Antalya, Deepo, 10 km from Lara district center, one of the most elite and beautiful districts of the city, and 4 km from Antalya International Airport.",
      features: ["For Residence Permit", "Under Construction", "Hotel Facilities", "Swimming Pool", "Fitness", "Sauna", "Turkish Bath", "Basketball Court", "Tennis Court", "Cinema"],
      pricing: [
        { type: "1+1 Flat", size: "45m²", price: "€157,500" },
        { type: "2+1 Flat", size: "74m²", price: "€250,500" },
        { type: "3+1 Flat", size: "103m²", price: "€344,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4469/general/property-antalya-aksu-general-4469-15.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4469/general/property-antalya-aksu-general-4469-3.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4469/general/property-antalya-aksu-general-4469-4.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4469/general/property-antalya-aksu-general-4469-5.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4469/general/property-antalya-aksu-general-4469-6.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4469/plan/property-antalya-aksu-plan-4469-0.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "4 km",
      distanceToBeach: "7 km",
      facilities: ["Garden", "Pool", "From Developer", "New Building"]
    },
    "3267": {
      id: "3267",
      title: "Luxury villas in the biggest project of the region in Antalya, Belek",
      location: "Antalya, Belek",
      price: "€550,000",
      bedrooms: "4+1",
      bathrooms: "4",
      area: "180m²",
      propertyType: "Villas",
      refNo: "1311",
      buildingComplete: "01/01/2025",
      description: "Villas for sale are located in Kadriye, Antalya, Serik. Kadriye district is one of the most famous tourism regions of Antalya, which hosts the largest and most luxurious hotels and world-famous golf centers of the city, side by side with Belek. In addition to the availability of all daily necessities in the region, its proximity to the city center of Antalya makes this area and the houses built here valuable and suitable for investment. The project, which includes luxury villas for sale, will be built on a 50,000 m² plot of land with a length of 1.2 km. It will house a total of 86 4+1 luxury villas. There will be facilities such as 1 car parking area for each villa, garden usage area, 32 m² private pool, walking paths within the site, 24/7 security and security camera system, children's playgrounds. In the villas, underfloor heating system, combi boiler, air conditioning infrastructure on all floors, lacquered specially coated kitchen cabinets, built-in set, cloakroom in the entrance and hall, dressing room cabinet and shelf system, washer and dryer area, ceramic wet floors, parquet floor, lacquered living areas. There will be luxury features such as coated interior doors, special marble stairs, video intercom system, 3 meters ceiling height on the entrance floor, 2.8 meters ceiling height in the rooms, solar energy panel infrastructure in each villa. The apartments are 1.8 km from the sea, 1.8 km from The Land of Legends, one of the most luxurious hotels and shopping centers in Antalya, 0.5 km from local shopping malls and 30 km from Antalya International Airport.",
      features: ["For Residence Permit", "Under Construction", "Luxury Villas", "Private Pool", "24/7 Security", "Golf Area", "Turkish Citizenship"],
      pricing: [{ type: "4+1 Villa", size: "180m²", price: "€550,000" }],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3267/general/property-antalya-serik-general-3267-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3267/general/property-antalya-serik-general-3267-1.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3267/general/property-antalya-serik-general-3267-10.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3267/general/property-antalya-serik-general-3267-11.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3267/general/property-antalya-serik-general-3267-12.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3267/plan/property-antalya-serik-plan-3267-0.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "30 km",
      distanceToBeach: "1.8 km",
      facilities: ["Garden", "Pool", "Cable TV - Satellite", "Nature view", "Floor heating", "From Developer", "For Residence Permit", "Under Construction", "Open Car Park", "Security", "Fire Alarm", "Turkish Citizenship"]
    },
    "3278": {
      id: "3278",
      title: "Apartments with sea, mountain and forest views in Antalya, Kepez",
      location: "Antalya, Kepez",
      price: "€170,000",
      bedrooms: "2+1 <> 3+1",
      bathrooms: "1 <> 1",
      area: "82 <> 126m²",
      propertyType: "Apartments",
      refNo: "1314",
      buildingComplete: "01/01/2025",
      description: "Apartments for sale are located in Antalya, Kepez region. The apartments, which are in one of the biggest urban transformation projects of the city, attract attention with their modern design. Such projects in the Kepez region meet the growth needs of the city and ensure the rapid development of the region. A large population of the city lives in this region, and flats suitable for renting all year round are frequently preferred by investors. The project where the flats are located consists of 3 blocks and a total of 210 residences. In the apartments consisting of ground + 10 floors, there will be features such as 24/7 security, security camera system, open car parking, indoor car parking, outdoor swimming pool, playgrounds for children, green landscape. The most important feature of the apartments is that they are located in the largest living area of the city. All daily necessities such as hospitals, schools, banks, shopping malls, ATMs will be found in this region. The first stop of the city's tram system will be moved into this urban transformation project. While there are all daily necessities around the project, there are natural and forested areas such as Antalya zoo and picnic areas. It is within walking distance to public transportation, local shopping centers, 6 km to the city center, 7 km to the beach, 4 km to shopping centers and 18 km to Antalya International Airport.",
      features: ["For Residence Permit", "Under Construction", "Sea View", "Mountain View", "Forest View", "Urban Transformation", "Turkish Citizenship"],
      pricing: [
        { type: "2+1 Flat", size: "82m²", price: "€170,000" },
        { type: "3+1 Flat", size: "126m²", price: "€290,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3278/general/property-antalya-kepez-general-3278-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3278/general/property-antalya-kepez-general-3278-6.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3278/general/property-antalya-kepez-general-3278-7.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3278/general/property-antalya-kepez-general-3278-8.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3278/plan/property-antalya-kepez-plan-3278-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3278/plan/property-antalya-kepez-plan-3278-1.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "18 km",
      distanceToBeach: "7 km",
      facilities: ["Fire Alarm", "Security", "Garden", "Open Car Park", "Pool", "Elevator", "City view", "Close to Bus Stop", "Private garage", "City Center", "Turkish Citizenship", "From Developer", "For Residence Permit", "Under Construction"]
    },
    "3302": {
      id: "3302",
      title: "Stylish apartments in a project suitable for investment in Antalya, Altıntaş",
      location: "Antalya, Aksu",
      price: "€155,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 1",
      area: "45 <> 64m²",
      propertyType: "Apartments",
      refNo: "1323",
      buildingComplete: "10/01/2025",
      description: "Apartments for sale are located in Altıntaş, Antalya, Aksu region. Altıntaş district is right next to Antalya International Airport and is adjacent to Lara, one of the oldest and most elite districts of the city. Near the area are the city's major shopping centers. This region, which draws attention with its proximity to the sea and proximity to the Kundu hotels area, is the most popular area for investors in Antalya. The project, where the apartments are for sale, has 3 blocks and a construction area of 8.000 m². In the project, there are 80 residences in B and C blocks and 34 commercial flats in A block. The flats with American kitchen design have luxury features such as air conditioning in each room, electric shutters, ready-to-use bathroom, ready-to-use kitchen, built-in triple kitchen set and floor heating. In the project, there will be hotel facilities such as indoor car parking, outdoor car parking, poolside bar, outdoor swimming pool, children's swimming pool, barbecue area, multi-court (football + basketball), tennis court, sports field, children's playground, concierge service, fitness center, reception, security and 24/7 camera. Only 4 km to the beach in Lara, the apartments are 8 km to major shopping centers such as Ikea, Agora and Mall of Antalya, 12 km to the city center and 4 km to Antalya International Airport.",
      features: ["Under Construction", "American Kitchen", "Electric Shutters", "Floor Heating", "Hotel Facilities", "Poolside Bar", "Multi-Court", "Concierge Service"],
      pricing: [
        { type: "1+1 Flat", size: "45m²", price: "€155,000" },
        { type: "2+1 Flat", size: "64m²", price: "€225,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3302/general/property-antalya-aksu-general-3302-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3302/general/property-antalya-aksu-general-3302-2.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3302/general/property-antalya-aksu-general-3302-3.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3302/general/property-antalya-aksu-general-3302-4.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3302/general/property-antalya-aksu-general-3302-5.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3302/general/property-antalya-aksu-general-3302-6.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "4 km",
      distanceToBeach: "4 km",
      facilities: ["Fire Alarm", "Security", "Camera System", "Air Conditioning", "Garden", "Football Field", "Basketball Court", "Tennis Court", "Open Car Park", "Pool", "Elevator", "Floor heating", "Baby Pool", "Caretaker", "Barbeque", "Garage", "Concierge Service", "Pool bar", "Pergolas", "Fitness", "From Developer", "Under Construction"]
    },
    "3246": {
      id: "3246",
      title: "Apartments for sale in the best location of the region in Antalya, Altintas",
      location: "Antalya, Aksu",
      price: "€179,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 2",
      area: "90 <> 137m²",
      propertyType: "Apartments",
      refNo: "1302",
      buildingComplete: "12/01/2024",
      description: "The complex with luxury apartments is located in Antalya, Altıntaş region. Golden stone; It is located in Antalya. Altıntaş region has become an investment center thanks to its specially designed housing projects with hotel facilities. Thanks to the proximity of the region to the Lara beach and Antalya Airport, it is estimated that it will become one of the elite districts with high rental income in a few years, when infrastructure works and housing projects are completed. The project, where the apartments for sale are located, will be 11,001 m² wide, and will be built on the side of the main street, which will form the center of the region. Thanks to the location of the project, which will house a total of 123 apartments, it will become one of the most valuable projects of the region where the infrastructure works are completed. In the project, there are 1+1, 2+1 and 2+1 duplex apartments with a garden usage area, terrace and pool or mezzanine apartments. Lobby, reception, outdoor car parking lot, electric vehicle charging unit, outdoor swimming pool, children's swimming pool, indoor swimming pool, Turkish bath, sauna, fitness, steam room, salt room, massage room, meeting room and library, solar energy panels in the luxury complex. , bowling, billiards, table football, darts, playstation, movie theater, pool bar, barbecue area, mini club, children's playground, walking track, free beach entrance (vip card), free airport shuttle, shopping center shuttle and beach shuttle service, TV and satellite system, 24/7 security and camera system, guest hosting service, dry cleaning, housekeeping, carpet cleaning service, technical service, vip transfer service, car rental service, courier service, veterinarian and doctor, etc. There are facilities to meet all of them. In addition to technical features such as earthquake regulations, building inspection regulations, fire regulations, ground survey, generator, air conditioner collection unit, 5 elevators, mechanically insulated exterior cladding, underfloor heating, electric combi boiler, triple built-in kitchen set, smart home system, air conditioners, Safe and high quality apartments such as kitchen and bathroom cabinets, cloakroom at the entrance of the apartment, interior doors, ceramic floor coverings, shower cabin will be delivered ready for use. 3 km to Lara beach, 5 km to shopping centers such as Mall of Antalya, Agora and Ikea, 8 km to Lara district center, the apartments are only 1 km to Antalya International Airport.",
      features: ["Under Construction", "Luxury Complex", "Hotel Facilities", "Indoor Swimming Pool", "Turkish Bath", "Sauna", "Steam Room", "Salt Room", "Massage Room", "Movie Theater", "Bowling", "Free Beach Entrance", "Airport Shuttle", "VIP Services"],
      pricing: [
        { type: "1+1 Flat", size: "90m²", price: "€179,000" },
        { type: "2+1 Duplex", size: "137m²", price: "€285,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3246/general/property-antalya-aksu-general-3246-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3246/general/property-antalya-aksu-general-3246-19.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3246/general/property-antalya-aksu-general-3246-2.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3246/general/property-antalya-aksu-general-3246-3.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3246/general/property-antalya-aksu-general-3246-4.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3246/plan/property-antalya-aksu-plan-3246-0.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "1 km",
      distanceToBeach: "3 km",
      facilities: ["Fire Alarm", "Security", "Camera System", "Air Conditioning", "Garden", "Sauna", "Cinema", "Open Car Park", "Pool", "Cable TV - Satellite", "Elevator", "Floor heating", "Turkish bath", "Indoor swimming pool", "Close to Bus Stop", "Pool Table", "Beach", "Baby Pool", "Caretaker", "Barbeque", "Garage", "Concierge Service", "Steam Room", "Smart-Home System", "Massage room", "Pool bar", "Pergolas", "Bowling", "Beach transfer services", "Fitness", "From Developer", "Under Construction"]
    },
    "3240": {
      id: "3240",
      title: "Luxury apartments for sale with perfect location in Antalya, Muratpasa",
      location: "Antalya, Muratpasa",
      price: "€150,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "44m²",
      propertyType: "Apartments",
      refNo: "1297",
      buildingComplete: "03/01/2024",
      description: "Apartments for sale are located in Genç Mahallesi of Antalya, Muratpaşa. It is located on Işıklar Street, where the city's most beautiful cafes, restaurants and hotels are located. The neighborhood, which hosts the historical Kaleiçi (OldTown) and Karaalioğlu Park, is one of the oldest neighborhoods in Antalya. All daily necessities such as public transportation, pharmacies, schools, shopping malls, markets are also available in the area. The project areas where the apartments for sale are located consist of 70 different types of flats varying between 60 m² and 130 m². Luxury features such as Siemens brand built-in set, Artema plumbing systems, Daikin brand air conditioners, underfloor heating system, 2-3 pane double glazed heat and sound insulated panoramic windows, steel exterior doors, air conditioning infrastructures, natural gas, manual shutters are delivered to their buyers ready for use. will be. On the site, facilities such as an outdoor swimming pool and a children's pool, a security camera system, a private parking garage for all apartments and a smart car wash system, 2 smart and fast elevator systems in the indoor parking lot, 24/7 site attendant, Turkish bath and fitness center. will be found. The project, which has a perfect location, is only 300 meters to the sea, 500 meters to the historical Kaleici, within walking distance to all daily needs such as cafes, restaurants, public transport, taxi stands, markets, shops, banks, 1 km to MarkAntalya shopping center and Antalya International Airport. It is 14 km away.",
      features: ["For Residence Permit", "Under Construction", "Perfect Location", "Historical Area", "Luxury Features", "Siemens Appliances", "Turkish Citizenship"],
      pricing: [{ type: "1+1 Flat", size: "44m²", price: "€150,000" }],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3240/general/property-antalya-muratpasa-general-3240-3.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3240/general/property-antalya-muratpasa-general-3240-6.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3240/general/property-antalya-muratpasa-general-3240-7.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3240/general/property-antalya-muratpasa-general-3240-8.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3240/general/property-antalya-muratpasa-general-3240-9.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3240/plan/property-antalya-muratpasa-plan-3240-0.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "14 km",
      distanceToBeach: "2 km",
      facilities: ["Fire Alarm", "Security", "Camera System", "Air Conditioning", "Pool", "Elevator", "Floor heating", "Turkish bath", "Close to Bus Stop", "Private garage", "Caretaker", "Turkish Citizenship", "Garage", "Smart-Home System", "Fitness", "From Developer", "For Residence Permit", "Under Construction"]
    },
    "4510": {
      id: "4510",
      title: "Stylish loft apartments in a unique location in Cyprus, Bahçeli",
      location: "Cyprus, Bahçeli",
      price: "€175,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "82m²",
      propertyType: "Apartments",
      refNo: "8029",
      buildingComplete: "12/01/2025",
      description: "Flats for sale are located in Bahçeli region, Cyprus. This region attracts attention with its luxury villas and residential projects. In addition to offering a peaceful and quiet life opportunity to its residents with its untouched nature and unique sea view, Bahçeli is also frequently preferred by tourists throughout the year with its easy access to city centers. It is a very suitable investment option with its high rental income. Around the project, where stylish loft apartments are located, there are other luxury villas and apartment complexes of Bahçeli. The project, which consists of 1+1 mezzanine and 1+1 loft flat types, has a unique sea view, outdoor swimming pool, gym, spa, sauna, steam room, massage room, changing room, relaxation areas, landscaped gardens and open car parking. There are.",
      features: ["Sea view", "For Residence Permit", "Under Construction", "Loft Design", "Gym", "Spa", "Sauna"],
      pricing: [
        { type: "1+1 Flat", size: "82m²", price: "€175,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4510/general/apartment-319302.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4510/interior/apartment-319317.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4510/interior/apartment-319316.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4510/interior/apartment-319315.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4510/interior/apartment-319314.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4510/interior/apartment-319313.webp"
      ],
      agent: "Ervina Köksel",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "50 km",
      distanceToBeach: "0.5 km",
      facilities: ["Garden", "Sauna", "Open Car Park", "Pool", "Sea view", "Nature view", "Steam Room", "Massage room", "Spa", "Fitness", "From Developer", "For Residence Permit", "Under Construction"]
    },
    "4513": {
      id: "4513",
      title: "Luxury apartments in the villa area near the sea in Cyprus, Esentepe",
      location: "Cyprus, Esentepe",
      price: "€215,000",
      bedrooms: "1+1 <> 3+1",
      bathrooms: "1 <> 1",
      area: "46 <> 132m²",
      propertyType: "Apartments",
      refNo: "8032",
      buildingComplete: "09/01/2025",
      description: "Flats for sale are located in Bahçeli, Esentepe, Cyprus. The region attracts attention with its proximity to the sea, villas and low-rise luxury complexes. The fact that the completion dates of the constructions in the region are close to each other makes the region suitable for investment, and the fact that Cyprus is frequently preferred by construction companies adds value to the region. The project, where there are flats for sale, has 4 blocks and a total of 32 flats. In addition to 1+1, 2+1, 3+1 flat types, loft flats are also available in the complex. Facilities such as swimming pool, children's playground, green areas, recreation area, parking lot and commercial areas will be included in the project.",
      features: ["Sea view", "For Residence Permit", "Under Construction", "Swimming Pool", "Children's Playground", "Green Areas"],
      pricing: [
        { type: "1+1 Flat", size: "46m²", price: "€215,000" },
        { type: "2+1 Flat", size: "111m²", price: "€274,000" },
        { type: "3+1 Flat", size: "132m²", price: "€359,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4513/general/apartment-319371.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4513/general/apartment-319378.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4513/general/apartment-319379.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4513/interior/apartment-319380.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4513/interior/apartment-319381.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4513/interior/apartment-319382.webp"
      ],
      agent: "Ervina Köksel",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "37 km",
      distanceToBeach: "0.5 km",
      facilities: ["Fire Alarm", "Garden", "Open Car Park", "Pool", "Sea view", "Nature view", "Pergolas", "Hot Offer", "From Developer", "New Building", "Under Construction"]
    },
    "4490": {
      id: "4490",
      title: "Stylish apartments in a complex with a private beach in Cyprus, Famagusta",
      location: "Cyprus, Famagusta",
      price: "€552,000",
      bedrooms: "2+1 <> 3+1",
      bathrooms: "2 <> 2",
      area: "115 <> 142m²",
      propertyType: "Apartments",
      refNo: "8012",
      buildingComplete: "06/01/2023",
      description: "Flats for sale are located in Tatlısu, Famagusta, Cyprus. Tatlısu is a coastal area in the middle of Kyrenia and Famagusta district centers, containing luxury villas, apartments and hotel projects. The region attracts attention with its calm and peaceful life. At the same time, 30 minutes driving freedom to Kyrenia center and Nicosia Center. The complex of flats for sale was built in 5 blocks on a land of 6000 m² and consists of 43 flats in total. The luxury site has facilities such as open registration pool, closed registration book, sports center, Turkish room, sauna, massage rooms, beauty center, landscaped garden, orchard, walking capacity, mountain and hiking trails.",
      features: ["Sea view", "Under Construction", "Private Beach", "Sports Center", "Turkish Bath", "Sauna", "Beauty Center"],
      pricing: [
        { type: "2+1 Flat", size: "115m²", price: "€552,000" },
        { type: "3+1 Flat", size: "142m²", price: "€600,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4490/general/apartment-318948.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4490/general/apartment-318957.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4490/general/apartment-318949.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4490/general/apartment-318950.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4490/general/apartment-318951.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4490/general/apartment-318952.webp"
      ],
      agent: "Ervina Köksel",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "40 km",
      distanceToBeach: "0.1 km",
      facilities: ["Garden", "Sauna", "Pool", "Sea view", "Nature view", "Turkish bath", "Indoor swimming pool", "Beach", "Massage room", "Luxury", "From Developer", "New Building", "Under Construction"]
    },
    "4489": {
      id: "4489",
      title: "Modern designed apartments with sea view in Cyprus, Tatlısu",
      location: "Cyprus, Tatlısu",
      price: "€540,000",
      bedrooms: "3+1",
      bathrooms: "2",
      area: "135m²",
      propertyType: "Apartments",
      refNo: "8011",
      buildingComplete: "01/01/2022",
      description: "Flats for sale are located in Tatlısu, Kyrenia, Cyprus. Freshwater; It is a region famous for its luxury villa and apartment projects, offering its residents the opportunity of a quiet life in nature. The projects in this region, which is a 20-minute drive from the centers of Kyrenia and Nicosia, have a unique sea and nature view. The project consists of 28 flats and 6 villas and offers flat options with private gardens or roof terraces. 2 bedroom garden apartments; It has an area of 85 m² and has 2 bathrooms. The American kitchen has direct access to your garden and living room. The flat's private garden terrace will be delivered ready-made with trees and flowers that the person will choose when purchasing the flat. 3-bedroom petnhouse apartments have a perfect sea and nature view. The sunrise and sunset views you will witness from the terrace are breathtaking. Additionally, a jacuzzi can be placed on your roof terrace as an option for hot summer days. The complex will have landscaping, secure entrance, outdoor swimming pool, herb garden and fruit trees. The project, which is located on the seafront, is 2 km from the beach, 30 km from the center of Kyrenia, 36 km from the center of Nicosia and 34 km from Ercan Airport.",
      features: ["Sea view", "For Residence Permit", "Ready to Move", "Private Gardens", "Roof Terraces", "Herb Garden"],
      pricing: [
        { type: "3+1 Flat", size: "135m²", price: "€540,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4489/general/apartment-318933.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4489/general/apartment-318938.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4489/general/apartment-318937.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4489/general/apartment-318936.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4489/general/apartment-318935.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4489/general/apartment-318934.webp"
      ],
      agent: "Ervina Köksel",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "34 km",
      distanceToBeach: "2 km",
      facilities: ["Garden", "Pool", "Sea view", "Nature view", "Private Garden for apartment", "Ready to Move", "Luxury", "From Developer", "For Residence Permit"]
    },
    "4482": {
      id: "4482",
      title: "Flats in a luxury project with a hospital in Cyprus, Gaziveren",
      location: "Cyprus, Gaziveren",
      price: "€98,000",
      bedrooms: "1+ <> 1+1",
      bathrooms: "1 <> 1",
      area: "37 <> 59m²",
      propertyType: "Apartments",
      refNo: "8005",
      buildingComplete: "09/01/2025",
      description: "Flats for sale are located in Gaziveren, Cyprus. The area where the complex is located offers its residents the opportunity for a quiet, tranquil life. Structures such as housing projects, health facilities and education complexes in the region have accelerated the development of the region and made the region suitable for investment. Gaziveren attracts attention with its unique beaches, golf courses, ancient cities and includes all daily needs. The complex with luxury flats for sale consists of 6 blocks with 10 floors. Located on a total land of 25,000 m², the complex includes a hospital and health center built on an area of 5,000 m². There are 604 flats of different sizes and types available for investors and holidaymakers. Apart from the hospital and facilities, the luxury project will be located in front of the complex in a marina where you can do all sea activities such as boating, surfing and water sports. The complex has facilities such as an outdoor swimming pool, heated indoor swimming pool, surfing and water sports club, gym, yoga areas, sauna, Turkish bath, steam room, massage room, jacuzzi, medical center, treatment center, marina, garden area, restaurants. It will happen. Apartments will be delivered to their buyers ready for use, with facilities such as air conditioning, kitchen appliances and satellite system, as well as standard features.",
      features: ["Sea view", "For Residence Permit", "Under Construction", "Hospital", "Marina", "Water Sports Club"],
      pricing: [
        { type: "1+ Flat", size: "37m²", price: "€98,000" },
        { type: "1+1 Flat", size: "59m²", price: "€131,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4482/general/apartment-318787.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4482/interior/apartment-318799.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4482/interior/apartment-318798.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4482/general/apartment-318788.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4482/general/apartment-318789.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4482/general/apartment-318790.webp"
      ],
      agent: "Ervina Köksel",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "65 km",
      distanceToBeach: "0.4 km",
      facilities: ["Garden", "Pool", "Cable TV - Satellite", "Smart-Home System", "New Building"]
    },
    "4491": {
      id: "4491",
      title: "Beachfront flats in a project with extensive facilities in Cyprus, Esentepe",
      location: "Cyprus, Esentepe",
      price: "€141,000",
      bedrooms: "1+ <> 2+1",
      bathrooms: "1 <> 2",
      area: "42 <> 88m²",
      propertyType: "Apartments",
      refNo: "8013",
      buildingComplete: "12/01/2023",
      description: "The complex where the apartments are located is located in Cyprus, Kyrenia, Esentepe. This region, adorned with the natural beauties of Cyprus, has a unique view. Esentepe, located in the north of the island and east of Kyrenia, is famous for its restaurants, hiking trails, beach, historical and cultural heritage. This region, which is frequently preferred by local and foreign people for holiday and living, is very suitable for real estate investment. The project, which is being built on an area of 85,000 m², has flats of many different types and sizes. You will have a comfortable life thanks to the features in the complex such as gym, outdoor sports area, indoor swimming pool, outdoor swimming pool, children's garden, tennis court, bicycle path, restaurant, supermarket, barbecue area, beach bar, mingolf and sauna.",
      features: ["Sea view", "For Residence Permit", "Under Construction", "Tennis Court", "Indoor Swimming Pool", "Beach Bar"],
      pricing: [
        { type: "1+ Flat", size: "42m²", price: "€141,000" },
        { type: "1+1 Flat", size: "82m²", price: "€201,000" },
        { type: "2+1 Flat", size: "88m²", price: "€240,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4491/general/apartment-318968.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4491/general/apartment-318969.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4491/general/apartment-318970.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4491/general/apartment-318971.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4491/general/apartment-318972.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4491/general/apartment-318973.webp"
      ],
      agent: "Ervina Köksel",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "44 km",
      distanceToBeach: "0.1 km",
      facilities: ["Fire Alarm", "Garden", "Tennis Court", "Golf", "Sauna", "Pool", "Sea view", "Nature view", "Indoor swimming pool", "Restaurant", "Barbeque", "Dressing Room", "Pool bar", "Fitness", "Luxury", "From Developer", "For Residence Permit", "Under Construction"]
    },
    "4500": {
      id: "4500",
      title: "Apartments in a complex with indoor swimming pool in Cyprus, Tatlısu",
      location: "Cyprus, Tatlısu",
      price: "€143,000",
      bedrooms: "1+ <> 4+1",
      bathrooms: "1 <> 2",
      area: "49 <> 300m²",
      propertyType: "Apartments",
      refNo: "8021",
      buildingComplete: "12/01/2025",
      description: "Flats for sale are located in Tatlısu, Cyprus. The Tatlisu region, located in the north of Cyprus, is a developing region of the island that is frequently preferred by local and foreign investors. There are mostly villas and low-rise apartment projects in this region, which stands out with its easy access to areas such as Kyrenia center, Nicosia center and Ercan Airport. There are a total of 175 units in the project. Flat types such as studio flats, 1+1 flats, 2+1 flats and detached houses are available in the project and all daily needs will be located in the complex. There will be an outdoor swimming pool, indoor swimming pool, gym, Turkish bath, spa, sauna, pool bar, restaurants and shops in the complex. The site is only 500 meters from the beach, 25 km from Kyrenia center and 50 km from Ercan Airport.",
      features: ["Sea view", "For Residence Permit", "Under Construction", "Indoor Swimming Pool", "Turkish Bath", "Spa"],
      pricing: [
        { type: "1+ Flat", size: "49m²", price: "€143,000" },
        { type: "1+1 Flat", size: "67m²", price: "€174,000" },
        { type: "2+1 Flat", size: "97m²", price: "€282,000" },
        { type: "3+1 Private House", size: "350m²", price: "€768,000" },
        { type: "4+1 Villas", size: "300m²", price: "€960,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4500/general/apartment-319135.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4500/interior/apartment-319146.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4500/interior/apartment-319148.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4500/interior/apartment-319145.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4500/interior/apartment-319149.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4500/interior/apartment-319150.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "50 km",
      distanceToBeach: "0.5 km",
      facilities: ["Garden", "Pool", "Turkish bath", "Indoor swimming pool", "Restaurant", "Barbeque", "Steam Room", "Massage room", "Pool bar", "Spa", "Fitness", "From Developer", "New Building"]
    },
    "4509": {
      id: "4509",
      title: "Flats in a complex with sea view in Cyprus, Esentepe",
      location: "Cyprus, Esentepe",
      price: "€300,000",
      bedrooms: "3+1",
      bathrooms: "2",
      area: "121m²",
      propertyType: "Apartments",
      refNo: "8028",
      buildingComplete: "",
      description: "Flats for sale are located in Esentepe region, Cyprus. Esentepe; It is a region that attracts attention with its low-rise apartment projects and villa projects, and is famous for its unique Mediterranean view and untouched nature. Projects in the region accelerate the development of the region and make the region suitable for investment. Thanks to the ease of access to Nicosia and Kyrenia centre, it is a region frequently preferred by those who want a peaceful holiday throughout the year. The project, where there are flats for sale, consists of 4 blocks and 28 units consisting of 1 bedroom, 2 bedroom and 3 bedroom flats. The apartments have private garden areas and terraces where you can enjoy the unique Mediterranean view. The complex will have facilities such as an outdoor swimming pool, recreation areas, outdoor car parking, landscaped gardens, sports center, barbecue area in common gardens, jacuzzi, barbecue area on the roof terrace, water heating system.",
      features: ["Sea view", "For Residence Permit", "Under Construction", "Private Gardens", "Jacuzzi", "Sports Center"],
      pricing: [
        { type: "3+1 Flat", size: "121m²", price: "€300,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4509/general/apartment-319282.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4509/general/apartment-319283.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4509/general/apartment-319284.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4509/general/apartment-319285.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4509/general/apartment-319286.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4509/general/apartment-319287.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "45 km",
      distanceToBeach: "0.6 km",
      facilities: ["Garden", "Pool", "Cable TV - Satellite", "Barbeque", "Jacuzzi", "Pergolas", "From Developer"]
    },
    "4503": {
      id: "4503",
      title: "Stylish apartments surrounded by nature in Cyprus, Tatlısu",
      location: "Cyprus, Tatlısu",
      price: "€178,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 2",
      area: "60 <> 106m²",
      propertyType: "Apartments",
      refNo: "8023",
      buildingComplete: "08/01/2024",
      description: "Flats for sale are located in Tatlısu region, Cyprus. Tatlısu, located in the north of Cyprus; It is a twenty-minute drive from Kyrenia and Famagusta regions. There are low-rise apartment projects and luxury villa projects in this region, which stands out with its beaches, untouched nature and climate. Projects in the region accelerate the infrastructural development of the region and add value to the region. This project, which has sea and mountain views, is ideal for those who want a peaceful and comfortable life. The project includes 1+1 ground floor flats with private gardens, 1+1 flats with sea views and 12 semi-detached villas with large roof terraces. The project has 2 common pools, recreation areas, gym, private outdoor car parking, children's playground, basketball court, tennis court, landscaped garden, management and rental services.",
      features: ["Sea view", "For Residence Permit", "Under Construction", "Basketball Court", "Tennis Court", "Children's Playground"],
      pricing: [
        { type: "1+1 Flat", size: "60m²", price: "€178,000" },
        { type: "2+1 Villas", size: "106m²", price: "€336,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4503/general/apartment-319181.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4503/general/apartment-319194.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4503/general/apartment-319195.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4503/general/apartment-319196.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4503/general/apartment-319197.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4503/general/apartment-319198.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "47 km",
      distanceToBeach: "0.9 km",
      facilities: ["Garden", "Pool", "Cable TV - Satellite", "Sea view", "Basketball Court", "Tennis Court", "Open Car Park", "Fire Alarm", "Nature view", "Caretaker", "Pergolas", "Fitness", "From Developer", "For Residence Permit", "Under Construction"]
    },
    "4507": {
      id: "4507",
      title: "Stylish properties within walking distance to the sea in Cyprus, Tatlısu",
      location: "Cyprus, Tatlısu",
      price: "€252,000",
      bedrooms: "1+1 <> 3+1",
      bathrooms: "1 <> 2",
      area: "133 <> 243m²",
      propertyType: "Apartments",
      refNo: "8026",
      buildingComplete: "05/01/2025",
      description: "Flats for sale are located in Tatlısu region, Cyprus. Tatlısu region, located in the east of Kyrenia, is a region in nature, between the Beşparmak mountains and the Mediterranean coast. This region, which stands out with its seaside location and magnificent sunrise and sunset views, is also known for its easy access to city centers and the airport. The project with flats for sale is located in a 10-block project. There are flat types of different sizes in the project, including 1+1 garden floor and penthouse duplex, 2+1 and 3+1 penthouse duplex and detached houses. The project includes facilities such as a private garden area, rooftop terrace area, outdoor swimming pool, indoor heated swimming pool, gymnastics area, yoga area, private car parking and meditation room. The flats have an open-plan kitchen design, features such as central satellite system, air conditioning infrastructure, internet infrastructure are available in the flats and rental services will be provided by the professional site management.",
      features: ["Sea view", "For Residence Permit", "Under Construction", "Indoor Heated Swimming Pool", "Yoga Area", "Meditation Room"],
      pricing: [
        { type: "1+1 Flat", size: "133m²", price: "€252,000" },
        { type: "2+1 Flat", size: "99m²", price: "€288,000" },
        { type: "3+1 Flat", size: "243m²", price: "€450,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4507/general/apartment-319238.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4507/general/apartment-319250.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4507/general/apartment-319251.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4507/general/apartment-319252.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4507/general/apartment-319253.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4507/general/apartment-319254.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "40 km",
      distanceToBeach: "0.2 km",
      facilities: ["Fire Alarm", "Garden", "Sauna", "Pool", "Cable TV - Satellite", "Sea view", "Nature view", "Indoor swimming pool", "Caretaker", "Fitness", "From Developer", "For Residence Permit", "Under Construction"]
    },
    "4494": {
      id: "4494",
      title: "Flats in the project with a health center in Cyprus, Tatlısu",
      location: "Cyprus, Tatlısu",
      price: "€138,000",
      bedrooms: "1+ <> 2+1",
      bathrooms: "1 <> 2",
      area: "41 <> 80m²",
      propertyType: "Apartments",
      refNo: "8016",
      buildingComplete: "06/01/2025",
      description: "Flats for sale are located in Tatlısu, Cyprus. Freshwater region; It is a region equipped with luxury villa and apartment projects, offering a quiet life away from the city noise, frequently preferred by holidaymakers with its easy access to the city, and gaining investment opportunities thanks to this feature. The entire project is built on an area of 133,800 m² and offers great facilities and a health center as a modern residential complex developed by the most reliable and powerful construction company in the city. The project will be an excellent choice for those who prefer a healthy lifestyle, meditation and tranquility. Surrounded by breathtaking views of the Mediterranean and the mountains, this project includes facilities such as a restaurant, a meditation and wellness center, barbecue areas, basketball and tennis courts, a cafe, a beach restaurant with a perfect view of the sunset, and pools.",
      features: ["For Residence Permit", "Under Construction", "Health Center", "Meditation Center", "Basketball Court", "Tennis Court"],
      pricing: [
        { type: "1+ Flat", size: "41m²", price: "€138,000" },
        { type: "1+1 Flat", size: "61m²", price: "€183,000" },
        { type: "2+1 Flat", size: "80m²", price: "€310,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4494/general/apartment-319035.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4494/general/apartment-319036.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4494/general/apartment-319037.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4494/general/apartment-319038.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4494/general/apartment-319041.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4494/general/apartment-319039.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "48 km",
      distanceToBeach: "0.3 km",
      facilities: ["Garden", "Basketball Court", "Tennis Court", "Open Car Park", "Pool", "Beach", "Barbeque", "Pool bar", "From Developer", "For Residence Permit", "Under Construction"]
    },
    "4511": {
      id: "4511",
      title: "Flats in a complex with a swimming pool and close to the beach in Cyprus, Iskele",
      location: "Cyprus, Iskele",
      price: "€173,000",
      bedrooms: "1+1 <> 3+1",
      bathrooms: "1 <> 2",
      area: "65 <> 400m²",
      propertyType: "Apartments",
      refNo: "8030",
      buildingComplete: "06/01/2026",
      description: "Flats for sale are located in Iskele, Cyprus. Dock; It is a region that attracts attention with its proximity to Famagusta city center and sandy beaches, and is constantly preferred by tourists with its warm climate throughout the year. Thanks to the housing and villa projects being built in the region by construction companies, the region is constantly developing and is frequently preferred by local and foreign investors. There are 72 flats and 13 villas in the project, which includes villas and flats with sea and nature views. The complex has 24/7 security service and facilities such as pools with a total area of 1000 m², restaurant, bar, Turkish bath, sauna, fitness, basketball court, garden chess, sports fields, playgrounds, private car parking, generator, electric scooter rental service. will be found. In addition, the cooling and heating needs of the flats on the site will be met by VRF air conditioners and underfloor heating. Only 600 meters away from the sea, the complex is 25 km away from Famagusta center and 57 km away from Ercan Airport.",
      features: ["Sea view", "For Residence Permit", "Under Construction", "24/7 Security", "Turkish Bath", "Basketball Court", "Electric Scooter Rental"],
      pricing: [
        { type: "1+1 Flat", size: "65m²", price: "€173,000" },
        { type: "2+1 Flat", size: "80m²", price: "€210,000" },
        { type: "3+1 Villas", size: "400m²", price: "€554,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4511/general/apartment-319321.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4511/general/apartment-319336.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4511/interior/apartment-319337.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4511/interior/apartment-319338.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4511/interior/apartment-319339.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4511/interior/apartment-319340.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "57 km",
      distanceToBeach: "0.6 km",
      facilities: ["Fire Alarm", "Security", "Backup Generator", "Air Conditioning", "Garden", "Basketball Court", "Sauna", "Open Car Park", "Pool", "Sea view", "Nature view", "Floor heating", "Turkish bath", "Restaurant", "Pool bar", "Spa", "Fitness", "Luxury", "From Developer", "For Residence Permit", "Under Construction"]
    },
    "4512": {
      id: "4512",
      title: "Stylish apartments in a luxury complex in Cyprus, Iskele",
      location: "Cyprus, Iskele",
      price: "€160,000",
      bedrooms: "1+ <> 3+1",
      bathrooms: "1 <> 2",
      area: "46 <> 482m²",
      propertyType: "Apartments",
      refNo: "8031",
      buildingComplete: "09/01/2027",
      description: "Flats for sale are located in Iskele, Cyprus. This region is famous for its luxury hotels, is close to Famagusta, is located by the sea, has all your daily needs, and is also a fifteen-minute drive from the city centers. Luxury projects in the region increase the value of the region. Thanks to its unique location between Famagusta and Dipkarpaz, it is frequently preferred by local and foreign tourists throughout the year. The project, which includes stylish apartments, consists of 5 blocks with 29 floors. The complex has studio, 1+1, 2+1, 3+1 apartments as well as 3+1 penthouse apartments with their own private pool. 5-star hotel, supermarkets, children's club, Cyprus's largest swimming pool of 4000 m², sports fields, open-air cinema, water park, gym, beauty salon, spa, rooftop infinity pool, shuttle service, playgrounds, There are many hotel facilities in the project, such as a pharmacy, business center, bar, cafe, indoor heated swimming pool. There are markets, stores, shops and pharmacies around the complex, which is 14 km away from Famagusta, where you can meet your daily needs. The complex is 45 km from Nicosia and 40 km from Ercan Airport.",
      features: ["Sea view", "For Residence Permit", "Under Construction", "5-Star Hotel", "Water Park", "Open-Air Cinema", "Rooftop Infinity Pool"],
      pricing: [
        { type: "1+ Flat", size: "46m²", price: "€160,000" },
        { type: "2+1 Flat", size: "94m²", price: "€215,000" },
        { type: "1+1 Flat", size: "59m²", price: "€217,500" },
        { type: "3+1 Dublex", size: "482m²", price: "€1,985,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4512/general/apartment-319356.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4512/general/apartment-319359.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4512/general/apartment-319362.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4512/interior/apartment-319360.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4512/interior/apartment-319361.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4512/interior/apartment-319363.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "40 km",
      distanceToBeach: "0.7 km",
      facilities: ["Fire Alarm", "Security Alarm System", "Security", "Backup Generator", "Garden", "Cinema", "Open Car Park", "Pool", "Cable TV - Satellite", "Elevator", "Sea view", "Nature view", "Restaurant", "Caretaker", "Garage", "Concierge Service", "Steam Room", "Smart-Home System", "Massage room", "Pool bar", "Pergolas", "Spa", "Fitness", "Luxury", "From Developer", "For Residence Permit", "New Building", "Under Construction"]
    },
    "4501": {
      id: "4501",
      title: "Sea and nature view flats in a complex in Cyprus, Bahçeli",
      location: "Cyprus, Bahçeli",
      price: "€194,000",
      bedrooms: "1+ <> 2+1",
      bathrooms: "1 <> 1",
      area: "43 <> 135m²",
      propertyType: "Apartments",
      refNo: "8022",
      buildingComplete: "06/01/2026",
      description: "Flats for sale are located in Bahçeli, Cyprus. The project, which is being built in an area with direct sea and mountain views, will consist of 3 phases. In the 1st phase, villas on the beach, in the 2nd phase, 14 studio flats, 4 1+1 and 4 2+1 flats, shared swimming pools and decorative step pools, in the 3rd phase, 1+1 garden floor flats and 2+1 penthouses. It will consist of solid circles. The most attractive feature of the complex is the large communal swimming pools with an artificial beach of real sand, around the pool there are restaurants, a spa center, a tennis court and a gym. Additionally, there will be various activity centers for both adults and children within the complex. The project is an excellent investment tool for buyers, thanks to its high rental income potential as well as a peaceful life opportunity by the beach. Studio garden flats have a usage area of 35 m² and a terrace area of 8 m². 1+1 flats consist of a total area of 50 m² and a terrace area of 10 m². 2+1 flats have a usage area of 75 m², a terrace area of 10 m² and a roof terrace area of 50 m². The project, which has a private beach only 400 meters from the coast, is 20 km from Kyrenia center and 35 km from Ercan Airport.",
      features: ["Sea view", "For Residence Permit", "Under Construction", "Artificial Beach", "Tennis Court", "Private Beach", "3 Phases"],
      pricing: [
        { type: "1+ Flat", size: "43m²", price: "€194,000" },
        { type: "2+1 Flat", size: "135m²", price: "€396,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4501/general/apartment-319158.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4501/general/apartment-319159.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4501/general/apartment-319157.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4501/general/apartment-319160.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4501/general/apartment-319161.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4501/general/apartment-319162.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "35 km",
      distanceToBeach: "0.4 km",
      facilities: ["Fire Alarm", "Garden", "Tennis Court", "Sauna", "Open Car Park", "Pool", "Cable TV - Satellite", "Sea view", "Nature view", "Turkish bath", "Indoor swimming pool", "Restaurant", "Spa", "Fitness", "From Developer", "For Residence Permit", "Under Construction"]
    },
    "4486": {
      id: "4486",
      title: "Luxury villas within a complex in Cyprus, Kyrenia",
      location: "Cyprus, Kyrenia",
      price: "€887,000",
      bedrooms: "4+1",
      bathrooms: "4",
      area: "440m²",
      propertyType: "Villas",
      refNo: "8008",
      buildingComplete: "10/01/2025",
      description: "Luxury villas for sale are located in Alsancak, Cyprus. It is an area suitable for investment as it houses the city's luxury hotels and restaurants, is close to all daily needs such as education, hospitals, shopping malls, and is close to the center of Kyrenia. This region, which is frequently preferred by those who want to invest in Cyprus or those who want to establish a life in Cyprus, is one of the most well-known districts of Cyprus. In the complex where the villas are located, there are only 10 detached 4-room villas. These are 2-storey villas consisting of a large living room combined with a kitchen, 4 bedrooms, 4 bathrooms and a laundry room. Luxury villas also have a private pool, garden area, garage for 2 cars and a roof terrace. Located 1 km from the sea, the complex is close to all daily needs. It is 8 km from the center of Kyrenia, 30 km from Nicosia and 50 km from Ercan Airport.",
      features: ["For Residence Permit", "Under Construction", "Private Pool", "Garage for 2 Cars", "Roof Terrace", "Detached Villas"],
      pricing: [
        { type: "4+1 Villa", size: "440m²", price: "€887,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4486/general/apartment-318857.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4486/general/apartment-318856.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4486/general/apartment-318858.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4486/general/apartment-318854.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4486/general/apartment-318855.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4486/general/apartment-318859.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "50 km",
      distanceToBeach: "1 km",
      facilities: ["Garden", "Pool", "From Developer", "New Building"]
    },
    "4498": {
      id: "4498",
      title: "Beachfront apartments in a luxury complex in Cyprus, Famagusta",
      location: "Cyprus, Famagusta",
      price: "€198,000",
      bedrooms: "1+ <> 2+1",
      bathrooms: "1 <> 2",
      area: "43 <> 135m²",
      propertyType: "Apartments",
      refNo: "8019",
      buildingComplete: "12/01/2025",
      description: "Flats for sale are located in Tatlısu region of Famagusta, Cyprus. Tatlısu region is famous in the city for its quiet life away from the city noise. Thanks to the ease of access to the region's city center and airport, it is frequently preferred by holidaymakers throughout the year. Luxury villa and apartment projects being built in the region add value to the region and make the region suitable for investment. There are different types of flats in the project, such as garden flats, penthouse terrace flats and luxury villas. The project, which consists of a total of 105 different units, has facilities such as the beach, specially designed outdoor swimming pools, barbecue area, beach facilities, restaurant, gymnastics area, spa center, mini market, 24/7 maintenance service, and shuttle service to the golf club, just a few steps away.",
      features: ["Sea view", "Under Construction", "Golf Club Shuttle", "Mini Market", "24/7 Maintenance", "Beach Facilities"],
      pricing: [
        { type: "1+ Flat", size: "43m²", price: "€198,000" },
        { type: "1+1 Flat", size: "60m²", price: "€300,000" },
        { type: "2+1 Flat", size: "135m²", price: "€395,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4498/general/apartment-319085.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4498/general/apartment-319099.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4498/general/apartment-319100.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4498/general/apartment-319101.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4498/general/apartment-319102.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4498/general/apartment-319103.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "48 km",
      distanceToBeach: "0.1 km",
      facilities: ["Fire Alarm", "Garden", "Tennis Court", "Sauna", "Open Car Park", "Pool", "Sea view", "Turkish bath", "Restaurant", "Caretaker", "Barbeque", "Pool bar", "From Developer", "Under Construction"]
    },
    "4496": {
      id: "4496",
      title: "Sea view apartments and bungalows within the complex in Cyprus, Tatlısu",
      location: "Cyprus, Tatlısu",
      price: "€143,000",
      bedrooms: "1+ <> 3+1",
      bathrooms: "1 <> 2",
      area: "49 <> 285m²",
      propertyType: "Apartments",
      refNo: "8018",
      buildingComplete: "06/01/2025",
      description: "Flats for sale are located in Tatlısu, Cyprus. Villa and flat projects in the region add value to the region. Located right by the sea with its untouched signs, Tatlısu offers a unique Mediterranean view to their lives. Although it receives help from the city's clouds, this region is preferred by locals and foreigners for holidays and tourism throughout the year, due to its easy access to the city. Luxury flats are located in a seaside site on an area of 41,400 m². The site, which consists of 5 blocks, 216 flats and 17 bungalow houses in total, includes an outdoor registration pool, outdoor heated registration pool, sports center, gymnastics area, sauna, steam room, health and wellness center, professional site management, rental service, beach facilities and landscaped garden. Facilities such as are available. Located 36 km from Kyrenia center and 48 km from Ercan Airport, the complex is right next to the sea and you can find places such as markets, restaurants and bars to meet daily payments.",
      features: ["Sea view", "For Residence Permit", "Under Construction", "Bungalow Houses", "Health and Wellness Center", "Professional Site Management"],
      pricing: [
        { type: "1+ Flat", size: "49m²", price: "€143,000" },
        { type: "1+1 Flat", size: "67m²", price: "€174,000" },
        { type: "3+1 Private House", size: "285m²", price: "€744,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4496/general/apartment-319064.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4496/interior/apartment-319074.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4496/interior/apartment-319075.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4496/interior/apartment-319076.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4496/general/apartment-319065.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4496/general/apartment-319066.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "48 km",
      distanceToBeach: "0.2 km",
      facilities: ["Garden", "Sauna", "Open Car Park", "Pool", "Sea view", "Indoor swimming pool", "Restaurant", "Caretaker", "Massage room", "Pool bar", "Fitness", "Luxury", "From Developer", "For Residence Permit", "Under Construction"]
    },
    "4492": {
      id: "4492",
      title: "Luxury detached villas with sea view in Cyprus, Famagusta",
      location: "Cyprus, Famagusta",
      price: "€960,000",
      bedrooms: "4+1",
      bathrooms: "3",
      area: "195m²",
      propertyType: "Villas",
      refNo: "8014",
      buildingComplete: "05/01/2024",
      description: "Villas for sale are located in Tatlısu, Famagusta, Cyprus. Tatlısu is a region that offers its residents a peaceful life away from city noise, with its untouched nature where luxury villa and apartment projects are located. Ease of transportation to the city centers of the region adds value to the region. The project where the villas are located consists of 2 rows of luxury villas with a unique design whose facades are made of natural stone. The two-storey villas, consisting of 3 bedrooms and 3 bathrooms with an interior area of 150 m² and a terrace area of 70 m², feature a large open-plan living room combined with an American kitchen on the ground floor, two spacious bedrooms and two balconies. The master bedroom is located on the second floor with a private bathroom and access to a large terrace with stunning views of the pool and the Mediterranean Sea. Each villa has its own plot planted with flowers and decorative trees.",
      features: ["Sea view", "For Residence Permit", "Under Construction", "Natural Stone Facades", "Private Plot", "Mediterranean View"],
      pricing: [
        { type: "4+1 Villa", size: "195m²", price: "€960,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4492/general/apartment-318993.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4492/general/apartment-318998.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4492/general/apartment-319001.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4492/general/apartment-319002.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4492/general/apartment-319003.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4492/general/apartment-318995.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "50 km",
      distanceToBeach: "0.2 km",
      facilities: ["Garden", "Pool", "Sea view", "Nature view", "Restaurant", "Luxury", "From Developer", "For Residence Permit", "Under Construction"]
    },
    "4506": {
      id: "4506",
      title: "Real estate for sale in a site with a pool by the sea in Cyprus, Esentepe",
      location: "Cyprus, Esentepe",
      price: "€276,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 2",
      area: "50 <> 138m²",
      propertyType: "Apartments",
      refNo: "8025",
      buildingComplete: "01/01/2027",
      description: "Flats for sale are located in Esentepe region, Cyprus. Esentepe; It is a region located in the north of Cyprus, attracting attention with its low-rise housing projects and villa complexes, and offering its buyers the opportunity of a quiet, peaceful life with its unique sea view and untouched nature. Thanks to the region's proximity to cities and entertainment centers, it is preferred by local and foreign tourists throughout the year. The project with flats for sale is located right next to the sea. In addition to a peaceful life with its terraced flats, it also offers investment opportunities to its buyers, just a few steps away from the sea and easy access to many facilities. The project, which consists of 7 blocks built on a land of 35,000 m², has many facilities such as a common swimming pool, garden usage area, outdoor car parking, professional site management service and apartment rental service. In the project, which includes 1+1 garden floor, 1+1 penthouse loft and 2+1 penthouse loft flat types, 2+1 penthouse flats are located on the terrace. All flats are designed as an open-plan kitchen.",
      features: ["Sea view", "For Residence Permit", "Under Construction", "Terraced Flats", "Penthouse Loft", "Open-Plan Kitchen"],
      pricing: [
        { type: "1+1 Flat", size: "50m²", price: "€276,000" },
        { type: "2+1 Dublex", size: "138m²", price: "€480,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4506/general/apartment-319233.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4506/general/apartment-319228.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4506/general/apartment-319227.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4506/general/apartment-319226.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4506/general/apartment-319225.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4506/general/apartment-319235.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "22 km",
      distanceToBeach: "0.5 km",
      facilities: ["Garden", "Pool", "Open Car Park", "Sea view", "Nature view", "Restaurant", "Caretaker", "Pool bar", "From Developer", "For Residence Permit", "Under Construction"]
    },
    "4495": {
      id: "4495",
      title: "Flats in the project with sea service in Cyprus, Esentepe",
      location: "Cyprus, Esentepe",
      price: "€480,000",
      bedrooms: "2+1",
      bathrooms: "2",
      area: "90m²",
      propertyType: "Apartments",
      refNo: "8017",
      buildingComplete: "03/01/2025",
      description: "Flats for sale are located in Cyprus, Esentepe, Karaağaç. Right next to the project where the apartments are located, there is another complex built by the same developer. The project, which is one of the largest sites in its region, is a living center defined as a 'small city'. The project, which is suitable for investment thanks to such features, offers its investors the opportunity of a quiet, peaceful and comfortable life. In the complex where luxury apartments are located, there is an outdoor swimming pool, indoor swimming pool, common garden, walking track, car park, gym, health center, spa, restaurant, bar, basketball court, tennis court, professional site management service, site attendant, market and beach access. There are facilities such as shuttle service. Each of the flats will be built using first-class materials, with kitchen cabinets, wardrobes, floor ceramics, bathroom tiles and hardware ready, and will be delivered to the buyers. The complex is located 1.5 km from the sea, 3 km from the beach with regular shuttle service every day, 3 km from the facility where restaurants, bars and cafes are located, 20 km from Kyrenia city center and 37 km from Ercan Airport.",
      features: ["Sea view", "For Residence Permit", "Under Construction", "Small City Complex", "Beach Shuttle Service", "Health Center"],
      pricing: [
        { type: "2+1 Flat", size: "90m²", price: "€480,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4495/general/cyprus-apartment-319061.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4495/general/cyprus-apartment-319056.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4495/general/cyprus-apartment-319058.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4495/general/cyprus-apartment-319059.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4495/general/cyprus-apartment-319060.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4495/general/cyprus-apartment-319062.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "37 km",
      distanceToBeach: "3 km",
      facilities: ["Garden", "Pool", "Basketball Court", "Tennis Court", "Sauna", "Indoor swimming pool", "Restaurant", "Steam Room", "Pool bar", "Beach transfer services", "Spa", "Fitness", "Luxury", "From Developer"]
    },
    "4481": {
      id: "4481",
      title: "Sea view apartments for sale in Cyprus, Lefke",
      location: "Cyprus, Lefke",
      price: "€96,000",
      bedrooms: "1+ <> 2+1",
      bathrooms: "1 <> 1",
      area: "36 <> 81m²",
      propertyType: "Apartments",
      refNo: "8004",
      buildingComplete: "07/01/2022",
      description: "Flats for sale are located in Lefke, Gaziveren. Education and health projects in the region add value to the region and enable the rapid development of the region. It is estimated that real estate investment in this rapidly developing region will yield great returns. The project where the flats are located has a total of 3 blocks and was built on an area of 10,000 m². The complex has outdoor car parking for each flat, children's playground, outdoor swimming pool, heated indoor swimming pool, sauna, fitness, rooftop swimming pool, Turkish bath, spa and wellness center, mini golf course, restaurants, cafes, beach bar, private beach area. There are many features such as walking areas.",
      features: ["Sea view", "For Residence Permit", "Ready to Move", "Rooftop Swimming Pool", "Mini Golf Course", "Private Beach Area"],
      pricing: [
        { type: "1+ Flat", size: "36m²", price: "€96,000" },
        { type: "1+1 Flat", size: "65m²", price: "€145,000" },
        { type: "2+1 Dublex", size: "81m²", price: "€235,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4481/general/apartment-318755.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4481/general/apartment-318777.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4481/general/apartment-318778.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4481/general/apartment-318779.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4481/general/apartment-318780.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4481/interior/apartment-318767.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "65 km",
      distanceToBeach: "0.3 km",
      facilities: ["Garden", "Pool", "Cable TV - Satellite", "New Building"]
    },
    "4479": {
      id: "4479",
      title: "Stylish villas in luxury complex in Cyprus, Kyrenia",
      location: "Cyprus, Kyrenia",
      price: "€390,000",
      bedrooms: "3+1",
      bathrooms: "1",
      area: "150m²",
      propertyType: "Villas",
      refNo: "8003",
      buildingComplete: "04/01/2025",
      description: "Luxury villas for sale are located in Kyrenia. Kyrenia; Famous for its features such as luxury hotels, warm climate, restaurants, international universities, clear sea and tourism life, it is one of the apples of the eye of Turkey and Cyprus. The area where luxury villas are located is located in the west of Kyrenia. It offers its residents the opportunity of a quiet life surrounded by nature. The project, which has a total land area of 3500 m², includes 6 semi-detached villas and 12 detached villas. All of the villas have 3+1 plans, and there is an outdoor parking area in their gardens and a pool option in the garden. Each of the luxury villas is equipped with features such as en-suite bathrooms and closets in the bedrooms, balconies in all rooms, non-slip ceramic flooring, internet infrastructure, satellite infrastructure, air conditioning infrastructures, bathroom fixtures, shower cabin, fireplace and barbecue area.",
      features: ["Sea view", "For Residence Permit", "Under Construction", "Semi-detached and Detached Options", "Fireplace", "Barbecue Area"],
      pricing: [
        { type: "3+1 Villa", size: "150m²", price: "€390,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4479/general/apartment-318735.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4479/general/apartment-318743.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4479/general/apartment-318742.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4479/general/apartment-318741.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4479/general/apartment-318740.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4479/general/apartment-318739.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "50 km",
      distanceToBeach: "9 km",
      facilities: ["Garden", "Open Car Park", "Cable TV - Satellite", "Sea view", "Nature view", "Barbeque", "Dressing Room", "Luxury", "From Developer", "For Residence Permit", "Under Construction"]
    },
    "4508": {
      id: "4508",
      title: "Ultra luxury apartments in a project with a hotel in Cyprus, Iskele",
      location: "Cyprus, Iskele",
      price: "€181,000",
      bedrooms: "1+ <> 3+1",
      bathrooms: "1 <> 2",
      area: "44 <> 250m²",
      propertyType: "Apartments",
      refNo: "8027",
      buildingComplete: "06/01/2026",
      description: "Flats for sale are located in Iskele region, Cyprus. This region, located in nature with a unique panoramic sea view, attracts attention with its proximity to daily needs. This region, which contains all daily needs such as markets, schools, cafes, restaurants, bars, banks, health institutions, is located in the north of Famagusta. Luxury hotels and housing projects built in the region make the region suitable for investment. The project, which has luxury flats for sale, consists of studio, one-bedroom, two-bedroom and three-bedroom flats. The project, which consists of 682 units and 6 blocks, also includes a 5-star hotel and casino. At the same time, there are supermarkets, a children's club, more than 10 swimming pools with an area of 4000 m², sports fields, open-air cinema, aquapark, gym, beauty center, spa, rooftop infinity pool, shuttle service, bicycle paths, children's playgrounds, pedestrian roads and 24-hour site management service.",
      features: ["Sea view", "For Residence Permit", "Under Construction", "5-Star Hotel", "Casino", "Aquapark", "Rooftop Infinity Pool"],
      pricing: [
        { type: "1+ Flat", size: "44m²", price: "€181,000" },
        { type: "1+1 Flat", size: "73m²", price: "€190,500" },
        { type: "3+1 Flat", size: "250m²", price: "€723,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4508/general/apartment-319262.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4508/general/apartment-319277.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4508/general/apartment-319278.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4508/general/apartment-319279.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4508/general/apartment-319280.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4508/general/apartment-319281.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "45 km",
      distanceToBeach: "0.25 km",
      facilities: ["Fire Alarm", "Wi-Fi in Facilities", "Security", "Garden", "Sauna", "Cinema", "Open Car Park", "Pool", "Cable TV - Satellite", "Sea view", "Caretaker", "Concierge Service", "Pergolas", "Beach transfer services", "Spa", "Fitness", "Luxury", "From Developer"]
    },
    "4515": {
      id: "4515",
      title: "Apartments in luxury complex in Cyprus, Gaziveren",
      location: "Cyprus, Gaziveren",
      price: "€97,000",
      bedrooms: "1+ <> 1+1",
      bathrooms: "1 <> 1",
      area: "55 <> 75m²",
      propertyType: "Apartments",
      refNo: "8033",
      buildingComplete: "09/01/2026",
      description: "Flats for sale are located in Gaziveren, Cyprus. Gaziveren is a region that draws attention with its proximity to the sea, consists of hotels and luxury complexes in nature, and is preferred by construction companies to meet the growth needs of Cyprus. Project prices in the region are affordable compared to the rest of Cyprus. This region, which will develop over time, is frequently preferred as an investment. The complex, consisting of a total of 268 flats, has a rooftop pool with panoramic Mediterranean views, a restaurant, terraces, a jacuzzi on private terraces, outdoor swimming pools, indoor heated swimming pools, a water park, gym, sauna, Turkish bath, children's playground, multi-purpose sports field, indoor vehicle parking, beach transfer service and laundry.",
      features: ["Sea view", "For Residence Permit", "Under Construction", "Rooftop Pool", "Water Park", "Beach Transfer Service"],
      pricing: [
        { type: "1+ Flat", size: "55m²", price: "€97,000" },
        { type: "1+1 Flat", size: "75m²", price: "€128,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4515/general/apartment-319412.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4515/general/apartment-319417.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4515/general/apartment-319416.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4515/general/apartment-319415.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4515/general/apartment-319414.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4515/general/apartment-319413.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "65 km",
      distanceToBeach: "0.5 km",
      facilities: ["Fire Alarm", "Garden", "Gym", "Sauna", "Open Car Park", "Pool", "Sea view", "Turkish bath", "Indoor swimming pool", "Caretaker", "Water Slide", "Garage", "Beach transfer services", "Fitness", "From Developer", "For Residence Permit", "Under Construction"]
    },
    "4483": {
      id: "4483",
      title: "Stylish apartments within walking distance to the sea in Cyprus, Gaziveren",
      location: "Cyprus, Gaziveren",
      price: "€93,000",
      bedrooms: "1+ <> 1+1",
      bathrooms: "1 <> 1",
      area: "37 <> 75m²",
      propertyType: "Apartments",
      refNo: "8006",
      buildingComplete: "09/01/2027",
      description: "Flats for sale are located in Gaziveren, Cyprus. Gaziveren is a developing region right by the sea, hosting luxury projects, hotels, and health centers, making it suitable for investment. This region offers residents a peaceful life away from city noise and congestion, and is close to all daily needs. The project, which includes luxury flats for sale, is built on a land of 8,700 m². There are 1+1 and 1+0 studio flat types in the 2-block project. The complex offers a wide range of luxurious facilities, including parking space for each flat, common garden, outdoor swimming pool, indoor heated swimming pool, aquapark, sea view terraces and swimming pools on the terraces, spa, massage room, sauna, gym, yoga area, children's playground, mini golf course, restaurants and beach bars, water sports clubs, beach facilities, surfing clubs.",
      features: ["Sea view", "For Residence Permit", "Under Construction", "Aquapark", "Yoga Area", "Mini Golf Course", "Surfing Clubs"],
      pricing: [
        { type: "1+ Flat", size: "37m²", price: "€93,000" },
        { type: "1+1 Flat", size: "75m²", price: "€115,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4483/general/apartment-318829.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4483/general/apartment-318820.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4483/general/apartment-318821.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4483/interior/apartment-318822.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4483/interior/apartment-318823.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4483/interior/apartment-318824.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "65 km",
      distanceToBeach: "0.5 km",
      facilities: ["Garden", "Pool", "Cable TV - Satellite", "Sauna", "From Developer", "New Building"]
    },
    "4484": {
      id: "4484",
      title: "Apartments in a luxury seafront project with a private beach in Gaziveren, Cyprus",
      location: "Cyprus, Gaziveren",
      price: "€142,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 1",
      area: "70 <> 229m²",
      propertyType: "Apartments",
      refNo: "8007",
      buildingComplete: "09/01/2026",
      description: "The complex with luxury apartments is located in Gaziveren in the east of Cyprus. Gaziveren; It is a region that has made a name for itself with its breathtaking sea and nature, and has begun to gain value with the developing health tourism in the region. The region contains luxury villa sites. The region, which offers its residents the opportunity of a quiet life away from the city noise, is suitable for investment as it is under development. There are 1 and 2 bedroom apartments in the complex with luxury apartments for sale. The project, which is currently on sale at launch prices, includes a marina, harbour, beach, sunset bar, aquapark for adults and children, family pool, jacuzzi pool, surf school, children's playground, amphitheater, summer cinema, football field, basketball court, volleyball court, tennis court, outdoor car parking, bicycle parking, scooter and bicycle path, high-speed internet, electric charging units, generator, supermarket, restaurant, cafe, site attendant, indoor car parking, gym, spa, massage room, cinema, vitamin bar, nursery, outlet shops, car rental service, car washing service, apartment rental service, management office.",
      features: ["Sea view", "For Residence Permit", "Under Construction", "Marina", "Private Beach", "Amphitheater", "Summer Cinema"],
      pricing: [
        { type: "1+1 Flat", size: "70m²", price: "€142,000" },
        { type: "2+1 Flat", size: "229m²", price: "€420,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4484/general/apartment-318830.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4484/plan/apartment-318841.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4484/general/apartment-318831.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4484/general/apartment-318832.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4484/general/apartment-318833.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4484/general/apartment-318834.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "65 km",
      distanceToBeach: "0.1 km",
      facilities: ["Fire Alarm", "Security Alarm System", "Wi-Fi in Facilities", "Security", "Camera System", "Backup Generator", "Garden", "Basketball Court", "Volleyball Court", "Tennis Court", "Sauna", "Cinema", "Open Car Park", "Pool", "Elevator", "Sea view", "Turkish bath", "Indoor swimming pool", "Restaurant", "Beach", "Baby Pool", "Caretaker", "Barbeque", "Water Slide", "Jacuzzi", "Disabled-Friendly", "Garage", "Concierge Service", "Massage room", "Pool bar", "Spa", "Fitness", "Luxury", "From Developer", "For Residence Permit", "Under Construction"]
    },
    "4488": {
      id: "4488",
      title: "Luxury villas with private gardens by the sea in Cyprus, Kyrenia",
      location: "Cyprus, Kyrenia",
      price: "€649,000",
      bedrooms: "3+1",
      bathrooms: "3",
      area: "225m²",
      propertyType: "Villas",
      refNo: "8010",
      buildingComplete: "N/A",
      description: "Luxury villas with private gardens by the sea in Cyprus, Kyrenia. These exclusive villas offer the ultimate in luxury living with stunning sea views and private outdoor spaces. Located in one of Cyprus's most prestigious areas, these properties provide an exceptional investment opportunity in the beautiful Kyrenia region.",
      features: ["Sea view", "For Residence Permit", "Under Construction", "Private Gardens", "Luxury Design", "Exclusive Location"],
      pricing: [
        { type: "3+1 Villa", size: "225m²", price: "€649,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4488/general/apartment-318910.webp"
      ],
      agent: "Contact for Details",
      contactPhone: "N/A",
      contactEmail: "N/A",
      distanceToAirport: "N/A",
      distanceToBeach: "N/A",
      facilities: ["Garden", "Pool", "Sea view", "Nature view", "Luxury", "From Developer"]
    },
    // Dubai Properties
    "4566": {
      id: "4566",
      title: "Elegant apartments in great location in Dubai, Jumeirah Village Circle",
      location: "Dubai, Jumeirah Village Circle",
      price: "€485,000",
      bedrooms: "2+1",
      bathrooms: "2",
      area: "119m²",
      propertyType: "Apartments",
      refNo: "10008",
      buildingComplete: "09/01/2025",
      description: "Apartments for sale are located in Jumeirah Village Circle, Dubai. JVC area is one of the fastest growing areas of Dubai that has attracted the most investors in recent years. The unique urban layout of the area and its proximity to all the main centers of Dubai, shopping malls, tourist attractions etc. make this area attractive. JVC currently offers high rental income potential to prospective buyers in investment. The complex where luxury apartments for sale are located includes Studio, 1+1 and 2+1 type apartments. This excellent 17-storey residence has facilities such as meeting hall, 4-storey car park, adult swimming pool, children's swimming pool, fitness center, children's playground, market, smart home systems. Located in a great location of the city, JVC area has all the needs such as markets, banks, schools, shopping malls, public transportation. This area is 9 km away from the beach and 40 km away from Dubai International Airport.",
      features: ["Under Construction", "Swimming Pool", "Fitness Center", "Smart Home Systems", "Car Park"],
      pricing: [
        { type: "2+1 Flat", size: "119m²", price: "€485,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4566/general/apartment-320274.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4566/general/apartment-320287.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4566/general/apartment-320292.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4566/general/apartment-320293.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4566/general/apartment-320294.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4566/general/apartment-320295.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "40 km",
      distanceToBeach: "9 km",
      facilities: ["Pool", "Smart-Home System", "Under Construction", "Hot Offer", "From Developer"]
    },
    "4596": {
      id: "4596",
      title: "Luxury apartments for sale in one of the largest complexes in the region at Dubai, Meydan",
      location: "Dubai, Meydan",
      price: "€311,000",
      bedrooms: "1+ <> 4+1",
      bathrooms: "1 <> 4",
      area: "27 <> 198m²",
      propertyType: "Apartments",
      refNo: "10028",
      buildingComplete: "12/01/2024",
      description: "Apartments for sale are located in the Meydan district of Dubai. The area attracts attention as one of the developing and shining life centers of the city. The area includes the city's largest stadium, international schools, cafes, restaurants, hotels, all daily needs and facilities for entertaining social life. At the same time, the area, which attracts attention with its easy transportation facilities, is easily accessible to the city's main centers such as Jumeirah Beach, Dubai Opera, Dubai Mall, Burj Khalifa. The life center where the luxury apartments are located is surrounded by 130,000 m² of artificial lagoons. These lagoons are formed by crystal clear desalinated waters. There are many facilities such as retail stores on the ground floor, 24/7 security, internet in common areas, spa center, infinity pools, fully equipped gyms, outdoor sports and children's playgrounds, outdoor walking paths, recreation areas, barbecue areas, private beaches, boulevards adorned with palm trees in the complex.",
      features: ["Ready to Move", "Under Construction", "Artificial Lagoons", "Infinity Pools", "Private Beaches", "Spa Center"],
      pricing: [
        { type: "1+ Flat", size: "27m²", price: "€311,000" },
        { type: "1+1 Flat", size: "54m²", price: "€565,000" },
        { type: "2+1 Flat", size: "110m²", price: "€900,000" },
        { type: "3+1 Flat", size: "174m²", price: "€1,665,000" },
        { type: "4+1 Flat", size: "198m²", price: "€4,710,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4596/general/apartment-320850.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4596/interior/apartment-320874.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4596/interior/apartment-320873.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4596/interior/apartment-320872.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4596/interior/apartment-320868.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4596/interior/apartment-320867.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "17 km",
      distanceToBeach: "9 km",
      facilities: ["Fire Alarm", "Security Alarm System", "Wi-Fi in Facilities", "Security", "Camera System", "Backup Generator", "Garden", "Tennis Court", "Gym", "Sauna", "Cinema", "Pool", "Cable TV - Satellite", "Elevator", "Nature view", "City view", "Private garage", "Restaurant", "Beach", "Baby Pool", "Caretaker", "Barbeque", "Garage", "Concierge Service", "Steam Room", "Smart-Home System", "Pergolas", "Fitness", "Ready to Move", "Hot Offer", "Luxury", "From Developer", "New Building", "Under Construction"]
    },
    "4599": {
      id: "4599",
      title: "Spacious apartments in a great location for investment in Dubai, Studio City",
      location: "Dubai, Studio City",
      price: "€310,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "81m²",
      propertyType: "Apartments",
      refNo: "10031",
      buildingComplete: "03/01/2025",
      description: "Apartments for sale are located in Studio City, Dubai. Studio City: It is located right next to Sheikh Zayed Road, which provides easy access to the main centers of the city. Thanks to Sheikh Zayed Road, Burj Khalifa, Studio City, which attracts attention with its proximity to the completed infrastructure development of the city, is one of the most preferred areas for investment. The complex where luxury apartments are located has facilities such as children's playgrounds, running areas, sports facilities, fitness areas, adult swimming pool, children's swimming pool, yoga area, landscaped garden, recreation areas, security system. Thanks to the urban layout plan with a city-within-the-city design, it is possible to meet your daily needs easily in every area of ​​Dubai. At the same time, every part of the city can be reached with the public transportation network.",
      features: ["Under Construction", "Swimming Pool", "Yoga Area", "Fitness Areas", "Security System"],
      pricing: [
        { type: "1+1 Flat", size: "81m²", price: "€310,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4599/general/apartment-320912.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4599/interior/apartment-320917.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4599/interior/apartment-320918.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4599/interior/apartment-320920.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4599/general/apartment-320915.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4599/general/apartment-320914.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "35 km",
      distanceToBeach: "14 km",
      facilities: ["Fire Alarm", "Security Alarm System", "Security", "Camera System", "Garden", "Gym", "Pool", "Elevator", "City view", "Baby Pool", "Caretaker", "City Center", "Barbeque", "Fitness", "Hot Offer", "Luxury", "From Developer", "New Building", "Under Construction"]
    },
    "4607": {
      id: "4607",
      title: "Modern designed apartments with private pools in Dubai, Land Residence Complex",
      location: "Dubai, Land Residence Complex",
      price: "€410,000",
      bedrooms: "1+1 <> 4+1",
      bathrooms: "2 <> 3",
      area: "88 <> 171m²",
      propertyType: "Apartments",
      refNo: "10033",
      buildingComplete: "06/01/2027",
      description: "The apartments for sale are located in the Land Residence Complex area of Dubai, also known as DLRC. This area offers a unique investment opportunity due to its easily accessible location. According to Dubai's urban planning, areas like DLRC are expected to complete their development by 2030, transforming into unique living centers. This ongoing development makes DLRC an increasingly valuable and favored investment area. The complex itself is notable for its leaf-inspired design, drawing inspiration from Tuscany's famous hot springs. It features 294 exclusive residences, including villas with private pools. Residents can enjoy a wide array of facilities such as an infinity pool, jacuzzis, sun loungers, relaxation areas, shower areas, an open-air cinema, a barbecue area, a yoga area, a sauna, a steam room, dance and boxing academies, concierge service, 24-hour security, private car park, a welcoming lobby and reception, and dedicated work areas.",
      features: ["Under Construction", "Private Pool", "Infinity Pool", "Open-air Cinema", "Dance and Boxing Academies"],
      pricing: [
        { type: "1+1 Flat", size: "88m²", price: "€410,000" },
        { type: "2+1 Flat", size: "112m²", price: "€475,000" },
        { type: "3+1 Flat", size: "132m²", price: "€535,000" },
        { type: "4+1 Flat", size: "171m²", price: "€622,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4607/general/apartment-321008.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4607/general/apartment-321011.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4607/general/apartment-321006.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4607/general/apartment-321007.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4607/general/apartment-321010.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4607/general/apartment-321012.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "25 km",
      distanceToBeach: "20 km",
      facilities: ["Fire Alarm", "Security Alarm System", "Security", "Camera System", "Garden", "Gym", "Sauna", "Cinema", "Pool", "Barbeque", "Garage", "Steam Room", "Smart-Home System", "Fitness", "Hot Offer", "Luxury", "From Developer", "New Building", "Under Construction"]
    },
    "4563": {
      id: "4563",
      title: "Luxury apartments in the region's most magnificent complex in Dubai, Jumeirah Village Circle",
      location: "Dubai, Jumeirah Village Circle",
      price: "€313,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 2",
      area: "70 <> 112m²",
      propertyType: "Apartments",
      refNo: "10005",
      buildingComplete: "12/01/2026",
      description: "The apartments for sale are located in the Jumeirah Village Circle area of Dubai. This rapidly growing and developing area provides easy access to touristic spots and all needs thanks to its strategic location. Designed for families and investors, this area offers many opportunities such as luxury residences, parks, sports facilities, and retail stores. The most striking feature of the area is its unique urban planning in the form of a circle, from which it takes its name. The complex where the apartments for sale are located consists of 36 floors and a total of 340 apartments. Offering a luxurious and comfortable life to its residents, the complex offers many opportunities such as a swimming pool, children's swimming pool, gym, yoga room, club room, children's playground, game room, sauna, steam room, cinema, barbecue, seating areas, walking paths.",
      features: ["Under Construction", "Swimming Pool", "Gym", "Yoga Room", "Cinema", "Steam Room"],
      pricing: [
        { type: "1+1 Flat", size: "70m²", price: "€313,000" },
        { type: "2+1 Flat", size: "112m²", price: "€420,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4563/general/apartment-320190.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4563/general/apartment-320213.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4563/general/apartment-320214.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4563/general/apartment-320215.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4563/general/apartment-320216.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4563/general/apartment-320217.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "31 km",
      distanceToBeach: "6.5 km",
      facilities: ["Garden", "Pool", "Gym", "Sauna", "Cinema", "Open Car Park", "Elevator", "Baby Pool", "Barbeque", "Garage", "Steam Room", "Pergolas", "Fitness", "Hot Offer", "Luxury", "From Developer", "Under Construction"]
    },
    "4636": {
      id: "4636",
      title: "Luxury apartments with walking distance to the beach in Dubai, Marina",
      location: "Dubai, Marina",
      price: "€1,110,000",
      bedrooms: "1+1 <> 6+1",
      bathrooms: "2 <> 7",
      area: "78 <> 1,505m²",
      propertyType: "Apartments",
      refNo: "10048",
      buildingComplete: "08/01/2027",
      description: "Apartments for sale are located in Dubai Marina. Dubai Marina is at the heart of the city's glitz and luxury living. Adjacent to the Marina and the Harbour, the area is known for its chic restaurants, entertainment centers, shopping areas, international cruise ship ports and famous beaches. It is also close to two major airports and at the intersection of public transportation lines. In short, this area offers a location within easy reach of a luxury lifestyle. The project with apartments for sale includes 3 towers with 40, 50 and 60 floors. The towers offer panoramic views of Palm Island, Ain Dubai, the Marina and the city. The last 10 floors of tower C have a special arrangement called Sky Edition and are reserved for homeowners who prefer a private living space.",
      features: ["Sea view", "Under Construction", "Sky Edition", "Panoramic Views", "Valet Service", "Concierge Service"],
      pricing: [
        { type: "1+1 Flat", size: "78m²", price: "€1,110,000" },
        { type: "2+1 Flat", size: "159m²", price: "€1,535,000" },
        { type: "3+1 Flat", size: "221m²", price: "€4,250,000" },
        { type: "4+1 Flat", size: "375m²", price: "€5,365,000" },
        { type: "5+1 Flat", size: "726m²", price: "€12,350,000" },
        { type: "6+1 Flat", size: "1,505m²", price: "€25,410,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4636/general/apartment-321429.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4636/general/apartment-321433.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4636/general/apartment-321431.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4636/general/apartment-321432.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4636/general/apartment-321430.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4636/interior/apartment-321435.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "30 km",
      distanceToBeach: "0.5 km",
      facilities: ["Fire Alarm", "Security Alarm System", "Security", "Camera System", "Backup Generator", "Garden", "Basketball Court", "Tennis Court", "Sauna", "Cinema", "Open Car Park", "Pool", "Elevator", "Sea view", "Nature view", "City view", "Close to Bus Stop", "Restaurant", "Pool Table", "Baby Pool", "Barbeque", "Dressing Room", "Pool bar", "Spa", "Fitness", "Hot Offer", "Luxury", "From Developer", "New Building", "Under Construction"]
    },
    "4628": {
      id: "4628",
      title: "Luxury apartments with modern design in a great location in Dubai, Marina",
      location: "Dubai, Marina",
      price: "€815,000",
      bedrooms: "2+1",
      bathrooms: "2",
      area: "139m²",
      propertyType: "Apartments",
      refNo: "10043",
      buildingComplete: "03/01/2026",
      description: "The apartments for sale are located in Dubai Marina. Dubai Marina has gained significant value in the real estate sector in recent years. It offers an attractive option for investors with its modern architecture, luxurious living spaces and sea view apartments. The area is enriched with transportation facilities, restaurants, shopping malls and social amenities, attracting the attention of tourists and foreign investors. In addition, due to the high-demand location of Dubai Marina, it stands out as a very lucrative investment area in terms of value increase and rental income. The complex has social areas and services such as a swimming pool, fitness center, children's playground, 24/7 security service, outdoor seating areas, and a basketball court.",
      features: ["Sea view", "Under Construction", "Modern Architecture", "Swimming Pool", "Basketball Court"],
      pricing: [
        { type: "2+1 Flat", size: "139m²", price: "€815,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4628/general/apartment-321323.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4628/interior/apartment-321326.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4628/interior/apartment-321329.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4628/interior/apartment-321331.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4628/interior/apartment-321330.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4628/interior/apartment-321332.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "32 km",
      distanceToBeach: "0.2 km",
      facilities: ["Security Alarm System", "Security", "Camera System", "Garden", "Open Car Park", "Pool", "Elevator", "Sea view", "Baby Pool", "City Center", "Garage", "Fitness", "Hot Offer", "Luxury", "From Developer", "Under Construction"]
    },
    "4620": {
      id: "4620",
      title: "Stylishly designed luxury apartments for sale in Dubai, Al Warsan",
      location: "Dubai, Al Warsan",
      price: "€178,000",
      bedrooms: "1+ <> 2+1",
      bathrooms: "1 <> 2",
      area: "35 <> 77m²",
      propertyType: "Apartments",
      refNo: "10037",
      buildingComplete: "11/01/2027",
      description: "Apartments for sale are located in Al Warsan, Dubai. The Al Warsan area of Dubai has become an attractive real estate area for investors, especially in recent years. The area attracts attention with its easy access to the central and touristic areas of Dubai, modern living facilities and various housing projects. There are spacious apartments, luxury residences and commercial areas in Al Warsan, which make the area attractive for both those who want to live and invest. In addition, Dubai's fast-growing infrastructure and developing trade network make Al Warsan a profitable option for real estate investors in the long term. The complex where the apartments for sale are located has areas such as an infinity pool, a jogging area, an open-air cinema, a children's playground, an indoor sports hall, a pergola, and a private pool for the apartments.",
      features: ["Under Construction", "Infinity Pool", "Open-air Cinema", "Indoor Sports Hall", "Private Pool"],
      pricing: [
        { type: "1+ Flat", size: "35m²", price: "€178,000" },
        { type: "1+1 Flat", size: "53m²", price: "€251,000" },
        { type: "2+1 Flat", size: "77m²", price: "€353,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4620/general/apartment-321192.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4620/general/apartment-321202.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4620/interior/apartment-321208.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4620/interior/apartment-321203.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4620/interior/apartment-321205.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4620/interior/apartment-321204.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "20 km",
      distanceToBeach: "15 km",
      facilities: ["Security Alarm System", "Camera System", "Garden", "Gym", "Cinema", "Open Car Park", "Pool", "Indoor swimming pool", "Baby Pool", "Private Pool", "Garage", "Pool bar", "Fitness", "Hot Offer", "Luxury", "From Developer", "Under Construction"]
    },
    "4634": {
      id: "4634",
      title: "Luxury apartments with modern design in Dubai, Motor City",
      location: "Dubai, Motor City",
      price: "€250,000",
      bedrooms: "1+1 <> 3+1",
      bathrooms: "1 <> 3",
      area: "50 <> 180m²",
      propertyType: "Apartments",
      refNo: "10047",
      buildingComplete: "12/01/2027",
      description: "Apartments for sale are located in Dubai, Motor City. Dubai Motor City is a vibrant community known for its motorsports, modern properties and excellent infrastructure. With great road links and popular amenities such as the Dubai Autodrome, it is an attractive area for residents and tourists alike. It offers residents a high standard of living with modern infrastructure, spacious living areas, sports and entertainment facilities. In the complex, you will have access to world-class amenities such as a gym, barbecue and picnic areas, a lively square, a children's pool, a jogging track, an open-air cinema, and dedicated children's playgrounds. There is also a pilates studio, lap pool, zen garden and parkour areas, offering residents a dynamic, social and versatile lifestyle.",
      features: ["Under Construction", "Dubai Autodrome", "Pilates Studio", "Zen Garden", "Parkour Areas"],
      pricing: [
        { type: "1+1 Flat", size: "50m²", price: "€250,000" },
        { type: "2+1 Flat", size: "100m²", price: "€515,000" },
        { type: "3+1 Flat", size: "180m²", price: "€953,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4634/general/apartment-321416.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4634/interior/apartment-321419.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4634/interior/apartment-321420.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4634/interior/apartment-321425.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4634/interior/apartment-321423.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4634/interior/apartment-321424.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "35 km",
      distanceToBeach: "15 km",
      facilities: ["Security Alarm System", "Security", "Camera System", "Backup Generator", "Garden", "Tennis Court", "Sauna", "Cinema", "Open Car Park", "Pool", "Elevator", "Nature view", "Restaurant", "Baby Pool", "Barbeque", "Spa", "Fitness", "Hot Offer", "Luxury", "From Developer", "New Building", "Under Construction"]
    },
    "4632": {
      id: "4632",
      title: "Luxury apartments with modern design in Dubai, Meydan",
      location: "Dubai, Meydan",
      price: "€402,000",
      bedrooms: "1+1 <> 4+1",
      bathrooms: "1 <> 4",
      area: "66 <> 210m²",
      propertyType: "Apartments",
      refNo: "10045",
      buildingComplete: "12/01/2026",
      description: "Apartments for sale are located in Meydan, Dubai. Dubai's Meydan district is an an attractive area for real estate investors with its developing infrastructure and strategic location. Offering modern living spaces, luxury residential projects and commercial opportunities, the area is a valuable market for both local and international investors. In particular, Meydan's proximity to the center of Dubai and major transportation networks are among the factors that continuously increase the real estate value of the area. Located on Ras Al Khor road, one of the city's main roads, the project is also adjacent to Ras Al Khor Wildlife Park and Dubai's new landmark Dubai Creek Tower. The complex includes a golf course, barbecue area, gym, swimming pool, 4 themed courtyards, sky terrace, spa, sauna, fitness center, yoga and meditation area.",
      features: ["Under Construction", "Golf Course", "Sky Terrace", "4 Themed Courtyards", "Yoga and Meditation Area"],
      pricing: [
        { type: "1+1 Flat", size: "66m²", price: "€402,000" },
        { type: "3+1 Flat", size: "207m²", price: "€999,000" },
        { type: "4+1 Flat", size: "210m²", price: "€1,145,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4632/general/apartment-321388.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4632/interior/apartment-321394.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4632/interior/apartment-321395.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4632/interior/apartment-321397.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4632/interior/apartment-321393.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4632/interior/apartment-321392.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "12 km",
      distanceToBeach: "15 km",
      facilities: ["Security Alarm System", "Camera System", "Golf", "Sauna", "Cinema", "Open Car Park", "Pool", "Elevator", "Nature view", "City view", "Baby Pool", "Barbeque", "Spa", "Fitness", "Hot Offer", "Luxury", "From Developer", "Under Construction"]
    },
    "4569": {
      id: "4569",
      title: "Spacious apartments in modern living complex in Dubai, Jumeirah Village Triangle",
      location: "Dubai, Jumeirah Village Triangle",
      price: "€303,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "67m²",
      propertyType: "Apartments",
      refNo: "10011",
      buildingComplete: "09/01/2026",
      description: "Apartments for sale are located in Dubai, Jumeirah Village Triangle. Jumeirah Village Triangle is an area that offers its residents a quiet social life, attracts attention with its security and green areas. This area is famous as one of the most family-friendly areas of Dubai. In this area where modern life and green areas are intertwined, there are facilities that will meet all your daily needs. Jumeirah Village Triangle is among the first choices of those looking for a family-friendly, comfortable and quiet life in green areas. The complex where the apartments for sale are located has a total of 196 apartments. In this complex, there are facilities such as a lobby with 24/7 concierge service, adult swimming pool, children's swimming pool, children's playroom, outdoor children's playground, gym, outdoor yoga hall, sauna, game room, club house, prayer rooms, outdoor barbecue area, outdoor lounge area, outdoor restaurant.",
      features: ["Under Construction", "Family-friendly", "24/7 Concierge", "Outdoor Yoga Hall", "Prayer Rooms"],
      pricing: [
        { type: "1+1 Flat", size: "67m²", price: "€303,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4569/general/apartment-320355.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4569/general/apartment-320367.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4569/general/apartment-320368.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4569/general/apartment-320369.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4569/general/apartment-320370.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4569/general/apartment-320371.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "42 km",
      distanceToBeach: "8 km",
      facilities: ["Garden", "Pool", "Smart-Home System", "Hot Offer", "From Developer", "Under Construction"]
    },
    "4571": {
      id: "4571",
      title: "Modern designed apartments in luxury living complex in Dubai, Jumeirah Village Triangle",
      location: "Dubai, Jumeirah Village Triangle",
      price: "€195,000",
      bedrooms: "1+ <> 3+1",
      bathrooms: "1 <> 3",
      area: "34 <> 185m²",
      propertyType: "Apartments",
      refNo: "10013",
      buildingComplete: "09/01/2027",
      description: "Apartments for sale are located in Dubai, Jumeirah Village Triangle. Jumeirah Village Triangle is an area that offers its residents a quiet social life, attracts attention with its security and green areas. This area is famous as one of the most family-friendly areas of Dubai. In this area, where modern life and green areas are intertwined, there are facilities to meet all your daily needs. Jumeirah Village Triangle is among the first choices of those looking for a family-friendly, comfortable and quiet life in green areas. There are a total of 184 apartments of different types in the complex where the apartments for sale are located. In this complex, there are facilities such as a lobby with 24/7 concierge service, adult swimming pool, children's swimming pool, children's playroom, outdoor children's playground, gym, outdoor yoga hall, sauna, game room, club house, prayer rooms, outdoor barbecue area, outdoor lounge area, outdoor restaurant.",
      features: ["Under Construction", "Family-friendly", "Green Areas", "Conference Room", "Prayer Rooms"],
      pricing: [
        { type: "1+ Flat", size: "34m²", price: "€195,000" },
        { type: "1+1 Flat", size: "64m²", price: "€290,000" },
        { type: "2+1 Flat", size: "100m²", price: "€389,000" },
        { type: "3+1 Flat", size: "185m²", price: "€740,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4571/general/apartment-320405.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4571/general/apartment-320397.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4571/general/apartment-320396.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4571/general/apartment-320395.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4571/general/apartment-320393.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4571/general/apartment-320392.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "42 km",
      distanceToBeach: "8 km",
      facilities: ["Fire Alarm", "Security Alarm System", "Camera System", "Air Conditioning", "Garden", "Gym", "Sauna", "Cinema", "Pool", "Cable TV - Satellite", "Elevator", "Mosque", "Restaurant", "Baby Pool", "Barbeque", "En-Suite Bathroom", "Garage", "Concierge Service", "Smart-Home System", "Pergolas", "Conference room", "Fitness", "Hot Offer", "Luxury", "From Developer", "Under Construction"]
    },
    "4597": {
      id: "4597",
      title: "Ready to move-in apartments in excellent location in Dubai, Al Jaddaf",
      location: "Dubai, Al Jaddaf",
      price: "€265,000",
      bedrooms: "1+ <> 2+1",
      bathrooms: "1 <> 2",
      area: "34 <> 99m²",
      propertyType: "Apartments",
      refNo: "10029",
      buildingComplete: "01/01/2021",
      description: "Apartments for sale are located in Al Jaddaf, Dubai. Al Jaddaf is home to Dubai Healthcare City (DHCC). The DHCC area was established in 2002 to bring together the best medical and healthcare facilities in the region and around the world. Today, DHCC has more than 100 medical facilities with over 4,000 licensed professionals serving its people. The complexes located in the DHCC area stand out with their unique views of Dubai Creek and excellent location close to the city center. The construction of the complex where the apartments for sale are located was completed in 2021. The complex, consisting of 18 floors, has a total of 587 apartments, including 116 Sudio, 436 1+1 and 35 2+1. The complex has facilities such as retail stores, cafes, restaurants, swimming pool, car park, fitness center, children's playground.",
      features: ["For Residence Permit", "Ready to Move", "Dubai Healthcare City", "Dubai Creek Views", "Retail Stores"],
      pricing: [
        { type: "1+ Flat", size: "34m²", price: "€265,000" },
        { type: "1+1 Flat", size: "57m²", price: "€425,000" },
        { type: "2+1 Flat", size: "99m²", price: "€711,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4597/general/apartment-320877.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4597/general/apartment-320884.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4597/general/apartment-320885.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4597/interior/apartment-320888.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4597/interior/apartment-320889.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4597/general/apartment-320878.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "11 km",
      distanceToBeach: "8 km",
      facilities: ["Fire Alarm", "Security Alarm System", "Security", "Garden", "Gym", "Pool", "Elevator", "City view", "Restaurant", "Baby Pool", "City Center", "Garage", "Fitness", "Ready to Move", "Hot Offer", "From Developer", "For Residence Permit", "New Building"]
    },
    "4598": {
      id: "4598",
      title: "Modern designed apartments suitable for investment in Dubai, Studio City",
      location: "Dubai, Studio City",
      price: "€255,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 2",
      area: "63 <> 97m²",
      propertyType: "Apartments",
      refNo: "10030",
      buildingComplete: "09/01/2026",
      description: "Apartments for sale are located in Studio City, Dubai. Studio City stands out with its location built right next to Sheikh Zayed Road, which connects every important point in the city center, such as Burj Khalifa, museums, restaurants, hotels, cafes. Daily needs such as schools, shopping malls and medical facilities are also easily accessible in the area. Public transportation centers in the area make the area attractive for families and residents. The complex is a luxury housing project with studios and one and two-bedroom apartments. In the complex built with modern architecture, amenities such as a pool, fitness center and landscaped gardens are reserved only for residents. Offering its residents a combination of stylish design, seaside lifestyle, modern life and functionality, the complex offers its buyers a peaceful life opportunity that allows residents to just relax.",
      features: ["Under Construction", "Sheikh Zayed Road", "Modern Architecture", "Landscaped Gardens", "Investment Suitable"],
      pricing: [
        { type: "1+1 Flat", size: "63m²", price: "€255,000" },
        { type: "2+1 Flat", size: "97m²", price: "€380,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4598/general/apartment-320890.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4598/general/apartment-320891.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4598/general/apartment-320892.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4598/general/apartment-320893.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4598/general/apartment-320894.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4598/general/apartment-320895.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "38 km",
      distanceToBeach: "14 km",
      facilities: ["Fire Alarm", "Security Alarm System", "Security", "Garden", "Gym", "Pool", "Cable TV - Satellite", "Elevator", "Baby Pool", "Caretaker", "City Center", "Barbeque", "Smart-Home System", "Fitness", "Hot Offer", "Luxury", "From Developer", "Under Construction"]
    },
    "4658": {
      id: "4658",
      title: "Luxury apartments with stylish design in Dubai, Dubailand",
      location: "Dubai, Dubailand",
      price: "€134,000",
      bedrooms: "1+ - 2+1",
      bathrooms: "1-2",
      area: "33-108",
      status: "Under Construction",
      type: "Flat",
      completionDate: "06/01/2028",
      propertyRef: "10052",
      description: "Apartments for sale are located in the City Of Arabia area at the entrance of Dubailand, Dubai. Located at the entrance of Dubai's rapidly developing Dubailand area, City Of Arabia offers unique opportunities to investors with its strategic location and visionary projects. Thanks to its direct connection to Sheikh Mohammed Bin Zayed Road, it provides easy access to both the city center and important transportation points. Equipped with modern housing projects suitable for family life, themed shopping centers and entertainment areas, this region is a candidate to be the center of attraction not only for today but also for the future. With its developing infrastructure and high rental income potential, City Of Arabia is an ideal choice for those who want to make a solid and profitable investment in Dubai.",
      features: ["Swimming pool", "Fitness center", "Jogging and cycling paths", "Children's playground", "Movie theater", "Barbecue area", "Tennis court", "Shopping centers", "24/7 security"],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4658/general/apartment-321732.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321735.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321739.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321749.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321741.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321747.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321746.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321745.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321748.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4658/general/apartment-321750.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "27 km",
      distanceToBeach: "29 km",
      facilities: ["Security Alarm System", "Security", "Camera System", "Backup Generator", "Garden", "Volleyball Court", "Cinema", "Open Car Park", "Pool", "Elevator", "Baby Pool", "Barbeque", "Fitness", "Hot Offer", "Luxury", "From Developer", "New Building", "Under Construction"]
    },
    "4633": {
      id: "4633",
      title: "Luxury apartments with stylish design in Dubai, Motor City",
      location: "Dubai, Motor City",
      price: "€242,000",
      bedrooms: "1+1 - 2+1",
      bathrooms: "1",
      area: "50-90",
      status: "Under Construction",
      type: "Flat",
      completionDate: "12/01/2027",
      propertyRef: "10046",
      description: "Apartments for sale are located in Motor City, Dubai. Dubai Motor City has developed rapidly in recent years and has become an attractive area for investors. It offers its residents a high standard of living with modern infrastructure, spacious living areas, sports and entertainment facilities. An ideal location especially for families and car enthusiasts, Motor City is gaining more value with its proximity to Dubai's central locations and the strengthening of transportation networks. In terms of investment, given the steady rise in real estate prices in the area and future development projects, Motor City stands out as a lucrative home purchase choice.",
      features: ["Fitness center", "Outdoor sports areas", "Jogging tracks", "Restaurants", "Super markets", "Retail shops", "Swimming pool", "Children's playground", "Basketball court", "Tennis court", "Cycling track", "Social areas"],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4633/general/apartment-321400.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4633/interior/apartment-321408.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4633/interior/apartment-321409.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4633/interior/apartment-321407.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4633/interior/apartment-321406.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4633/plan/apartment-321412.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4633/plan/apartment-321413.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4633/general/apartment-321405.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4633/general/apartment-321403.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4633/general/apartment-321404.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "35 km",
      distanceToBeach: "15 km",
      facilities: ["Security Alarm System", "Camera System", "Backup Generator", "Garden", "Basketball Court", "Tennis Court", "Open Car Park", "Pool", "Elevator", "Close to Bus Stop", "Restaurant", "Baby Pool", "Barbeque", "Spa", "Fitness", "Hot Offer", "Luxury", "From Developer", "New Building", "Under Construction"]
    },
    "4570": {
      id: "4570",
      title: "Elegant apartments in a modern living complex in Dubai, Jumeirah Village Triangle",
      location: "Dubai, Jumeirah Village Triangle",
      price: "€296,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "89",
      status: "Under Construction",
      type: "Flat",
      completionDate: "12/01/2026",
      propertyRef: "10012",
      description: "Apartments for sale are located in Dubai, Jumeirah Village Triangle. Jumeirah Village Triangle is an area that offers its residents a quiet social life, attracts attention with its security and green areas. This area is famous as one of the most family-friendly areas of Dubai. In this area where modern life and green areas are intertwined, there are facilities that will meet all your daily needs. Jumeirah Village Triangle is among the first choices of those looking for a family-friendly, comfortable and quiet life in green areas.",
      features: ["Lobby with 24/7 concierge service", "Adult swimming pool", "Children's swimming pool", "Children's playroom", "Outdoor children's playground", "Gym", "Outdoor yoga hall", "Sauna", "Game room", "Club house", "Prayer rooms", "Outdoor barbecue area", "Outdoor lounge area", "Outdoor restaurant"],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4570/general/apartment-320387.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4570/general/apartment-320380.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4570/general/apartment-320382.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4570/general/apartment-320383.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4570/general/apartment-320384.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4570/general/apartment-320386.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4570/plan/apartment-320381.png",
        "https://cdn.futurehomesturkey.com/uploads/pages/4570/plan/apartment-320379.png",
        "https://cdn.futurehomesturkey.com/uploads/pages/4570/plan/apartment-320378.png",
        "https://cdn.futurehomesturkey.com/uploads/pages/4570/general/apartment-320385.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "42 km",
      distanceToBeach: "8 km",
      facilities: ["Fire Alarm", "Security", "Camera System", "Furniture", "White Goods", "Air Conditioning", "Garden", "Gym", "Sauna", "Cinema", "Pool", "Cable TV - Satellite", "Elevator", "Mosque", "Restaurant", "Baby Pool", "Barbeque", "Garage", "Pergolas", "Conference room", "Fitness", "Hot Offer", "Luxury", "From Developer", "Under Construction"]
    },
    "4657": {
      id: "4657",
      title: "Luxury apartments with private pool in Dubai, Jumeirah Lake Towers",
      location: "Dubai, Jumeirah Lake Towers",
      price: "€271,000",
      bedrooms: "1+ - 4+1",
      bathrooms: "1-4",
      area: "38-183",
      status: "Under Construction",
      type: "Flat",
      completionDate: "11/01/2027",
      propertyRef: "10051",
      description: "Apartments for sale are located in Jumeirah Lake Towers, Dubai. Jumeirah Lake Towers (JLT) is one of Dubai's fastest-growing and most attractive areas for investment. With its modern skyscrapers, walkways overlooking the lake and a variety of cafes and restaurants, it offers an ideal environment for both living and doing business. Thanks to its proximity to the metro, central location and affordable housing options, JLT attracts great interest among investors and tenants. With these features, JLT has a strong potential for both rental income and long-term value growth.",
      features: ["Infinity pool", "Rooftop pool bar", "Aqua gym", "Therapy rooms", "Spa", "Yoga area", "Zumba area", "Sky observation deck", "Cricket pitch", "Trampoline", "Climbing wall", "Skate park", "Water park", "Children's playgrounds", "Nursery", "Library", "Worship areas", "Beauty salon", "Party hall", "Outdoor cinema"],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4657/general/apartment-321707.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4657/general/apartment-321717.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4657/general/apartment-321718.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4657/general/apartment-321719.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4657/general/apartment-321720.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4657/general/apartment-321722.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4657/general/apartment-321725.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4657/plan/apartment-321724.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4657/plan/apartment-321721.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4657/plan/apartment-321726.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "30 km",
      distanceToBeach: "5 km",
      facilities: ["Camera System", "Backup Generator", "Garden", "Football Field", "Basketball Court", "Volleyball Court", "Tennis Court", "Sauna", "Cinema", "Open Car Park", "Pool", "Cable TV - Satellite", "Elevator", "Nature view", "City view", "Mosque", "Indoor swimming pool", "Baby Pool", "Barbeque", "Private Pool", "Disabled-Friendly", "Pool bar", "Spa", "Fitness", "Hot Offer", "Luxury", "From Developer", "New Building", "Under Construction"]
    },
    "4602": {
      id: "4602",
      title: "Modern designed apartments suitable for investment in Dubai, Investment Park",
      location: "Dubai, Investment Park",
      price: "€235,000",
      bedrooms: "1+1 - 2+1",
      bathrooms: "2-3",
      area: "73-95",
      status: "Under Construction",
      type: "Flat",
      completionDate: "06/01/2028",
      propertyRef: "10032",
      description: "Apartments for sale are located in Dubai, Investment Park 2. Investment Park 2 is one of the prominent areas of Dubai for investment. The area offers an ideal balance between business and entertainment by seamlessly blending business centers and corporate offices with a social lifestyle-oriented infrastructure. Thanks to the concept of the area being built with a city within a city, all daily needs can be easily reached.",
      features: ["Swimming pools", "Opera", "Cinema", "Markets", "Restaurants", "Fitness", "Walking paths", "Running tracks", "Green areas", "Children's playgrounds", "Sports fields", "24/7 security service"],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4602/general/apartment-320947.png",
        "https://cdn.futurehomesturkey.com/uploads/pages/4602/general/apartment-320954.png",
        "https://cdn.futurehomesturkey.com/uploads/pages/4602/interior/apartment-320955.png",
        "https://cdn.futurehomesturkey.com/uploads/pages/4602/interior/apartment-320956.png",
        "https://cdn.futurehomesturkey.com/uploads/pages/4602/interior/apartment-320957.png",
        "https://cdn.futurehomesturkey.com/uploads/pages/4602/interior/apartment-320958.png",
        "https://cdn.futurehomesturkey.com/uploads/pages/4602/plan/apartment-320959.png",
        "https://cdn.futurehomesturkey.com/uploads/pages/4602/plan/apartment-320960.png",
        "https://cdn.futurehomesturkey.com/uploads/pages/4602/plan/apartment-320961.png",
        "https://cdn.futurehomesturkey.com/uploads/pages/4602/general/apartment-320945.png"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "15 km",
      distanceToBeach: "20 km",
      facilities: ["Garden", "Pool", "Cable TV - Satellite", "City view", "City Center", "Smart-Home System", "Hot Offer", "From Developer", "New Building"]
    },
    "4629": {
      id: "4629",
      title: "Modern apartments with sea and city views in Dubai, Islands",
      location: "Dubai, Islands",
      price: "€1,675,000",
      bedrooms: "3+1",
      bathrooms: "3",
      area: "375",
      status: "Under Construction",
      type: "Dublex",
      completionDate: "09/01/2026",
      propertyRef: "10044",
      description: "Apartments for sale are located in Dubai Islands. The Dubai Islands area offers an attractive option for real estate investors with its luxury lifestyle and unique location. The Palm Jumeirah, Bluewaters Island, and other developments are world-renowned projects with strong potential for both rental income and value growth. The region's high-quality residences, prestigious commercial areas and tourist attractions create sustainable and lucrative opportunities for investors. In Dubai's dynamic real estate market, the Islands area has always stood out as an area of high demand and appreciation.",
      features: ["Infinity pool", "Outdoor yoga area", "Fitness center", "Pool bar", "Co-working space", "Children's playground"],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4629/general/apartment-321336.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4629/interior/apartment-321344.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4629/interior/apartment-321341.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4629/interior/apartment-321340.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4629/interior/apartment-321348.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4629/interior/apartment-321347.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4629/interior/apartment-321342.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4629/interior/apartment-321350.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4629/interior/apartment-321351.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4629/plan/apartment-321352.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "9 km",
      distanceToBeach: "2 km",
      facilities: ["Garden", "Pool", "Sea view", "City view", "Baby Pool", "Garage", "Pool bar", "Fitness", "Hot Offer", "Luxury", "From Developer", "Under Construction", "Security Alarm System"]
    },
    "4627": {
      id: "4627",
      title: "Ultra luxury apartments with modern design in Dubai, Downtown",
      location: "Dubai, Downtown",
      price: "€605,000",
      bedrooms: "1+1 - 3+1",
      bathrooms: "1-3",
      area: "73-414",
      status: "Under Construction",
      type: "Flat",
      completionDate: "09/01/2026",
      propertyRef: "10042",
      description: "Apartments for sale are located in Downtown Dubai. Dubai's Downtown area has a very attractive real estate market for investors. The area is home to major landmarks such as the iconic Burj Khalifa and Dubai Mall, as well as modern living spaces and luxury residences. With its location close to the city center, high rental income and ever-increasing demand, Downtown stands out as a safe option for both local and foreign investors. With its high living standards and prestigious address, this is an important location that can provide long-term gains in terms of real estate investment.",
      features: ["Children's playground", "Sauna", "Fitness center", "Parking lot", "Cinema room", "Pool", "Children's pool", "Bicycle paths", "Spa"],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4627/general/apartment-321298.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4627/interior/apartment-321312.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4627/interior/apartment-321314.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4627/interior/apartment-321310.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4627/interior/apartment-321311.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4627/interior/apartment-321315.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4627/interior/apartment-321309.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4627/interior/apartment-321313.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4627/interior/apartment-321316.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4627/interior/apartment-321318.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "13 km",
      distanceToBeach: "8 km",
      facilities: ["Security Alarm System", "Wi-Fi in Facilities", "Camera System", "Backup Generator", "Garden", "Sauna", "Cinema", "Open Car Park", "Pool", "Elevator", "City view", "Pool Table", "Baby Pool", "Barbeque", "Jacuzzi", "Conference room", "Spa", "Fitness", "Hot Offer", "Luxury", "From Developer", "Under Construction"]
    },
    "4656": {
      id: "4656",
      title: "Luxury apartments with modern design in Dubai, Al Furjan",
      location: "Dubai, Al Furjan",
      price: "€439,000",
      bedrooms: "2+1 - 3+1",
      bathrooms: "2-3",
      area: "102-129",
      status: "Under Construction",
      type: "Flat",
      completionDate: "05/01/2028",
      propertyRef: "10050",
      description: "Apartments for sale are located in Al Furjan, Dubai. Al Furjan offers an attractive choice for real estate investment as one of the rapidly developing regions of Dubai. Drawing attention with its modern residential projects, strategic location, and developing infrastructure, Al Furjan offers investors long-term earning opportunities in terms of both residence and rental potential. Its proximity to the Dubai Metro line and ease of access to shopping malls, schools and health institutions are among the important factors that increase the value of the region.",
      features: ["Infinity pool", "Fitness center", "Spa", "Camellia", "Basketball court", "Tennis court", "Yoga area", "Children's playgrounds", "Outdoor cinema", "Barbecue area", "Study rooms", "Prayer hall"],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4656/general/apartment-321678.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4656/interior/apartment-321692.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4656/interior/apartment-321693.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4656/interior/apartment-321704.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4656/interior/apartment-321694.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4656/interior/apartment-321695.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4656/interior/apartment-321696.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4656/interior/apartment-321697.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4656/interior/apartment-321698.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4656/interior/apartment-321699.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "36 km",
      distanceToBeach: "6 km",
      facilities: ["Fire Alarm", "Security", "Camera System", "Backup Generator", "Garden", "Basketball Court", "Volleyball Court", "Tennis Court", "Cinema", "Open Car Park", "Pool", "Elevator", "Nature view", "Mosque", "Baby Pool", "Barbeque", "Disabled-Friendly", "Pool bar", "Conference room", "Spa", "Fitness", "Hot Offer", "Luxury", "From Developer", "New Building", "Under Construction"]
    },
    "4587": {
      id: "4587",
      title: "Modern designed spacious apartments in Dubai, Jumeirah Village Circle",
      location: "Dubai, Jumeirah Village Circle",
      price: "€207,000",
      bedrooms: "1+ - 2+1",
      bathrooms: "1-3",
      area: "39-114",
      status: "Under Construction",
      type: "Flat",
      completionDate: "06/01/2027",
      propertyRef: "10021",
      description: "Apartments for sale are located in Dubai, Jumeirah Village Circle. JVC is a region that attracts attention with its modern urban layout in a great location within the city. The region, designed with the concept of a city within the city, has a developed infrastructure. Thanks to its location, it is close to all the touristic points of the city. JVC offers its buyers an entertaining social life with its facilities such as cafes, restaurants, and hotels, as well as all daily needs.",
      features: ["Lobby", "Adult swimming pool", "Infinity pool", "Sun loungers", "Children's swimming pool", "Club house", "Children's playground", "Children's playroom", "Fitness center", "Outdoor sports area", "Yoga and meditation area", "Walking paths", "Sauna", "Steam room", "Barbecue area", "Rest areas", "Table tennis", "Cinema", "Indoor car park", "Bicycle parking area"],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4587/general/apartment-320631.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4587/general/apartment-320644.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4587/general/apartment-320653.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4587/general/apartment-320654.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4587/general/apartment-320652.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4587/general/apartment-320651.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4587/general/apartment-320655.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4587/plan/apartment-320645.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4587/plan/apartment-320649.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4587/plan/apartment-320648.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "30 km",
      distanceToBeach: "9 km",
      facilities: ["Fire Alarm", "Garden", "Gym", "Sauna", "Cinema", "Pool", "Elevator", "Pool Table", "Baby Pool", "Barbeque", "Garage", "Concierge Service", "Steam Room", "Smart-Home System", "Pergolas", "Table tennis", "Fitness", "Hot Offer", "Luxury", "From Developer", "New Building", "Under Construction"]
    },
    "4560": {
      id: "4560",
      title: "Stylish apartments with long term payment plan in Dubai, Al Furjan",
      location: "Dubai, Al Furjan",
      price: "€376,000",
      bedrooms: "1+1 - 3+1",
      bathrooms: "1-3",
      area: "82-169",
      status: "Under Construction",
      type: "Flat",
      completionDate: "03/01/2027",
      propertyRef: "10002",
      description: "Apartments for sale are located in Al Furjan, Dubai, UAE. Al Furjan is a rapidly developing, family-centered and well-planned area with modern villas, lush greenery, breathtaking skyline views of Discovery Gardens and Jumeirah Lakes Towers, adjacent to Jebel Ali village. Strategically located, Al Furjan offers seamless connectivity to Dubai's most important landmarks such as Expo 2020 and Dubai Marina. The area's proximity to key transport links such as metro stations and easy access to major highways makes getting around stress-free and efficient.",
      features: ["Lobby", "Lagoon-style pool", "Sun loungers", "Children's swimming pool", "Outdoor children's playground", "Children's playroom", "Sauna", "Club room", "Gyms", "Games room", "Cinema", "Barbecue and recreation areas", "4-storey car park"],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4560/general/apartment-320117.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4560/general/apartment-320128.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4560/general/apartment-320130.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4560/general/apartment-320135.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4560/general/apartment-320137.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4560/general/apartment-320138.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4560/general/apartment-320139.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4560/plan/apartment-320131.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4560/plan/apartment-320129.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4560/plan/apartment-320132.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "42 km",
      distanceToBeach: "5 km",
      facilities: ["Air Conditioning", "Gym", "Sauna", "Open Car Park", "Pool", "Elevator", "Baby Pool", "Barbeque", "Garage", "Smart-Home System", "Fitness", "Hot Offer", "Luxury", "From Developer", "Furnished", "Under Construction"]
    },
    "4619": {
      id: "4619",
      title: "Ultra-luxury apartments for sale in unique location in Dubai, Downtown",
      location: "Dubai, Downtown",
      price: "€600,000",
      bedrooms: "1+1 - 4+1",
      bathrooms: "1-4",
      area: "70-187",
      status: "Under Construction",
      type: "Flat",
      completionDate: "06/01/2029",
      propertyRef: "10036",
      description: "The apartments for sale are located in the Downtown area of Dubai. Offering both luxurious living spaces and commercial opportunities, Downtown is one of the most prestigious locations in Dubai. Hosting world-class icons such as the Burj Khalifa, Dubai Mall and Dubai Opera, Downtown has a high-demand real estate market. In addition to the strong rental income for investors, its central location provides easy access and developing infrastructure. These features make Downtown an attractive option for both residential and commercial purposes.",
      features: ["Flow pool", "Water sports gymnastics area", "Arcade area", "Badminton playground", "Basketball court", "Barbecue area", "Cafe", "Changing rooms", "Cigar lounge", "Indoor sports hall", "Indoor party hall", "Infinity pool", "Jacuzzi", "Running track", "Children's pool", "Library", "Open-air cinema", "Rain shower", "Sky garden", "Sky golf course", "Spa", "Table tennis", "Tennis court"],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4619/general/apartment-321175.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4619/interior/apartment-321186.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4619/interior/apartment-321181.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4619/interior/apartment-321183.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4619/interior/apartment-321184.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4619/interior/apartment-321187.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4619/plan/apartment-321189.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4619/plan/apartment-321188.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4619/plan/apartment-321190.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4619/plan/apartment-321191.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "15 km",
      distanceToBeach: "3 km",
      facilities: ["Fire Alarm", "Security Alarm System", "Security", "Camera System", "Tennis Court", "Golf", "Gym", "Sauna", "Cinema", "Open Car Park", "Pool", "Elevator", "Nature view", "City view", "Indoor swimming pool", "Close to Bus Stop", "City Center", "Barbeque", "Private Pool", "Jacuzzi", "Garage", "Steam Room", "Massage room", "Conference room", "Table tennis", "Spa", "Fitness", "Hot Offer", "Luxury", "From Developer"]
    },
    "4561": {
      id: "4561",
      title: "Luxury apartments near the beach in Dubai, Al Satwa",
      location: "Dubai, Al Satwa",
      price: "€523,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "76",
      status: "Under Construction",
      type: "Flat",
      completionDate: "06/01/2026",
      propertyRef: "10003",
      description: "The apartments for sale are located in the Jumariah Garden City area of Al Satwa, Dubai, the largest city in the United Arab Emirates. This area in the heart of the city attracts attention with its location thanks to its ease of transportation and surrounding facilities. Jumariah Garden City promises its residents a dynamic lifestyle that is easily accessible with its surrounding luxury restaurants, cultural experiences and social activity areas.",
      features: ["Green areas", "Lobby", "Club room", "Children's playroom", "Barbecue area", "Outdoor seating area", "Outdoor children's playground", "Swimming pool", "Sun loungers", "Children's swimming pool", "Outdoor sports area", "Sauna", "Shower and changing rooms", "Fitness", "Smart home system"],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4561/general/apartment-320147.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4561/general/apartment-320155.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4561/general/apartment-320157.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4561/general/apartment-320158.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4561/general/apartment-320159.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4561/general/apartment-320156.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4561/general/apartment-320160.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4561/general/apartment-320161.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4561/plan/apartment-320144.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4561/plan/apartment-320143.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "13 km",
      distanceToBeach: "2 km",
      facilities: ["Air Conditioning", "Gym", "Sauna", "Open Car Park", "Pool", "Elevator", "Baby Pool", "Barbeque", "Garage", "Smart-Home System", "Pergolas", "Fitness", "Hot Offer", "Luxury", "From Developer", "Under Construction"]
    },
    "4572": {
      id: "4572",
      title: "Luxury apartments with long term payment plans in Dubai, Jumeirah Village Triangle",
      location: "Dubai, Jumeirah Village Triangle",
      price: "€194,000",
      bedrooms: "1+ - 1+1",
      bathrooms: "1",
      area: "42-83",
      status: "Under Construction",
      type: "Flat",
      completionDate: "12/01/2027",
      propertyRef: "10014",
      description: "The apartments for sale are located in Dubai, Jumeirah Village Triangle. Designed with a city-within-a-city concept, this area offers its residents sufficient infrastructure to meet all your daily needs and a social environment equipped with peaceful green areas. This constantly developing area is quite suitable for investment. Also, this area, which is quite suitable for families, has the advantage of high rental income throughout the year.",
      features: ["Lobby", "Adult swimming pool", "Children's pool", "Sun loungers", "Children's playground", "Outdoor children's playground", "Gym", "Outdoor crossfit area", "Yoga and meditation area", "Padel court", "Sauna", "Steam room", "Cinema", "Table tennis", "Clubhouse", "Barbecue area", "Outdoor seating areas"],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4572/general/apartment-320409.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4572/general/apartment-320421.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4572/general/apartment-320422.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4572/general/apartment-320423.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4572/general/apartment-320424.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4572/plan/apartment-320415.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4572/plan/apartment-320416.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4572/plan/apartment-320417.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4572/plan/apartment-320418.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4572/plan/apartment-320419.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "37 km",
      distanceToBeach: "8 km",
      facilities: ["Security Alarm System", "Camera System", "Air Conditioning", "Garden", "Gym", "Sauna", "Cinema", "Pool", "Cable TV - Satellite", "Elevator", "Pool Table", "Baby Pool", "Barbeque", "Garage", "Concierge Service", "Steam Room", "Smart-Home System", "Pergolas", "Conference room", "Table tennis", "Fitness", "Hot Offer", "Luxury", "From Developer", "Under Construction"]
    },
    "4595": {
      id: "4595",
      title: "Apartments at launch prices suitable for investment in Dubai, Dubai South",
      location: "Dubai, Dubai South",
      price: "€175,000",
      bedrooms: "1+ - 3+1",
      bathrooms: "1-2",
      area: "35-134",
      status: "Under Construction",
      type: "Flat",
      completionDate: "12/01/2026",
      propertyRef: "10027",
      description: "Apartments for sale are located in Dubai South. Dubai South is a developing area located next to Al Maktoum International Airport to support economic, commercial and logistic activities. Thanks to the urban layout plan implemented in Dubai, the area is becoming suitable for investment. The complexes being built in the area offer their buyers investment opportunities as well as a wonderful life.",
      features: ["Fitness", "Gym", "Lobby", "Concierge service", "Children's playground", "Cinema", "Jacuzzi and spa area", "Gardens", "Walking paths", "Club house"],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4595/general/apartment-320825.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4595/general/apartment-320847.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4595/general/apartment-320848.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4595/general/apartment-320849.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4595/interior/apartment-320827.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4595/interior/apartment-320830.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4595/interior/apartment-320831.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4595/interior/apartment-320832.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4595/plan/apartment-320839.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4595/plan/apartment-320840.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "10 km",
      distanceToBeach: "35 km",
      facilities: ["Fire Alarm", "Security Alarm System", "Security", "Garden", "Gym", "Sauna", "Cinema", "Pool", "Cable TV - Satellite", "Elevator", "Baby Pool", "Jacuzzi", "Garage", "Steam Room", "Smart-Home System", "Pergolas", "Fitness", "Hot Offer", "Luxury", "From Developer", "Under Construction"]
    },
    "4678": {
      id: "4678",
      title: "Luxury apartments with modern designs in Dubai, Sports City",
      location: "Dubai, Sports City",
      price: "€265,000",
      bedrooms: "1+1 - 3+1",
      bathrooms: "1-3",
      area: "45-123",
      status: "Under Construction",
      type: "Flat",
      completionDate: "12/01/2028",
      propertyRef: "10053",
      description: "Apartments for sale are located in Dubai Sports City. Dubai Sports City is an ideal area for real estate investment with its modern infrastructure, sports-oriented lifestyle, and developing residential projects. It has the potential to offer both long-term value appreciation and high rental income. The ease of transportation and variety of living options make the area even more attractive to investors.",
      features: ["Running Track", "Cricket Field", "Multi-Purpose Training Area", "Badminton Court", "Padel Court", "Family Lounge Area", "Barbecue Area", "Water Aerobics", "Swimming Pool", "Jacuzzi", "Children's Pool", "Children's Bike Path", "Children's Play Area", "Trampoline", "Children's Climbing Wall", "Zumba/Yoga Studio", "Children's Nursery", "Steam Room", "Sauna"],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4678/general/apartment-321994.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4678/interior/apartment-322001.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4678/interior/apartment-322000.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4678/interior/apartment-321999.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4678/interior/apartment-321998.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4678/interior/apartment-321997.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4678/interior/apartment-321996.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4678/interior/apartment-322009.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4678/plan/apartment-322010.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4678/plan/apartment-322011.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "25 km",
      distanceToBeach: "10 km",
      facilities: ["Fire Alarm", "Security Alarm System", "Security", "Camera System", "Backup Generator", "Garden", "Football Field", "Volleyball Court", "Tennis Court", "Golf", "Cinema", "Open Car Park", "Pool", "Cable TV - Satellite", "Elevator", "Nature view", "Barbeque", "Disabled-Friendly", "Garage", "Steam Room", "Pool bar", "Table tennis", "Spa", "Fitness", "Hot Offer", "Luxury", "From Developer", "New Building", "Under Construction"]
    },
    "4625": {
      id: "4625",
      title: "Luxury apartments with modern design in Dubai, Dubai Hills",
      location: "Dubai, Dubai Hills",
      price: "€515,000",
      bedrooms: "1+1 - 3+1",
      bathrooms: "1-3",
      area: "75-225",
      status: "Under Construction",
      type: "Flat",
      completionDate: "04/01/2027",
      propertyRef: "10041",
      description: "Apartments for sale are located in Dubai Hills, Dubai. Dubai Hills is one of the most prestigious and rapidly developing areas of Dubai, with great potential for real estate investments. It attracts attention with its location close to the city center, modern infrastructure and green areas. Luxury residences, spacious villas and high quality apartments make Dubai Hills attractive for both local and foreign investors.",
      features: ["Indoor gym", "Swimming pool", "Children's swimming pool", "Jogging track", "Jacuzzi", "Electric car charging station", "Meditation room", "Listening room", "Conference room", "Barbecue area", "Children's playground"],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4625/general/apartment-321277.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4625/general/apartment-321276.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4625/general/apartment-321275.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4625/general/apartment-321274.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4625/general/apartment-321273.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4625/general/apartment-321272.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4625/general/apartment-321278.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4625/general/apartment-321279.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4625/interior/apartment-321281.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4625/interior/apartment-321283.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "25 km",
      distanceToBeach: "8 km",
      facilities: ["Garden", "Pool", "City Center", "Under Construction", "Hot Offer", "From Developer", "New Building"]
    },
    "4622": {
      id: "4622",
      title: "City View Apartments with Pool in Dubai, Al Safa One",
      location: "Dubai, Al Safa One",
      price: "€521,000",
      bedrooms: "1+1 - 2+1",
      bathrooms: "2-3",
      area: "71-106",
      status: "Under Construction",
      type: "Flat",
      completionDate: "12/01/2029",
      propertyRef: "10038",
      description: "Apartments for sale are located in Dubai Al Safa One. Al Safa One is one of the prestigious residential areas of Dubai. It attracts attention with its luxurious living spaces, large green areas and proximity to important centers. Centrally located on Sheikh Zayed Road, it offers easy access to popular destinations such as Downtown Dubai, Business Bay and Jumeirah.",
      features: ["Swimming pool", "Gym", "Outdoor car park", "Indoor car park", "Football field", "Children's playground", "Sauna", "Game room"],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4622/general/apartment-321235.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4622/general/apartment-321234.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4622/general/apartment-321233.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4622/plan/apartment-321237.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4622/general/apartment-321236.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "18 km",
      distanceToBeach: "2 km",
      facilities: ["Fire Alarm", "Security", "Camera System", "Backup Generator", "Garden", "Football Field", "Gym", "Sauna", "Open Car Park", "Pool", "Elevator", "City view", "Close to Bus Stop", "Baby Pool", "City Center", "Disabled-Friendly", "Garage", "Fitness", "Hot Offer", "Luxury", "From Developer", "Under Construction"]
    },
    "4565": {
      id: "4565",
      title: "Spacious apartments in a quiet social area in Dubai, Jumeirah Village Circle",
      location: "Dubai, Jumeirah Village Circle",
      price: "€336,000",
      bedrooms: "1+1 - 2+1",
      bathrooms: "1-2",
      area: "83-98",
      status: "Under Construction",
      type: "Flat",
      completionDate: "06/01/2026",
      propertyRef: "10007",
      description: "Apartments for sale are located in Dubai, Jumeirah Village Circle. This area is located in the heart of Dubai. It attracts attention with its easy access to important areas of the city such as tourist areas, restaurants, and main centers. The area has an urban design within the city. All daily needs such as supermarkets, parks, restaurants, fitness centers, and swimming pools are within walking distance of all houses in this area.",
      features: ["Swimming pools for children and adults", "Showers", "Sun loungers", "Changing rooms", "Outdoor squash court", "Yoga area", "Dining area", "Barbecue area", "Outdoor rooms", "24/7 concierge service", "Lobby", "Sauna", "Aroma room", "Clubhouse with cinema", "Climbing wall", "Children's playgrounds", "Gym", "Car park"],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4565/general/apartment-320243.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4565/general/apartment-320260.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4565/general/apartment-320261.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4565/general/apartment-320262.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4565/general/apartment-320263.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4565/general/apartment-320264.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4565/general/apartment-320265.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4565/general/apartment-320266.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4565/general/apartment-320267.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4565/general/apartment-320268.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "34 km",
      distanceToBeach: "9 km",
      facilities: ["Air Conditioning", "Gym", "Sauna", "Cinema", "Open Car Park", "Pool", "Elevator", "Baby Pool", "Barbeque", "Garage", "Concierge Service", "Steam Room", "Smart-Home System", "Pergolas", "Conference room", "Fitness", "Hot Offer", "Luxury", "From Developer", "Under Construction"]
    },
    "4568": {
      id: "4568",
      title: "Partially furnished apartments in luxury complex in Dubai, Jumeirah Village Triangle",
      location: "Dubai, Jumeirah Village Triangle",
      price: "€306,000",
      bedrooms: "1+1 - 2+1",
      bathrooms: "1-2",
      area: "85-118",
      status: "Under Construction",
      type: "Flat",
      completionDate: "09/01/2026",
      propertyRef: "10010",
      description: "Apartments for sale are located in Dubai, Jumeirah Village Triangle. Jumeirah Village Triangle is a region that offers its residents a quiet social life, attracting attention with its green areas and walking paths. Located on the north side of Dubai, this peaceful area is renowned as one of the best family-friendly neighborhoods in Dubai.",
      features: ["Lobby", "Adult swimming pool", "Children's swimming pool", "Sun loungers", "Outdoor children's playground", "Outdoor sports area", "Outdoor yoga area", "Fitness center", "Sauna", "Game room", "Cinema room", "Children's play room", "Clubhouse", "Barbecue area", "4-storey car park", "Air conditioning systems", "Smart home systems", "Partially equipped apartments with first-class furniture"],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4568/general/apartment-320331.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4568/general/apartment-320342.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4568/general/apartment-320332.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4568/general/apartment-320333.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4568/general/apartment-320334.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4568/general/apartment-320335.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4568/general/apartment-320336.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4568/general/apartment-320337.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4568/general/apartment-320338.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4568/general/apartment-320339.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "42 km",
      distanceToBeach: "8 km",
      facilities: ["Furniture", "White Goods", "Air Conditioning", "Garden", "Gym", "Cinema", "Pool", "Elevator", "Baby Pool", "Barbeque", "Garage", "Fitness", "Hot Offer", "Luxury", "From Developer", "Under Construction"]
    },
    "4637": {
      id: "4637",
      title: "Luxury apartments with city views in Dubai, Bukadra",
      location: "Dubai, Bukadra",
      price: "€418,000",
      bedrooms: "1+1 - 3+1",
      bathrooms: "2-4",
      area: "73-147",
      status: "Under Construction",
      type: "Flat",
      completionDate: "12/01/2028",
      propertyRef: "10049",
      description: "Apartments for sale are located in Bukadra, Dubai. Bukadra is an exclusive residential neighborhood offering a luxurious lifestyle with lush greenery and world-class amenities. The expansive area of over eight million square meters includes meticulously designed residences, landscaped parks, retail shops and world-class entertainment facilities.",
      features: ["Infinity pool", "Children's pool", "Jacuzzi", "Modern seating and relaxation areas", "Gym", "Yoga area", "Sauna", "Steam room", "Jogging and walking paths", "Amphitheater", "Movie theater", "Party terrace", "Barbecue area", "Meditation hall", "Garden", "Game room", "Children's playgrounds", "Co-working areas", "Music and art rooms"],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4637/general/apartment-321444.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4637/interior/apartment-321452.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4637/interior/apartment-321455.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4637/interior/apartment-321454.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4637/interior/apartment-321453.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4637/plan/apartment-321459.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4637/plan/apartment-321456.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4637/plan/apartment-321457.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4637/plan/apartment-321458.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4637/general/apartment-321445.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "15 km",
      distanceToBeach: "15 km",
      facilities: ["Security Alarm System", "Security", "Camera System", "Backup Generator", "Garden", "Basketball Court", "Volleyball Court", "Tennis Court", "Sauna", "Cinema", "Open Car Park", "Pool", "Elevator", "Nature view", "City view", "Restaurant", "Pool Table", "Baby Pool", "Barbeque", "Steam Room", "Spa", "Fitness", "Hot Offer", "Luxury", "From Developer", "Under Construction"]
    },
    // Antalya properties
    "3003": {
      id: "3003",
      title: "Luxury real estate in a complex close to airport in Antalya, Altintas",
      location: "Antalya, Aksu",
      price: "€199,000",
      bedrooms: "1+1 <> 3+1",
      bathrooms: "1 <> 2",
      area: "93 <> 156m²",
      propertyType: "Apartments",
      refNo: "1006",
      buildingComplete: "01/01/2023",
      description: "Aksu, Altintas neighborhood, a popular region for new and prestigious projects, offers investment opportunities and has recently attracted buyers. The real estate in this hotel-concept complex provides shuttle services and car rentals to reach the airport, beaches, and shopping malls. Additionally, a bus stop is within walking distance of the complex. The luxurious real estate in this residential complex is 4.5 km from the airport, 5 km from the D-400 highway (connecting all roads in Antalya), 8.5 km from Lara beach, and 10.5 km from the Terra City shopping mall. The environmentally-friendly complex, planned to utilize solar power in communal areas, is built on 10,702 sqm of land. This luxury complex, consisting of 174 apartments, offers excellent features such as an indoor car park, an outdoor parking lot, lifts, an EV charging station, a lobby, reception, infirmary, gym, sauna, steam bath, meeting room, library, walking track, tennis court, basketball court, outdoor and indoor pools, aqua park, kids' playground, mini club, beach club, barbeque area, satellite, bowling, billiard, game consoles, cinema hall, cafe, bar, concierge, and 24/7 security.",
      features: ["Ready to Move", "Under Construction", "Garden", "Pool", "Sauna", "Cinema", "Open Car Park", "Turkish bath", "Indoor swimming pool", "Barbeque", "Fitness", "Security"],
      pricing: [
        { type: "1+1 Flat", size: "93m²", price: "€199,000" },
        { type: "2+1 Flat", size: "110m²", price: "€320,000" },
        { type: "3+1 Flat", size: "156m²", price: "€350,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3003/general/property-antalya-aksu-general-3003-8.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3003/general/property-antalya-aksu-general-3003-2.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3003/general/property-antalya-aksu-general-3003-3.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3003/general/property-antalya-aksu-general-3003-4.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3003/general/property-antalya-aksu-general-3003-5.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3003/general/property-antalya-aksu-general-3003-6.webp"
      ],
      agent: "Ervina Köksel",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "4.5 km",
      distanceToBeach: "8.5 km",
      facilities: ["Garden", "Pool", "Sauna", "Cinema", "Open Car Park", "Turkish bath", "Indoor swimming pool", "Barbeque", "Fitness", "Security"]
    },
    "4648": {
      id: "4648",
      title: "Ready to move-in apartment with a view in Antalya, Kepez",
      location: "Antalya, Kepez",
      price: "€73,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "40m²",
      propertyType: "Apartments",
      refNo: "1391",
      buildingComplete: "12/01/2021",
      description: "The apartment for sale is located in Güneş Neighborhood of Kepez, Antalya. Güneş Neighborhood offers an attractive option for real estate investors as a rapidly developing and appreciating region in recent years. Especially thanks to the ease of transportation, infrastructure investments and new housing projects in the region, Güneş Neighborhood is very advantageous in terms of quality of life and value increase. The complex where the apartment for sale is located has social areas such as an outdoor swimming pool, fitness center, sauna, steam room, children's playground.",
      features: ["Ready to Move", "Security Alarm System", "Camera System", "Garden", "Sauna", "Open Car Park", "Pool", "Elevator", "City view", "Close to Bus Stop", "City Center", "Disabled-Friendly", "Steam Room", "Spa", "Fitness", "Furnished"],
      pricing: [
        { type: "1+1", size: "40m²", price: "€73,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4648/general/apartment-321601.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4648/general/apartment-321596.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4648/general/apartment-321587.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4648/general/apartment-321591.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4648/general/apartment-321592.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4648/general/apartment-321589.webp"
      ],
      agent: "Ervina Köksel",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "9 km",
      distanceToBeach: "8 km",
      facilities: ["Security Alarm System", "Camera System", "Garden", "Sauna", "Open Car Park", "Pool", "Elevator", "City view", "Close to Bus Stop", "City Center", "Disabled-Friendly", "Steam Room", "Spa", "Fitness", "Ready to Move", "Furnished"]
    },
    "4614": {
      id: "4614",
      title: "Luxurious spacious apartments for sale in Antalya, Konyaaltı",
      location: "Antalya, Konyaalti",
      price: "€198,000",
      bedrooms: "2+1 <> 3+1",
      bathrooms: "2 <> 2",
      area: "76 <> 91m²",
      propertyType: "Apartments",
      refNo: "1380",
      buildingComplete: "12/01/2025",
      description: "The apartments for sale are located in the Sarısu region of Konyaaltı, Antalya. Sarısu offers a peaceful life surrounded by nature, while also attracting attention with its proximity to the sea and easy access to the city center. Modern housing projects and luxury villas located along the coast have high return potential for investors. The complex where the apartments for sale are located will be built on an area of ​​5290 m² and consists of 2 blocks in total. There are a total of 106 apartments in the project, 2+1 and 3+1. The complex includes social areas such as an outdoor swimming pool, indoor parking lot, fitness, sitting areas, Turkish bath, sauna and camellia.",
      features: ["Under Construction", "Fire Alarm", "Security", "Camera System", "Garden", "Tennis Court", "Sauna", "Open Car Park", "Pool", "Elevator", "Turkish bath", "Baby Pool", "Caretaker", "Garage", "Massage room", "Spa", "Fitness", "Hot Offer", "Luxury", "From Developer"],
      pricing: [
        { type: "2+1 Flat", size: "76m²", price: "€198,000" },
        { type: "2+1 Dublex", size: "82m²", price: "€207,500" },
        { type: "3+1 Dublex", size: "91m²", price: "€217,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4614/general/apartment-321117.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4614/interior/apartment-321120.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4614/interior/apartment-321121.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4614/interior/apartment-321127.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4614/interior/apartment-321122.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4614/interior/apartment-321125.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "25 km",
      distanceToBeach: "1.5 km",
      facilities: ["Fire Alarm", "Security", "Camera System", "Garden", "Tennis Court", "Sauna", "Open Car Park", "Pool", "Elevator", "Turkish bath", "Baby Pool", "Caretaker", "Garage", "Massage room", "Spa", "Fitness", "Hot Offer", "Luxury", "From Developer", "Under Construction"]
    },
    "3097": {
      id: "3097",
      title: "Apartments in a luxury living center in Antalya, Kepez",
      location: "Antalya, Kepez",
      price: "€167,000",
      bedrooms: "1+1 <> 4+1",
      bathrooms: "1 <> 2",
      area: "63 <> 201m²",
      propertyType: "Apartments",
      refNo: "1168",
      buildingComplete: "12/01/2024",
      description: "Apartments for sale are located in Antalya, Kepez. It is a living center rather than a complex site, which is a state-supported urban transformation project in the Kepez region. This project, which plays a major role in the valuation and development of the region, is a housing project that meets all the demands of the investor such as investment, life, rent and, with its design like a city, meets all the daily needs. The living area, where the apartments for sale are located, is located in a huge living center designed on an area of ​​1.300.000 m² and will accommodate 16.000 residences.",
      features: ["For Residence Permit", "Fire Alarm", "Security", "Camera System", "Backup Generator", "Garden", "Open Car Park", "Pool", "Elevator", "Indoor swimming pool", "Baby Pool", "Turkish Citizenship", "Garage", "Fitness", "From Developer", "New Building"],
      pricing: [
        { type: "1+1 Flat", size: "63m²", price: "€167,000" },
        { type: "2+1 Flat", size: "84m²", price: "€226,000" },
        { type: "3+1 Flat", size: "150m²", price: "€375,000" },
        { type: "4+1 Flat", size: "201m²", price: "€494,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3097/general/property-antalya-kepez-general-3097-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3097/general/property-antalya-kepez-general-3097-17.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3097/general/property-antalya-kepez-general-3097-2.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3097/general/property-antalya-kepez-general-3097-3.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3097/general/property-antalya-kepez-general-3097-4.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3097/general/property-antalya-kepez-general-3097-5.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "20 km",
      distanceToBeach: "8 km",
      facilities: ["Fire Alarm", "Security", "Camera System", "Backup Generator", "Garden", "Open Car Park", "Pool", "Elevator", "Indoor swimming pool", "Baby Pool", "Turkish Citizenship", "Garage", "Fitness", "From Developer", "For Residence Permit", "New Building"]
    },
    "4642": {
      id: "4642",
      title: "Modern apartments for sale in a residential complex in Antalya, Muratpaşa",
      location: "Antalya, Muratpasa",
      price: "€213,000",
      bedrooms: "3+1 <> 4+1",
      bathrooms: "2 <> 3",
      area: "167 <> 170m²",
      propertyType: "Apartments",
      refNo: "1386",
      buildingComplete: "10/01/2025",
      description: "The apartments for sale are located in Sinan Neighborhood of Antalya, Muratpaşa. Muratpaşa, which continues to develop rapidly, is a central district that attracts many local and foreign visitors. The complex where the apartments for sale are located has open and closed car parking, air conditioning infrastructure, central satellite system, combi boiler honeycomb infrastructure, natural gas line, built-in set, anthracite colored windows, automatic blinds, central water treatment and hydrophore system, video intercom and steel door.",
      features: ["Under Construction", "Fire Alarm", "Camera System", "Backup Generator", "Garden", "Open Car Park", "Cable TV - Satellite", "Elevator", "City Center", "Disabled-Friendly", "Garage", "Hot Offer", "Luxury", "From Developer", "Furnished"],
      pricing: [
        { type: "3+1 Dublex", size: "167m²", price: "€213,000" },
        { type: "4+1 Dublex", size: "170m²", price: "€230,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4642/general/apartment-321517.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4642/interior/apartment-321525.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4642/interior/apartment-321528.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4642/interior/apartment-321523.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4642/interior/apartment-321529.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4642/interior/apartment-321530.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "15 km",
      distanceToBeach: "1 km",
      facilities: ["Fire Alarm", "Camera System", "Backup Generator", "Garden", "Open Car Park", "Cable TV - Satellite", "Elevator", "City Center", "Disabled-Friendly", "Garage", "Hot Offer", "Luxury", "From Developer", "Furnished", "Under Construction"]
    },
    "4600": {
      id: "4600",
      title: "Apartments in a site with affordable payment options in Antalya, Altintas",
      location: "Antalya, Altintas",
      price: "€119,900",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 1",
      area: "53 <> 74m²",
      propertyType: "Apartments",
      refNo: "1379",
      buildingComplete: "06/01/2026",
      description: "The apartments for sale are located in Altıntaş, Antalya. Altıntaş has become the most suitable location for investment in Antalya thanks to the new zoning plan. All developers of the city and companies from different regions of Turkey are building projects suitable for investment in the region. The complex where the apartments for sale are located consists of 1+1 and 2+1 apartments. The complex has facilities such as landscaping, garden lighting, 24/7 security, security camera system, water tank and hydrophore, generator, car park, Turkish bath, sauna, steam room, multicort that can be used as a basketball, tennis and volleyball court, table tennis, billiards, outdoor swimming pool, children's swimming pool and fitness.",
      features: ["Under Construction", "Fire Alarm", "Security", "Backup Generator", "Garden", "Basketball Court", "Volleyball Court", "Tennis Court", "Gym", "Sauna", "Pool", "Cable TV - Satellite", "Elevator", "Floor heating", "Turkish bath", "Baby Pool", "Garage", "Steam Room", "Massage room", "Table tennis", "Fitness", "Hot Offer", "From Developer"],
      pricing: [
        { type: "1+1 Flat", size: "53m²", price: "€119,900" },
        { type: "2+1 Flat", size: "74m²", price: "€164,900" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4600/general/apartment-320927.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4600/interior/apartment-320932.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4600/interior/apartment-320933.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4600/interior/apartment-320934.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4600/interior/apartment-320935.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4600/interior/apartment-320937.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "5 km",
      distanceToBeach: "8 km",
      facilities: ["Fire Alarm", "Security", "Backup Generator", "Garden", "Basketball Court", "Volleyball Court", "Tennis Court", "Gym", "Sauna", "Pool", "Cable TV - Satellite", "Elevator", "Floor heating", "Turkish bath", "Baby Pool", "Garage", "Steam Room", "Massage room", "Table tennis", "Fitness", "Hot Offer", "From Developer", "Under Construction"]
    },
    "3062": {
      id: "3062",
      title: "Apartments for sale in a stylish project with pool in Antalya, Altıntas",
      location: "Antalya, Aksu",
      price: "€112,500",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 1",
      area: "55 <> 82m²",
      propertyType: "Apartments",
      refNo: "1121",
      buildingComplete: "04/01/2024",
      description: "Apartments for sale are located in Antalya, Altıntaş region. Altıntaş is the fastest developing region of Antalya with the highest number of housing projects and the most suitable for investment. The project with flats for sale will be built on an area of ​​4500 m² and will consist of 2 blocks and 48 flats. In the project where stylish apartments are located, outdoor parking lot, indoor parking lot, fitness, 24/7 security, site attendant, outdoor swimming pool, children's pool, children's playground, solar energy system, basketball court, camellia and generator, 3 built-in kitchen sets, automatic blinds. facilities are available.",
      features: ["Ready to Move", "Under Construction", "Garden", "Pool", "Hot Offer", "From Developer", "New Building"],
      pricing: [
        { type: "1+1 Flat", size: "55m²", price: "€112,500" },
        { type: "2+1 Flat", size: "82m²", price: "€140,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3062/general/property-antalya-aksu-general-3062-1.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3062/general/property-antalya-aksu-general-3062-3.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3062/general/property-antalya-aksu-general-3062-4.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3062/general/property-antalya-aksu-general-3062-5.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3062/general/property-antalya-aksu-general-3062-6.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3062/general/property-antalya-aksu-general-3062-7.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "4 km",
      distanceToBeach: "9 km",
      facilities: ["Garden", "Pool", "Hot Offer", "From Developer", "New Building"]
    },
    "3216": {
      id: "3216",
      title: "Apartments within walking distance to the sea in Antalya, Finike",
      location: "Antalya, Kemer",
      price: "€135,000",
      bedrooms: "2+1",
      bathrooms: "1",
      area: "68m²",
      propertyType: "Apartments",
      refNo: "1285",
      buildingComplete: "06/01/2024",
      description: "Apartments for sale are located in Antalya, Finike. Finike; It is one of the central districts of Antalya, established right next to the sea, which contains all daily needs such as hospitals, banks, shopping markets, parks, walking paths, pharmacies, and public transportation. Finike region, located in the west of Antalya, is close to all the touristic holiday centers of the region such as Adrasan, Olympos and Çıralı. The project where the apartments for sale are located consists of 2+1 flats with a net area of 57 m². There are flats with terraces in the project, which includes different types of flats. Swimming pool in the project. There are facilities such as children's swimming pool, security camera system, security at the site entrances, car parking, fitness center, sauna, children's playgrounds, multi-purpose (basketball, volleyball) sports field, walking paths and camellias, generator, doorman and site attendant. In the apartments, features such as triple built-in appliances, kitchen cabinets, cloakroom, bathroom fixtures and shower cabin, air conditioning in each room, underfloor heating system and electric blinds will be delivered to the buyers ready for use.",
      features: ["Near the Sea", "Swimming Pool", "Multi-purpose Sports Field", "Fitness Center", "Sauna", "Walking Distance to Sea"],
      pricing: [{ type: "2+1 Flat", size: "68m²", price: "€135,000" }],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3216/general/property-antalya-finike-general-3216-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3216/general/property-antalya-finike-general-3216-4.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3216/general/property-antalya-finike-general-3216-5.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3216/general/property-antalya-finike-general-3216-6.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3216/plan/property-antalya-finike-plan-3216-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3216/general/property-antalya-finike-general-3216-1.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "125 km",
      distanceToBeach: "0.5 km",
      facilities: ["Fire Alarm", "Security", "Camera System", "Backup Generator", "Air Conditioning", "Garden", "Basketball Court", "Volleyball Court", "Sauna", "Open Car Park", "Pool", "Floor heating", "Baby Pool", "Caretaker", "Fitness"]
    },
    "3212": {
      id: "3212",
      title: "Apartments for sale in a luxury project in Antalya, Altintas",
      location: "Antalya, Aksu",
      price: "€200,000",
      bedrooms: "2+1",
      bathrooms: "1",
      area: "91m²",
      propertyType: "Apartments",
      refNo: "1284",
      buildingComplete: "12/01/2023",
      description: "Apartments for sale are located in Antalya, Altıntaş region. Altıntaş region, which meets the growth needs of the city with its new zoning plan, is close to Kundu, Lara district center and Lara beach, was established next to Antalya International Airport, and will have its name written among the elite districts of Antalya in a few years thanks to the close completion dates of its housing projects. is a region. The project where the flats for sale are located consists of 25 2+1 flats and 14 1+1 flats. There are two swimming pools, indoor car parking lot, fitness center, sauna, children's playgrounds, outdoor sports fields, camellias and walking paths, security camera system, security at the entrance and exit of the site, generator and central heating system in the project with a total of 39 apartments. The apartments will be delivered to their prospective buyers with features such as built-in kitchen trio, heat and sound insulation, all bathroom fixtures, shower cabin, ready to use. The apartments are 4 km to Lara beach, 7 km to Lara district center, 6 km to shopping centers such as Mall of Antalya, Agora and Ikea, and only 3 km to Antalya International Airport.",
      features: ["Under Construction", "Two Swimming Pools", "Indoor Parking", "Fitness Center", "Sauna", "Luxury Project"],
      pricing: [{ type: "2+1 Flat", size: "91m²", price: "€200,000" }],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3212/general/property-antalya-aksu-general-3212-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3212/general/property-antalya-aksu-general-3212-6.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3212/general/property-antalya-aksu-general-3212-7.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3212/plan/property-antalya-aksu-plan-3212-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3212/plan/property-antalya-aksu-plan-3212-1.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3212/general/property-antalya-aksu-general-3212-1.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "3 km",
      distanceToBeach: "4 km",
      facilities: ["Fire Alarm", "Security", "Camera System", "Backup Generator", "Garden", "Basketball Court", "Volleyball Court", "Sauna", "Pool", "Garage", "Pergolas", "Beach transfer services", "Fitness", "From Developer", "Under Construction"]
    },
    "3207": {
      id: "3207",
      title: "Stylish apartments in a project with hotel facilities in Antalya, Altintas",
      location: "Antalya, Aksu",
      price: "€200,000",
      bedrooms: "2+1",
      bathrooms: "1",
      area: "80m²",
      propertyType: "Apartments",
      refNo: "1281",
      buildingComplete: "12/01/2023",
      description: "Apartments for sale are located in Antalya, Altıntaş region. Altıntaş district, which has made a name for itself as the new luxury residential district of the city, is the region of greatest interest to investors. The original architecture of the housing constructions in the region and the luxury facilities to serve their buyers will make the region one of the most valuable settlements in Antalya in a few years. Established right next to Antalya Airport, the region is also close to Lara and Kundu districts. The project, where there are apartments for sale, offers a safe and peaceful life opportunity with its modern designed architecture and facilities prepared for the comfort of people. The project consists of 14 1+1 flats, 26 2+1 flats and 2 3+1 flats. The apartments on the top floor have their own private terrace area. In the project, 24/7 security camera system, site security personnel, 2 outdoor swimming pools, fitness, sauna, children's playground and sports fields, multi-purpose (basketball and volleyball) sports field, walking paths, camellias, service to Lara beach at certain times of the day. service, generator and central heating system. In the apartments, features such as kitchen cabinets, triple built-in kitchen set, cloakroom at the entrance of the apartment, heat and sound insulation, bathroom fixtures, shower cabin will be delivered to the buyers ready to use. Stylish apartments are 8 km from Lara beach, 6 km from the city's major shopping centers, 10 km from the city center and 4 km from Antalya International Airport.",
      features: ["Ready to Move", "Under Construction", "Hotel Facilities", "2 Outdoor Swimming Pools", "Private Terrace", "Beach Service"],
      pricing: [{ type: "1+1 Flat", size: "80m²", price: "€200,000" }],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3207/general/property-antalya-aksu-general-3207-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3207/general/property-antalya-aksu-general-3207-1.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3207/general/property-antalya-aksu-general-3207-10.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3207/general/property-antalya-aksu-general-3207-11.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3207/plan/property-antalya-aksu-plan-3207-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3207/general/property-antalya-aksu-general-3207-2.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "4 km",
      distanceToBeach: "8 km",
      facilities: ["Garden", "Pool", "Camera System", "Backup Generator", "Basketball Court", "Volleyball Court", "Sauna", "Open Car Park", "Baby Pool", "Private garage", "Pergolas", "Beach transfer services", "Fitness", "Fire Alarm", "Security"]
    },
    "3208": {
      id: "3208",
      title: "Spacious apartments in a boutique project in Antalya, Altintas",
      location: "Antalya, Aksu",
      price: "€180,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 1",
      area: "56 <> 75m²",
      propertyType: "Apartments",
      refNo: "1282",
      buildingComplete: "12/01/2023",
      description: "The project with apartments for sale is located in Antalya, Altıntaş region. Golden stone; Thanks to the fact that the housing projects it has will be completed in the near future, its infrastructure is developing rapidly, gaining value as it develops, and it is a region that has recently announced its name as the investment center of Antalya, and has attracted the attention of all domestic and foreign investors. The excellent location of the region will make the region one of the most elite districts of Antalya in a few years. There are 18 1+1 flats and 12 2+1 flats in the project where the flats are located. In the project, where stylish apartments are located, there will be facilities such as an outdoor swimming pool, outdoor car parking, indoor car parking, fitness, sauna, security camera system, generators, reception, camellia, children's playground, multi-purpose (basketball, volleyball) sports field. In the apartments, there is a cloakroom, kitchen cabinets and countertops, bathroom cabinets, shower cabin, bathroom fixtures, triple built-in kitchen set and central heating system at the entrance. The apartments are 4 km from the sea, 6 km from Lara district center, 6 km from the city's major shopping centers and 3 km from Antalya International Airport.",
      features: ["Under Construction", "Boutique Project", "Indoor/Outdoor Parking", "Reception", "Multi-purpose Sports Field"],
      pricing: [
        { type: "1+1 Flat", size: "56m²", price: "€180,000" },
        { type: "2+1 Flat", size: "75m²", price: "€220,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3208/general/property-antalya-aksu-general-3208-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3208/general/property-antalya-aksu-general-3208-4.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3208/general/property-antalya-aksu-general-3208-5.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3208/general/property-antalya-aksu-general-3208-6.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3208/plan/property-antalya-aksu-plan-3208-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3208/general/property-antalya-aksu-general-3208-1.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "3 km",
      distanceToBeach: "4 km",
      facilities: ["Fire Alarm", "Security", "Backup Generator", "Garden", "Basketball Court", "Volleyball Court", "Sauna", "Open Car Park", "Pool", "Elevator", "Baby Pool", "Barbeque", "Pergolas", "Fitness", "From Developer", "Under Construction"]
    },
    "3206": {
      id: "3206",
      title: "Twin villas for sale in a luxury complex in Antalya, Altintas",
      location: "Antalya, Aksu",
      price: "€1,196,000",
      bedrooms: "6+1",
      bathrooms: "5",
      area: "347m²",
      propertyType: "Villas",
      refNo: "1280",
      buildingComplete: "12/01/2023",
      description: "Villas for sale are located in Antalya, Altıntaş region. Golden stone; It is a region where the most innovative architectural projects of Antalya take place, which will become the most interesting region of the city thanks to these projects and will put its name among the elite names of the city. The construction of housing and villa projects in the region continues rapidly. The fact that the delivery dates of these constructions are close to each other has accelerated the infrastructure works in the region. The project, where there are twin villas for sale, consists of 12 twin villas built on an area of 2.489 m². Each of the villas, designed to be 6+2, has a usage area of 347 m². There are facilities such as swimming pool, indoor car parking, fitness, sauna, 24/7 security and security camera system, site management service, service to the sea in the villa site. In luxury villas, there are features such as kitchen cabinets, built-in kitchen set, cloakroom, underfloor heating and air conditioners in each room, electric blinds and smart home system, en-suite bathrooms, jacuzzi, terrace and balconies, laundry rooms. As a location, it is 9 km to Lara beaches, 12 km to Kundu beach, 7 km to shopping centers such as Mall of Antalya and Agora, 10 km to Lara district center and 5 km to Antalya International Airport.",
      features: ["Under Construction", "Twin Villas", "Luxury Complex", "Smart Home System", "Jacuzzi", "En-suite Bathrooms", "Sea Service"],
      pricing: [{ type: "6+1 Villa", size: "347m²", price: "€1,196,000" }],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3206/general/property-antalya-aksu-general-3206-4.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3206/general/property-antalya-aksu-general-3206-19.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3206/general/property-antalya-aksu-general-3206-2.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3206/general/property-antalya-aksu-general-3206-3.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3206/plan/property-antalya-aksu-plan-3206-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3206/general/property-antalya-aksu-general-3206-0.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "5 km",
      distanceToBeach: "7 km",
      facilities: ["Fire Alarm", "Security", "Camera System", "Air Conditioning", "Sauna", "Pool", "Floor heating", "Private garage", "Caretaker", "Garage", "Beach transfer services", "Fitness", "From Developer", "Under Construction"]
    },
    "3200": {
      id: "3200",
      title: "Spacious apartments suitable for investment in Antalya, Altintas",
      location: "Antalya, Aksu",
      price: "€161,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 1",
      area: "72 <> 92m²",
      propertyType: "Apartments",
      refNo: "1277",
      buildingComplete: "06/01/2024",
      description: "Apartments for sale are located in Antalya, Altıntaş. Thanks to its opening for construction a short time ago, it has suddenly become a favorite of Antalya. The proximity of the region to Antalya International Airport, Lara beach, Lara district center, Kundu hotels area and the city's big shopping centers draws attention. Thanks to these location features, the region that will complete the infrastructure development in a few years will be a new elite district of Antalya. Thanks to the closeness of the completion dates of the constructions in the region, the region is developing and gaining value every day. The project, in which the apartments for sale are located, is built on an area of 3.089 m². There are a total of 136 flats in the project, 76 of which are 1+1 flats and 60 are 2+1 flats. 1+1 flats have areas ranging from 64 m² to 72 m². 2+1 flats have an area between 92 m² and 106 m². In the project where apartments for sale are located, there are facilities such as an outdoor swimming pool, children's swimming pool, indoor car parking, fitness, sauna, steam bath, 4 elevators, security camera system, generator and reception. The apartments, on the other hand, will be delivered to their prospective buyers equipped with luxury features such as cloakroom, cnc lacquered interior doors, Franke brand built-in triple kitchen set, Daikin brand air conditioners, electric blinds, en-suite bathroom, dressing room, panoramic glass and floor heating. Located in one of the best locations in the region, the apartments are 4 km from Lara beach, 6 km from Lara district center, 6 km from shopping centers such as Terra City, Agora, Ikea, Mall of Antalya and 3 km from Antalya International Airport.",
      features: ["Under Construction", "136 Total Flats", "Steam Bath", "4 Elevators", "Daikin Air Conditioners", "Franke Kitchen Set"],
      pricing: [
        { type: "1+1 Flat", size: "72m²", price: "€161,000" },
        { type: "2+1 Flat", size: "92m²", price: "€213,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3200/general/property-antalya-aksu-general-3200-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3200/general/property-antalya-aksu-general-3200-4.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3200/general/property-antalya-aksu-general-3200-5.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3200/general/property-antalya-aksu-general-3200-6.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3200/plan/property-antalya-aksu-plan-3200-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3200/general/property-antalya-aksu-general-3200-1.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "3 km",
      distanceToBeach: "6 km",
      facilities: ["Fire Alarm", "Camera System", "Backup Generator", "Air Conditioning", "Sauna", "Pool", "Elevator", "Floor heating", "Private garage", "Baby Pool", "Caretaker", "Garage", "Fitness", "From Developer", "Under Construction"]
    },
    "3178": {
      id: "3178",
      title: "High rental income bungalow complex in Antalya, Olympos",
      location: "Antalya",
      price: "€1,250,000",
      bedrooms: "2+1",
      bathrooms: "1",
      area: "30m²",
      propertyType: "Houses",
      refNo: "1271",
      buildingComplete: "01/01/2022",
      description: "The complex for sale is located in Antalya, Olympos. Olympus; It is one of the most famous recreation and holiday regions of Antalya. The region takes its name from the Ancient City of Olympos. Çıralı and Olympos region have been the resting and holiday area of people throughout the year. The region consists entirely of bungalow sites and camping areas. There are 18 fully furnished tree houses for sale in the bungalow complex for sale. The complex built in nature also has a cafe and restaurant. Rental service is available throughout the year in the complex. The complex draws attention with its sitting areas, walking paths, closeness to the ancient city, and its structure intertwined with nature. Olympos region, which is 65 km away from Antalya city center, is a very important region for tourism. The region, which has an easy access to public life from Antalya, has many historical sites and natural beauties nearby. Its distance to Antalya Airport is 90 km.",
      features: ["Ready to Move", "Furnished", "Tree Houses", "Cafe & Restaurant", "Year-round Rental", "Tourism Area"],
      pricing: [{ type: "2+1 House", size: "30m²", price: "€1,250,000" }],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3178/general/property-antalya-kumluca-general-3178-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3178/general/property-antalya-kumluca-general-3178-17.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3178/general/property-antalya-kumluca-general-3178-18.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3178/general/property-antalya-kumluca-general-3178-2.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3178/general/property-antalya-kumluca-general-3178-3.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3178/general/property-antalya-kumluca-general-3178-4.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "90 km",
      distanceToBeach: "0 km",
      facilities: ["Garden"]
    },
    "3138": {
      id: "3138",
      title: "Luxury apartments suitable for investment and citizenship in Antalya, Altintas",
      location: "Antalya, Aksu",
      price: "€193,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 1",
      area: "52 <> 131m²",
      propertyType: "Apartments",
      refNo: "1223",
      buildingComplete: "12/01/2024",
      description: "Apartments for sale are located in Antalya, Aksu, Altıntaş region. Thanks to its new zoning plan, it is a region that suddenly hosts housing projects, is expected to meet the growth needs of the city, and is rapidly advancing to become one of the new elite districts of Antalya. The proximity of the region to the airport, beaches and Lara region, which is one of the oldest settlements in the city, attracts attention. The complex with luxury apartments for sale is built on an area of 17.250 m². The project, which will consist of a total of 3 blocks, has 8 floors and will contain a total of 246 apartments. There are flats with a usage area varying between 52 m² and 233 m², and there are flat types such as flats with a private garden area and terraces. In the complex where luxury apartments are located, outdoor swimming pool, indoor swimming pool, pool bar, children's playground, fitness, sauna, indoor car parking lot, barbecue area, communal garden, camellias, generator, central satellite system, water booster, security camera system, site attendant There will be facilities such as reception, 24/7 security, shuttle service to the beach. In stylish apartments, features such as steel apartment doors, interior doors, kitchen cabinets, LED lighting, double glass windows, central heating and cooling system, stove, oven, extractor fan, and recessed cloakroom in the corridor will be offered to the buyers as standard. As a location, it is 5.5 km from the sea, 4 km from the city's big shopping centers, 8.5 km from Lara district center and 4 km from Antalya International Airport.",
      features: ["For Residence Permit", "Under Construction", "Turkish Citizenship", "Indoor/Outdoor Pools", "Pool Bar", "Beach Shuttle"],
      pricing: [
        { type: "1+1 Flat", size: "52m²", price: "€193,000" },
        { type: "2+1 Flat", size: "131m²", price: "€390,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3138/general/property-antalya-aksu-general-3138-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3138/general/property-antalya-aksu-general-3138-7.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3138/general/property-antalya-aksu-general-3138-8.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3138/general/property-antalya-aksu-general-3138-9.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3138/plan/property-antalya-aksu-plan-3138-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3138/general/property-antalya-aksu-general-3138-1.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "4 km",
      distanceToBeach: "5.5 km",
      facilities: ["Fire Alarm", "Security", "Camera System", "Air Conditioning", "Garden", "Basketball Court", "Volleyball Court", "Tennis Court", "Sauna", "Open Car Park", "Pool", "Cable TV - Satellite", "Floor heating", "Indoor swimming pool", "Turkish Citizenship", "Garage", "Steam Room", "Massage room", "Pool bar", "Fitness", "From Developer", "For Residence Permit", "Under Construction"]
    },
    "3130": {
      id: "3130",
      title: "Luxury apartments close to daily amenities in Antalya, Konyaaltı",
      location: "Antalya, Konyaalti",
      price: "€670,000",
      bedrooms: "3+1",
      bathrooms: "2",
      area: "175m²",
      propertyType: "Apartments",
      refNo: "1215",
      buildingComplete: "12/01/2023",
      description: "Apartments for sale are located in Antalya, Konyaaltı, in Uncalı Mahallesi. Konyaalti; Established next to the long blue beaches of Antalya, it is a region that attracts attention with its socio-cultural structure, where all daily needs such as hospitals, pharmacies, banks, markets, shopping malls are located, as well as the city's oldest and most developed, luxury restaurants, cafes and hotels. The complex with flats for sale is built on an area of 7500 m² and will consist of 6 4-storey blocks. There are a total of 48 apartments with 3 bedrooms and separate kitchens on the site. 5500 m² garden area, three-lane outdoor swimming pool, heated indoor swimming pool and jacuzzi, professional gym, sauna, 24/7 security, indoor parking lot with 2 cars for each flat, 5 m² storage area for each flat in the basement. There will be facilities specially designed for the residents such as soundproofed generator for all flats and common areas, wi-fi for all common areas, intercom for security communication in elevators. In luxury apartments, intercom and smart home system, remotely controlled heating and cooling via internet, Mitsubishi brand split air conditioner in every room, built-in ceiling air conditioner in living room and kitchen, Rehau underfloor heating system, Viessmann gas boiler for each apartment, heat and sound insulation in all apartments, There will be parquet-flooring, fingerprinted steel entrance doors, Volkswagen shutter system, Bosh brand built-in set and dishwasher, all wet floors will be tile and marble, all bathrooms will have luxury vitrifieds. In Uncalı Neighborhood; Located in this most preferred location of Antalya, the apartments have been carefully designed for the residents to spend their lives comfortably. The scarcity of such projects in the region also makes the project a good investment opportunity. The apartments are located 2.5 km from Konyaaltı Beach, within walking distance of all daily needs, 2 km from Konyaaltı district center and 22.5 km from Antalya International Airport.",
      features: ["Ready to Move", "For Residence Permit", "Smart Home System", "Heated Indoor Pool", "Jacuzzi", "Professional Gym", "2 Car Parking per Flat"],
      pricing: [{ type: "3+1 Flat", size: "175m²", price: "€670,000" }],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3130/general/property-antalya-konyaalti-general-3130-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3130/general/property-antalya-konyaalti-general-3130-2.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3130/general/property-antalya-konyaalti-general-3130-3.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3130/general/property-antalya-konyaalti-general-3130-4.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3130/plan/property-antalya-konyaalti-plan-3130-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3130/general/property-antalya-konyaalti-general-3130-1.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "22.5 km",
      distanceToBeach: "2.5 km",
      facilities: ["Garden", "Pool", "Cable TV - Satellite", "City view", "City Center", "Smart-Home System", "Ready to Move", "From Developer", "New Building"]
    },
    "3126": {
      id: "3126",
      title: "New apartments suitable for investment in Antalya, Altintas",
      location: "Antalya, Aksu",
      price: "€133,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 1",
      area: "63 <> 95m²",
      propertyType: "Apartments",
      refNo: "1210",
      buildingComplete: "12/01/2023",
      description: "Apartments for sale are located in Antalya, Altıntaş. Altintas region; Equipped with the projects of Turkey's largest construction companies with its new zoning plan, it is a region that is the apple of the eye of investors in Antalya. The fact that the completion dates of the projects in the region are close to each other will make the region one of the most beautiful districts of Antalya in a few years. Apartments for sale will be built on 2424 m² of land. In the two-block project, there are facilities such as swimming pool, open car park, generator, common garden, security and security camera system, water tank and hydrophore. Apartments for sale are in an open kitchen plan, equipped with features such as video intercom, natural gas infrastructure, air conditioning infrastructure in every room, built-in kitchen products, electric shutters, steel exterior doors, 1st class sanitary ware.",
      features: ["For Residence Permit", "Under Construction", "Two-Block Project", "Open Kitchen Plan", "Video Intercom", "Natural Gas Infrastructure"],
      pricing: [
        { type: "1+1 Flat", size: "63m²", price: "€133,000" },
        { type: "2+1 Flat", size: "95m²", price: "€174,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3126/general/property-antalya-aksu-general-3126-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3126/general/property-antalya-aksu-general-3126-16.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3126/general/property-antalya-aksu-general-3126-2.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3126/general/property-antalya-aksu-general-3126-3.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3126/general/property-antalya-aksu-general-3126-5.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3126/general/property-antalya-aksu-general-3126-7.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "4.5 km",
      distanceToBeach: "6.6 km",
      facilities: ["Fire Alarm", "Security", "Camera System", "Backup Generator", "Garden", "Open Car Park", "Pool", "Cable TV - Satellite", "From Developer", "New Building"]
    },
    "3081": {
      id: "3081",
      title: "Stylish apartments in a luxury complex for sale in Antalya, Altintas",
      location: "Antalya, Aksu",
      price: "€213,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "48m²",
      propertyType: "Apartments",
      refNo: "1147",
      buildingComplete: "12/01/2023",
      description: "Apartments for sale are located in Antalya, Altıntaş. Altıntaş is the region most valued by investors in the province of Antalya, which hosts many housing projects, close to Antalya Airport, close to the Lara region and the famous Antalya shopping centers, due to its newly-planned area. The fact that many housing projects have been implemented in the region together with the zoning planning has enabled the region to develop rapidly and made the region one of the new luxury districts of Antalya such as Konyaaltı and Lara. The project, where the apartments for sale are located, consists of a specially designed block with 11 floors and 105 apartments and 12 villas around it. There are 1+1, 2+1 and 4+1 villa type apartments in the project. All apartments are south facing and have a children's pool, outdoor pool, elevated pool, cloakrooms in the apartments, automatic shutter system, indoor parking lot, waterfall, botanical garden, children's playground, fitness, security camera system, underfloor heating in all apartments, Turkish bath, sauna, 3 units. There are many features such as elevator, generator, double wall system and sound insulation between apartments, thermal insulation on the exterior, kitchen counters, lacquer painted doors, laminate-ceramic-parquet flooring, 3-piece built-in kitchen set, bathroom fixtures.",
      features: ["For Residence Permit", "Ready to Move", "Luxury Complex", "Botanical Garden", "Waterfall", "Turkish Bath", "Automatic Shutter System"],
      pricing: [{ type: "1+1 Flat", size: "48m²", price: "€213,000" }],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3081/general/property-antalya-aksu-general-3081-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3081/general/property-antalya-aksu-general-3081-19.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3081/general/property-antalya-aksu-general-3081-2.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3081/general/property-antalya-aksu-general-3081-3.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3081/plan/property-antalya-aksu-plan-3081-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3081/general/property-antalya-aksu-general-3081-1.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "7 km",
      distanceToBeach: "6 km",
      facilities: ["Garden", "Pool", "Cable TV - Satellite", "City view", "City Center", "Smart-Home System", "Ready to Move", "New Building"]
    },
    "3083": {
      id: "3083",
      title: "Stylish apartments close to the sea in Antalya, Konyaaltı",
      location: "Antalya, Konyaalti",
      price: "€378,000",
      bedrooms: "2+1 <> 3+1",
      bathrooms: "1 <> 3",
      area: "100 <> 177m²",
      propertyType: "Apartments",
      refNo: "1150",
      buildingComplete: "03/01/2024",
      description: "Apartments for sale are located in Antalya, Konyaaltı. Konyaaltı has always been one of the elite districts of Antalya that attracts attention with its blue flag beaches, picnic areas, shopping centers, hospitals, pharmacies, banks, markets, walking and cycling paths, restaurants, cafes, bars, and daily needs and various facilities. Flats for sale consist of 3300 m² green area, 1311 m² building residence area and social areas within an area of ​​4611 m². There will be a total of 67 flats in the site, which consists of 4 blocks with 6 floors. There are 2+1 mezzanine, 3+1 loft and 3+1 roof duplex apartments. In the complex where stylish apartments for sale are located, covered parking, open parking in front of the site, access to the floors by elevator from the indoor parking lot, 24/7 security, lobby, generator, outdoor swimming pool, heated indoor swimming pool, children's swimming pool, cafeteria, fitness, sauna, steam room, dressing rooms and showers, resting area, table football, table tennis, airhockey, billiards, children's playroom, outdoor playground, private landscaped garden, camera system, central satellite system, camellia, 2 elevators in each building, automatic doors at the entrance of the building. facilities are available. In the apartments, wooden-clad steel doors, video intercom system, lacquered painted mdf-covered interior doors, satin plaster walls, ceramic coatings, hidden LED light and spot lighting systems, laminate and granite floor coverings, double glass windows and electric shutters, shower cabin, bathroom cabinets , kitchen cabinets and kitchen furniture sets, quartz and granite countertops, Siemens brand built-in kitchen set, air conditioning in every room, natural gas underfloor heating system, cloakroom in the corridor, sauna and jacuzzi special for roof duplexes, barbecue on large terraces, dressing room.",
      features: ["Under Construction", "Heated Indoor Pool", "Sauna", "Steam Room", "Table Tennis", "Billiards", "Siemens Kitchen Set"],
      pricing: [
        { type: "2+1 Flat", size: "100m²", price: "€378,000" },
        { type: "3+1 Duplex", size: "177m²", price: "€560,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3083/general/property-antalya-konyaalti-general-3083-11.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3083/general/property-antalya-konyaalti-general-3083-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3083/general/property-antalya-konyaalti-general-3083-1.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3083/general/property-antalya-konyaalti-general-3083-10.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3083/plan/property-antalya-konyaalti-plan-3083-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3083/general/property-antalya-konyaalti-general-3083-2.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "25.5 km",
      distanceToBeach: "1.5 km",
      facilities: ["Fire Alarm", "Security", "Camera System", "Backup Generator", "Air Conditioning", "Garden", "Open Car Park", "Pool", "Elevator", "Floor heating", "Indoor swimming pool", "Baby Pool", "Garage", "Pergolas", "Table tennis", "Spa", "Fitness", "From Developer", "Under Construction"]
    },
    "3061": {
      id: "3061",
      title: "Ready to move apartments close to the beach in Antalya, Lara",
      location: "Antalya, Lara",
      price: "€129,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "40m²",
      propertyType: "Apartments",
      refNo: "1120",
      buildingComplete: "11/01/2022",
      description: "Apartments for sale are located in Antalya, Lara. Lara is one of the oldest and most popular settlements in Antalya. This region, which offers a permanent holiday life with its fun social life, cafes, restaurants, long sandy beaches, clear sea, is very valuable in tourism. The project, where the apartments for sale are located, consists of a single block built on an area of ​​1237 m². The construction of the project, which includes apartments with 1+1 and 1+1 garden usage area, has been completed and is ready to live in or to rent as an investment vehicle.",
      features: ["For Residence Permit", "Ready to Move", "Fire Alarm", "Camera System", "Backup Generator", "Air Conditioning", "Garden", "Pool", "Elevator", "Caretaker", "Garage", "Hot Offer", "From Developer", "New Building"],
      pricing: [
        { type: "1+1 Flat", size: "40m²", price: "€129,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3061/general/property-antalya-lara-general-3061-4.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3061/general/property-antalya-lara-general-3061-11.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3061/general/property-antalya-lara-general-3061-12.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3061/general/property-antalya-lara-general-3061-13.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3061/general/property-antalya-lara-general-3061-14.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3061/general/property-antalya-lara-general-3061-7.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "9.5 km",
      distanceToBeach: "2 km",
      facilities: ["Fire Alarm", "Camera System", "Backup Generator", "Air Conditioning", "Garden", "Pool", "Elevator", "Caretaker", "Garage", "Hot Offer", "From Developer", "For Residence Permit", "New Building"]
    },
    "3004": {
      id: "3004",
      title: "Stunning Flats with Mountain View in Antalya, Konyaaltı",
      location: "Antalya, Konyaalti",
      price: "€192,000",
      bedrooms: "2+1 <> 3+1",
      bathrooms: "1 <> 2",
      area: "87 <> 140m²",
      propertyType: "Apartments",
      refNo: "1016",
      buildingComplete: "01/01/2022",
      description: "Stunning flats for sale in Antalya are situated in a coveted area known with proximity to the famous Konyaalti Beach and intertwined with nature. There is very close to Sarısu beach and the picnic area. Also, Konyaalti offers easy access to all region of Antalya with developed public transportation networks. The modern residential complex consists of 2 blocks with 4 storeys, a total of 60 flats. The complex has an outdoor car parking area, caretaker, sitting area, swimming pool, kid's pool, sunbathing areas, sauna, elevator, well-designed garden, 24/7 security camera, and services.",
      features: ["For Residence Permit", "Garden", "Pool", "City view", "New Building"],
      pricing: [
        { type: "2+1 Flat", size: "87m²", price: "€192,000" },
        { type: "3+1 Flat", size: "140m²", price: "€259,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3004/general/property-antalya-konyaalti-general-3004-8.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3004/general/property-antalya-konyaalti-general-3004-16.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3004/general/property-antalya-konyaalti-general-3004-4.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3004/general/property-antalya-konyaalti-general-3004-5.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3004/general/property-antalya-konyaalti-general-3004-6.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3004/general/property-antalya-konyaalti-general-3004-7.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "27 km",
      distanceToBeach: "1.5 km",
      facilities: ["Garden", "Pool", "City view", "New Building"]
    },
    "3009": {
      id: "3009",
      title: "Apartments with mountain and forest view in Antalya, Dösemealti",
      location: "Antalya, Döşemealtı",
      price: "€155,000",
      bedrooms: "1+1 <> 5+1",
      bathrooms: "1 <> 2",
      area: "70 <> 222m²",
      propertyType: "Apartments",
      refNo: "1042",
      buildingComplete: "01/01/2024",
      description: "This modern property is located in Döşemealtı, Antalya. This region is popular for its historical and cultural sites such as the ancient city, the museum and the green areas. Döşemealtı offers a quiet and peaceful lifestyle in Antalya. If you want to make an investment and buy an apartment, this region is a great choice for you. Antalya properties are also close to the ecologic Bazaar and Kindergarten, hospitals, universities. Properties in Antalya are walking distance to all transportation facilities.",
      features: ["For Residence Permit", "Under Construction", "Garden", "Pool", "Nature view"],
      pricing: [
        { type: "1+1 Flat", size: "70m²", price: "€155,000" },
        { type: "2+1 Flat", size: "132m²", price: "€240,000" },
        { type: "3+1 Flat", size: "163m²", price: "€305,000" },
        { type: "4+1 Flat", size: "207m²", price: "€370,000" },
        { type: "5+1 Flat", size: "222m²", price: "€385,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3009/general/property-antalya-dosemealti-general-3009-10.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3009/general/property-antalya-dosemealti-general-3009-2.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3009/general/property-antalya-dosemealti-general-3009-3.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3009/general/property-antalya-dosemealti-general-3009-4.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3009/general/property-antalya-dosemealti-general-3009-5.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3009/general/property-antalya-dosemealti-general-3009-6.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "35 km",
      distanceToBeach: "20 km",
      facilities: ["Garden", "Pool", "Nature view"]
    },
    "3248": {
      id: "3248",
      title: "New apartments with modern architecture in Antalya, Kepez",
      location: "Antalya, Kepez",
      price: "€140,000",
      bedrooms: "2+1",
      bathrooms: "1",
      area: "83m²",
      propertyType: "Apartments",
      refNo: "1304",
      buildingComplete: "12/01/2024",
      description: "Apartments for sale are located in Düdenbaşı Neighborhood of Kepez, Antalya. The Düdenbaşı region is a developing region where public transportation opportunities are abundant. New housing projects in the region are frequently preferred by local investors and residents of the city. Thanks to this, the site where the apartments are located will provide regular and high rental income to the investors.",
      features: ["Under Construction", "Fire Alarm", "Camera System", "Open Car Park", "Cable TV - Satellite", "Elevator", "City view", "Close to Bus Stop", "City Center", "From Developer"],
      pricing: [
        { type: "2+1 Flat", size: "83m²", price: "€140,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3248/general/property-antalya-kepez-general-3248-1.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3248/general/property-antalya-kepez-general-3248-7.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3248/general/property-antalya-kepez-general-3248-8.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3248/general/property-antalya-kepez-general-3248-9.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3248/plan/property-antalya-kepez-plan-3248-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3248/plan/property-antalya-kepez-plan-3248-1.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "12 km",
      distanceToBeach: "8 km",
      facilities: ["Fire Alarm", "Camera System", "Open Car Park", "Cable TV - Satellite", "Elevator", "City view", "Close to Bus Stop", "City Center", "From Developer", "Under Construction"]
    },
    "4468": {
      id: "4468",
      title: "Apartments for sale within the complex in Antalya, Dösemealti",
      location: "Antalya, Döşemealtı",
      price: "€115,000",
      bedrooms: "2+1",
      bathrooms: "1",
      area: "80m²",
      propertyType: "Apartments",
      refNo: "1352",
      buildingComplete: "10/01/2024",
      description: "Flats for sale are located in Antalya Döşemealtı. Döşemealtı is a region that is a 15-minute drive from Antalya city center, meets the growth needs of the city and attracts attention with its clean air, natural beauties and ancient districts. University and villa sites in the district add value to the region. This region, which offers its residents the opportunity of a peaceful life away from the city noise, is suitable for investment as it gains value day by day.",
      features: ["Under Construction", "Garden", "Pool", "Cable TV - Satellite", "Smart-Home System"],
      pricing: [
        { type: "2+1 Flat", size: "80m²", price: "€115,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4468/general/property-antalya-dosemealti-general-4468-3.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4468/general/property-antalya-dosemealti-general-4468-2.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4468/general/property-antalya-dosemealti-general-4468-4.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4468/general/property-antalya-dosemealti-general-4468-5.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4468/general/property-antalya-dosemealti-general-4468-6.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4468/general/property-antalya-dosemealti-general-4468-7.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "25 km",
      distanceToBeach: "22 km",
      facilities: ["Garden", "Pool", "Cable TV - Satellite", "Smart-Home System"]
    },
    "3229": {
      id: "3229",
      title: "Spacious apartments in a project close to the sea in Antalya, Altintas",
      location: "Antalya, Aksu",
      price: "€140,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "63m²",
      propertyType: "Apartments",
      refNo: "1292",
      buildingComplete: "12/01/2023",
      description: "Apartments for sale are located in Antalya, Altıntaş. Altıntaş started to develop rapidly with the new zoning plan and became the most preferred area for all investors in the city. When the projects in this region, which gains in value day by day, are completed and the infrastructure works are completed, it will begin to be recognized as one of the elite districts of Antalya.",
      features: ["Under Construction", "Fire Alarm", "Security", "Camera System", "Air Conditioning", "Garden", "Sauna", "Open Car Park", "Pool", "Cable TV - Satellite", "Turkish bath", "Baby Pool", "Caretaker", "Barbeque", "Pergolas", "Fitness", "From Developer"],
      pricing: [
        { type: "1+1 Flat", size: "63m²", price: "€140,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3229/general/property-antalya-aksu-general-3229-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3229/general/property-antalya-aksu-general-3229-4.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3229/general/property-antalya-aksu-general-3229-5.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3229/general/property-antalya-aksu-general-3229-6.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3229/general/property-antalya-aksu-general-3229-7.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3229/general/property-antalya-aksu-general-3229-8.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "7 km",
      distanceToBeach: "4 km",
      facilities: ["Fire Alarm", "Security", "Camera System", "Air Conditioning", "Garden", "Sauna", "Open Car Park", "Pool", "Cable TV - Satellite", "Turkish bath", "Baby Pool", "Caretaker", "Barbeque", "Pergolas", "Fitness", "From Developer", "Under Construction"]
    },
    "3219": {
      id: "3219",
      title: "Spacious apartments with affordable payment plan in Antalya, Lara",
      location: "Antalya, Lara",
      price: "€165,000",
      bedrooms: "1+1 <> 3+1",
      bathrooms: "1 <> 2",
      area: "65 <> 133m²",
      propertyType: "Apartments",
      refNo: "1287",
      buildingComplete: "11/01/2023",
      description: "Apartments for sale are located in Antalya, Lara region. Lara is known as one of the oldest districts of Antalya. The city's most luxurious restaurants, hotels, cafes, the most beautiful walking paths and parks are located in this area. The district includes all daily needs such as hospitals, banks, market areas, shopping malls, pharmacies, and public transportation.",
      features: ["Under Construction", "Fire Alarm", "Air Conditioning", "Garden", "Pool", "Floor heating", "Baby Pool", "Garage", "From Developer"],
      pricing: [
        { type: "1+1 Flat", size: "65m²", price: "€165,000" },
        { type: "2+1 Flat", size: "89m²", price: "€235,000" },
        { type: "3+1 Flat", size: "133m²", price: "€335,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3219/general/property-antalya-lara-general-3219-4.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3219/general/property-antalya-lara-general-3219-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3219/general/property-antalya-lara-general-3219-1.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3219/general/property-antalya-lara-general-3219-10.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3219/general/property-antalya-lara-general-3219-11.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3219/general/property-antalya-lara-general-3219-12.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "4 km",
      distanceToBeach: "2.5 km",
      facilities: ["Fire Alarm", "Air Conditioning", "Garden", "Pool", "Floor heating", "Baby Pool", "Garage", "From Developer", "Under Construction"]
    },
    // Mersin Properties
    "6504": {
      id: "6504",
      title: "Apartments in a complex with a swimming pool in the city center of Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€167,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 2",
      area: "52 <> 102m²",
      propertyType: "Apartments",
      refNo: "6504",
      buildingComplete: "Ready to Move",
      description: "Located in the city center of Erdemli, these modern apartments offer comfortable living with swimming pool facilities and close proximity to all amenities.",
      features: ["Swimming Pool", "City Center", "Ready to Move"],
      pricing: [
        { type: "1+1 Flat", size: "52m²", price: "€167,000" },
        { type: "2+1 Flat", size: "102m²", price: "€250,000" }
      ],
      images: ["/lovable-uploads/57965b04-af07-45ca-8bb7-9dec10da9d29.png"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "90 km",
      distanceToBeach: "2 km",
      facilities: ["Pool", "Garden", "Parking"]
    },
    "6503": {
      id: "6503",
      title: "Peaceful apartments close to the city center in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€135,000",
      bedrooms: "1+1 <> 3+1",
      bathrooms: "1",
      area: "52 <> 109m²",
      propertyType: "Apartments",
      refNo: "6503",
      buildingComplete: "Ready to Move",
      description: "Peaceful apartments located close to Erdemli city center, offering tranquil living with easy access to urban amenities.",
      features: ["Peaceful Location", "City Center Access", "Ready to Move"],
      pricing: [
        { type: "1+1 Flat", size: "52m²", price: "€135,000" },
        { type: "3+1 Flat", size: "109m²", price: "€225,000" }
      ],
      images: ["/lovable-uploads/7b10aab5-8e09-4620-80e7-b1014f36115e.png"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "90 km",
      distanceToBeach: "3 km",
      facilities: ["Garden", "Parking"]
    },
    "6502": {
      id: "6502",
      title: "Duplex apartments in a complex with a swimming pool in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€125,000",
      bedrooms: "2+1 <> 3+1",
      bathrooms: "2 <> 3",
      area: "85 <> 110m²",
      propertyType: "Apartments",
      refNo: "6502",
      buildingComplete: "Ready to Move",
      description: "Modern duplex apartments with swimming pool in a well-designed complex in Erdemli.",
      features: ["Duplex Design", "Swimming Pool", "Modern Complex"],
      pricing: [
        { type: "2+1 Duplex", size: "85m²", price: "€125,000" },
        { type: "3+1 Duplex", size: "110m²", price: "€160,000" }
      ],
      images: ["/lovable-uploads/956541d2-b461-4acd-a29a-463c5a97983e.png"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "90 km",
      distanceToBeach: "2 km",
      facilities: ["Pool", "Garden", "Parking"]
    },
    "6501": {
      id: "6501",
      title: "Furnished apartments in a complex with a swimming pool in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€315,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 2",
      area: "52 <> 102m²",
      propertyType: "Apartments",
      refNo: "6501",
      buildingComplete: "Ready to Move",
      description: "Fully furnished apartments with sea views and swimming pool facilities in a premium complex.",
      features: ["Sea View", "Fully Furnished", "Swimming Pool", "Premium Complex"],
      pricing: [
        { type: "1+1 Flat", size: "52m²", price: "€315,000" },
        { type: "2+1 Flat", size: "102m²", price: "€420,000" }
      ],
      images: ["/lovable-uploads/aff7bebd-5943-45d9-84d8-a923abf07e24.png"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "90 km",
      distanceToBeach: "0.5 km",
      facilities: ["Pool", "Sea View", "Furnished"]
    },
    "6500": {
      id: "6500",
      title: "Apartments in an award-winning complex within walking distance to the sea in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€250,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 2",
      area: "65 <> 75m²",
      propertyType: "Apartments",
      refNo: "6500",
      buildingComplete: "Ready to Move",
      description: "Award-winning complex with apartments within walking distance to the sea, offering premium living experience.",
      features: ["Award-Winning Complex", "Walking Distance to Sea", "For Residence Permit"],
      pricing: [
        { type: "1+1 Flat", size: "65m²", price: "€250,000" },
        { type: "2+1 Flat", size: "75m²", price: "€320,000" }
      ],
      images: ["/lovable-uploads/000f440d-ddb1-4c1b-9202-eef1ef588a8c.png"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "90 km",
      distanceToBeach: "0.2 km",
      facilities: ["Pool", "Sea Access", "Garden"]
    },
    "3176": {
      id: "3176",
      title: "Stylish apartments near the sea in Mersin, Mezitli",
      location: "Mersin, Mezitli",
      price: "€68,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "58m²",
      propertyType: "Apartments",
      refNo: "1269",
      buildingComplete: "07/01/2024",
      description: "Stylish apartments with sea views located near the beautiful Mediterranean coast in Mezitli.",
      features: ["Sea View", "Under Construction", "Near Beach"],
      pricing: [{ type: "1+1 Flat", size: "58m²", price: "€68,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3176/general/property-mersin-mezitli-general-3176-0.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "85 km",
      distanceToBeach: "0.5 km",
      facilities: ["Pool", "Garden", "Sea View"]
    },
    "4673": {
      id: "4673",
      title: "Luxury villas with stylish designs in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€350,000",
      bedrooms: "4+1",
      bathrooms: "2",
      area: "198m²",
      propertyType: "Villas",
      refNo: "3017",
      buildingComplete: "05/01/2025",
      description: "Luxury villas featuring modern designs and premium amenities in the beautiful Erdemli region.",
      features: ["Luxury Design", "Under Construction", "Private Garden"],
      pricing: [{ type: "4+1 Villa", size: "198m²", price: "€350,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4673/general/apartment-321909.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "120 km",
      distanceToBeach: "8 km",
      facilities: ["Pool", "Garden", "Parking"]
    },
    "4659": {
      id: "4659",
      title: "Luxury villa with modern design in Mersin, Silifke",
      location: "Mersin, Silifke",
      price: "€297,500",
      bedrooms: "4+1",
      bathrooms: "2",
      area: "185m²",
      propertyType: "Villas",
      refNo: "3013",
      buildingComplete: "04/01/2025",
      description: "Modern luxury villa in natural surroundings with premium finishes and spacious design.",
      features: ["Modern Design", "Natural Setting", "Ready to Move"],
      pricing: [{ type: "4+1 Villa", size: "185m²", price: "€297,500" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4659/general/apartment-321762.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "120 km",
      distanceToBeach: "20 km",
      facilities: ["Pool", "Garden", "Nature View"]
    },
    "3265": {
      id: "3265",
      title: "Spacious apartments in a luxury complex in Mersin, Mezitli",
      location: "Mersin, Mezitli",
      price: "€69,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 2",
      area: "59 <> 99m²",
      propertyType: "Apartments",
      refNo: "1310",
      buildingComplete: "08/01/2026",
      description: "Spacious apartments in a luxury complex with premium amenities in Mezitli.",
      features: ["Luxury Complex", "Under Construction", "Spacious Design"],
      pricing: [
        { type: "1+1 Flat", size: "59m²", price: "€69,000" },
        { type: "2+1 Flat", size: "99m²", price: "€92,000" }
      ],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3265/general/property-mersin-mezitli-general-3265-0.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "75 km",
      distanceToBeach: "1 km",
      facilities: ["Pool", "Fitness", "Garden"]
    },
    "4671": {
      id: "4671",
      title: "Luxury villa with sea view and furniture in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€210,000",
      bedrooms: "4+1",
      bathrooms: "3",
      area: "180m²",
      propertyType: "Villas",
      refNo: "3015",
      buildingComplete: "01/01/2024",
      description: "Luxury furnished villa with stunning sea views and premium amenities.",
      features: ["Sea View", "Furnished", "Luxury Design"],
      pricing: [{ type: "4+1 Villa", size: "180m²", price: "€210,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4671/general/apartment-321860.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "109 km",
      distanceToBeach: "2 km",
      facilities: ["Sea View", "Furnished", "Garden"]
    },
    "4631": {
      id: "4631",
      title: "Stylish apartments within walking distance to the sea in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€75,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 2",
      area: "70 <> 104m²",
      propertyType: "Apartments",
      refNo: "3012",
      buildingComplete: "09/01/2025",
      description: "Stylish apartments with easy sea access and modern amenities.",
      features: ["Near Sea", "Under Construction", "Modern Design"],
      pricing: [
        { type: "1+1 Flat", size: "70m²", price: "€75,000" },
        { type: "2+1 Flat", size: "104m²", price: "€110,000" }
      ],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4631/general/apartment-321368.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "90 km",
      distanceToBeach: "0.5 km",
      facilities: ["Pool", "Fitness", "Basketball Court"]
    },
    "4612": {
      id: "4612",
      title: "Apartments for sale close to daily needs in Mersin, Mezitli",
      location: "Mersin, Mezitli",
      price: "€70,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1",
      area: "55 <> 70m²",
      propertyType: "Apartments",
      refNo: "3009",
      buildingComplete: "12/01/2024",
      description: "Convenient apartments close to all daily necessities in Mezitli.",
      features: ["Close to Amenities", "For Residence Permit", "Modern Complex"],
      pricing: [
        { type: "1+1 Flat", size: "55m²", price: "€70,000" },
        { type: "2+1 Flat", size: "70m²", price: "€82,000" }
      ],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4612/general/apartment-321080.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "85 km",
      distanceToBeach: "0.7 km",
      facilities: ["Pool", "Basketball Court", "Parking"]
    },
    "4621": {
      id: "4621",
      title: "Luxury apartments for sale close to the beach in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€79,000",
      bedrooms: "2+1",
      bathrooms: "2",
      area: "74m²",
      propertyType: "Apartments",
      refNo: "3011",
      buildingComplete: "07/01/2025",
      description: "Luxury apartments with premium amenities close to beautiful beaches.",
      features: ["Near Beach", "Luxury Amenities", "Under Construction"],
      pricing: [{ type: "2+1 Flat", size: "74m²", price: "€79,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4621/general/apartment-321213.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "85 km",
      distanceToBeach: "0.3 km",
      facilities: ["Pool", "Sauna", "Fitness"]
    },
    "3157": {
      id: "3157",
      title: "Apartments within walking distance to the sea in Mersin, Mezitli",
      location: "Mersin, Mezitli",
      price: "€115,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "82m²",
      propertyType: "Apartments",
      refNo: "1247",
      buildingComplete: "06/01/2025",
      description: "Premium apartments with easy sea access and luxury amenities.",
      features: ["Sea Access", "Premium Amenities", "Under Construction"],
      pricing: [{ type: "1+1 Flat", size: "82m²", price: "€115,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3157/general/property-mersin-mezitli-general-3157-14.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "75 km",
      distanceToBeach: "0.7 km",
      facilities: ["Pool", "Turkish Bath", "Fitness"]
    },
    "3173": {
      id: "3173",
      title: "Apartments in a hotel concept project close to the sea in Mersin, Mezitli",
      location: "Mersin, Mezitli",
      price: "€65,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "60m²",
      propertyType: "Apartments",
      refNo: "1265",
      buildingComplete: "07/01/2024",
      description: "Hotel concept apartments with premium services and sea access.",
      features: ["Hotel Concept", "Sea View", "Premium Services"],
      pricing: [{ type: "1+1 Flat", size: "60m²", price: "€65,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3173/general/property-mersin-mezitli-general-3173-0.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "100 km",
      distanceToBeach: "0.6 km",
      facilities: ["Pool", "Turkish Bath", "Fitness"]
    },
    "3093": {
      id: "3093",
      title: "Spacious real estate in a featured complex in Mersin, Tarsus",
      location: "Mersin, Tarsus",
      price: "€63,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 2",
      area: "70 <> 100m²",
      propertyType: "Apartments",
      refNo: "1163",
      buildingComplete: "06/01/2025",
      description: "Spacious apartments in a featured complex with modern amenities in Tarsus.",
      features: ["Spacious Design", "Featured Complex", "Under Construction"],
      pricing: [
        { type: "1+1 Flat", size: "70m²", price: "€63,000" },
        { type: "2+1 Flat", size: "100m²", price: "€81,000" }
      ],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3093/general/property-mersin-tarsus-general-3093-0.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "15 km",
      distanceToBeach: "7 km",
      facilities: ["Pool", "Turkish Bath", "Fitness"]
    },
    "4429": {
      id: "4429",
      title: "Apartments for sale in a project suitable for investment in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€60,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "61m²",
      propertyType: "Apartments",
      refNo: "1332",
      buildingComplete: "08/01/2025",
      description: "Investment-suitable apartments in a promising development project.",
      features: ["Investment Opportunity", "Modern Design", "Under Construction"],
      pricing: [{ type: "1+1 Flat", size: "61m²", price: "€60,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4429/general/property-mersin-erdemli-general-4429-1.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "90 km",
      distanceToBeach: "0.5 km",
      facilities: ["Pool", "Sauna", "Fitness"]
    },
    "3167": {
      id: "3167",
      title: "Spacious apartments in the project within walking distance to the sea in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€110,000",
      bedrooms: "2+1",
      bathrooms: "2",
      area: "110m²",
      propertyType: "Apartments",
      refNo: "1257",
      buildingComplete: "09/01/2023",
      description: "Spacious apartments in a modern project with easy sea access and luxury amenities.",
      features: ["Sea Access", "Under Construction", "Spacious Design"],
      pricing: [{ type: "2+1 Flat", size: "110m²", price: "€110,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3167/general/property-mersin-erdemli-general-3167-0.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "95 km",
      distanceToBeach: "0.6 km",
      facilities: ["Pool", "Garden", "Parking"]
    },
    "3179": {
      id: "3179",
      title: "Stylish apartments in a modern designed project in Mersin, Mezitli",
      location: "Mersin, Mezitli",
      price: "€66,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 2",
      area: "45 <> 75m²",
      propertyType: "Apartments",
      refNo: "1272",
      buildingComplete: "09/01/2024",
      description: "Stylish apartments with sea views in a modern designed project in Mezitli.",
      features: ["Sea View", "Modern Design", "Under Construction"],
      pricing: [
        { type: "1+1 Flat", size: "45m²", price: "€66,000" },
        { type: "2+1 Flat", size: "75m²", price: "€100,000" }
      ],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3179/general/property-mersin-mezitli-general-3179-0.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "60 km",
      distanceToBeach: "0.7 km",
      facilities: ["Pool", "Garden", "Elevator"]
    },
    "4454": {
      id: "4454",
      title: "Spacious flats for sale close to daily needs in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€37,500",
      bedrooms: "1+ <> 1+1",
      bathrooms: "1",
      area: "43 <> 74m²",
      propertyType: "Apartments",
      refNo: "1343",
      buildingComplete: "10/01/2024",
      description: "Affordable spacious flats with sea views close to all daily amenities.",
      features: ["Sea View", "Close to Amenities", "Under Construction"],
      pricing: [
        { type: "1+ Flat", size: "43m²", price: "€37,500" },
        { type: "1+1 Flat", size: "74m²", price: "€61,000" }
      ],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4454/general/property-mersin-erdemli-general-4454-5.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "100 km",
      distanceToBeach: "1 km",
      facilities: ["Pool", "Sea View", "Turkish Bath"]
    },
    "4452": {
      id: "4452",
      title: "Flats for sale in a project with many opportunities in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€40,000",
      bedrooms: "1+ <> 1+1",
      bathrooms: "1",
      area: "40 <> 46m²",
      propertyType: "Apartments",
      refNo: "1341",
      buildingComplete: "12/01/2024",
      description: "Affordable flats in a project offering many investment opportunities.",
      features: ["Investment Opportunity", "Sea View", "Under Construction"],
      pricing: [
        { type: "1+ Flat", size: "40m²", price: "€40,000" },
        { type: "1+1 Flat", size: "46m²", price: "€43,000" }
      ],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4452/general/property-mersin-erdemli-general-4452-0.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "100 km",
      distanceToBeach: "1.2 km",
      facilities: ["Pool", "Turkish Bath", "Fitness"]
    },
    "4458": {
      id: "4458",
      title: "Apartments within walking distance to daily amenities and the sea are in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€62,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1",
      area: "70 <> 94m²",
      propertyType: "Apartments",
      refNo: "1346",
      buildingComplete: "12/01/2023",
      description: "Convenient apartments with easy access to daily amenities and beautiful sea views.",
      features: ["Daily Amenities Access", "Sea Views", "Under Construction"],
      pricing: [
        { type: "1+1 Flat", size: "70m²", price: "€62,000" },
        { type: "2+1 Flat", size: "94m²", price: "€85,000" }
      ],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4458/general/property-mersin-erdemli-general-4458-1.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "93 km",
      distanceToBeach: "0.5 km",
      facilities: ["Pool", "Water Slide", "Fitness"]
    },
    "3106": {
      id: "3106",
      title: "Spacious apartments in a luxury complex in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€77,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "71m²",
      propertyType: "Apartments",
      refNo: "1183",
      buildingComplete: "10/01/2023",
      description: "Spacious apartments in a luxury complex offering premium amenities and comfort.",
      features: ["Ready to Move", "Under Construction", "Luxury Complex"],
      pricing: [{ type: "1+1 Flat", size: "71m²", price: "€77,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3106/general/property-mersin-erdemli-general-3106-0.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "100 km",
      distanceToBeach: "0.4 km",
      facilities: ["Pool", "Elevator", "Parking"]
    },
    "3172": {
      id: "3172",
      title: "Apartments close to all daily amenities in Mersin, Mezitli",
      location: "Mersin, Mezitli",
      price: "€111,000",
      bedrooms: "2+1",
      bathrooms: "2",
      area: "70m²",
      propertyType: "Apartments",
      refNo: "1264",
      buildingComplete: "08/01/2023",
      description: "Convenient apartments with easy access to all daily amenities in Mezitli.",
      features: ["Daily Amenities Access", "Under Construction", "Convenient Location"],
      pricing: [{ type: "2+1 Flat", size: "70m²", price: "€111,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3172/general/property-mersin-mezitli-general-3172-0.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "65 km",
      distanceToBeach: "1 km",
      facilities: ["Pool", "Basketball Court", "Garden"]
    },
    "4536": {
      id: "4536",
      title: "Stylish apartments in a new site in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€58,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 2",
      area: "62 <> 115m²",
      propertyType: "Apartments",
      refNo: "3002",
      buildingComplete: "12/01/2025",
      description: "Stylish apartments with sea views in a new modern development site.",
      features: ["Sea View", "New Development", "Under Construction"],
      pricing: [
        { type: "1+1 Flat", size: "62m²", price: "€58,000" },
        { type: "2+1 Flat", size: "115m²", price: "€87,000" }
      ],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4536/general/apartment-319738.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "93 km",
      distanceToBeach: "0.6 km",
      facilities: ["Pool", "Turkish Bath", "Water Slide"]
    },
    "4432": {
      id: "4432",
      title: "Luxury apartments with sea view in the villas area in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€101,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "90m²",
      propertyType: "Apartments",
      refNo: "1333",
      buildingComplete: "09/01/2024",
      description: "Luxury apartments with stunning sea views located in an exclusive villa area.",
      features: ["Sea View", "Luxury Design", "Villa Area"],
      pricing: [{ type: "1+1 Flat", size: "90m²", price: "€101,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4432/general/property-mersin-erdemli-general-4432-3.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "92 km",
      distanceToBeach: "0.7 km",
      facilities: ["Pool", "Garden", "Cable TV"]
    },
    "4474": {
      id: "4474",
      title: "Villas suitable for citizenship in a luxury project in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€450,000",
      bedrooms: "4+1",
      bathrooms: "5",
      area: "179m²",
      propertyType: "Villas",
      refNo: "1358",
      buildingComplete: "12/01/2026",
      description: "Luxury villas suitable for Turkish citizenship in an exclusive project with premium amenities.",
      features: ["Turkish Citizenship", "Luxury Project", "Sea View"],
      pricing: [{ type: "4+1 Villa", size: "179m²", price: "€450,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4474/general/property-mersin-erdemli-general-4474-10.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "95 km",
      distanceToBeach: "0.5 km",
      facilities: ["Pool", "Tennis Court", "Restaurant"]
    },
    "4660": {
      id: "4660",
      title: "Stylish apartment with sea view in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€32,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "47m²",
      propertyType: "Apartments",
      refNo: "3014",
      buildingComplete: "07/01/2025",
      description: "Affordable stylish apartment with beautiful sea views in a peaceful location.",
      features: ["Sea View", "Affordable Price", "Under Construction"],
      pricing: [{ type: "1+1 Flat", size: "47m²", price: "€32,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4660/general/apartment-321786.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "110 km",
      distanceToBeach: "3 km",
      facilities: ["Elevator", "Sea View", "Parking"]
    },
    "3120": {
      id: "3120",
      title: "Stylish apartments with modern design in Mersin, Mezitli",
      location: "Mersin, Mezitli",
      price: "€96,000",
      bedrooms: "2+1",
      bathrooms: "2",
      area: "91m²",
      propertyType: "Apartments",
      refNo: "1204",
      buildingComplete: "06/01/2024",
      description: "Stylish apartments featuring modern design elements and sea views in Mezitli.",
      features: ["Sea View", "Modern Design", "Under Construction"],
      pricing: [{ type: "2+1 Flat", size: "91m²", price: "€96,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3120/general/property-mersin-mezitli-general-3120-0.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "105 km",
      distanceToBeach: "0.5 km",
      facilities: ["Pool", "Turkish Bath", "Tennis Court"]
    },
    "3150": {
      id: "3150",
      title: "Apartments from the project with many amenities in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€77,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 2",
      area: "69 <> 120m²",
      propertyType: "Apartments",
      refNo: "1237",
      buildingComplete: "08/01/2024",
      description: "Apartments in a project featuring numerous amenities and facilities for comfortable living.",
      features: ["Many Amenities", "Sea View", "Under Construction"],
      pricing: [
        { type: "1+1 Flat", size: "69m²", price: "€77,000" },
        { type: "2+1 Flat", size: "120m²", price: "€112,000" }
      ],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3150/general/property-mersin-erdemli-general-3150-0.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "95 km",
      distanceToBeach: "0.3 km",
      facilities: ["Pool", "Turkish Bath", "Fitness"]
    },
    "4457": {
      id: "4457",
      title: "Spacious apartments for sale within walking distance to the sea in Erdemli, Mersin",
      location: "Mersin, Erdemli",
      price: "€57,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "69m²",
      propertyType: "Apartments",
      refNo: "1345",
      buildingComplete: "08/01/2024",
      description: "Spacious apartments offering excellent value with easy walking access to the sea.",
      features: ["Walking Distance to Sea", "Spacious Design", "Sea View"],
      pricing: [{ type: "1+1 Flat", size: "69m²", price: "€57,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4457/general/property-mersin-erdemli-general-4457-0.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "88 km",
      distanceToBeach: "0.5 km",
      facilities: ["Pool", "Turkish Bath", "Water Slide"]
    },
    "4535": {
      id: "4535",
      title: "Spacious apartments within walking distance to the sea in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€57,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 2",
      area: "65 <> 120m²",
      propertyType: "Apartments",
      refNo: "3001",
      buildingComplete: "12/01/2025",
      description: "Spacious apartments with premium amenities and close proximity to the beautiful Mediterranean sea.",
      features: ["Sea Access", "Spacious Layout", "Premium Amenities"],
      pricing: [
        { type: "1+1 Flat", size: "65m²", price: "€57,000" },
        { type: "2+1 Flat", size: "120m²", price: "€86,000" }
      ],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4535/general/apartment-319717.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "92 km",
      distanceToBeach: "0.3 km",
      facilities: ["Pool", "Turkish Bath", "Spa"]
    },
    "4610": {
      id: "4610",
      title: "Luxury apartments close to the sea in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€60,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "53m²",
      propertyType: "Apartments",
      refNo: "3007",
      buildingComplete: "06/01/2025",
      description: "Luxury apartments offering premium living experience very close to the sea in Tömük region.",
      features: ["Near the Sea", "Luxury Design", "Prime Location"],
      pricing: [{ type: "1+1 Flat", size: "53m²", price: "€60,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4610/general/apartment-321047.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "90 km",
      distanceToBeach: "0.5 km",
      facilities: ["Pool", "Elevator", "Parking"]
    },
    "4672": {
      id: "4672",
      title: "Luxury apartments within walking distance of the sea in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€90,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "75m²",
      propertyType: "Apartments",
      refNo: "3016",
      buildingComplete: "11/01/2025",
      description: "Luxury apartments offering premium living experience within walking distance of the Mediterranean sea in Ayaş region.",
      features: ["Walking Distance to Sea", "Luxury Design", "Premium Location"],
      pricing: [{ type: "1+1 Flat", size: "75m²", price: "€90,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4672/general/apartment-321882.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "115 km",
      distanceToBeach: "0.1 km",
      facilities: ["Pool", "Cinema", "Fitness"]
    },
    "3285": {
      id: "3285",
      title: "Stylish apartments within walking distance to the sea in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€79,000",
      bedrooms: "2+1 <> 3+1",
      bathrooms: "2",
      area: "70 <> 94m²",
      propertyType: "Apartments",
      refNo: "1317",
      buildingComplete: "05/01/2026",
      description: "Stylish apartments with modern amenities and easy sea access in Erdemli.",
      features: ["Sea Access", "Stylish Design", "Modern Amenities"],
      pricing: [
        { type: "2+1 Flat", size: "70m²", price: "€79,000" },
        { type: "3+1 Flat", size: "94m²", price: "€94,000" }
      ],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3285/general/property-mersin-erdemli-general-3285-0.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "75 km",
      distanceToBeach: "0.2 km",
      facilities: ["Pool", "Football Field", "Water Slide"]
    },
    "4465": {
      id: "4465",
      title: "Luxury flats for sale within walking distance to the sea in Mersin, Mezitli",
      location: "Mersin, Mezitli",
      price: "€43,000",
      bedrooms: "1+",
      bathrooms: "1",
      area: "32m²",
      propertyType: "Apartments",
      refNo: "1350",
      buildingComplete: "12/01/2025",
      description: "Affordable luxury flats offering great value with sea access in Mezitli.",
      features: ["Sea View", "Affordable Luxury", "Walking Distance to Sea"],
      pricing: [{ type: "1+ Flat", size: "32m²", price: "€43,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4465/general/property-mersin-mezitli-general-4465-1.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "88 km",
      distanceToBeach: "0.3 km",
      facilities: ["Pool", "Turkish Bath", "Water Slide"]
    },
    "3104": {
      id: "3104",
      title: "New apartments from the project near the sea in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€200,000",
      bedrooms: "2+1",
      bathrooms: "2",
      area: "110m²",
      propertyType: "Apartments",
      refNo: "1180",
      buildingComplete: "12/01/2024",
      description: "Premium new apartments from an exclusive project located near the beautiful Mediterranean sea.",
      features: ["Near Sea", "New Project", "Premium Quality"],
      pricing: [{ type: "2+1 Flat", size: "110m²", price: "€200,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3104/general/property-mersin-erdemli-general-3104-0.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "100 km",
      distanceToBeach: "0.5 km",
      facilities: ["Pool", "Air Conditioning", "Garden"]
    },
    "3283": {
      id: "3283",
      title: "Apartments close to the sea suitable for investment and rental in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€48,000",
      bedrooms: "1+",
      bathrooms: "1",
      area: "39m²",
      propertyType: "Apartments",
      refNo: "1315",
      buildingComplete: "08/01/2025",
      description: "Affordable apartments ideal for investment and rental income close to the sea.",
      features: ["Investment Opportunity", "Rental Potential", "Sea Access"],
      pricing: [{ type: "1+ Flat", size: "39m²", price: "€48,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3283/general/property-mersin-erdemli-general-3283-0.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "70 km",
      distanceToBeach: "1 km",
      facilities: ["Pool", "Turkish Bath", "Restaurant"]
    },
    "3148": {
      id: "3148",
      title: "Properties close to daily amenities in Mersin, Mezitli",
      location: "Mersin, Mezitli",
      price: "€97,000",
      bedrooms: "2+1 <> 3+1",
      bathrooms: "2 <> 2",
      area: "95 <> 130",
      propertyType: "Apartments",
      refNo: "3148",
      buildingComplete: "12/01/2024",
      description: "Apartments for sale are located in Mersin, Mezitli, Tece Mahallesi. Tece neighborhood; It is a region established by the sea, which includes all daily needs such as cafes, restaurants, markets, market areas, parks, and is close to Mersin city center, offering the opportunity for a peaceful life to people.",
      features: ["Fire Alarm", "Backup Generator", "Open Car Park", "Pool", "Elevator", "Close to Bus Stop", "Pergolas", "From Developer", "Under Construction"],
      pricing: [{ type: "2+1 Flat", size: "95m²", price: "€97,000" }, { type: "3+1 Flat", size: "130m²", price: "€117,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3148/general/property-mersin-mezitli-general-3148-0.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "85 km",
      distanceToBeach: "0.5 km",
      facilities: ["Fire Alarm", "Backup Generator", "Open Car Park", "Pool", "Elevator"]
    },
    "3168": {
      id: "3168", 
      title: "Apartments in a complex with amenities close to the sea in Mersin, Mezitli",
      location: "Mersin, Mezitli",
      price: "€83,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 2", 
      area: "75 <> 120",
      propertyType: "Apartments",
      refNo: "3168",
      buildingComplete: "05/01/2024",
      description: "Nestled along the Mediterranean coast, Mersin is a real estate paradise waiting to be discovered.",
      features: ["Fire Alarm", "Security", "Camera System", "Backup Generator", "Garden", "Basketball Court", "Tennis Court", "Sauna", "Open Car Park", "Pool"],
      pricing: [{ type: "1+1 Flat", size: "75m²", price: "€83,000" }, { type: "2+1 Flat", size: "120m²", price: "€120,500" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3168/general/property-mersin-mezitli-general-3168-0.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "65 km",
      distanceToBeach: "1.8 km",
      facilities: ["Pool", "Gym", "Garden", "Security"]
    },
    "4613": {
      id: "4613",
      title: "Spacious apartments for sale in the center of the city in Mersin, Mezitli",
      location: "Mersin, Mezitli",
      price: "€74,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 2",
      area: "45 <> 70m²",
      propertyType: "Apartments",
      refNo: "3010",
      buildingComplete: "11/01/2025",
      description: "Spacious apartments in prime city center location with easy access to all amenities.",
      features: ["City Center", "Spacious Design", "Under Construction"],
      pricing: [
        { type: "1+1 Flat", size: "45m²", price: "€74,000" },
        { type: "2+1 Flat", size: "70m²", price: "€90,000" }
      ],
      images: ["https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4613/general/apartment-321097.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "80 km",
      distanceToBeach: "0.65 km",
      facilities: ["Pool", "Elevator", "Parking"]
    },
    "3181": {
      id: "3181",
      title: "Apartments within walking distance of daily amenities in Mersin, Mezitli",
      location: "Mersin, Mezitli",
      price: "€73,000",
      bedrooms: "2+1",
      bathrooms: "1",
      area: "74m²",
      propertyType: "Apartments",
      refNo: "1274",
      buildingComplete: "12/01/2024",
      description: "Nestled along the Mediterranean coast, Mersin is a real estate paradise waiting to be discovered. At Future Homes Turkey, we're your dedicated guides to this charming city, where sea-view apartments, flats, houses, and more are yours for the taking. Our goal? To provide you with all the information you need to make an informed choice.",
      features: ["Under Construction", "Daily Amenities", "Fire Alarm"],
      pricing: [{ type: "2+1 Flat", size: "74m²", price: "€73,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/pages/3181/general/property-mersin-mezitli-general-3181-16.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3181/general/property-mersin-mezitli-general-3181-2.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3181/general/property-mersin-mezitli-general-3181-3.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3181/general/property-mersin-mezitli-general-3181-4.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3181/general/property-mersin-mezitli-general-3181-5.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3181/general/property-mersin-mezitli-general-3181-6.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3181/general/property-mersin-mezitli-general-3181-7.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3181/general/property-mersin-mezitli-general-3181-9.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3181/plan/property-mersin-mezitli-plan-3181-0.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3181/general/property-mersin-mezitli-general-3181-8.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3181/general/property-mersin-mezitli-general-3181-0.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3181/general/property-mersin-mezitli-general-3181-1.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3181/general/property-mersin-mezitli-general-3181-10.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3181/general/property-mersin-mezitli-general-3181-11.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3181/general/property-mersin-mezitli-general-3181-12.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3181/general/property-mersin-mezitli-general-3181-13.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3181/general/property-mersin-mezitli-general-3181-14.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3181/general/property-mersin-mezitli-general-3181-15.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "60 km",
      distanceToBeach: "1 km",
      facilities: ["Fire Alarm", "Camera System", "Backup Generator", "Basketball Court", "Sauna", "Open Car Park", "Pool", "Elevator", "Turkish bath", "Close to Bus Stop", "Barbeque", "From Developer", "Under Construction"]
    },
    "3166": {
      id: "3166",
      title: "Luxury apartments in a hotel concept project in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€75,000",
      bedrooms: "1+1 <> 3+1",
      bathrooms: "1 <> 3",
      area: "70 <> 160m²",
      propertyType: "Apartments",
      refNo: "1256",
      buildingComplete: "05/01/2025",
      description: "Apartments for sale are located in Mersin, Erdemli, Tömük. Mersin is a tourism city known for its palm-lined walking paths, luxury hotels, restaurants, and developed infrastructure. It will soon host one of the Mediterranean's largest commercial ports and Turkey's 4th largest airport. Tömük, a beautiful town near Erdemli district center, offers all daily necessities.",
      features: ["Under Construction", "Hotel Concept", "Fire Alarm"],
      pricing: [
        { type: "1+1 Flat", size: "70m²", price: "€75,000" },
        { type: "2+1 Flat", size: "100m²", price: "€105,000" },
        { type: "3+1 Flat", size: "160m²", price: "€262,000" }
      ],
      images: ["https://cdn.futurehomesturkey.com/uploads/pages/3166/general/property-mersin-erdemli-general-3166-2.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3166/general/property-mersin-erdemli-general-3166-3.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3166/general/property-mersin-erdemli-general-3166-4.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3166/general/property-mersin-erdemli-general-3166-5.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3166/general/property-mersin-erdemli-general-3166-6.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3166/general/property-mersin-erdemli-general-3166-7.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3166/general/property-mersin-erdemli-general-3166-8.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3166/general/property-mersin-erdemli-general-3166-9.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3166/plan/property-mersin-erdemli-plan-3166-0.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3166/plan/property-mersin-erdemli-plan-3166-1.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3166/plan/property-mersin-erdemli-plan-3166-2.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3166/plan/property-mersin-erdemli-plan-3166-3.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3166/general/property-mersin-erdemli-general-3166-0.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3166/general/property-mersin-erdemli-general-3166-1.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3166/general/property-mersin-erdemli-general-3166-10.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3166/general/property-mersin-erdemli-general-3166-11.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3166/general/property-mersin-erdemli-general-3166-12.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3166/general/property-mersin-erdemli-general-3166-13.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3166/general/property-mersin-erdemli-general-3166-14.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3166/general/property-mersin-erdemli-general-3166-15.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3166/general/property-mersin-erdemli-general-3166-16.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3166/general/property-mersin-erdemli-general-3166-17.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3166/general/property-mersin-erdemli-general-3166-18.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "90 km",
      distanceToBeach: "0.2 km",
      facilities: ["Fire Alarm", "Security", "Camera System", "Backup Generator", "Garden", "Basketball Court", "Tennis Court", "Sauna", "Cinema", "Open Car Park", "Pool", "Turkish bath", "Indoor swimming pool", "Private garage", "Restaurant", "Baby Pool", "Barbeque", "Water Slide", "Pool bar", "Pergolas", "Fitness"]
    },
    "3144": {
      id: "3144",
      title: "Apartments close to daily amenities in Mersin, Mezitli",
      location: "Mersin, Mezitli",
      price: "€90,000",
      bedrooms: "2+1",
      bathrooms: "2",
      area: "95m²",
      propertyType: "Apartments",
      refNo: "1228",
      buildingComplete: "04/01/2024",
      description: "Nestled along the Mediterranean coast, Mersin is a real estate paradise waiting to be discovered. At Future Homes Turkey, we're your dedicated guides to this charming city, where sea-view apartments, flats, houses, and more are yours for the taking. Our goal? To provide you with all the information you need to make an informed choice.",
      features: ["Sea view", "Under Construction", "Fire Alarm"],
      pricing: [{ type: "2+1 Flat", size: "95m²", price: "€90,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/pages/3144/general/property-mersin-mezitli-general-3144-0.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3144/general/property-mersin-mezitli-general-3144-1.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3144/general/property-mersin-mezitli-general-3144-2.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3144/general/property-mersin-mezitli-general-3144-3.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3144/general/property-mersin-mezitli-general-3144-4.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3144/general/property-mersin-mezitli-general-3144-5.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3144/general/property-mersin-mezitli-general-3144-6.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3144/plan/property-mersin-mezitli-plan-3144-0.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "92 km",
      distanceToBeach: "0.6 km",
      facilities: ["Fire Alarm", "Backup Generator", "Open Car Park", "Pool", "Cable TV - Satellite", "Elevator", "Sea view", "City view", "City Center", "Pergolas", "From Developer", "Under Construction"]
    },
    "4604": {
      id: "4604",
      title: "Spacious apartments close to the city center in Mersin, Mezitli",
      location: "Mersin, Mezitli",
      price: "€290,000",
      bedrooms: "4+1",
      bathrooms: "3",
      area: "245m²",
      propertyType: "Apartments",
      refNo: "3004",
      buildingComplete: "10/01/2024",
      description: "Nestled along the Mediterranean coast, Mersin is a real estate paradise waiting to be discovered. At Future Homes Turkey, we're your dedicated guides to this charming city, where sea-view apartments, flats, houses, and more are yours for the taking. Our goal? To provide you with all the information you need to make an informed choice.",
      features: ["Spacious", "City Center", "Garden"],
      pricing: [{ type: "4+1 Flat", size: "245m²", price: "€290,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/pages/4604/general/apartment-320963.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4604/general/apartment-320962.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4604/general/apartment-320964.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4604/general/apartment-320965.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4604/general/apartment-320966.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4604/interior/apartment-320967.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4604/interior/apartment-320979.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4604/interior/apartment-320978.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4604/interior/apartment-320977.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4604/interior/apartment-320976.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4604/interior/apartment-320975.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4604/interior/apartment-320974.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4604/interior/apartment-320973.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4604/interior/apartment-320972.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4604/interior/apartment-320971.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4604/interior/apartment-320970.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4604/interior/apartment-320969.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4604/interior/apartment-320968.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4604/interior/apartment-320980.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4604/plan/apartment-320981.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "75 km",
      distanceToBeach: "2 km",
      facilities: ["Garden", "Pool", "City view", "Hot Offer", "From Developer"]
    },
    "3174": {
      id: "3174",
      title: "Stylish apartments close to the city center in Mersin, Mezitli",
      location: "Mersin",
      price: "€60,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "59m²",
      propertyType: "Apartments",
      refNo: "1266",
      buildingComplete: "12/01/2024",
      description: "Nestled along the Mediterranean coast, Mersin is a real estate paradise waiting to be discovered. At Future Homes Turkey, we're your dedicated guides to this charming city, where sea-view apartments, flats, houses, and more are yours for the taking. Our goal? To provide you with all the information you need to make an informed choice.",
      features: ["Under Construction", "City Center", "Fire Alarm"],
      pricing: [{ type: "1+1 Flat", size: "59m²", price: "€60,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/pages/3174/general/property-mersin-mezitli-general-3174-0.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3174/general/property-mersin-mezitli-general-3174-1.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3174/general/property-mersin-mezitli-general-3174-10.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3174/general/property-mersin-mezitli-general-3174-11.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3174/general/property-mersin-mezitli-general-3174-12.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3174/general/property-mersin-mezitli-general-3174-13.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3174/general/property-mersin-mezitli-general-3174-14.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3174/general/property-mersin-mezitli-general-3174-15.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3174/general/property-mersin-mezitli-general-3174-16.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3174/general/property-mersin-mezitli-general-3174-17.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3174/general/property-mersin-mezitli-general-3174-18.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3174/general/property-mersin-mezitli-general-3174-2.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3174/general/property-mersin-mezitli-general-3174-3.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3174/general/property-mersin-mezitli-general-3174-4.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3174/general/property-mersin-mezitli-general-3174-5.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3174/general/property-mersin-mezitli-general-3174-6.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3174/general/property-mersin-mezitli-general-3174-7.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3174/general/property-mersin-mezitli-general-3174-8.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3174/general/property-mersin-mezitli-general-3174-9.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3174/plan/property-mersin-mezitli-plan-3174-0.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "65 km",
      distanceToBeach: "1 km",
      facilities: ["Fire Alarm", "Backup Generator", "Garden", "Basketball Court", "Open Car Park", "Pool", "Elevator", "Close to Bus Stop", "Barbeque", "Pergolas", "From Developer", "Under Construction"]
    },
    "4406": {
      id: "4406",
      title: "Apartment close to daily amenities in Mersin, Yenisehir",
      location: "Mersin, Yenisehir",
      price: "€115,000",
      bedrooms: "2+1",
      bathrooms: "1",
      area: "80m²",
      propertyType: "Apartments",
      refNo: "1240",
      buildingComplete: "03/01/2023",
      description: "Nestled along the Mediterranean coast, Mersin is a real estate paradise waiting to be discovered. At Future Homes Turkey, we're your dedicated guides to this charming city, where sea-view apartments, flats, houses, and more are yours for the taking. Our goal? To provide you with all the information you need to make an informed choice.",
      features: ["Sea view", "Ready to Move", "Daily Amenities"],
      pricing: [{ type: "2+1 Flat", size: "80m²", price: "€115,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/pages/4406/general/property-mersin-yenisehir-general-4406-16.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4406/general/property-mersin-yenisehir-general-4406-17.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4406/general/property-mersin-yenisehir-general-4406-18.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4406/general/property-mersin-yenisehir-general-4406-2.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4406/general/property-mersin-yenisehir-general-4406-4.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4406/general/property-mersin-yenisehir-general-4406-5.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4406/general/property-mersin-yenisehir-general-4406-6.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4406/general/property-mersin-yenisehir-general-4406-7.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4406/general/property-mersin-yenisehir-general-4406-8.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4406/general/property-mersin-yenisehir-general-4406-9.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4406/general/property-mersin-yenisehir-general-4406-3.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4406/general/property-mersin-yenisehir-general-4406-0.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4406/general/property-mersin-yenisehir-general-4406-1.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4406/general/property-mersin-yenisehir-general-4406-10.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4406/general/property-mersin-yenisehir-general-4406-11.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4406/general/property-mersin-yenisehir-general-4406-12.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4406/general/property-mersin-yenisehir-general-4406-13.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4406/general/property-mersin-yenisehir-general-4406-14.webp", "https://cdn.futurehomesturkey.com/uploads/pages/4406/general/property-mersin-yenisehir-general-4406-15.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "60 km",
      distanceToBeach: "1.5 km",
      facilities: ["Backup Generator", "Garden", "Open Car Park", "Pool", "Elevator", "Sea view", "City view", "Ready to Move", "From Developer"]
    },
    "3156": {
      id: "3156",
      title: "Spacious apartments in a complex with sea view in Mersin, Mezitli",
      location: "Mersin",
      price: "€116,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "55m²",
      propertyType: "Apartments",
      refNo: "1246",
      buildingComplete: "03/01/2025",
      description: "Apartments for sale are located in Tece, Mersin, Mezitli. Tece is a region famous for its living spaces by the sea, containing luxury hotels, cafes, and restaurants. It is a 15-minute drive from Mersin city center and offers a calm and peaceful life. The city of Mersin is known for its expansion parallel to the sea, and Tece is frequently preferred by domestic and foreign investors for this reason.",
      features: ["Sea view", "Under Construction", "Fire Alarm"],
      pricing: [{ type: "1+1 Flat", size: "55m²", price: "€116,000" }],
      images: ["https://cdn.futurehomesturkey.com/uploads/pages/3156/general/property-mersin-mezitli-general-3156-2.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3156/general/property-mersin-mezitli-general-3156-0.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3156/general/property-mersin-mezitli-general-3156-1.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3156/general/property-mersin-mezitli-general-3156-10.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3156/general/property-mersin-mezitli-general-3156-11.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3156/general/property-mersin-mezitli-general-3156-12.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3156/general/property-mersin-mezitli-general-3156-13.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3156/general/property-mersin-mezitli-general-3156-14.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3156/general/property-mersin-mezitli-general-3156-15.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3156/general/property-mersin-mezitli-general-3156-16.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3156/general/property-mersin-mezitli-general-3156-17.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3156/general/property-mersin-mezitli-general-3156-18.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3156/general/property-mersin-mezitli-general-3156-19.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3156/general/property-mersin-mezitli-general-3156-3.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3156/general/property-mersin-mezitli-general-3156-4.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3156/general/property-mersin-mezitli-general-3156-5.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3156/general/property-mersin-mezitli-general-3156-6.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3156/general/property-mersin-mezitli-general-3156-7.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3156/general/property-mersin-mezitli-general-3156-8.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3156/general/property-mersin-mezitli-general-3156-9.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3156/plan/property-mersin-mezitli-plan-3156-0.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3156/plan/property-mersin-mezitli-plan-3156-1.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3156/plan/property-mersin-mezitli-plan-3156-2.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3156/plan/property-mersin-mezitli-plan-3156-3.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3156/plan/property-mersin-mezitli-plan-3156-4.webp", "https://cdn.futurehomesturkey.com/uploads/pages/3156/plan/property-mersin-mezitli-plan-3156-5.webp"],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "80 km",
      distanceToBeach: "0.2 km",
      facilities: ["Fire Alarm", "Wi-Fi in Facilities", "Security", "Garden", "Basketball Court", "Tennis Court", "Sauna", "Open Car Park", "Pool", "Market", "Cable TV - Satellite", "Sea view", "Turkish bath", "Restaurant", "Barbeque", "Water Slide", "Garage", "Pool bar", "Fitness", "From Developer", "Under Construction"]
    },
    "3163": {
      id: "3163",
      title: "Apartments within walking distance to the sea in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€58,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 2",
      area: "62 <> 89m²",
      propertyType: "Apartments",
      refNo: "1253",
      buildingComplete: "04/01/2025",
      description: "Apartments for sale are located in the Kocahasanlı District of Erdemli, Mersin. Erdemli is one of the central districts of Mersin, which has its own developed district center, hosts hospitals, banks, restaurants, cafes, market places, local shops, is 20 minutes' drive from Mersin city center, and is built on the seaside. The complex with apartments for sale consists of 2 blocks with 15 floors. It is designed to have 7 flats in each block in A block and 14 flats in each block in B block. Flat types with 1+1 62 m² gross area and 2+1 89 m² gross usage area are available in the complex.",
      features: ["Sea view", "Under Construction", "Walking distance to sea", "Modern design"],
      pricing: [
        { type: "1+1 Flat", size: "62m²", price: "€58,000" },
        { type: "2+1 Flat", size: "89m²", price: "€82,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3163/general/property-mersin-erdemli-general-3163-1.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3163/general/property-mersin-erdemli-general-3163-19.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3163/general/property-mersin-erdemli-general-3163-2.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3163/general/property-mersin-erdemli-general-3163-3.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3163/general/property-mersin-erdemli-general-3163-4.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3163/general/property-mersin-erdemli-general-3163-5.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "100 km",
      distanceToBeach: "0.5 km",
      facilities: ["Fire Alarm", "Security", "Backup Generator", "Open Car Park", "Pool", "Elevator", "Sea view", "Turkish bath", "Barbeque", "Pergolas", "From Developer", "Under Construction"]
    },
    "4609": {
      id: "4609",
      title: "Apartments for sale near the beach in Mersin, Mezitli",
      location: "Mersin, Mezitli",
      price: "€66,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 2",
      area: "53 <> 96m²",
      propertyType: "Apartments",
      refNo: "3006",
      buildingComplete: "09/01/2024",
      description: "The apartments for sale are located in Mersin Mezitli. Mezitli has become suitable for living thanks to its infrastructure that continues to develop day by day. The district, which stands out with its proximity to Mersin city center and Marina, is also a neighborhood established on the seaside that includes all needs such as hospitals, banks, public transportation stops, pharmacies, local markets, gyms, shopping malls.",
      features: ["Near the Sea", "Modern design", "Central location"],
      pricing: [
        { type: "1+1 Flat", size: "53m²", price: "€66,000" },
        { type: "2+1 Flat", size: "96m²", price: "€100,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4609/general/apartment-321025.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4609/interior/apartment-321034.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4609/interior/apartment-321035.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4609/interior/apartment-321036.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4609/general/apartment-321024.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4609/general/apartment-321026.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "60 km",
      distanceToBeach: "0.6 km",
      facilities: ["Fire Alarm", "Camera System", "Garden", "Open Car Park", "Pool", "Elevator", "City view", "Garage", "From Developer"]
    },
    "4405": {
      id: "4405",
      title: "Spacious apartments near the sea in Mersin, Mezitli",
      location: "Mersin, Mezitli",
      price: "€106,000",
      bedrooms: "2+1 <> 3+1",
      bathrooms: "1 <> 2",
      area: "100 <> 120m²",
      propertyType: "Apartments",
      refNo: "1233",
      buildingComplete: "12/01/2023",
      description: "Nestled along the Mediterranean coast, Mersin is a real estate paradise waiting to be discovered. At Future Homes Turkey, we're your dedicated guides to this charming city, where sea-view apartments, flats, houses, and more are yours for the taking. Our goal? To provide you with all the information you need to make an informed choice.",
      features: ["Sea view", "Under Construction", "Spacious", "Near sea"],
      pricing: [
        { type: "2+1 Flat", size: "100m²", price: "€106,000" },
        { type: "3+1 Flat", size: "120m²", price: "€135,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4405/general/property-mersin-mezitli-general-4405-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4405/general/property-mersin-mezitli-general-4405-1.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4405/general/property-mersin-mezitli-general-4405-10.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4405/general/property-mersin-mezitli-general-4405-11.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4405/general/property-mersin-mezitli-general-4405-2.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4405/general/property-mersin-mezitli-general-4405-3.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "92 km",
      distanceToBeach: "0.5 km",
      facilities: ["Fire Alarm", "Sauna", "Open Car Park", "Pool", "Turkish bath", "Barbeque", "Pergolas", "Fitness", "From Developer", "Under Construction"]
    },
    "3284": {
      id: "3284",
      title: "Apartments suitable for investment and rental in a hotel concept project in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€37,000",
      bedrooms: "1+ <> 1+1",
      bathrooms: "1 <> 1",
      area: "35 <> 60m²",
      propertyType: "Apartments",
      refNo: "1316",
      buildingComplete: "06/01/2025",
      description: "Nestled along the Mediterranean coast, Mersin is a real estate paradise waiting to be discovered. At Future Homes Turkey, we're your dedicated guides to this charming city, where sea-view apartments, flats, houses, and more are yours for the taking. Our goal? To provide you with all the information you need to make an informed choice.",
      features: ["Sea view", "Under Construction", "Hotel concept", "Investment opportunity"],
      pricing: [
        { type: "1+ Flat", size: "35m²", price: "€37,000" },
        { type: "1+1 Flat", size: "60m²", price: "€58,500" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3284/general/property-mersin-erdemli-general-3284-1.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3284/general/property-mersin-erdemli-general-3284-17.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3284/general/property-mersin-erdemli-general-3284-2.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3284/general/property-mersin-erdemli-general-3284-3.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3284/general/property-mersin-erdemli-general-3284-4.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3284/general/property-mersin-erdemli-general-3284-5.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "70 km",
      distanceToBeach: "1.0 km",
      facilities: ["Garden", "Pool", "Open Car Park", "Turkish bath", "Sauna", "Fitness", "Fire Alarm", "Backup Generator", "Basketball Court", "Water Slide", "Pergolas", "Elevator", "From Developer", "Under Construction"]
    },
    "3287": {
      id: "3287",
      title: "Spacious apartments close to daily needs in Mersin, Mezitli",
      location: "Mersin, Mezitli",
      price: "€76,000",
      bedrooms: "2+1",
      bathrooms: "1",
      area: "69m²",
      propertyType: "Apartments",
      refNo: "1318",
      buildingComplete: "05/01/2024",
      description: "Nestled along the Mediterranean coast, Mersin is a real estate paradise waiting to be discovered. At Future Homes Turkey, we're your dedicated guides to this charming city, where sea-view apartments, flats, houses, and more are yours for the taking. Our goal? To provide you with all the information you need to make an informed choice.",
      features: ["Sea view", "Under Construction", "Close to amenities", "Spacious"],
      pricing: [
        { type: "2+1 Flat", size: "69m²", price: "€76,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3287/general/property-mersin-mezitli-general-3287-1.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3287/general/property-mersin-mezitli-general-3287-18.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3287/general/property-mersin-mezitli-general-3287-19.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3287/general/property-mersin-mezitli-general-3287-2.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3287/general/property-mersin-mezitli-general-3287-3.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3287/general/property-mersin-mezitli-general-3287-4.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "75 km",
      distanceToBeach: "0.5 km",
      facilities: ["Fire Alarm", "Backup Generator", "Open Car Park", "Pool", "Elevator", "City view", "Close to Bus Stop", "Pergolas", "From Developer", "Under Construction"]
    },
    "3175": {
      id: "3175",
      title: "Spacious apartments with sea view in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€70,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 2",
      area: "74 <> 99m²",
      propertyType: "Apartments",
      refNo: "1268",
      buildingComplete: "06/01/2024",
      description: "Nestled along the Mediterranean coast, Mersin is a real estate paradise waiting to be discovered. At Future Homes Turkey, we're your dedicated guides to this charming city, where sea-view apartments, flats, houses, and more are yours for the taking. Our goal? To provide you with all the information you need to make an informed choice.",
      features: ["Sea view", "Under Construction", "Spacious", "Modern design"],
      pricing: [
        { type: "1+1 Flat", size: "74m²", price: "€70,000" },
        { type: "2+1 Flat", size: "99m²", price: "€90,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3175/general/property-mersin-erdemli-general-3175-1.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3175/general/property-mersin-erdemli-general-3175-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3175/general/property-mersin-erdemli-general-3175-10.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3175/general/property-mersin-erdemli-general-3175-11.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3175/general/property-mersin-erdemli-general-3175-12.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3175/general/property-mersin-erdemli-general-3175-13.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "70 km",
      distanceToBeach: "0.6 km",
      facilities: ["Fire Alarm", "Garden", "Basketball Court", "Sauna", "Cinema", "Open Car Park", "Pool", "Elevator", "Sea view", "Turkish bath", "Close to Bus Stop", "Barbeque", "Pergolas", "Fitness", "From Developer", "Under Construction"]
    },
    "3108": {
      id: "3108",
      title: "Apartments within walking distance of daily amenities in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€65,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "65m²",
      propertyType: "Apartments",
      refNo: "1185",
      buildingComplete: "12/01/2024",
      description: "Nestled along the Mediterranean coast, Mersin is a real estate paradise waiting to be discovered. At Future Homes Turkey, we're your dedicated guides to this charming city, where sea-view apartments, flats, houses, and more are yours for the taking. Our goal? To provide you with all the information you need to make an informed choice.",
      features: ["Sea view", "Under Construction", "Walking distance to amenities"],
      pricing: [
        { type: "1+1 Flat", size: "60m²", price: "€65,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3108/general/property-mersin-erdemli-general-3108-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3108/general/property-mersin-erdemli-general-3108-16.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3108/general/property-mersin-erdemli-general-3108-2.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3108/general/property-mersin-erdemli-general-3108-3.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3108/general/property-mersin-erdemli-general-3108-4.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3108/general/property-mersin-erdemli-general-3108-5.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "35 km",
      distanceToBeach: "0.5 km",
      facilities: ["Garden", "Pool", "City view", "Under Construction"]
    },
    "4611": {
      id: "4611",
      title: "Stylish apartments within walking distance to the beach in Mersin, Erdemli",
      location: "Mersin, Erdemli",
      price: "€62,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "50m²",
      propertyType: "Apartments",
      refNo: "3008",
      buildingComplete: "07/01/2025",
      description: "The apartments for sale are located in Mersin, Erdemli. Erdemli has become an attractive place for those who want to be surrounded by nature and benefit from modern living opportunities. Erdemli's rapid development offers a unique opportunity for investment. Erdemli has become a favorite for a peaceful life due to its location and ease of access to daily amenities.",
      features: ["Under Construction", "Near the Sea", "Stylish design", "Walking distance to beach"],
      pricing: [
        { type: "1+1 Flat", size: "50m²", price: "€62,000" }
      ],
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4611/general/apartment-321061.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4611/interior/apartment-321070.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4611/interior/apartment-321075.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4611/interior/apartment-321069.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4611/general/apartment-321060.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4611/general/apartment-321062.webp"
      ],
      agent: "Ervina Köksel",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "80 km",
      distanceToBeach: "0.3 km",
      facilities: ["Garden", "Pool", "Fire Alarm", "Gym", "Open Car Park", "Elevator", "Garage", "Massage room", "Fitness", "Luxury", "From Developer", "Under Construction"]
    },
    "4675": {
      id: "4675",
      title: "Luxury apartments with modern design in Antalya, Altıntaş",
      location: "Antalya, Altintas",
      price: "€135,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "53m²",
      propertyType: "Apartments",
      refNo: "1398",
      description: "Apartments for sale are located in the Altıntaş region of Aksu, Antalya. The Altıntaş region of Aksu district in Antalya has become an important location that has attracted the attention of real estate investors in recent years.",
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4675/general/apartment-321950.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4675/general/apartment-321951.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4675/general/apartment-321952.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "6 km",
      distanceToBeach: "5 km",
      facilities: ["Security Alarm System", "Garden", "Sauna", "Open Car Park", "Pool", "Cable TV - Satellite", "Elevator", "Baby Pool", "Disabled-Friendly", "Garage", "Fitness", "Hot Offer", "Luxury", "From Developer", "New Building", "Under Construction"]
    },
    "4640": {
      id: "4640",
      title: "Luxury apartments in a complex with pool in Antalya, Muratpaşa",
      location: "Antalya, Muratpaşa",
      price: "€73,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "50m²",
      propertyType: "Apartments",
      refNo: "1384",
      description: "The apartments for sale are located in Dutlubahçe Neighborhood of Antalya, Muratpaşa. Dutlubahçe Neighborhood is a central neighborhood with social amenities such as schools, banks, public bazaar, ATMs, markets, restaurants, cafes, and bus stops.",
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4640/general/apartment-321490.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4640/general/apartment-321492.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4640/general/apartment-321491.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "15 km",
      distanceToBeach: "4 km",
      facilities: ["Security Alarm System", "Camera System", "Backup Generator", "Garden", "Open Car Park", "Pool", "Cable TV - Satellite", "Elevator", "Close to Bus Stop", "City Center", "Disabled-Friendly", "Hot Offer", "Luxury", "From Developer", "New Building", "Under Construction"]
    },
    "4662": {
      id: "4662",
      title: "Luxury apartments with modern design in Antalya, Altıntaş",
      location: "Antalya, Altintas",
      price: "€105,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "40m²",
      propertyType: "Apartments",
      refNo: "1396",
      description: "Apartments for sale are located in Altıntaş neighborhood, Aksu district of Antalya. Altıntaş neighborhood has been attracting the attention of real estate investors, especially in recent years, thanks to increasing infrastructure investments and its proximity to the airport.",
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4662/general/luxury-apartments-with-modern-design-in-antalya-altintas-321815.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4662/general/luxury-apartments-with-modern-design-in-antalya-altintas-321826.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/4662/general/luxury-apartments-with-modern-design-in-antalya-altintas-321818.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "6 km",
      distanceToBeach: "9 km",
      facilities: ["Camera System", "Backup Generator", "Sauna", "Open Car Park", "Pool", "Cable TV - Satellite", "Elevator", "Baby Pool", "Disabled-Friendly", "Garage", "Fitness", "Hot Offer", "Luxury", "From Developer", "New Building", "Under Construction", "EXCLUSIVE"]
    },
    "3127": {
      id: "3127",
      title: "Centrally located modern apartments in Antalya, Altintas",
      location: "Antalya, Aksu",
      price: "€165,000",
      bedrooms: "2+1",
      bathrooms: "1",
      area: "74m²",
      propertyType: "Apartments",
      refNo: "1211",
      description: "Apartments for sale are located in Antalya, Altıntaş. Altintas region; It is the new investment center of the city, which is on its way to become one of the most elite districts of the city after a few years.",
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3127/general/property-antalya-aksu-general-3127-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3127/general/property-antalya-aksu-general-3127-3.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3127/general/property-antalya-aksu-general-3127-4.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "4 km",
      distanceToBeach: "7 km",
      facilities: ["Fire Alarm", "Security", "Camera System", "Backup Generator", "Garden", "Open Car Park", "Pool", "Elevator", "City view", "Close to Bus Stop", "City Center", "From Developer", "For Residence Permit", "Under Construction"]
    },
    "3222": {
      id: "3222",
      title: "Apartments in a modern designed project in Antalya, Altintas",
      location: "Antalya, Aksu",
      price: "€135,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "65m²",
      propertyType: "Apartments",
      refNo: "1288",
      description: "Apartments for sale are located in Antalya, Altıntaş. Altıntaş is the new investment area of the city, which is developing rapidly thanks to the housing projects in the region.",
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3222/general/property-antalya-aksu-general-3222-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3222/general/property-antalya-aksu-general-3222-1.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3222/general/property-antalya-aksu-general-3222-10.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "3 km",
      distanceToBeach: "6 km",
      facilities: ["Garden", "Pool", "Cable TV - Satellite", "From Developer", "Under Construction", "Basketball Court", "Sauna", "Baby Pool", "Water Slide", "Garage", "Fitness"]
    },
    "3197": {
      id: "3197",
      title: "Apartments for sale in a modern architectural project in Antalya, Kepez",
      location: "Antalya, Kepez",
      price: "€160,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "43m²",
      propertyType: "Apartments",
      refNo: "1276",
      description: "Apartments for sale are located in Zeytinlik District of Kepez, Antalya. Kepez; It is one of the central districts of Antalya, which attracts attention with its developed infrastructure and meeting the growth needs of the city.",
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3197/general/property-antalya-kepez-general-3197-1.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3197/general/property-antalya-kepez-general-3197-18.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3197/general/property-antalya-kepez-general-3197-19.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "9 km",
      distanceToBeach: "13 km",
      facilities: ["Garden", "Pool", "Cable TV - Satellite", "City view", "Smart-Home System", "From Developer", "New Building"]
    },
    "3204": {
      id: "3204",
      title: "Apartments for sale in a luxury complex in Antalya, Altintas",
      location: "Antalya, Aksu",
      price: "€150,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "60m²",
      propertyType: "Apartments",
      refNo: "1279",
      description: "Apartments for sale are located in Antalya, Altıntaş. It is located right next to Antalya International Airport, five minutes' drive from the city's big shopping centers.",
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3204/general/property-antalya-aksu-general-3204-1.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3204/general/property-antalya-aksu-general-3204-3.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3204/general/property-antalya-aksu-general-3204-4.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "5 km",
      distanceToBeach: "7 km",
      facilities: ["Fire Alarm", "Camera System", "Backup Generator", "Air Conditioning", "Sauna", "Open Car Park", "Pool", "Cable TV - Satellite", "Elevator", "Floor heating", "Private garage", "Baby Pool", "Caretaker", "Garage", "Fitness", "From Developer", "Under Construction"]
    },
    "3184": {
      id: "3184",
      title: "Twin villas with launch price in new project in Antalya, Kemer",
      location: "Antalya, Kemer",
      price: "€350,000",
      bedrooms: "3+1",
      bathrooms: "2",
      area: "115m²",
      propertyType: "Villas",
      refNo: "1275",
      description: "Villas for sale are located in Göynük, Kemer, Antalya. Goynuk; Located close to the city center of Antalya, famous for its natural beauties, canyons, uninterrupted beaches and coves.",
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3184/general/property-antalya-kemer-general-3184-0.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3184/general/property-antalya-kemer-general-3184-1.webp",
        "https://cdn.futurehomesturkey.com/uploads/pages/3184/general/property-antalya-kemer-general-3184-10.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "50 km",
      distanceToBeach: "1 km",
      facilities: ["Fire Alarm", "Garden", "Open Car Park", "Pool", "Nature view", "Baby Pool", "From Developer"]
    },
    "4545": {
      id: "4545",
      title: "Ready to move-in apartments in a boutique apartment building in Antalya, Muratpaşa",
      location: "Antalya, Muratpaşa",
      price: "€105,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "60m²",
      propertyType: "Apartments",
      refNo: "1376",
      description: "Apartments for sale are located in Guzeloba Neighborhood, Muratpasa, Antalya. Guzeloba neighborhood is neighboring Lara, one of the most famous and deep-rooted neighborhoods of the city.",
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4545/general/apartment-319909.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "9 km",
      distanceToBeach: "1 km",
      facilities: ["Pool", "Ready to Move"]
    },
    "4410": {
      id: "4410",
      title: "Spacious apartments in a modern designed project in Antalya, Altıntaş",
      location: "Antalya, Aksu",
      price: "€202,000",
      bedrooms: "2+1",
      bathrooms: "1",
      area: "85m²",
      propertyType: "Apartments",
      refNo: "1327",
      description: "Apartments for sale are located in Altıntaş, which is connected to the Aksu district of Antalya. It is a district that hosts the city's luxury and newest housing projects.",
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4410/general/property-antalya-aksu-general-4410-0.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "4 km",
      distanceToBeach: "8 km",
      facilities: ["Pool", "Basketball Court", "Tennis Court", "Aqua Park", "From Developer", "Under Construction"]
    },
    "4638": {
      id: "4638",
      title: "Luxury apartments for sale in a central location in Antalya, Muratpaşa",
      location: "Antalya, Muratpaşa",
      price: "€105,000",
      bedrooms: "2+1",
      bathrooms: "2",
      area: "70m²",
      propertyType: "Apartments",
      refNo: "1382",
      description: "The apartments for sale are located in Güvenlik neighborhood of Muratpaşa, Antalya. Muratpaşa is an ideal option in terms of both quality of life and investment potential.",
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4638/general/apartment-321462.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "17 km",
      distanceToBeach: "3 km",
      facilities: ["Pool", "Security", "From Developer", "Under Construction"]
    },
    "4514": {
      id: "4514",
      title: "Ultra luxury villa in nature with a unique view in Antalya, Geyikbayırı",
      location: "Antalya, Konyaalti",
      price: "€790,000",
      bedrooms: "4+1",
      bathrooms: "3",
      area: "300m²",
      propertyType: "Villas",
      refNo: "1360",
      description: "The villa for sale is located in Antalya, Geyikbayırı region. This area is a villa area set in nature, 20 minutes away from the city center.",
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4514/general/apartment-319390.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "37 km",
      distanceToBeach: "20 km",
      facilities: ["Pool", "Garden", "Private Pool", "Sea view", "Ready to Move", "For Residence Permit", "Furnished"]
    },
    "3107": {
      id: "3107",
      title: "Apartments in a luxury complex in Antalya, Konyaaltı",
      location: "Antalya, Konyaalti",
      price: "€220,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "60m²",
      propertyType: "Apartments",
      refNo: "1184",
      description: "Apartments for sale are located in Antalya, Konyaaltı, Sarısu Neighborhood. Konyaaltı region is a decent district of Antalya, suitable for living and investment.",
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3107/general/property-antalya-konyaalti-general-3107-2.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "25 km",
      distanceToBeach: "1 km",
      facilities: ["Pool", "Indoor swimming pool", "Sauna", "Steam room", "Fitness", "Security", "For Residence Permit"]
    },
    "3140": {
      id: "3140",
      title: "Apartments suitable for citizenship in a stylish project in Antalya, Altintas",
      location: "Antalya, Aksu",
      price: "€167,500",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "42m²",
      propertyType: "Apartments",
      refNo: "1224",
      description: "Apartments for sale are located in Antalya, Aksu, Altıntaş Neighborhood. Altıntaş is an area suitable for investment, which stands out with its housing projects.",
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3140/general/property-antalya-aksu-general-3140-0.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "4.5 km",
      distanceToBeach: "3.5 km",
      facilities: ["Pool", "Indoor swimming pool", "Fitness", "Spa", "Basketball Court", "Sea view", "For Residence Permit", "Under Construction"]
    },
    "4397": {
      id: "4397",
      title: "Spacious apartments with terrace and pool in Antalya, Altıntaş",
      location: "Antalya, Aksu",
      price: "€155,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "45m²",
      propertyType: "Apartments",
      refNo: "1324",
      description: "Apartments for sale are located in the Altıntaş region of Aksu district, Antalya. Thanks to the new zoning plan, it is a region that has become the favorite of construction companies and investors.",
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4397/general/property-antalya-aksu-general-4397-2.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "2.5 km",
      distanceToBeach: "6 km",
      facilities: ["Pool", "Baby Pool", "Fitness", "Sauna", "Sports field", "Security", "From Developer", "Under Construction"]
    },
    "4676": {
      id: "4676",
      title: "Luxury apartments with stylish designs in Antalya, Altıntaş",
      location: "Antalya, Altintas",
      price: "€130,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "55m²",
      propertyType: "Apartments",
      refNo: "1399",
      description: "The apartments for sale are located in Altıntaş neighborhood, which is part of Aksu district in Antalya. Altıntaş neighborhood has undergone rapid development in recent years and has become an important real estate hub.",
      images: [
        "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4676/general/apartment-321966.webp"
      ],
      agent: "Batuhan Kunt",
      contactPhone: "+905523032750",
      contactEmail: "info@futurehomesturkey.com",
      distanceToAirport: "8 km",
      distanceToBeach: "6 km",
      facilities: ["Pool", "Fitness", "Sauna", "Private garden", "Floor heating", "From Developer", "Under Construction"]
    }
    
    
  };

  return properties[id] || null;
};

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  
  console.log('PropertyDetail: Loading property with ID:', id);
  const [property, setProperty] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [galleryImageIndex, setGalleryImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // No longer using useProperty hook to avoid re-render issues

  // Helper function to extract and format prices
  const formatPropertyPrice = (priceString: string): string => {
    const numericValue = parseInt(priceString.replace(/[€$£,₺₽₨﷼kr]/g, ''));
    if (isNaN(numericValue)) return priceString;
    return formatPrice(numericValue);
  };

  useEffect(() => {
    const loadPropertyData = async () => {
      if (!id) {
        console.log('PropertyDetail: No ID provided');
        setError('No property ID provided');
        setLoading(false);
        return;
      }

      console.log('PropertyDetail: Starting to load property with ID:', id);

      // Simple redirect for known missing properties
      const propertyRedirects: Record<string, string> = {
        '3002': '3006',
        '3001': '3006',
        '3003': '3008',
        '3004': '3009',
        '3005': '3010'
      };
      
      const actualId = propertyRedirects[id] || id;
      if (propertyRedirects[id]) {
        console.log(`PropertyDetail: Redirecting ${id} to ${actualId}`);
        navigate(`/property/${actualId}`, { replace: true });
        return;
      }

      // Validate the property ID

      try {
        setLoading(true);
        setError(null);
        
        // Get property data from static sources, pass location context
        const fromLocation = location.state?.from || '';
        const propertyData = await getPropertyData(actualId, fromLocation);
        
        if (!propertyData) {
          console.log('PropertyDetail: No property data found for ID:', id);
          setError(`Property with ID "${id}" not found`);
        } else {
          console.log('PropertyDetail: Property data loaded successfully:', propertyData);
          setProperty(propertyData);
        }
      } catch (err) {
        console.error('Error loading property:', err);
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };
    
    // Always load property data, but handle loading state properly
    loadPropertyData();
  }, [id]); // Only depend on id to avoid infinite re-renders

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const openImageGallery = (index: number = 0) => {
    setGalleryImageIndex(index);
    setShowImageGallery(true);
  };

  const nextGalleryImage = () => {
    if (property?.images) {
      setGalleryImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Keyboard navigation for gallery
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showImageGallery) {
        if (e.key === 'Escape') {
          setShowImageGallery(false);
        } else if (e.key === 'ArrowLeft') {
          prevGalleryImage();
        } else if (e.key === 'ArrowRight') {
          nextGalleryImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showImageGallery]);

  const prevGalleryImage = () => {
    if (property?.images) {
      setGalleryImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  // Show loading state with better error handling
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-xl text-muted-foreground">Loading property details...</div>
        </div>
      </div>
    );
  }

  // Show error state with suggestions
  if (error) {
    const displayError = error;
    
    // Suggest similar properties based on the failed ID
    const getSimilarProperties = (failedId: string) => {
      const prefix = failedId.substring(0, 2);
      return [
        { id: '3006', title: 'Modern Apartment in Antalya', price: '€89,000' },
        { id: '3008', title: 'Luxury Villa with Sea View', price: '€125,000' },
        { id: '3009', title: 'Beachfront Apartment', price: '€95,000' },
        { id: '3010', title: 'City Center Apartment', price: '€75,000' },
        { id: '3011', title: 'Garden Apartment', price: '€85,000' }
      ].filter(p => p.id.startsWith(prefix)).slice(0, 3);
    };
    
    const suggestions = getSimilarProperties(id || '');
    
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-foreground mb-4">Property Not Found</h1>
            <p className="text-muted-foreground mb-6">{displayError}</p>
            
            {suggestions.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Similar Properties You Might Like:</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {suggestions.map((prop) => (
                    <Card key={prop.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-2">{prop.title}</h3>
                        <p className="text-primary font-semibold mb-3">{prop.price}</p>
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => navigate(`/property/${prop.id}`)}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/properties')} 
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Browse All Properties
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/antalya')}
              >
                View Antalya Properties
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Property Not Found</h1>
            <p className="text-muted-foreground mb-6">The property you're looking for doesn't exist.</p>
            <button 
              onClick={() => navigate('/properties')} 
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  const agent = getAgentData(property.agent);

  // Timeline data for property details
  const timelineData = [
    {
      title: "About This Property",
      content: (
        <div className="space-y-6">
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 shadow-lg">
            <div className="text-muted-foreground leading-relaxed mb-6 text-sm md:text-base">
              {property.description || "Beskrivning saknas..."}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Plane className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">Distance to Airport</div>
                  <div className="font-semibold text-foreground text-sm">{property.distanceToAirport}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500/10 to-blue-500/5 rounded-xl">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Waves className="w-5 h-5 text-blue-500" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">Distance to Beach</div>
                  <div className="font-semibold text-foreground text-sm">{property.distanceToBeach}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Amenities",
      content: (
        <div className="space-y-6">
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {property.facilities?.map((facility: string, index: number) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-lg hover:from-green-500/20 hover:to-green-500/10 transition-all duration-300">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs font-medium text-foreground break-words leading-tight">{facility}</span>
                </div>
              ))}
            </div>
            
            {property.features?.some((feature: string) => feature.includes("Award")) && (
              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground text-sm">Award-Winning Complex</div>
                    <div className="text-xs text-muted-foreground">This property has received recognition for excellence in design and amenities</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Pricing",
      content: (
        <div className="space-y-6">
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 shadow-lg">
            <div className="space-y-4">
              {property.pricing?.map((item: any, index: number) => (
                <div key={index} className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20 hover:from-primary/10 hover:to-primary/15 transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <div className="min-w-0 flex-1 mr-4">
                      <div className="font-semibold text-foreground text-sm">{item.type}</div>
                      <div className="text-xs text-muted-foreground">{item.size}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold text-primary">{formatPropertyPrice(item.price)}</div>
                      <div className="text-xs text-muted-foreground">Starting price</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="font-semibold text-foreground text-sm">Investment Opportunity</span>
              </div>
              <p className="text-xs text-muted-foreground">
                This property offers excellent investment potential with strong rental yields and capital appreciation prospects in the growing Turkish real estate market.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Add Google Maps section if available
  if (property.google_maps_embed) {
    timelineData.push({
      title: "Location Map",
      content: (
        <div className="space-y-6">
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 shadow-lg">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Explore the property location and surrounding area
              </p>
            </div>
            <div className="rounded-xl overflow-hidden border border-border/50 shadow-md">
              <div 
                className="w-full h-96 [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                dangerouslySetInnerHTML={{ __html: property.google_maps_embed }}
              />
            </div>
          </div>
        </div>
      ),
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              // Smart navigation based on property location
              const getLocationRoute = (location: string) => {
                const locationLower = location.toLowerCase();
                if (locationLower.includes('antalya')) return '/antalya';
                if (locationLower.includes('dubai')) return '/dubai';
                if (locationLower.includes('mersin')) return '/mersin';
                if (locationLower.includes('cyprus') || locationLower.includes('kyrenia') || locationLower.includes('famagusta')) return '/cyprus';
                if (locationLower.includes('france') || locationLower.includes('cannes') || locationLower.includes('nice')) return '/france';
                return '/properties';
              };

              // Try to navigate back to the referrer first
              const fromPath = (location.state as any)?.from;
              if (fromPath && fromPath !== '/properties') {
                navigate(fromPath);
              } else if (property?.location) {
                // Navigate to the appropriate city page based on property location
                const targetRoute = getLocationRoute(property.location);
                navigate(targetRoute);
              } else {
                // Fallback to all properties
                navigate('/properties');
              }
            }}
            className="text-muted-foreground hover:text-foreground h-8 px-3 text-sm"
          >
            <ArrowLeft className="w-3 h-3 mr-1" />
            {(() => {
              const getLocationName = (location: string) => {
                const locationLower = location?.toLowerCase() || '';
                if (locationLower.includes('antalya')) return 'Antalya Properties';
                if (locationLower.includes('dubai')) return 'Dubai Properties';
                if (locationLower.includes('mersin')) return 'Mersin Properties';
                if (locationLower.includes('cyprus') || locationLower.includes('kyrenia') || locationLower.includes('famagusta')) return 'Cyprus Properties';
                if (locationLower.includes('france') || locationLower.includes('cannes') || locationLower.includes('nice')) return 'France Properties';
                return 'All Properties';
              };
              return `Back to ${getLocationName(property?.location || '')}`;
            })()}
          </Button>
        </div>

        {/* Hero Section */}
        <div className="mb-8">
          <div className="mb-4">
            <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              {property.title}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{property.location}</span>
              </div>
              <Badge variant="outline" className="border-primary/20 text-primary text-xs">REF: {property.refNo}</Badge>
            </div>
          </div>
          
          <div className="text-2xl md:text-3xl font-bold text-primary mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Starting from {formatPropertyPrice(property.price)}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery - Main Column */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="relative group mb-6 rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[16/10] bg-muted">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[currentImageIndex]}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No images available
                  </div>
                )}
                
                {/* Navigation Arrows */}
                {property.images && property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                  </>
                )}
                
                {/* Image Counter */}
                {property.images && property.images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                    {currentImageIndex + 1} / {property.images.length}
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Grid */}
            {property.images && property.images.length > 1 && (
              <div className="grid grid-cols-6 gap-2 mb-8">
                {property.images.slice(0, 6).map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                      index === currentImageIndex 
                        ? 'border-primary shadow-lg shadow-primary/25' 
                        : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                     <img
                       src={image}
                       alt={`${property.title} ${index + 1}`}
                       className="w-full h-full object-cover"
                     />
                   </button>
                 ))}
                 
                 {/* View All Images Button */}
                 {property.images.length > 6 && (
                   <button
                     onClick={() => openImageGallery(0)}
                     className="aspect-square rounded-lg border-2 border-dashed border-primary/50 hover:border-primary bg-primary/5 hover:bg-primary/10 transition-all flex flex-col items-center justify-center text-primary hover:scale-105"
                   >
                     <Images className="w-4 h-4 mb-1" />
                     <span className="text-xs font-medium">+{property.images.length - 6}</span>
                   </button>
                 )}
               </div>
             )}

             {/* View All Images Button for all cases */}
             {property.images && property.images.length > 1 && (
               <div className="mb-8">
                 <Button
                   onClick={() => openImageGallery(currentImageIndex)}
                   variant="outline"
                   className="w-full sm:w-auto"
                 >
                   <Images className="w-4 h-4 mr-2" />
                   View All {property.images.length} Images
                 </Button>
               </div>
             )}

            {/* Property Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-2xl text-center border border-primary/20 hover:from-primary/15 hover:to-primary/10 transition-all duration-300">
                <div className="flex justify-center mb-2">
                  <Bed className="w-6 h-6 text-primary" />
                </div>
                <div className="text-xs text-muted-foreground mb-1">Bedrooms</div>
                <div className="font-bold text-foreground text-sm">{property.bedrooms}</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-4 rounded-2xl text-center border border-blue-500/20 hover:from-blue-500/15 hover:to-blue-500/10 transition-all duration-300">
                <div className="flex justify-center mb-2">
                  <Bath className="w-6 h-6 text-blue-500" />
                </div>
                <div className="text-xs text-muted-foreground mb-1">Bathrooms</div>
                <div className="font-bold text-foreground text-sm">{property.bathrooms}</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 p-4 rounded-2xl text-center border border-green-500/20 hover:from-green-500/15 hover:to-green-500/10 transition-all duration-300">
                <div className="flex justify-center mb-2">
                  <Square className="w-6 h-6 text-green-500" />
                </div>
                <div className="text-xs text-muted-foreground mb-1">Area</div>
                <div className="font-bold text-foreground text-sm">{property.area}</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 p-4 rounded-2xl text-center border border-orange-500/20 hover:from-orange-500/15 hover:to-orange-500/10 transition-all duration-300">
                <div className="flex justify-center mb-2">
                  <Calendar className="w-6 h-6 text-orange-500" />
                </div>
                <div className="text-xs text-muted-foreground mb-1">Completion</div>
                <div className="font-bold text-xs text-foreground">{property.buildingComplete}</div>
              </div>
            </div>

            {/* Timeline Sections */}
            <Timeline data={timelineData} />
          </div>

          {/* Contact Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="border-2 border-primary/20 shadow-2xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold mb-4 text-foreground">Contact Agent</h2>
                  
                   {/* Agent Profile */}
                   <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl">
                     <div className="flex items-center gap-3 mb-3">
                       <Avatar className="h-12 w-12 border-2 border-primary/20">
                         <AvatarImage src={ervinaImage} alt="Ervina Köksel" />
                         <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                           EK
                         </AvatarFallback>
                       </Avatar>
                       <div className="min-w-0 flex-1">
                         <div className="font-semibold text-foreground text-sm">Ervina Köksel</div>
                         <div className="text-xs text-primary">Sales Office Supervisor</div>
                         <div className="text-xs text-muted-foreground">Experienced property specialist</div>
                       </div>
                     </div>
                     
                     <div className="flex flex-wrap gap-1">
                       <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20 px-2 py-1">
                         Property Sales
                       </Badge>
                       <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20 px-2 py-1">
                         Customer Service
                       </Badge>
                       <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20 px-2 py-1">
                         Office Management
                       </Badge>
                     </div>
                   </div>
                  
                  <p className="text-xs text-muted-foreground mb-6">
                    Get in touch with our expert agent for detailed information about this property.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-xl">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-muted-foreground">Phone</div>
                        <div className="font-semibold text-foreground text-sm break-all">{property.contactPhone}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500/10 to-blue-500/5 rounded-xl">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-muted-foreground">Email</div>
                        <div className="font-semibold text-xs text-foreground break-all">{property.contactEmail}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 text-sm" 
                      size="sm"
                      onClick={() => window.location.href = `tel:${property.contactPhone}`}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 text-sm" 
                      size="sm"
                      onClick={() => window.location.href = `mailto:${property.contactEmail}`}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email  
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

      </div>
      
      {/* Image Gallery Modal */}
      {showImageGallery && property?.images && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={() => setShowImageGallery(false)}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all backdrop-blur-sm"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Image Counter */}
            <div className="absolute top-4 left-4 z-10 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              {galleryImageIndex + 1} / {property.images.length}
            </div>
            
            {/* Main Image */}
            <div className="relative max-w-5xl max-h-[90vh] w-full">
              <img
                src={property.images[galleryImageIndex]}
                alt={`${property.title} ${galleryImageIndex + 1}`}
                className="w-full h-full object-contain rounded-lg"
              />
              
              {/* Navigation Arrows */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevGalleryImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextGalleryImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all backdrop-blur-sm"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail Strip */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-4xl w-full px-4">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide justify-center">
                {property.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setGalleryImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === galleryImageIndex 
                        ? 'border-white shadow-lg' 
                        : 'border-white/30 hover:border-white/70'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
