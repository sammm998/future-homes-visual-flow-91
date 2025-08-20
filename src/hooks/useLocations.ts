import { useMemo } from 'react';
import { useProperties } from './useProperties';

export const useLocations = () => {
  const { properties, loading: propertiesLoading, error } = useProperties();

  const locations = useMemo(() => {
    if (!properties || properties.length === 0) return [];
    
    // Extract unique locations and sort them
    const uniqueLocations = [...new Set(properties
      .filter(property => (property as any).is_active && property.location)
      .map(property => property.location)
    )].sort();
    
    return uniqueLocations;
  }, [properties]);

  return {
    locations,
    loading: propertiesLoading,
    error
  };
};