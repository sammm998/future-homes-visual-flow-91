import React, { useState, useMemo, useEffect } from 'react';
import ElevenLabsWidget from "@/components/ElevenLabsWidget";
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import PropertyFilter from "@/components/PropertyFilter";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Timeline } from "@/components/ui/timeline";
import { Eye, Grid } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import SEOHead from "@/components/SEOHead";

import { filterProperties, PropertyFilters } from "@/utils/propertyFilter";

const CyprusPropertySearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { properties: allProperties, loading, error } = useProperties();
  
  const [filters, setFilters] = useState<PropertyFilters>({
    propertyType: '',
    bedrooms: '',
    location: 'Cyprus',
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
  const [showTimeline, setShowTimeline] = useState(false);
  
  // Load filters from URL parameters and location state on mount
  useEffect(() => {
    const urlFilters: PropertyFilters = {
      propertyType: searchParams.get('propertyType') || '',
      bedrooms: searchParams.get('bedrooms') || '',
      location: searchParams.get('location') || 'Cyprus',
      district: searchParams.get('district') || '',
      minPrice: searchParams.get('priceMin') || searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('priceMax') || searchParams.get('maxPrice') || '',
      minSquareFeet: searchParams.get('areaMin') || searchParams.get('minSquareFeet') || '',
      maxSquareFeet: searchParams.get('areaMax') || searchParams.get('maxSquareFeet') || '',
      facilities: searchParams.get('facilities')?.split(',').filter(Boolean) || [],
      sortBy: (searchParams.get('sortBy') as any) || 'ref',
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
      return value && value !== '' && value !== 'ref' && value !== 'Cyprus';
    });
    
    setShowFiltered(hasFilters);
  }, [searchParams, location.state]);
  
  // Filter properties to only show Cyprus properties
  const cyprusProperties = useMemo(() => {
    return allProperties.filter(property => 
      property.location?.toLowerCase().includes('cyprus')
    ).map(property => {
      // Extract status from facilities - prioritize certain statuses
      let status = 'available';
      const facilities = property.property_facilities || [];
      const facilitiesString = property.facilities || '';
      
      // Combine all facility sources
      const allFacilities = [...facilities, ...facilitiesString.split(',').map(f => f.trim())];
      
      // Check for key status indicators in priority order
      if (allFacilities.some(f => f.toLowerCase().includes('under construction'))) {
        status = 'Under Construction';
      } else if (allFacilities.some(f => f.toLowerCase().includes('ready to move'))) {
        status = 'Ready to Move';
      } else if (allFacilities.some(f => f.toLowerCase().includes('sea view'))) {
        status = 'Sea View';
      } else if (allFacilities.some(f => f.toLowerCase().includes('private pool'))) {
        status = 'Private Pool';
      } else if (allFacilities.some(f => f.toLowerCase().includes('for residence permit'))) {
        status = 'For Residence Permit';
      }

      return {
        id: parseInt(property.ref_no) || parseInt(property.id),
        refNo: property.ref_no,
        title: property.title,
        location: property.location,
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.sizes_m2,
        status: status,
        image: property.property_image || "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/default/general/default.webp",
        coordinates: [35.1264, 33.4299] as [number, number] // Default Cyprus coordinates
      };
    });
  }, [allProperties]);

  const filteredProperties = useMemo(() => {
    if (showFiltered) {
      return filterProperties(cyprusProperties, filters);
    }
    return cyprusProperties;
  }, [cyprusProperties, filters, showFiltered]);

  const handleFilterChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    
    // Check if any meaningful filters are applied
    const hasFilters = Object.entries(newFilters).some(([key, value]) => {
      if (key === 'sortBy' || key === 'location') return false; // Don't count sortBy or default location
      return value && value !== '' && value !== 'Cyprus';
    });
    
    // Auto-trigger filtering when filters are applied
    setShowFiltered(hasFilters);
  };

  const handleSearch = () => {
    setShowFiltered(true);
  };

  const handlePropertyClick = (property: any) => {
    navigate(`/property/${property.id}`, { 
      state: { from: '/cyprus' } 
    });
  };

  const displayedProperties = showTimeline ? filteredProperties : filteredProperties.slice(0, 12);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 text-center">Loading properties...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 text-center text-red-600">Error loading properties: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Properties For Sale in Cyprus - Future Homes"
        description="Discover luxury apartments and villas for sale in Cyprus. Mediterranean island properties with modern amenities, close to beach and stunning sea views."
        keywords="Cyprus properties, Cyprus real estate, Cyprus apartments, Cyprus villas, properties for sale Cyprus"
      />
      
      <Navigation />
      <ElevenLabsWidget />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Properties In Cyprus
            </h1>
            <p className="text-xl text-muted-foreground">
              {cyprusProperties.length} properties found
            </p>
          </div>

          <PropertyFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
          />

          {showFiltered && (
            <div className="mb-4 text-center">
              <p className="text-sm text-muted-foreground">
                Showing {filteredProperties.length} of {cyprusProperties.length} properties
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setFilters({
                    propertyType: '',
                    bedrooms: '',
                    location: 'Cyprus',
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
                className="mt-2"
              >
                Clear Filters
              </Button>
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Showing {displayedProperties.length} of {filteredProperties.length} properties
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={!showTimeline ? "default" : "outline"}
                size="sm"
                onClick={() => setShowTimeline(false)}
                className="flex items-center gap-2"
              >
                <Grid size={16} />
                Grid View
              </Button>
              <Button
                variant={showTimeline ? "default" : "outline"}
                size="sm"
                onClick={() => setShowTimeline(true)}
                className="flex items-center gap-2"
              >
                <Eye size={16} />
                Timeline View
              </Button>
            </div>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold mb-2">No Properties Found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search criteria to find more properties.</p>
              <Button onClick={() => {
                setFilters({
                  propertyType: '',
                  bedrooms: '',
                  location: 'Cyprus',
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
              }}>
                Clear Filters
              </Button>
            </div>
          ) : showTimeline ? (
            <Timeline 
              data={filteredProperties.map((property, index) => ({
                title: property.title,
                content: (
                  <div>
                    <p className="text-foreground text-xs md:text-sm font-normal mb-4">
                      Premium property with modern amenities and excellent location in Cyprus.
                    </p>
                    <div className="mb-6">
                      <div className="flex gap-2 items-center text-muted-foreground text-xs md:text-sm mb-2">
                        📍 {property.location}
                      </div>
                      <div className="flex gap-2 items-center text-muted-foreground text-xs md:text-sm mb-2">
                        💰 {property.price}
                      </div>
                      <div className="flex gap-2 items-center text-muted-foreground text-xs md:text-sm mb-2">
                        🏠 {property.bedrooms} | 📐 {property.area}m²
                      </div>
                      <div className="flex gap-2 items-center text-muted-foreground text-xs md:text-sm mb-2">
                        🏷️ {property.status}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    </div>
                    <Button 
                      onClick={() => handlePropertyClick(property)}
                      className="w-full"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </div>
                )
              }))}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProperties.map((property) => (
                <div key={property.id} onClick={() => handlePropertyClick(property)}>
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}

          {!showTimeline && filteredProperties.length > 12 && displayedProperties.length < filteredProperties.length && (
            <div className="text-center mt-8">
              <Button 
                onClick={() => setShowTimeline(true)}
                variant="outline"
                size="lg"
              >
                View All {filteredProperties.length} Properties
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CyprusPropertySearch;