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
import { dubaiProperties } from "@/data/dubaiProperties";
import SEOHead from "@/components/SEOHead";

import { filterProperties, PropertyFilters } from "@/utils/propertyFilter";

const DubaiPropertySearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [filters, setFilters] = useState<PropertyFilters>({
    propertyType: '',
    bedrooms: '',
    location: 'Dubai',
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
      location: searchParams.get('location') || 'Dubai',
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
      return value && value !== '' && value !== 'ref' && value !== 'Dubai';
    });
    
    setShowFiltered(hasFilters);
  }, [searchParams, location.state]);
  
  // Transform Dubai properties to match expected structure
  const dubaiPropertiesData = useMemo(() => {
    return dubaiProperties.map(property => ({
      id: property.id,
      ref_no: property.refNo,
      title: property.title,
      location: property.location,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      sizes_m2: property.area,
      status: property.status,
      image: property.image,
      property_image: property.image,
      property_images: property.images,
      coordinates: property.coordinates,
      // Add missing fields for compatibility
      property_facilities: [],
      facilities: property.status,
      property_type: 'Apartment',
      property_district: property.location.split(', ')[1] || 'Dubai'
    }));
  }, []);

  const filteredProperties = useMemo(() => {
    if (showFiltered) {
      return filterProperties(dubaiPropertiesData, filters);
    }
    return dubaiPropertiesData;
  }, [dubaiPropertiesData, filters, showFiltered]);

  const handleFilterChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    setShowFiltered(true);
  };

  const handleSearch = () => {
    setShowFiltered(true);
  };

  const handlePropertyClick = (property: any) => {
    navigate(`/property/${property.id}`, { 
      state: { from: '/dubai' } 
    });
  };

  // Timeline data using filtered properties
  const timelineData = filteredProperties.map((property) => {
    const fallbackImages = [
      "/lovable-uploads/000f440d-ddb1-4c1b-9202-eef1ef588a8c.png",
      "/lovable-uploads/0d7b0c8a-f652-488b-bfca-3a11c1694220.png",
      "/lovable-uploads/0ecd2ba5-fc2d-42db-8052-d51cffc0b438.png",
      "/lovable-uploads/35d77b72-fddb-4174-b101-7f0dd0f3385d.png"
    ];
    
    const images = [];
    for (let i = 0; i < 4; i++) {
      if (i === 0) {
        images.push(property.property_image);
      } else if (property.property_images && property.property_images[i - 1]) {
        images.push(property.property_images[i - 1]);
      } else {
        images.push(fallbackImages[i]);
      }
    }

    return {
      title: property.title,
      content: (
        <div>
          <p className="text-foreground text-xs md:text-sm font-normal mb-4">
            Premium property in Dubai with modern amenities and excellent location.
          </p>
          <div className="mb-6">
            <div className="flex gap-2 items-center text-muted-foreground text-xs md:text-sm mb-2">
              📍 {property.location}
            </div>
            <div className="flex gap-2 items-center text-muted-foreground text-xs md:text-sm mb-2">
              💰 {property.price}
            </div>
            <div className="flex gap-2 items-center text-muted-foreground text-xs md:text-sm mb-2">
              🏠 {property.bedrooms} | 📐 {property.sizes_m2}m²
            </div>
            <div className="flex gap-2 items-center text-muted-foreground text-xs md:text-sm mb-2">
              ✅ {property.status}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {images.map((imageSrc, imageIndex) => (
              <img
                key={imageIndex}
                src={imageSrc}
                alt={`${property.title} - Image ${imageIndex + 1}`}
                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = fallbackImages[imageIndex] || fallbackImages[0];
                }}
              />
            ))}
          </div>
        </div>
      ),
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Dubai Properties Investment | Future Homes UAE"
        description="Premium Dubai real estate with guaranteed returns. Luxury apartments & villas with world-class amenities. Expert investment guidance."
        keywords="Dubai properties, Dubai real estate, property investment Dubai, luxury apartments Dubai, villas Dubai"
        canonicalUrl="https://futurehomesturkey.com/dubai"
      />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Properties In Dubai
          </h1>
          <p className="text-muted-foreground">
            {dubaiPropertiesData.length} properties found
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

        {/* Timeline Toggle */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <Switch isSelected={showTimeline} onChange={setShowTimeline}>
            <span className="text-sm text-muted-foreground">Timeline View</span>
          </Switch>
        </div>

        {/* Timeline Component - Only show when toggle is enabled */}
        {showTimeline && (
          <div className="mb-8">
            <Timeline data={timelineData} location="Dubai" />
          </div>
        )}

        {/* Mobile Layout: One property per screen */}
        <div className="block md:hidden">
          <div className="space-y-6">
            {filteredProperties.map((property) => (
              <div key={property.id} className="cursor-pointer min-h-[60vh] flex items-center justify-center" onClick={() => handlePropertyClick(property)}>
                <div className="w-full max-w-sm mx-auto">
                  <PropertyCard property={property} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Layout: Properties Grid - Show when Timeline is OFF */}
        <div className="hidden md:block">
          {!showTimeline && (
            <>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Showing {filteredProperties.length} of {dubaiPropertiesData.length} properties
                  </span>
                </div>
              </div>
              
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProperties.map((property) => (
                  <div key={property.id} className="cursor-pointer" onClick={() => handlePropertyClick(property)}>
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            </>
          )}
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
                Try adjusting your search criteria to find more properties.
              </p>
              <Button 
                onClick={() => {
                  setFilters({
                    propertyType: '',
                    bedrooms: '',
                    location: 'Dubai',
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

      {/* ElevenLabs Widget */}
      <ElevenLabsWidget />
    </div>
  );
};

export default DubaiPropertySearch;