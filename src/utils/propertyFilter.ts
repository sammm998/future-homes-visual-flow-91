export interface PropertyFilters {
  propertyType: string;
  bedrooms: string;
  location: string;
  district: string;
  minPrice: string;
  maxPrice: string;
  minSquareFeet: string;
  maxSquareFeet: string;
  facilities: string[];
  sortBy: string;
  referenceNo: string;
}

export interface Property {
  id: number | string; // Support both for compatibility
  refNo?: string;
  title: string;
  location: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  status: string;
  image: string;
  coordinates: [number, number];
  features?: string[];
}

export const filterProperties = (properties: Property[], filters: PropertyFilters): Property[] => {
  console.log('🔍 filterProperties: Starting with', properties.length, 'properties');
  console.log('🔧 filterProperties: Applied filters:', filters);
  
  let filtered = [...properties];
  
  // Filter by property type
  if (filters.propertyType && filters.propertyType !== '' && filters.propertyType !== 'all') {
    const beforeCount = filtered.length;
    filtered = filtered.filter(property => {
      const type = filters.propertyType.toLowerCase();
      const title = property.title.toLowerCase();
      
      if (type === 'apartments') {
        return title.includes('apartment') || title.includes('flat') || title.includes('duplex');
      } else if (type === 'villas') {
        return title.includes('villa');
      } else if (type === 'houses') {
        return title.includes('house') || title.includes('townhouse');
      } else if (type === 'commercial') {
        return title.includes('commercial') || title.includes('shop') || title.includes('office');
      }
      return true;
    });
    console.log(`🏠 propertyType filter (${filters.propertyType}): ${beforeCount} → ${filtered.length} properties`);
  }

  // Filter by bedrooms
  if (filters.bedrooms && filters.bedrooms !== '' && filters.bedrooms !== 'all') {
    const beforeCount = filtered.length;
    filtered = filtered.filter(property => {
      // Handle studio apartments
      if (filters.bedrooms === 'studio') {
        const propertyBedrooms = property.bedrooms.toLowerCase();
        const propertyTitle = property.title.toLowerCase();
        const propertyLocation = property.location.toLowerCase();
        
        // Enhanced studio detection
        return propertyBedrooms.includes('studio') || 
               propertyBedrooms === '0' || 
               propertyBedrooms === '0+1' ||
               propertyBedrooms.includes('0+') ||
               propertyTitle.includes('studio') ||
               propertyLocation.includes('studio city') ||
               (propertyBedrooms.includes('<>') && propertyBedrooms.includes('0')) ||
               propertyBedrooms.match(/^0\+/); // Matches patterns like "0+1"
      }
      
      const bedroomFilter = parseInt(filters.bedrooms);
      const propertyBedrooms = property.bedrooms.toLowerCase();
      
      // Handle ranges like "2+1 <> 3+1" or single values like "2+1"
      if (propertyBedrooms.includes('<>')) {
        // Split the range and extract bedroom numbers
        const rangeParts = propertyBedrooms.split('<>').map(part => part.trim());
        const validCounts = rangeParts.map(part => {
          const match = part.match(/^(\d+)/);
          return match ? parseInt(match[1]) : null;
        }).filter(count => count !== null);
        
        if (bedroomFilter === 5) {
          // 5+ bedrooms - check if any part of range is >= 5
          return validCounts.some(count => count >= 5);
        } else {
          // Check if filter bedroom count falls within the range
          const minBedrooms = Math.min(...validCounts);
          const maxBedrooms = Math.max(...validCounts);
          return bedroomFilter >= minBedrooms && bedroomFilter <= maxBedrooms;
        }
      } else {
        // Handle single values like "2+1", "3+1", etc.
        const bedroomMatch = propertyBedrooms.match(/^(\d+)/);
        if (!bedroomMatch) return false;
        
        const propertyBedroomCount = parseInt(bedroomMatch[1]);
        
        if (bedroomFilter === 5) {
          // 5+ bedrooms
          return propertyBedroomCount >= 5;
        } else {
          return propertyBedroomCount === bedroomFilter;
        }
      }
    });
    console.log(`🛏️ bedrooms filter (${filters.bedrooms}): ${beforeCount} → ${filtered.length} properties`);
  }

  // Filter by location
  if (filters.location && filters.location !== '' && filters.location !== 'all') {
    const beforeCount = filtered.length;
    filtered = filtered.filter(property => 
      property.location.toLowerCase().includes(filters.location.toLowerCase())
    );
    console.log(`📍 location filter (${filters.location}): ${beforeCount} → ${filtered.length} properties`);
  }

  // Filter by district
  if (filters.district && filters.district !== '' && filters.district !== 'all') {
    const beforeCount = filtered.length;
    filtered = filtered.filter(property => 
      property.location.toLowerCase().includes(filters.district.toLowerCase()) ||
      property.title.toLowerCase().includes(filters.district.toLowerCase())
    );
    console.log(`🏘️ district filter (${filters.district}): ${beforeCount} → ${filtered.length} properties`);
  }

  // Filter by reference number
  if (filters.referenceNo && filters.referenceNo !== '') {
    const beforeCount = filtered.length;
    filtered = filtered.filter(property => 
      property.refNo && property.refNo.toLowerCase().includes(filters.referenceNo.toLowerCase())
    );
    console.log(`🔢 refNo filter (${filters.referenceNo}): ${beforeCount} → ${filtered.length} properties`);
  }

  // Filter by price range
  if (filters.minPrice || filters.maxPrice) {
    const beforeCount = filtered.length;
    filtered = filtered.filter(property => {
      // Handle price ranges like "€202,000" or "€150,000 <> €300,000"
      let priceStr = property.price;
      let minPropertyPrice = 0;
      let maxPropertyPrice = 0;
      
      if (priceStr.includes('<>')) {
        // Handle price ranges
        const priceParts = priceStr.split('<>').map(part => part.trim());
        minPropertyPrice = parseInt(priceParts[0].replace(/[€$£,]/g, '')) || 0;
        maxPropertyPrice = parseInt(priceParts[1].replace(/[€$£,]/g, '')) || 0;
      } else {
        // Single price
        const price = parseInt(priceStr.replace(/[€$£,]/g, '')) || 0;
        minPropertyPrice = maxPropertyPrice = price;
      }
      
      if (minPropertyPrice === 0 && maxPropertyPrice === 0) return true; // Skip if price can't be parsed
      
      const filterMinPrice = filters.minPrice ? parseInt(filters.minPrice.replace(/[€$£,]/g, '')) : 0;
      const filterMaxPrice = filters.maxPrice ? parseInt(filters.maxPrice.replace(/[€$£,]/g, '')) : Infinity;
      
      // Check if price ranges overlap
      return maxPropertyPrice >= filterMinPrice && minPropertyPrice <= filterMaxPrice;
    });
    console.log(`💰 price filter (${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}): ${beforeCount} → ${filtered.length} properties`);
  }

  // Filter by area range
  if (filters.minSquareFeet || filters.maxSquareFeet) {
    const beforeCount = filtered.length;
    filtered = filtered.filter(property => {
      // Handle area like "85 <> 120" or single values like "100"
      const areas = property.area.split(' <> ');
      const minArea = parseInt(areas[0]) || 0;
      const maxArea = areas.length > 1 ? parseInt(areas[1]) : minArea;
      
      if (minArea === 0 && maxArea === 0) return true; // Skip if area can't be parsed
      
      const filterMinArea = filters.minSquareFeet ? parseInt(filters.minSquareFeet) : 0;
      const filterMaxArea = filters.maxSquareFeet ? parseInt(filters.maxSquareFeet) : Infinity;
      
      // Check if area ranges overlap
      return maxArea >= filterMinArea && minArea <= filterMaxArea;
    });
    console.log(`📐 area filter (${filters.minSquareFeet || '0'} - ${filters.maxSquareFeet || '∞'} m²): ${beforeCount} → ${filtered.length} properties`);
  }

  // Filter by facilities - CRITICAL FIX
  if (filters.facilities && filters.facilities.length > 0) {
    const beforeCount = filtered.length;
    console.log(`🔧 facilities filter checking for:`, filters.facilities);
    filtered = filtered.filter(property => {
      // Allow properties with empty or missing features if no specific facilities are required
      if (!property.features || property.features.length === 0) {
        console.log(`❌ Property "${property.title}" has no features, excluding from facilities filter`);
        return false;
      }
      
      // Check if the property has ALL selected facilities
      const hasAllFacilities = filters.facilities.every(facility => {
        // Create facility synonyms for better matching
        const facilityLower = facility.toLowerCase();
        
        return property.features!.some(feature => {
          const featureLower = feature.toLowerCase();
          
          // Direct match
          if (featureLower.includes(facilityLower)) {
            return true;
          }
          
          // Handle swimming pool synonyms
          if (facilityLower.includes('swimming pool') || facilityLower.includes('pool')) {
            return featureLower.includes('pool') || 
                   featureLower.includes('swimming') ||
                   featureLower.includes('swiming'); // Handle typos
          }
          
          // Handle gym synonyms
          if (facilityLower.includes('gym')) {
            return featureLower.includes('gym') || 
                   featureLower.includes('fitness') ||
                   featureLower.includes('exercise');
          }
          
          // Handle parking synonyms
          if (facilityLower.includes('parking')) {
            return featureLower.includes('parking') || 
                   featureLower.includes('garage') ||
                   featureLower.includes('car park') ||
                   featureLower.includes('open car park');
          }
          
          // Handle garden synonyms
          if (facilityLower.includes('garden')) {
            return featureLower.includes('garden') || 
                   featureLower.includes('landscaping') ||
                   featureLower.includes('green space');
          }
          
          // Handle security synonyms
          if (facilityLower.includes('security')) {
            return featureLower.includes('security') || 
                   featureLower.includes('surveillance') ||
                   featureLower.includes('cctv') ||
                   featureLower.includes('guard');
          }
          
          // Handle elevator synonyms
          if (facilityLower.includes('elevator')) {
            return featureLower.includes('elevator') || 
                   featureLower.includes('lift');
          }
          
          // Handle air conditioning synonyms  
          if (facilityLower.includes('air conditioning')) {
            return featureLower.includes('air conditioning') || 
                   featureLower.includes('ac') ||
                   featureLower.includes('cooling') ||
                   featureLower.includes('climate control');
          }
          
          return false;
        });
      });
      
      if (!hasAllFacilities) {
        console.log(`❌ Property "${property.title}" missing facilities. Has: [${property.features.join(', ')}], Needs: [${filters.facilities.join(', ')}]`);
      }
      
      return hasAllFacilities;
    });
    console.log(`🏢 facilities filter (${filters.facilities.join(', ')}): ${beforeCount} → ${filtered.length} properties`);
  }

  // Sort results - Default to reference number (lowest to highest)
  filtered.sort((a, b) => {
    // Extract numeric part from reference numbers for proper sorting
    const getRefNumber = (refNo: string | undefined): number => {
      if (!refNo) return 999999; // Put properties without refNo at the end
      const match = refNo.match(/\d+/);
      return match ? parseInt(match[0]) : 999999;
    };
    
    const refA = getRefNumber(a.refNo);
    const refB = getRefNumber(b.refNo);
    return refA - refB; // Ascending order (lowest to highest)
  });
  
  console.log(`🔄 sorted by reference number (lowest to highest): ${filtered.length} properties`);

  console.log('✅ filterProperties: Final result:', filtered.length, 'properties');
  return filtered;
};