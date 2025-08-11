// Sample France Properties Data
export const franceProperties = [
  {
    id: 7001,
    refNo: "7001",
    title: "Luxury château with vineyard in Bordeaux region, France",
    location: "France, Bordeaux",
    price: "€2,500,000",
    bedrooms: "6+1 <> 8+1",
    bathrooms: "4 <> 6",
    area: "400 <> 600",
    status: "Ready to Move",
    propertyType: "Villas",
    buildingComplete: "01/01/2020",
    description: "Historic château with working vineyard and extensive grounds in prestigious Bordeaux wine region.",
    features: ["Vineyard", "Historic Building", "Swimming Pool", "Wine Cellar", "Gardens"],
    distanceToAirport: "45 km",
    distanceToBeach: "120 km",
    agent: "France Sales Team",
    contactPhone: "+33612345678",
    contactEmail: "info@futurehomesturkey.com",
    image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/7001/general/france-chateau-bordeaux.webp",
    coordinates: [44.8378, -0.5792] as [number, number]
  },
  {
    id: 7002,
    refNo: "7002",
    title: "Modern apartment in historic district of Paris, France",
    location: "France, Paris",
    price: "€890,000",
    bedrooms: "2+1 <> 3+1",
    bathrooms: "1 <> 2",
    area: "65 <> 95",
    status: "Ready to Move",
    propertyType: "Apartments",
    buildingComplete: "01/01/2022",
    description: "Beautifully renovated apartment in historic Parisian building with original features and modern amenities.",
    features: ["Historic Building", "City Views", "High Ceilings", "Original Features", "Elevator"],
    distanceToAirport: "35 km",
    distanceToBeach: "200 km",
    agent: "France Sales Team",
    contactPhone: "+33612345678",
    contactEmail: "info@futurehomesturkey.com",
    image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/7002/general/paris-apartment-historic.webp",
    coordinates: [48.8566, 2.3522] as [number, number]
  }
];

export const getFrancePropertyById = (id: string | number) => {
  return franceProperties.find(property => property.id.toString() === id.toString());
};