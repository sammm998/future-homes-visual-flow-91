
export const parseApartmentTypes = (apartmentTypesData: any) => {
  if (!apartmentTypesData) return [];
  
  try {
    const parsed = typeof apartmentTypesData === 'string' 
      ? JSON.parse(apartmentTypesData) 
      : apartmentTypesData;
    
    if (Array.isArray(parsed)) {
      return parsed.map(type => ({
        ...type,
        price: type.price || type.starting_price || '€0'
      }));
    }
    return [];
  } catch (error) {
    console.error('Error parsing apartment types:', error);
    return [];
  }
};

export const getStartingPrice = (apartmentTypes: any[], fallbackPrice: string) => {
  if (!apartmentTypes || apartmentTypes.length === 0) {
    return fallbackPrice;
  }
  
  const prices = apartmentTypes
    .map(type => {
      const priceStr = type.price || type.starting_price || '0';
      const numericPrice = parseInt(priceStr.replace(/[€$£,]/g, ''));
      return isNaN(numericPrice) ? 0 : numericPrice;
    })
    .filter(price => price > 0);
  
  if (prices.length === 0) {
    return fallbackPrice;
  }
  
  const minPrice = Math.min(...prices);
  return `€${minPrice.toLocaleString()}`;
};
