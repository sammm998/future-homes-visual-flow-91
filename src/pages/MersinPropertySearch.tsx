import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import PropertyFilter from "@/components/PropertyFilter";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Timeline } from "@/components/ui/timeline";
import { Eye, Grid } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import { filterProperties, PropertyFilters } from "@/utils/propertyFilter";
import SEOHead from "@/components/SEOHead";
import { useSEOLanguage } from "@/hooks/useSEOLanguage";
import ElevenLabsWidget from "@/components/ElevenLabsWidget";

const MersinPropertySearch = () => {
  const { canonicalUrl, hreflangUrls } = useSEOLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { properties: allProperties, loading, error } = useProperties();
  
  const [filters, setFilters] = useState<PropertyFilters>({
    propertyType: '',
    bedrooms: '',
    location: 'Mersin',
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
      location: searchParams.get('location') || 'Mersin',
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
      return value && value !== '' && value !== 'ref' && value !== 'Mersin';
    });
    
    setShowFiltered(hasFilters);
  }, [searchParams, location.state]);
  
  // Filter properties to only show Mersin properties
  const mersinProperties = useMemo(() => {
    if (!allProperties || allProperties.length === 0) return [];
    
    return allProperties.filter(property => 
      property.location?.toLowerCase().includes('mersin')
    ).map(property => ({
      id: parseInt(property.ref_no) || parseInt(property.id) || 1,
      refNo: property.ref_no || property.id,
      title: property.title || 'Property in Mersin',
      location: property.location || 'Mersin, Turkey',
      price: property.price || '€250,000',
      bedrooms: property.bedrooms || '3+1',
      bathrooms: property.bathrooms || '2',
      area: property.sizes_m2 || '140',
      status: property.status || 'Available',
      image: property.property_image || "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/default/general/default.webp",
      coordinates: [36.7987, 34.6420] as [number, number]
    }));
  }, [allProperties]);

  const properties = mersinProperties;

  const filteredProperties = useMemo(() => {
    if (showFiltered) {
      return filterProperties(properties, filters);
    }
    return properties;
  }, [properties, filters, showFiltered]);

  const handleFilterChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    
    // Check if any meaningful filters are applied
    const hasFilters = Object.entries(newFilters).some(([key, value]) => {
      if (key === 'sortBy' || key === 'location') return false;
      return value && value !== '' && value !== 'Mersin';
    });
    
    setShowFiltered(hasFilters);
  };

  const handleSearch = () => {
    setShowFiltered(true);
  };

  const handlePropertyClick = (property: any) => {
    navigate(`/property/${property.id}`, { 
      state: { from: '/mersin' }
    });
  };

  // Timeline data using ALL Mersin properties
  const timelineData = filteredProperties.map((property, index) => ({
    title: property.title,
    content: (
      <div>
        <p className="text-foreground text-xs md:text-sm font-normal mb-4">
          Premium Mersin property with sea views and modern Mediterranean lifestyle.
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
          <img
            src={property.image}
            alt={`${property.title} - Image 1`}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `/lovable-uploads/000f440d-ddb1-4c1b-9202-eef1ef588a8c.png`;
            }}
          />
          <img
            src="/lovable-uploads/0d7b0c8a-f652-488b-bfca-3a11c1694220.png"
            alt="Property placeholder"
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
          />
        </div>
      </div>
    ),
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading Mersin properties...</div>
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
        title="Mersin Properties & Turkish Citizenship | Future Homes"
        description="Turkish citizenship via Mersin properties. Mediterranean coastline real estate with investment opportunities. Expert guidance included."
        keywords="Mersin properties, Turkish citizenship, property investment Mersin, Mediterranean real estate, Mersin apartments"
        canonicalUrl={canonicalUrl}
        hreflang={hreflangUrls}
      />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Properties in Mersin
          </h1>
          <p className="text-muted-foreground">
            {filteredProperties.length} properties found
          </p>
          {/* Debug info */}
          <div className="text-xs text-muted-foreground mt-1">
            Timeline: {showTimeline ? 'ON' : 'OFF'} | Total from DB: {allProperties?.length || 0} | Mersin filtered: {properties.length}
          </div>
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
            <Timeline data={timelineData} location="Mersin" />
          </div>
        )}

        {/* Properties Grid */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProperties.map((property) => (
            <div key={property.id} className="cursor-pointer" onClick={() => handlePropertyClick(property)}>
              <PropertyCard property={property} />
            </div>
          ))}
        </div>

        {/* Show message if no properties found */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No Mersin properties found in database.</p>
            <p className="text-sm text-muted-foreground mt-2">Total properties in DB: {allProperties?.length || 0}</p>
          </div>
        )}
      </div>

      {/* ElevenLabs Widget */}
      <ElevenLabsWidget />
    </div>
  );
};

export default MersinPropertySearch;