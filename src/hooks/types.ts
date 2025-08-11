export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  images: string[];
  description: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  size: string;
  facilities: string[];
  amenities: string[];
  agent: {
    name: string;
    phone: string;
  };
  distanceToBeach?: string;
  distanceToAirport?: string;
  completionDate?: string;
  propertyUrl?: string;
  refNo?: string;
  googleMapsEmbed?: string;
  slug?: string;
}

export interface PropertyFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  propertyType?: string;
  minSize?: number;
  maxSize?: number;
}