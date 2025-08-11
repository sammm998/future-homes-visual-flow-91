// Sample Mersin Properties Data
export const mersinProperties = [
  {
    id: 6002,
    refNo: "6002",
    title: "Modern villa complex near Mersin Marina",
    location: "Mersin, Marina District",
    price: "€250,000",
    bedrooms: "3+1 <> 4+1",
    bathrooms: "2 <> 3",
    area: "140 <> 200",
    status: "Under Construction",
    propertyType: "Villas",
    buildingComplete: "01/01/2025",
    description: "Exclusive villa development near Mersin Marina with private gardens and modern design.",
    features: ["Private Garden", "Pool", "Marina Access", "Parking", "Security"],
    distanceToAirport: "15 km",
    distanceToBeach: "1 km",
    agent: "Mersin Sales Team",
    contactPhone: "+905551234567",
    contactEmail: "info@futurehomesturkey.com",
    image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/6002/general/mersin-villa-marina.webp",
    coordinates: [36.7987, 34.6420] as [number, number]
  }
];

export const getMersinPropertyById = (id: string | number) => {
  return mersinProperties.find(property => property.id.toString() === id.toString());
};