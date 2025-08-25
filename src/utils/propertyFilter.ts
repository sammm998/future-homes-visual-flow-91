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
  id: number;
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
  let filtered = [...properties];
  
  // Filter by property type
  if (filters.propertyType && filters.propertyType !== '') {
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
  }

  // Filter by bedrooms
  if (filters.bedrooms && filters.bedrooms !== '') {
    filtered = filtered.filter(property => {
      // Handle studio apartments
      if (filters.bedrooms === 'studio') {
        const propertyBedrooms = property.bedrooms.toLowerCase();
        return propertyBedrooms.includes('studio') || 
               propertyBedrooms === '0' || 
               propertyBedrooms === '0+1' ||
               property.title.toLowerCase().includes('studio');
      }
      
      const bedroomFilter = parseInt(filters.bedrooms);
      const propertyBedrooms = property.bedrooms.toLowerCase();
      
      // Handle ranges like "1+1 <> 2+1" or single values like "2+1"
      if (propertyBedrooms.includes('<>')) {
        // Properties with ranges should NOT show when filtering for specific bedroom counts
        // They only show when 5+ bedrooms filter is used and range contains 5+
        if (bedroomFilter === 5) {
          const rangeParts = propertyBedrooms.split('<>').map(part => part.trim());
          const validCounts = rangeParts.map(part => {
            const match = part.match(/^(\d+)/);
            return match ? parseInt(match[1]) : null;
          }).filter(count => count !== null);
          return validCounts.some(count => count >= 5);
        } else {
          // For specific bedroom counts (1, 2, 3, 4), exclude range properties
          return false;
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
  }

  // Filter by location
  if (filters.location && filters.location !== '' && filters.location !== 'all') {
    filtered = filtered.filter(property => 
      property.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }

  // Filter by district
  if (filters.district) {
    filtered = filtered.filter(property => 
      property.location.toLowerCase().includes(filters.district.toLowerCase()) ||
      property.title.toLowerCase().includes(filters.district.toLowerCase())
    );
  }

  // Filter by reference number
  if (filters.referenceNo && filters.referenceNo !== '') {
    filtered = filtered.filter(property => 
      property.refNo && property.refNo.toLowerCase().includes(filters.referenceNo.toLowerCase())
    );
  }

  // Filter by price range
  if (filters.minPrice || filters.maxPrice) {
    filtered = filtered.filter(property => {
      const priceStr = property.price.replace(/[€$£,]/g, '');
      const price = parseInt(priceStr);
      
      if (isNaN(price)) return true; // Skip if price can't be parsed
      
      const minPrice = filters.minPrice ? parseInt(filters.minPrice.replace(/[€$£,]/g, '')) : 0;
      const maxPrice = filters.maxPrice ? parseInt(filters.maxPrice.replace(/[€$£,]/g, '')) : Infinity;
      
      return price >= minPrice && price <= maxPrice;
    });
  }

  // Filter by area range
  if (filters.minSquareFeet || filters.maxSquareFeet) {
    filtered = filtered.filter(property => {
      const areas = property.area.split(' <> ');
      const minArea = parseInt(areas[0]);
      const maxArea = areas.length > 1 ? parseInt(areas[1]) : minArea;
      
      const filterMinArea = filters.minSquareFeet ? parseInt(filters.minSquareFeet) : 0;
      const filterMaxArea = filters.maxSquareFeet ? parseInt(filters.maxSquareFeet) : Infinity;
      
      return maxArea >= filterMinArea && minArea <= filterMaxArea;
    });
  }

  // Filter by facilities
  if (filters.facilities && filters.facilities.length > 0) {
    filtered = filtered.filter(property => {
      if (!property.features) return false;
      
      // Check if the property has ALL selected facilities
      return filters.facilities.every(facility => 
        property.features!.some(feature => 
          feature.toLowerCase().includes(facility.toLowerCase())
        )
      );
    });
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
          return b.id - a.id; // Newer properties have higher IDs
        case 'oldest':
          return a.id - b.id; // Older properties have lower IDs
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
          return a.id - b.id;
      }
    });
  }

  return filtered;
};