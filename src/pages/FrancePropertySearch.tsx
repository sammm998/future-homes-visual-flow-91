import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import PropertyFilter from "@/components/PropertyFilter";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Eye, Grid } from "lucide-react";
import { franceProperties } from '@/data/franceProperties';
import { filterProperties, PropertyFilters } from "@/utils/propertyFilter";
import SEOHead from "@/components/SEOHead";

const FrancePropertySearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
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
    sortBy: 'ref',
    referenceNo: ''
  });
  const [showFiltered, setShowFiltered] = useState(false);

  // Load filters from URL parameters and location state
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlFilters: PropertyFilters = {
      propertyType: searchParams.get('propertyType') || '',
      bedrooms: searchParams.get('bedrooms') || '',
      location: 'France', // Always set to France for this page
      district: searchParams.get('district') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      minSquareFeet: searchParams.get('minSquareFeet') || '',
      maxSquareFeet: searchParams.get('maxSquareFeet') || '',
      facilities: searchParams.get('facilities')?.split(',').filter(Boolean) || [],
      sortBy: searchParams.get('sortBy') || 'ref',
      referenceNo: searchParams.get('referenceNo') || ''
    };
    
    // Merge with location state if available
    if (location.state?.filters) {
      Object.assign(urlFilters, location.state.filters, { location: 'France' });
    }
    
    setFilters(urlFilters);
    
    // If any filters are set, show filtered results
    const hasFilters = Object.values(urlFilters).some(value => value && value !== 'ref' && value !== 'France');
    if (hasFilters) {
      setShowFiltered(true);
    }
  }, [location.search, location.state]);

  // Collect properties from France
  const allProperties = useMemo(() => {
    return franceProperties;
  }, []);

  const filteredProperties = useMemo(() => {
    let result: any[] = allProperties;
    
    if (showFiltered) {
      result = filterProperties(allProperties, filters);
    } else if (filters.sortBy && filters.sortBy !== 'ref') {
      // Apply only sorting when not showing filtered results
      result = [...allProperties].sort((a: any, b: any) => {
        switch (filters.sortBy) {
          case 'price-low':
            const priceA = parseInt(a.price.replace(/[€$£,]/g, ''));
            const priceB = parseInt(b.price.replace(/[€$£,]/g, ''));
            return priceA - priceB;
          case 'price-high':
            const priceA2 = parseInt(a.price.replace(/[€$£,]/g, ''));
            const priceB2 = parseInt(b.price.replace(/[€$£,]/g, ''));
            return priceB2 - priceA2;
          case 'newest':
            return b.id - a.id;
          case 'oldest':
            return a.id - b.id;
          case 'area-large':
            const areaA = parseInt(a.area.split(' <> ')[0]);
            const areaB = parseInt(b.area.split(' <> ')[0]);
            return areaB - areaA;
          case 'area-small':
            const areaA2 = parseInt(a.area.split(' <> ')[0]);
            const areaB2 = parseInt(b.area.split(' <> ')[0]);
            return areaA2 - areaB2;
          case 'bedrooms-most':
            const bedroomsA = parseInt(a.bedrooms.split(' <> ')[0] || a.bedrooms);
            const bedroomsB = parseInt(b.bedrooms.split(' <> ')[0] || b.bedrooms);
            return bedroomsB - bedroomsA;
          case 'bedrooms-least':
            const bedroomsA2 = parseInt(a.bedrooms.split(' <> ')[0] || a.bedrooms);
            const bedroomsB2 = parseInt(b.bedrooms.split(' <> ')[0] || b.bedrooms);
            return bedroomsA2 - bedroomsB2;
          default:
            return a.id - b.id;
        }
      });
    }
    
    return result;
  }, [allProperties, filters, showFiltered]);

  const handleFilterChange = (newFilters: PropertyFilters) => {
    setFilters({ ...newFilters, location: 'France' }); // Always keep location as France
    setShowFiltered(true);
  };

  const handleSearch = () => {
    setShowFiltered(true);
  };

  const handlePropertyClick = (property: any) => {
    navigate(`/property/${property.refNo || property.slug || property.id}`, { 
      state: { from: '/france' }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="France Properties Investment | Future Homes"
        description="European real estate investment in France. Premium properties with expert guidance & consultation. Luxury French homes await."
        keywords="France properties, France real estate, property investment France, luxury homes France, European properties"
        canonicalUrl="https://futurehomesturkey.com/france"
      />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            France Properties
          </h1>
          <p className="text-muted-foreground">
            {allProperties.length} properties found in France
          </p>
        </div>

        {/* Filter at top */}
        <div className="mb-6">
          <PropertyFilter 
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            horizontal={true}
          />
        </div>

        {/* Mobile Layout: One property per screen */}
        <div className="block md:hidden">
          <div className="space-y-6">
            {filteredProperties.map((property) => (
              <div key={property.id} className="w-full">
                  <PropertyCard property={property} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Layout: Grid */}
        <div className="hidden md:block">
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Showing {filteredProperties.length} of {allProperties.length} properties
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Grid className="w-4 h-4" />
                Grid View
              </Button>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* Empty State */}
          {filteredProperties.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Grid className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Properties Found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria to find more properties in France.
                </p>
                <Button 
                  onClick={() => {
                    setFilters({
                      propertyType: '',
                      bedrooms: '',
                      location: 'France',
                      district: '',
                      minPrice: '',
                      maxPrice: '',
                      minSquareFeet: '',
                      maxSquareFeet: '',
                      facilities: [],
                      sortBy: 'ref',
                      referenceNo: ''
                    });
                    setShowFiltered(false);
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ElevenLabs Conversational AI Widget */}
      <elevenlabs-convai agent-id="agent_01jzfqzb51eha8drdp5z56zavy"></elevenlabs-convai>
    </div>
  );
};

export default FrancePropertySearch;