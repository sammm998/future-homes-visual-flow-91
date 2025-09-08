import React, { useState, useMemo, useEffect } from 'react';
import ElevenLabsWidget from "@/components/ElevenLabsWidget";
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import PropertyFilter from "@/components/PropertyFilter";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Timeline } from "@/components/ui/timeline";
import { Grid } from "lucide-react";
import { useProperties } from '@/hooks/useProperties';
import { filterProperties, PropertyFilters } from "@/utils/propertyFilter";
import SEOHead from "@/components/SEOHead";
import { useSEOLanguage } from "@/hooks/useSEOLanguage";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const BaliPropertySearch = () => {
  const { canonicalUrl, hreflangUrls } = useSEOLanguage();
  
  // Router hooks - these should be called unconditionally
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { properties: allProperties, loading } = useProperties();
  
  const [filters, setFilters] = useState<PropertyFilters>({
    propertyType: '',
    bedrooms: '',
    location: 'Bali',
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Load filters from URL parameters and location state on mount
  useEffect(() => {
    const urlFilters: PropertyFilters = {
      propertyType: searchParams.get('propertyType') || '',
      bedrooms: searchParams.get('bedrooms') || '',
      location: searchParams.get('location') || 'Bali',
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
    
    // Always show all properties by default (don't auto-apply filters)
    setShowFiltered(false);
  }, [searchParams, location.state]);

  // Filter properties by location (Bali) and active status from database and map to expected format
  const baliProperties = useMemo(() => {
    const filteredProperties = allProperties
      .filter(property => 
        property.location?.toLowerCase().includes('bali') && 
        (property as any).is_active === true
      );

    // Deduplicate by ref_no, keeping the most recent one (last in array)
    const uniqueProperties = filteredProperties.reduce((acc, property) => {
      acc[property.ref_no || property.id] = property;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(uniqueProperties)
      .map((property, index) => ({
        id: parseInt(property.ref_no || index.toString()), // Use ref_no as numeric ID, fallback to index
        refNo: property.ref_no,
        title: property.title,
        location: property.location,
        price: property.price,
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        area: property.sizes_m2 || '',
        status: property.status || 'available',
        image: property.property_image || (property.property_images && property.property_images[0]) || '',
        coordinates: [-8.3405, 115.0920] as [number, number], // Default Bali coordinates
        features: property.property_facilities || [],
        // Additional fields for PropertyCard compatibility
        property_images: property.property_images || [], // Use correct field name
        description: property.description || '',
        facilities: property.property_facilities?.join(', ') || '',
        // Store original UUID for navigation
        uuid: property.id
      }));
  }, [allProperties]);

  const filteredProperties = useMemo(() => {
    if (showFiltered) {
      return filterProperties(baliProperties, filters);
    }
    return baliProperties;
  }, [baliProperties, filters, showFiltered]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProperties, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProperties.length]);

  const handleFilterChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    // Auto-trigger filtering for sortBy and other filter changes
    setShowFiltered(true);
  };

  const handleSearch = () => {
    setShowFiltered(true);
  };

  const handlePropertyClick = (property: any) => {
    navigate(`/property/${(property as any).uuid || property.refNo || property.id}`, { 
      state: { from: '/bali' }
    });
  };

  // Timeline data using ALL properties (not just 6)
  const timelineData = filteredProperties.map((property, index) => ({
    title: property.title,
    content: (
      <div>
        <p className="text-foreground text-xs md:text-sm font-normal mb-4">
          {(property as any).description?.substring(0, 200) || "Premium property with modern amenities and excellent location in Bali."}...
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
          {(property as any).property_images?.slice(0, 4).map((image: string, imgIndex: number) => (
            <img
              key={imgIndex}
              src={image}
              alt={`${property.title} - Image ${imgIndex + 1}`}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `/lovable-uploads/956541d2-b461-4acd-a29a-463c5a97983e.png`;
              }}
            />
          )) || (
            <>
              <img
                src="/lovable-uploads/956541d2-b461-4acd-a29a-463c5a97983e.png"
                alt="Property placeholder"
                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
              />
              <img
                src="/lovable-uploads/60f987b0-c196-47b5-894d-173d604fa4c8.png"
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
        title="Bali Properties & Investment Opportunities | Future Homes Indonesia"
        description="Premium Bali real estate investments in Seminyak, Canggu, Ubud & more. Luxury villas, apartments with strong rental yields. Expert guidance for foreign investors."
        keywords="Bali properties, Bali real estate, property investment Bali, Seminyak villas, Canggu apartments, Indonesia property, Bali investment"
        canonicalUrl={canonicalUrl}
        hreflang={hreflangUrls}
      />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Properties In Bali
          </h1>
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : `${baliProperties.length} properties found`}
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
            <Timeline data={timelineData} location="Bali" />
          </div>
        )}

        {/* Mobile Layout: One property per screen */}
        <div className="block md:hidden">
          <div className="space-y-6">
            {paginatedProperties.map((property, propertyIndex) => (
              <div key={`${property.id}-${propertyIndex}`} className="w-full">
                  <PropertyCard property={property} />
              </div>
            ))}
          </div>
          
          {/* Pagination for mobile */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          isActive={pageNum === currentPage}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>

        {/* Desktop Layout: Grid */}
        <div className="hidden md:block">
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredProperties.length)} of {filteredProperties.length} properties
              </span>
            </div>
          </div>

          {/* Properties Grid - Show when Timeline is OFF */}
          {!showTimeline && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProperties.map((property, propertyIndex) => (
                    <PropertyCard key={`${property.id}-${propertyIndex}`} property={property} />
                ))}
              </div>
              
              {/* Desktop Pagination */}
              {filteredProperties.length > 0 && totalPages > 1 && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNumber = i + 1;
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(pageNumber);
                              }}
                              isActive={currentPage === pageNumber}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      {totalPages > 5 && <PaginationEllipsis />}
                      
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
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
                      location: 'Bali',
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

export default BaliPropertySearch;
