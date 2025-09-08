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
      const hasAllFacilities = filters.facilities.every(facility => 
        property.features!.some(feature => 
          feature.toLowerCase().includes(facility.toLowerCase())
        )
      );
      
      if (!hasAllFacilities) {
        console.log(`❌ Property "${property.title}" missing facilities. Has: [${property.features.join(', ')}], Needs: [${filters.facilities.join(', ')}]`);
      }
      
      return hasAllFacilities;
    });
    console.log(`🏢 facilities filter (${filters.facilities.join(', ')}): ${beforeCount} → ${filtered.length} properties`);
  }

  // Sort results
  if (filters.sortBy) {
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
        case 'low-to-high':
          const priceA = parseInt(a.price.replace(/[€$£,]/g, '')) || 0;
          const priceB = parseInt(b.price.replace(/[€$£,]/g, '')) || 0;
          return priceA - priceB;
        case 'price-high':
        case 'high-to-low':
          const priceA2 = parseInt(a.price.replace(/[€$£,]/g, '')) || 0;
          const priceB2 = parseInt(b.price.replace(/[€$£,]/g, '')) || 0;
          return priceB2 - priceA2;
        case 'newest':
          // Handle both string and number IDs
          const idA = typeof b.id === 'string' ? parseInt(b.id) || 0 : b.id;
          const idB = typeof a.id === 'string' ? parseInt(a.id) || 0 : a.id;
          return idA - idB; // Newer properties have higher IDs
        case 'oldest':
          const idA2 = typeof a.id === 'string' ? parseInt(a.id) || 0 : a.id;
          const idB2 = typeof b.id === 'string' ? parseInt(b.id) || 0 : b.id;
          return idA2 - idB2; // Older properties have lower IDs
        case 'area-large':
          const areaA = parseInt(a.area.split(' <> ')[0]);
          const areaB = parseInt(b.area.split(' <> ')[0]);
          return areaB - areaA; // Largest first
        case 'area-small':
          const areaA2 = parseInt(a.area.split(' <> ')[0]);
          const areaB2 = parseInt(b.area.split(' <> ')[0]);
          return areaA2 - areaB2; // Smallest first
        case 'bedrooms-most':
          const bedroomsA = parseInt(a.bedrooms.split(' <> ')[0] || a.bedrooms);
          const bedroomsB = parseInt(b.bedrooms.split(' <> ')[0] || b.bedrooms);
          return bedroomsB - bedroomsA; // Most bedrooms first
        case 'bedrooms-least':
          const bedroomsA2 = parseInt(a.bedrooms.split(' <> ')[0] || a.bedrooms);
          const bedroomsB2 = parseInt(b.bedrooms.split(' <> ')[0] || b.bedrooms);
          return bedroomsA2 - bedroomsB2; // Least bedrooms first
        case 'ref':
        default:
          const defaultIdA = typeof a.id === 'string' ? parseInt(a.id) || 0 : a.id;
          const defaultIdB = typeof b.id === 'string' ? parseInt(b.id) || 0 : b.id;
          return defaultIdA - defaultIdB;
      }
    });
    console.log(`🔄 sorted by ${filters.sortBy}: ${filtered.length} properties`);
  }

  console.log('✅ filterProperties: Final result:', filtered.length, 'properties');
  return filtered;
};