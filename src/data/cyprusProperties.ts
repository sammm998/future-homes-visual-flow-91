// Sample Cyprus Properties Data
export const cyprusProperties = [
  {
    id: 5001,
    refNo: "5001",
    title: "Beachfront villa with panoramic sea views in Cyprus, Paphos",
    location: "Cyprus, Paphos",
    price: "€650,000",
    bedrooms: "3+1 <> 4+1",
    bathrooms: "2 <> 3",
    area: "120 <> 180",
    status: "Ready to Move",
    propertyType: "Villas",
    buildingComplete: "01/01/2023",
    description: "Stunning beachfront villa with direct beach access and panoramic Mediterranean views.",
    features: ["Private Beach", "Pool", "Garden", "Parking", "Sea View"],
    distanceToAirport: "15 km",
    distanceToBeach: "0 km",
    agent: "Cyprus Sales Team",
    contactPhone: "+35799123456",
    contactEmail: "info@futurehomesturkey.com",
    image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/5001/general/cyprus-villa-beachfront.webp",
    images: [
      "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/5001/general/cyprus-villa-beachfront.webp",
      "https://cdn.futurehomesturkey.com/uploads/pages/5001/general/cyprus-villa-pool.webp",
      "https://cdn.futurehomesturkey.com/uploads/pages/5001/general/cyprus-villa-garden.webp"
    ],
    coordinates: [34.7570, 32.4084] as [number, number]
  },
  {
    id: 5002,
    refNo: "5002",
    title: "Modern apartments in luxury complex in Cyprus, Limassol",
    location: "Cyprus, Limassol",
    price: "€280,000",
    bedrooms: "1+1 <> 2+1",
    bathrooms: "1 <> 2",
    area: "55 <> 85",
    status: "Under Construction",
    propertyType: "Apartments",
    buildingComplete: "01/01/2025",
    description: "Contemporary apartments in prestigious Limassol development with marina access.",
    features: ["Marina Access", "Pool", "Gym", "Concierge", "Parking"],
    distanceToAirport: "70 km",
    distanceToBeach: "2 km",
    agent: "Cyprus Sales Team",
    contactPhone: "+35799123456",
    contactEmail: "info@futurehomesturkey.com",
    image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/5002/general/cyprus-apartment-limassol.webp",
    images: [
      "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/5002/general/cyprus-apartment-limassol.webp",
      "https://cdn.futurehomesturkey.com/uploads/pages/5002/general/cyprus-apartment-marina.webp"
    ],
    coordinates: [34.6823, 33.0464] as [number, number]
  }
];

export const getCyprusPropertyById = (id: string | number) => {
  return cyprusProperties.find(property => property.id.toString() === id.toString());
};