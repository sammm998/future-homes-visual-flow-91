export interface Property {
  id: string;
  ref_no?: string;
  title?: string;
  location?: string;
  price?: string;
  starting_price_eur?: string;
  images?: string[];
  apartment_types?: ApartmentType[];
  features?: string[];
  status?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_sold: boolean;
  // Additional fields for compatibility with PropertyCard
  bedrooms?: string;
  bathrooms?: string;
  area?: string;
}

export interface ApartmentType {
  bedrooms?: number;
  bathrooms?: number;
  size?: string;
  price?: string;
  features?: string[];
}