/**
 * Utility functions for parsing and formatting prices
 */

/**
 * Safely parses a price string and returns formatted price
 * @param priceString - Price string like "€350,000" or "147000" 
 * @returns Formatted price number or 0 if parsing fails
 */
export const parsePrice = (priceString: string | null | undefined): number => {
  if (!priceString || typeof priceString !== 'string') return 0;
  
  const numericValue = parseInt(priceString.replace(/[^\d]/g, ''));
  return isNaN(numericValue) ? 0 : numericValue;
};

/**
 * Formats a price number with Euro symbol and locale formatting
 * @param price - Numeric price value
 * @returns Formatted price string like "€350,000"
 */
export const formatEuroPrice = (price: number): string => {
  return `€${price.toLocaleString()}`;
};

/**
 * Extracts numeric value from a price string and formats it using the provided formatPrice function
 * @param priceString - Price string like "€350,000" or "147000"
 * @param formatPrice - Function to format the numeric price according to currency context
 * @returns Formatted price string or original string if parsing fails
 */
export const formatPriceFromString = (priceString: string, formatPrice: (value: number) => string): string => {
  if (!priceString) return formatPrice(0);
  
  // Extract numeric value from string like "€350,000" or "147000"
  const numericValue = parseFloat(priceString.replace(/[^\d.-]/g, ''));
  return isNaN(numericValue) ? priceString : formatPrice(numericValue);
};

/**
 * Legacy function for backward compatibility - uses parseInt instead of parseFloat
 * @param priceString - Price string like "€350,000"  
 * @param formatPrice - Function to format the numeric price according to currency context
 * @returns Formatted price string or original string if parsing fails
 */
export const formatDisplayPrice = (priceString: string, formatPrice: (value: number) => string): string => {
  const numericValue = parseInt(priceString.replace(/[€$£,₺₽₨﷼kr]/g, ''));
  return isNaN(numericValue) ? priceString : formatPrice(numericValue);
};