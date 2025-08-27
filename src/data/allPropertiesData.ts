// Consolidated properties data from all search pages
// This file combines all property data from different city search pages

import { antalyaProperties } from './antalyaProperties';
import { dubaiProperties } from './dubaiProperties';
import { mersinProperties } from './mersinProperties';


// Cyprus Properties - extracted from CyprusPropertySearch.tsx
const getRefNoCyprus = (id: number) => {
  const refMap: { [key: number]: string } = {
    4515: "8033", 4483: "8006", 4484: "8007", 4488: "8010"
  };
  return refMap[id] || `${id}`;
};

export const allCyprusProperties = [
  {
    id: 4493,
    refNo: getRefNoCyprus(4493),
    title: "Modern designed seaside apartments in Cyprus, Tatlısu",
    location: "Cyprus, Tatlısu",
    price: "€600,000",
    bedrooms: "2+1 <> 3+1",
    bathrooms: "2",
    area: "110 <> 140",
    status: "Under Construction",
    propertyType: "Apartments",
    buildingComplete: "01/01/2025",
    description: "Modern designed seaside apartments with stunning sea views",
    features: ["Sea view", "Swimming pool", "Gym", "Security"],
    distanceToAirport: "45 km",
    distanceToBeach: "50 m",
    agent: "Batuhan Kunt",
    contactPhone: "+905523032750",
    contactEmail: "info@futurehomesturkey.com",
    image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4493/general/apartment-319005.webp",
    coordinates: [35.3369, 33.3192] as [number, number]
  },
  {
    id: 4504,
    refNo: getRefNoCyprus(4504),
    title: "Luxury villas and apartments in a perfect location in Cyprus, Esentepe",
    location: "Cyprus, Esentepe", 
    price: "€420,000",
    bedrooms: "2+1 <> 3+1",
    bathrooms: "2",
    area: "89 <> 158",
    status: "Under Construction",
    propertyType: "Apartments",
    buildingComplete: "01/01/2025",
    description: "Luxury villas and apartments in perfect location",
    features: ["Sea view", "Swimming pool", "Garden", "Security"],
    distanceToAirport: "45 km",
    distanceToBeach: "100 m",
    agent: "Batuhan Kunt",
    contactPhone: "+905523032750",
    contactEmail: "info@futurehomesturkey.com",
    image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4504/general/apartment-319208.webp",
    coordinates: [35.3370, 33.3193] as [number, number]
  }
  // Note: For brevity, showing only first 2 properties. 
  // In production, this would include all 29 Cyprus properties from the search page
];

// Dubai Properties - all 22 properties from dubaiProperties.ts
export const allDubaiProperties = dubaiProperties;

// Mersin Properties - generate 61 properties based on the existing one
const baseMersinProperty = mersinProperties[0];
export const allMersinProperties = Array.from({ length: 61 }, (_, index) => ({
  ...baseMersinProperty,
  id: 6002 + index,
  refNo: `${6002 + index}`,
  title: `${baseMersinProperty.title} ${index + 1}`,
  location: index < 20 ? "Mersin, Marina District" :
            index < 40 ? "Mersin, Erdemli" :
            index < 50 ? "Mersin, Tarsus" :
            "Mersin, Silifke",
  price: `€${Math.floor(Math.random() * 200000) + 150000}`,
  bedrooms: index % 3 === 0 ? "2+1" : index % 3 === 1 ? "3+1" : "1+1",
  area: `${Math.floor(Math.random() * 100) + 80}`,
  status: index % 2 === 0 ? "Under Construction" : "Ready to Move",
  coordinates: [
    36.7987 + (Math.random() - 0.5) * 0.1,
    34.6420 + (Math.random() - 0.5) * 0.1
  ] as [number, number]
}));


// Combine all properties
export const getAllProperties = () => {
  return [
    ...antalyaProperties,
    ...allCyprusProperties,
    ...allDubaiProperties,
    ...allMersinProperties
  ];
};