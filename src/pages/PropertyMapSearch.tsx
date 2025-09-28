import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import PropertyMap from '@/components/PropertyMap';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilter from '@/components/PropertyFilter';
import { useProperties } from '@/hooks/useProperties';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Map, List, Filter } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

interface PropertyFilters {
  location: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  propertyType: string;
}

const PropertyMapSearch = () => {
  const navigate = useNavigate();
  const { properties, loading } = useProperties();
  const [filters, setFilters] = useState<PropertyFilters>({
    location: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    propertyType: ''
  });
  const [showFiltered, setShowFiltered] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Transform properties to the expected format
  const transformedProperties: Property[] = useMemo(() => {
    return properties
      .filter(property => property.is_active)
      .map(property => ({
        id: property.id,
        ref_no: property.ref_no || '',
        title: property.title || 'Untitled Property',
        location: property.location || 'Unknown Location',
        price: property.price || property.starting_price_eur || '',
        starting_price_eur: property.starting_price_eur || '',
        images: (property as any).images ? 
                (Array.isArray((property as any).images) ? (property as any).images : [(property as any).images]) : [],
        apartment_types: Array.isArray(property.apartment_types) ? property.apartment_types : [],
        features: property.amenities || [],
        status: property.status || 'available',
        created_at: property.created_at || new Date().toISOString(),
        updated_at: property.updated_at || new Date().toISOString(),
        is_active: property.is_active ?? true,
        is_sold: false,
        // Additional compatibility fields
        bedrooms: property.bedrooms || (Array.isArray(property.apartment_types) && property.apartment_types[0]?.bedrooms ? property.apartment_types[0].bedrooms.toString() : ''),
        bathrooms: property.bathrooms || (Array.isArray(property.apartment_types) && property.apartment_types[0]?.bathrooms ? property.apartment_types[0].bathrooms.toString() : ''),
        area: (Array.isArray(property.apartment_types) && property.apartment_types[0]?.size) || ''
      }));
  }, [properties]);

  // Filter properties based on search and filters
  const filteredProperties = useMemo(() => {
    let filtered = transformedProperties;

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(property =>
        property.title?.toLowerCase().includes(query) ||
        property.location?.toLowerCase().includes(query) ||
        property.ref_no?.toLowerCase().includes(query)
      );
    }

    // Apply filters only if showFiltered is true
    if (showFiltered) {
      if (filters.location) {
        filtered = filtered.filter(property =>
          property.location?.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      if (filters.bedrooms && filters.bedrooms !== 'any') {
        filtered = filtered.filter(property => {
          if (!property.apartment_types?.length) return false;
          return property.apartment_types.some(apt => 
            apt.bedrooms?.toString() === filters.bedrooms
          );
        });
      }

      if (filters.minPrice || filters.maxPrice) {
        filtered = filtered.filter(property => {
          const priceStr = property.price || property.starting_price_eur || '';
          const priceMatch = priceStr.match(/[\d,]+/);
          if (!priceMatch) return false;
          
          const price = parseInt(priceMatch[0].replace(/,/g, ''));
          const min = filters.minPrice ? parseInt(filters.minPrice) : 0;
          const max = filters.maxPrice ? parseInt(filters.maxPrice) : Infinity;
          
          return price >= min && price <= max;
        });
      }
    }

    return filtered;
  }, [transformedProperties, filters, showFiltered, searchQuery]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setShowFiltered(true);
  };

  const handleSearch = () => {
    setShowFiltered(true);
  };

  const handlePropertyClick = (property: Property) => {
    if (property.ref_no) {
      navigate(`/property/${property.ref_no}`);
    }
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      propertyType: ''
    });
    setShowFiltered(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Property Map Search - Interactive Real Estate Map | Future Homes Turkey"
        description="Search properties on our interactive map. Find apartments and homes in Turkey, Dubai, Cyprus, and Bali with detailed location views and instant property details."
        keywords="property map, real estate search, interactive map, property locations, Turkey properties, Dubai real estate"
        canonicalUrl="/map-search"
      />
      
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Property Map Search
          </h1>
          <p className="text-muted-foreground">
            Explore properties on our interactive map. Click on price markers to view details.
          </p>
        </div>

        {/* Search and View Toggle */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by location, property name, or reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>
              Search
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="rounded-none"
              >
                <Map className="h-4 w-4 mr-2" />
                Map
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  {showFiltered && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear
                    </Button>
                  )}
                </div>
                <PropertyFilter
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onSearch={handleSearch}
                />
              </CardContent>
            </Card>

            {/* Results Summary */}
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {filteredProperties.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Properties Found
                  </div>
                </div>
                {showFiltered && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {filters.location && (
                      <Badge variant="secondary" className="text-xs">
                        {filters.location}
                      </Badge>
                    )}
                    {filters.bedrooms && filters.bedrooms !== 'any' && (
                      <Badge variant="secondary" className="text-xs">
                        {filters.bedrooms} beds
                      </Badge>
                    )}
                    {(filters.minPrice || filters.maxPrice) && (
                      <Badge variant="secondary" className="text-xs">
                        €{filters.minPrice || '0'} - €{filters.maxPrice || '∞'}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {viewMode === 'map' ? (
              <PropertyMap
                properties={filteredProperties}
                onPropertyClick={handlePropertyClick}
                className="h-[600px] lg:h-[700px]"
              />
            ) : (
              <div className="space-y-4">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : filteredProperties.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <h3 className="text-lg font-semibold mb-2">No Properties Found</h3>
                      <p className="text-muted-foreground mb-4">
                        Try adjusting your search criteria or filters.
                      </p>
                      <Button onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProperties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={{
                          id: property.id,
                          refNo: property.ref_no || '',
                          title: property.title || 'Property',
                          location: property.location || '',
                          price: property.price || '€0',
                          bedrooms: property.bedrooms || '0',
                          bathrooms: property.bathrooms || '0',
                          area: property.area || '0',
                          status: property.status || 'available',
                          property_images: property.images || []
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyMapSearch;