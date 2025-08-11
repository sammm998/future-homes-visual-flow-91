import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import PropertyFilter from '@/components/PropertyFilter';
import PropertyCard from '@/components/PropertyCard';
import ElevenLabsWidget from '@/components/ElevenLabsWidget';
import { Button } from '@/components/ui/button';
import { useProperties } from '@/hooks/useProperties';
import { filterProperties, PropertyFilters, Property } from '@/utils/propertyFilter';
import { useCurrency } from '@/contexts/CurrencyContext';

// Import all property data
import { getAllProperties } from '@/data/allPropertiesData';

const Properties = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { formatPrice } = useCurrency();
  const { properties: dbProperties, loading: dbLoading, error: dbError } = useProperties();

  // Initialize filters from URL parameters and location state
  const [filters, setFilters] = useState<PropertyFilters>({
    propertyType: '',
    bedrooms: '',
    location: '',
    district: '',
    minPrice: '',
    maxPrice: '',
    minSquareFeet: '',
    maxSquareFeet: '',
    facilities: [],
    sortBy: 'newest',
    referenceNo: ''
  });

  const [showFiltered, setShowFiltered] = useState(false);

  // Load filters from URL and location state on mount
  useEffect(() => {
    const urlFilters: PropertyFilters = {
      propertyType: searchParams.get('propertyType') || '',
      bedrooms: searchParams.get('bedrooms') || '',
      location: searchParams.get('location') || '',
      district: searchParams.get('district') || '',
      minPrice: searchParams.get('priceMin') || searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('priceMax') || searchParams.get('maxPrice') || '',
      minSquareFeet: searchParams.get('areaMin') || searchParams.get('minSquareFeet') || '',
      maxSquareFeet: searchParams.get('areaMax') || searchParams.get('maxSquareFeet') || '',
      facilities: searchParams.get('facilities')?.split(',').filter(Boolean) || [],
      sortBy: (searchParams.get('sortBy') as any) || 'newest',
      referenceNo: searchParams.get('referenceNumber') || searchParams.get('referenceNo') || ''
    };

    // Merge with location state if available
    const stateFilters = location.state?.filters;
    if (stateFilters) {
      Object.keys(stateFilters).forEach(key => {
        if (stateFilters[key] && stateFilters[key] !== '') {
          urlFilters[key as keyof PropertyFilters] = stateFilters[key];
        }
      });
    }

    setFilters(urlFilters);
    
    // Show filtered results if any filters are applied
    const hasFilters = Object.entries(urlFilters).some(([key, value]) => {
      return value && value !== '' && value !== 'newest';
    });
    
    setShowFiltered(hasFilters);
  }, [searchParams, location.state]);

  // Combine all property data sources
  const allProperties = useMemo(() => {
    const staticProperties = getAllProperties().map((property, index) => ({
      id: typeof property.id === 'number' ? property.id : parseInt(`${property.id}`) || index,
      refNo: property.refNo || `REF-${property.id || index}`,
      title: property.title || '',
      location: property.location || '',
      price: property.price?.toString() || '0',
      bedrooms: property.bedrooms?.toString() || '0',
      bathrooms: property.bathrooms?.toString() || '0',
      area: property.area || '0',
      status: property.status || 'available',
      image: property.image || '/placeholder.svg',
      coordinates: Array.isArray(property.coordinates) ? property.coordinates : [0, 0] as [number, number]
    }));

    // Add database properties if available - using proper field names from the database
    const dbProps = (dbProperties || []).map((property, index) => ({
      id: parseInt(property.id) || index + 10000,
      refNo: property.ref_no || `DB-${property.id}`,
      title: property.title || '',
      location: property.location || '',
      price: property.price?.toString() || '0',
      bedrooms: property.bedrooms?.toString() || '0',
      bathrooms: property.bathrooms?.toString() || '0',
      area: '0', // Database properties area - will be properly mapped later
      status: property.status || 'available',
      image: '/placeholder.svg',
      coordinates: [0, 0] as [number, number]
    }));

    return [...staticProperties, ...dbProps] as Property[];
  }, [dbProperties]);

  // Filter properties based on current filters
  const filteredProperties = useMemo(() => {
    if (!showFiltered) return allProperties;
    return filterProperties(allProperties, filters);
  }, [allProperties, filters, showFiltered]);

  // Handle filter changes
  const handleFilterChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    
    // Handle location-specific redirects
    if (newFilters.location && newFilters.location !== '') {
      const locationRoutes: Record<string, string> = {
        'Antalya': '/antalya',
        'Dubai': '/dubai',
        'Cyprus': '/cyprus',
        'Mersin': '/mersin',
        'France': '/france'
      };
      
      const route = locationRoutes[newFilters.location];
      if (route) {
        navigate(route, { state: { filters: newFilters } });
        return;
      }
    }
    
    // Update URL with filters
    const searchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'newest') {
        searchParams.set(key, value.toString());
      }
    });
    
    navigate(`/properties${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, { replace: true });
  };

  const handleSearch = () => {
    setShowFiltered(true);
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`, {
      state: { from: location.pathname + location.search }
    });
  };

  const handleClearFilters = () => {
    const emptyFilters: PropertyFilters = {
      propertyType: '',
      bedrooms: '',
      location: '',
      district: '',
      minPrice: '',
      maxPrice: '',
      minSquareFeet: '',
      maxSquareFeet: '',
      facilities: [],
      sortBy: 'newest',
      referenceNo: ''
    };
    setFilters(emptyFilters);
    setShowFiltered(false);
    navigate('/properties', { replace: true });
  };

  if (dbLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-xl text-muted-foreground">Loading properties...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            All Properties
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            {showFiltered 
              ? `Found ${filteredProperties.length} propert${filteredProperties.length === 1 ? 'y' : 'ies'} matching your criteria`
              : `Discover ${allProperties.length} amazing properties worldwide`
            }
          </p>
        </div>

        {/* Property Filter */}
        <div className="mb-8">
          <PropertyFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            horizontal={false}
          />
        </div>

        {/* Clear Filters Button */}
        {showFiltered && (
          <div className="flex justify-center mb-6">
            <Button 
              onClick={handleClearFilters}
              variant="outline"
              className="mb-4"
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                onClick={() => handlePropertyClick(property.id.toString())}
                className="cursor-pointer"
              >
                <PropertyCard
                  property={{
                    id: property.id,
                    refNo: property.refNo,
                    title: property.title,
                    location: property.location,
                    price: formatPrice(parseInt(property.price.replace(/[€$£,₺₽₨﷼kr]/g, '')) || 0),
                    bedrooms: property.bedrooms,
                    bathrooms: property.bathrooms,
                    area: property.area,
                    image: property.image,
                    status: property.status
                  }}
                />
              </div>
            ))}
          </div>
        ) : showFiltered ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              No properties found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or clear filters to see all properties.
            </p>
            <Button onClick={handleClearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        ) : null}
      </div>

      <ElevenLabsWidget />
    </div>
  );
};

export default Properties;