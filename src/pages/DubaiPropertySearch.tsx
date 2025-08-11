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

const DubaiPropertySearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { properties: allProperties, loading, error } = useProperties();
  
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
  
  // Filter properties to only show Dubai properties
  const dubaiProperties = useMemo(() => {
    return allProperties.filter(property => 
      property.location?.toLowerCase().includes('dubai')
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
        title: property.title,
        location: property.location,
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.sizes_m2,
        status: status,
        image: property.property_image || "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/default/general/default.webp",
        coordinates: [25.0470, 55.2000] as [number, number] // Default Dubai coordinates
      };
    });
  }, [allProperties]);

  const properties = dubaiProperties;

  const filteredProperties = useMemo(() => {
    if (showFiltered) {
      return filterProperties(properties, filters);
    }
    return properties;
  }, [properties, filters, showFiltered]);

  const handleFilterChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    // Auto-trigger filtering for sortBy and other filter changes
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

  // Timeline data using ALL Dubai properties
  const timelineData = filteredProperties.map((property, index) => {
    // Get the original property data to access property_images array
    const originalProperty = allProperties.find(p => p.id === property.id.toString());
    const propertyImages = originalProperty?.property_images || [];
    
    // Create array of 4 images, using property images if available, otherwise fallback images
    const fallbackImages = [
      "/lovable-uploads/000f440d-ddb1-4c1b-9202-eef1ef588a8c.png",
      "/lovable-uploads/0d7b0c8a-f652-488b-bfca-3a11c1694220.png",
      "/lovable-uploads/0ecd2ba5-fc2d-42db-8052-d51cffc0b438.png",
      "/lovable-uploads/35d77b72-fddb-4174-b101-7f0dd0f3385d.png"
    ];
    
    const images = [];
    for (let i = 0; i < 4; i++) {
      if (i === 0) {
        // First image: use main property image
        images.push(property.image);
      } else if (propertyImages[i - 1]) {
        // Use additional images from property_images array
        images.push(propertyImages[i - 1]);
      } else {
        // Fallback to placeholder images
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
              🏠 {property.bedrooms} | 📐 {property.area}m²
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading Dubai properties...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-destructive">Error loading properties: {error}</div>
        </div>
      </div>
    );
  }

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
            {properties.length} properties found
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
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProperties.map((property) => (
                <div key={property.id} className="cursor-pointer" onClick={() => handlePropertyClick(property)}>
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ElevenLabs Widget */}
      <ElevenLabsWidget />
    </div>
  );
};

export default DubaiPropertySearch;