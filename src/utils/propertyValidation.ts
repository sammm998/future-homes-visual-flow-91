import { supabase } from '@/integrations/supabase/client';

// Property ID redirects for missing or moved properties
const PROPERTY_REDIRECTS: Record<string, string> = {
  '3002': '3006', // Redirect non-existent 3002 to existing 3006
  '3001': '3006', // Redirect non-existent 3001 to existing 3006  
  '3003': '3008', // Redirect non-existent 3003 to existing 3008
  '3004': '3009', // Redirect non-existent 3004 to existing 3009
  '3005': '3010', // Redirect non-existent 3005 to existing 3010
};

// Get all valid property IDs from database
export const getAllValidPropertyIds = async (): Promise<string[]> => {
  try {
    const { data: properties, error } = await supabase
      .from('properties')
      .select('ref_no, id')
      .eq('is_active', true);
    
    if (error) {
      console.error('Error fetching property IDs:', error);
      return [];
    }
    
    const ids: string[] = [];
    
    // Add ref_no values
    properties?.forEach(p => {
      if (p.ref_no) {
        ids.push(p.ref_no);
      }
      // Also add UUID IDs as strings
      ids.push(p.id);
    });
    
    return [...new Set(ids)]; // Remove duplicates
  } catch (error) {
    console.error('Database error fetching property IDs:', error);
    return [];
  }
};

// Check if a property ID is valid
export const isValidPropertyId = async (id: string): Promise<boolean> => {
  // Check redirects first
  if (id in PROPERTY_REDIRECTS) {
    return true;
  }
  
  try {
    // Check if property exists by ref_no
    const { data: propertyByRef } = await supabase
      .from('properties')
      .select('id')
      .eq('ref_no', id)
      .eq('is_active', true)
      .maybeSingle();
      
    if (propertyByRef) {
      return true;
    }
    
    // Check if property exists by UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(id)) {
      const { data: propertyByUuid } = await supabase
        .from('properties')
        .select('id')
        .eq('id', id)
        .eq('is_active', true)
        .maybeSingle();
        
      return !!propertyByUuid;
    }
    
    return false;
  } catch (error) {
    console.error('Error validating property ID:', error);
    return false;
  }
};

// Get redirect ID if exists, otherwise return original ID
export const getRedirectId = (id: string): string => {
  return PROPERTY_REDIRECTS[id] || id;
};

// Validate and redirect property ID
export const validatePropertyId = async (id: string): Promise<{ isValid: boolean; redirectId?: string; suggestedIds?: string[] }> => {
  // Check if ID has a redirect
  if (id in PROPERTY_REDIRECTS) {
    return { isValid: true, redirectId: PROPERTY_REDIRECTS[id] };
  }
  
  const isValid = await isValidPropertyId(id);
  
  if (isValid) {
    return { isValid: true };
  }
  
  // Find similar IDs for suggestions
  try {
    const allValidIds = await getAllValidPropertyIds();
    const suggestedIds = allValidIds
      .filter(validId => {
        // Suggest IDs that start with the same digits
        const idPrefix = id.substring(0, 2);
        return validId.startsWith(idPrefix);
      })
      .slice(0, 5); // Limit to 5 suggestions
    
    return { isValid: false, suggestedIds };
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return { isValid: false, suggestedIds: [] };
  }
};

// Log property validation results
export const logPropertyValidation = async () => {
  try {
    const { data: properties } = await supabase
      .from('properties')
      .select('ref_no, id')
      .eq('is_active', true);
    
    if (!properties) {
      console.log('No properties found in database');
      return;
    }
    
    const refNos = properties.map(p => parseInt(p.ref_no)).filter(n => !isNaN(n));
    
    console.log('Property Validation Report:');
    console.log('Total properties:', properties.length);
    if (refNos.length > 0) {
      console.log('Property ref_no range:', Math.min(...refNos), '-', Math.max(...refNos));
    }
    console.log('Configured redirects:', Object.keys(PROPERTY_REDIRECTS).length);
    
    // Check for missing IDs in ranges
    if (refNos.length > 0) {
      const sortedIds = refNos.sort((a, b) => a - b);
      const missingIds: number[] = [];
      
      for (let i = sortedIds[0]; i <= sortedIds[sortedIds.length - 1]; i++) {
        if (!sortedIds.includes(i)) {
          missingIds.push(i);
        }
      }
      
      if (missingIds.length > 0) {
        console.log('Missing property ref_nos:', missingIds.slice(0, 10)); // Show first 10
        if (missingIds.length > 10) {
          console.log(`... and ${missingIds.length - 10} more`);
        }
      }
    }
  } catch (error) {
    console.error('Error in property validation report:', error);
  }
};