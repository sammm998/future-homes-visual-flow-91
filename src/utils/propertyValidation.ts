import { getAllProperties } from '@/data/allPropertiesData';

// Property ID redirects for missing or moved properties
const PROPERTY_REDIRECTS: Record<string, string> = {
  '3002': '3006', // Redirect non-existent 3002 to existing 3006
  '3001': '3006', // Redirect non-existent 3001 to existing 3006  
  '3003': '3008', // Redirect non-existent 3003 to existing 3008
  '3004': '3009', // Redirect non-existent 3004 to existing 3009
  '3005': '3010', // Redirect non-existent 3005 to existing 3010
};

// Get all valid property IDs
export const getAllValidPropertyIds = (): string[] => {
  const allProperties = getAllProperties();
  return allProperties.map(p => p.id.toString());
};

// Check if a property ID is valid
export const isValidPropertyId = (id: string): boolean => {
  const validIds = getAllValidPropertyIds();
  return validIds.includes(id) || id in PROPERTY_REDIRECTS;
};

// Get redirect ID if exists, otherwise return original ID
export const getRedirectId = (id: string): string => {
  return PROPERTY_REDIRECTS[id] || id;
};

// Validate and redirect property ID
export const validatePropertyId = (id: string): { isValid: boolean; redirectId?: string; suggestedIds?: string[] } => {
  const allValidIds = getAllValidPropertyIds();
  
  // Check if ID exists directly
  if (allValidIds.includes(id)) {
    return { isValid: true };
  }
  
  // Check if ID has a redirect
  if (id in PROPERTY_REDIRECTS) {
    return { isValid: true, redirectId: PROPERTY_REDIRECTS[id] };
  }
  
  // Find similar IDs for suggestions
  const suggestedIds = allValidIds
    .filter(validId => {
      // Suggest IDs that start with the same digits
      const idPrefix = id.substring(0, 2);
      return validId.startsWith(idPrefix);
    })
    .slice(0, 5); // Limit to 5 suggestions
  
  return { isValid: false, suggestedIds };
};

// Log property validation results
export const logPropertyValidation = () => {
  const allProperties = getAllProperties();
  const propertyIds = allProperties.map(p => p.id);
  
  console.log('Property Validation Report:');
  console.log('Total properties:', allProperties.length);
  console.log('Property ID range:', Math.min(...propertyIds), '-', Math.max(...propertyIds));
  console.log('Configured redirects:', Object.keys(PROPERTY_REDIRECTS).length);
  
  // Check for missing IDs in ranges
  const sortedIds = propertyIds.sort((a, b) => a - b);
  const missingIds: number[] = [];
  
  for (let i = sortedIds[0]; i <= sortedIds[sortedIds.length - 1]; i++) {
    if (!sortedIds.includes(i)) {
      missingIds.push(i);
    }
  }
  
  if (missingIds.length > 0) {
    console.log('Missing property IDs:', missingIds.slice(0, 10)); // Show first 10
    if (missingIds.length > 10) {
      console.log(`... and ${missingIds.length - 10} more`);
    }
  }
};