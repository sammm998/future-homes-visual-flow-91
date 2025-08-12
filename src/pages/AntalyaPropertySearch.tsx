import React, { useState, useMemo, useEffect } from 'react';
import ElevenLabsWidget from "@/components/ElevenLabsWidget";
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import PropertyFilter from "@/components/PropertyFilter";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Timeline } from "@/components/ui/timeline";
import { Grid } from "lucide-react";
import { useFilteredProperties } from '@/hooks/useSupabaseProperties';
import { filterProperties, PropertyFilters } from "@/utils/propertyFilter";
import SEOHead from "@/components/SEOHead";
import { useSEOLanguage } from "@/hooks/useSEOLanguage";

const AntalyaPropertySearch = () => {
  const { canonicalUrl, hreflangUrls } = useSEOLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [filters, setFilters] = useState<PropertyFilters>({
    propertyType: '',
    bedrooms: '',
    location: 'Antalya',
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
  
  // Get properties from Supabase with real-time updates
  const { properties: supabaseProperties, loading, error } = useFilteredProperties({
    location: 'Antalya',
    minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
    bedrooms: filters.bedrooms ? parseInt(filters.bedrooms) : undefined,
    propertyType: filters.propertyType || undefined
  });

  // Load filters from URL parameters and location state on mount
  useEffect(() => {
    const urlFilters: PropertyFilters = {
      propertyType: searchParams.get('propertyType') || '',
      bedrooms: searchParams.get('bedrooms') || '',
      location: searchParams.get('location') || 'Antalya',
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
      return value && value !== '' && value !== 'ref' && value !== 'Antalya';
    });
    
    setShowFiltered(hasFilters);
  }, [searchParams, location.state]);

  const filteredProperties = useMemo(() => {
    if (loading || error) return [];
    
    // Convert Supabase properties to match the expected format
    const convertedProperties = supabaseProperties.map(prop => ({
      id: prop.id,
      refNo: prop.refNo,
      title: prop.title,
      location: prop.location,
      price: prop.price,
      bedrooms: prop.bedrooms.toString(),
      bathrooms: prop.bathrooms.toString(),
      area: prop.size,
      status: 'available',
      image: prop.image,
      images: prop.images,
      description: prop.description,
      coordinates: { lat: 0, lng: 0 }
    }));

    if (showFiltered) {
      return filterProperties(convertedProperties, filters);
    }
    return convertedProperties;
  }, [supabaseProperties, filters, showFiltered, loading, error]);

  const handleFilterChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    // Auto-trigger filtering for sortBy and other filter changes
    setShowFiltered(true);
  };

  const handleSearch = () => {
    setShowFiltered(true);
  };

  const handlePropertyClick = (property: any) => {
    navigate(`/property/${property.slug || property.id}`, { 
      state: { from: '/antalya' }
    });
  };

  // Timeline data using ALL properties (not just 6)
  const timelineData = filteredProperties.map((property, index) => ({
    title: property.title,
    content: (
      <div>
        <p className="text-foreground text-xs md:text-sm font-normal mb-4">
          {(property as any).description?.substring(0, 200) || "Premium property with modern amenities and excellent location."}...
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
          {(property as any).images?.slice(0, 4).map((image: string, imgIndex: number) => (
            <img
              key={imgIndex}
              src={image}
              alt={`${property.title} - Image ${imgIndex + 1}`}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `/lovable-uploads/000f440d-ddb1-4c1b-9202-eef1ef588a8c.png`;
              }}
            />
          )) || (
            <>
              <img
                src="/lovable-uploads/000f440d-ddb1-4c1b-9202-eef1ef588a8c.png"
                alt="Property placeholder"
                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
              />
              <img
                src="/lovable-uploads/0d7b0c8a-f652-488b-bfca-3a11c1694220.png"
                alt="Property placeholder"
                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
              />
              <img
                src="/lovable-uploads/0ecd2ba5-fc2d-42db-8052-d51cffc0b438.png"
                alt="Property placeholder"
                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
              />
              <img
                src="/lovable-uploads/35d77b72-fddb-4174-b101-7f0dd0f3385d.png"
                alt="Property placeholder"
                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
              />
            </>
          )}
        </div>
      </div>
    ),
  }));

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Antalya Properties & Turkish Citizenship | Future Homes"
        description="Turkish citizenship by investment via Antalya properties. Premium Mediterranean real estate with expert guidance. Start your new life today."
        keywords="Antalya properties, Turkish citizenship, property investment Turkey, Mediterranean real estate, Antalya apartments, Turkish passport"
        canonicalUrl={canonicalUrl}
        hreflang={hreflangUrls}
      />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Properties In Antalya
          </h1>
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : error ? 'Error loading properties' : `${filteredProperties.length} properties found`}
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
            <Timeline data={timelineData} location="Antalya" />
          </div>
        )}

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
                {loading ? 'Loading...' : `Showing ${filteredProperties.length} of ${supabaseProperties.length} properties`}
              </span>
            </div>
          </div>

          {/* Properties Grid - Show when Timeline is OFF */}
          {!showTimeline && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

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
                      location: 'Antalya',
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

      {/* ElevenLabs Widget */}
      <ElevenLabsWidget />
    </div>
  );
};

export default AntalyaPropertySearch;