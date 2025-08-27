import { useCurrency } from '@/contexts/CurrencyContext';

export interface ApartmentType {
  type: string;
  size: string;
  price: string;
}

export const parseApartmentTypes = (apartmentTypes: any): ApartmentType[] => {
  if (!apartmentTypes) return [];
  
  try {
    // Handle if it's already an array
    if (Array.isArray(apartmentTypes)) {
      return apartmentTypes;
    }
    
    // Handle if it's a string that needs parsing
    if (typeof apartmentTypes === 'string') {
      return JSON.parse(apartmentTypes);
    }
    
    return [];
  } catch (error) {
    console.warn('Failed to parse apartment types:', error);
    return [];
  }
};

export const getStartingPrice = (apartmentTypes: ApartmentType[], fallbackPrice?: string): string => {
  if (!apartmentTypes || apartmentTypes.length === 0) {
    return fallbackPrice || '';
  }

  // Extract numeric values to find the lowest price
  const prices = apartmentTypes
    .map(apt => {
      const priceMatch = apt.price?.match(/[\d,]+/);
      if (priceMatch) {
        return parseInt(priceMatch[0].replace(/,/g, ''), 10);
      }
      return 0;
    })
    .filter(price => price > 0);

  if (prices.length === 0) {
    return fallbackPrice || '';
  }

  const minPrice = Math.min(...prices);
  return `€${minPrice.toLocaleString()}`;
};

export const formatApartmentTypeDisplay = (apartmentTypes: ApartmentType[]): string => {
  if (!apartmentTypes || apartmentTypes.length === 0) return '';
  
  return apartmentTypes.map(apt => apt.type).join(', ');
};