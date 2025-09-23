import React, { useState, useMemo, useEffect } from 'react';
import ElevenLabsWidget from "@/components/ElevenLabsWidget";
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import PropertyFilter from "@/components/PropertyFilter";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
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

const AntalyaPropertySearch = () => {
  const { canonicalUrl, hreflangUrls } = useSEOLanguage();
  
  // Router hooks - these should be called unconditionally
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { properties: allProperties, loading } = useProperties();
  
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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
    
    // Always show all properties by default (don't auto-apply filters)
    setShowFiltered(false);
  }, [searchParams, location.state]);

  // Filter properties by location (Antalya) and active status from database and map to expected format
  const antalyaProperties = useMemo(() => {
    const filteredProperties = allProperties
      .filter(property => 
        property.location?.toLowerCase().includes('antalya') && 
        (property as any).is_active === true &&
        !property.status?.toLowerCase().includes('sold')
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
        status: (() => {
          // Handle property status - use original status from database  
          let status = property.status || 'available';
          
          // Handle compound statuses (multiple statuses separated by commas)
          if (status.includes(',')) {
            // If multiple statuses, prioritize certain ones
            if (status.toLowerCase().includes('sold')) {
              return 'sold';
            } else if (status.toLowerCase().includes('under construction')) {
              return 'Under Construction';
            } else if (status.toLowerCase().includes('ready to move')) {
              return 'Ready To Move';
            } else if (status.toLowerCase().includes('for residence permit')) {
              return 'For Residence Permit';
            } else {
              // Use the first status if no priority match
              return status.split(',')[0].trim();
            }
          }
          return status;
        })(),
        image: property.property_image || (property.property_images && property.property_images[0]) || '',
        coordinates: [0, 0] as [number, number], // Default coordinates
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
      return filterProperties(antalyaProperties, filters);
    }
    return antalyaProperties;
  }, [antalyaProperties, filters, showFiltered]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProperties, currentPage, itemsPerPage]);

  const handleFilterChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    // Auto-trigger filtering for sortBy and other filter changes
    setShowFiltered(true);
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setShowFiltered(true);
    setCurrentPage(1);
  };

  const handlePropertyClick = (property: any) => {
    navigate(`/property/${(property as any).uuid || property.refNo || property.id}`, { 
      state: { from: '/antalya' }
    });
  };


  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Antalya Real Estate - Premium Properties for Sale in Turkey | Future Homes"
        description="Discover luxury properties in Antalya, Turkey. Beachfront apartments, villas & investment opportunities. Turkish citizenship programs available. Expert guidance from Future Homes Turkey."
        keywords="Antalya real estate, Turkey property for sale, Antalya apartments, Turkish citizenship by investment, beachfront properties Antalya, luxury villas Turkey, property investment Antalya, overseas property Turkey"
        canonicalUrl={canonicalUrl}
        hreflangUrls={Object.fromEntries(hreflangUrls.map(h => [h.code, h.url]))}
      />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Properties In Antalya
          </h1>
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : `${antalyaProperties.length} properties found`}
          </p>
        </div>

        {/* Introductory SEO Content */}
        <div className="mb-8 p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-border/20">
          <div className="prose prose-gray max-w-none dark:prose-invert">
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Discover premium real estate opportunities in Antalya, Turkey's Mediterranean jewel and one of Europe's fastest-growing property markets. 
              As Turkey's tourism capital with over 15 million annual visitors, Antalya offers exceptional investment potential combining lifestyle luxury with strong rental yields.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our expert team at Future Homes has been guiding international investors in Antalya's property market for over 15 years. From beachfront apartments in Lara 
              to luxury villas in Konyaaltı, we provide comprehensive market insights, legal guidance, and post-purchase support. 
              <strong className="text-foreground">All Antalya properties qualify for Turkish citizenship by investment programs</strong>, offering EU-adjacent residency benefits.
            </p>
          </div>
        </div>

        {/* Layout with sidebar filter on left and content on right */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar filter - hidden on mobile, visible on desktop */}
          <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
            <PropertyFilter 
              filters={filters}
              onFilterChange={handleFilterChange}
              onSearch={handleSearch}
              horizontal={false}
            />
          </div>

          {/* Mobile filter toggle - only visible on mobile */}
          <div className="block lg:hidden mb-6">
            <PropertyFilter 
              filters={filters}
              onFilterChange={handleFilterChange}
              onSearch={handleSearch}
              horizontal={true}
            />
          </div>

          {/* Main content area */}
          <div className="flex-1 min-w-0">
            {/* Mobile Layout: One property per screen */}
            <div className="block md:hidden">
              <div className="space-y-6">
                {paginatedProperties.map((property, propertyIndex) => (
                  <div key={`${property.id}-${propertyIndex}`} className="cursor-pointer min-h-[60vh] flex items-center justify-center" onClick={() => handlePropertyClick(property)}>
                    <div className="w-full max-w-sm mx-auto">
                      <PropertyCard property={property} />
                    </div>
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
                    Showing {filteredProperties.length} of {antalyaProperties.length} properties
                  </span>
                </div>
              </div>

              {/* Properties Grid */}
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {paginatedProperties.map((property, propertyIndex) => (
                  <div key={`${property.id}-${propertyIndex}`} className="cursor-pointer" onClick={() => handlePropertyClick(property)}>
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
              
              {/* Pagination for desktop */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) setCurrentPage(currentPage - 1);
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
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                          }}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
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
        </div>

        {/* Concluding SEO Content */}
        <div className="mt-12 p-6 bg-gradient-to-br from-accent/5 to-primary/5 rounded-lg border border-border/20">
          <div className="prose prose-gray max-w-none dark:prose-invert">
            <h2 className="text-2xl font-bold text-foreground mb-4">Why Choose Antalya for Property Investment?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Market Advantages</h3>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Year-round tourism driving rental demand</li>
                  <li>• 15%+ annual property value appreciation</li>
                  <li>• Turkish citizenship eligibility ($400K+ properties)</li>
                  <li>• No restrictions on foreign property ownership</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Lifestyle Benefits</h3>
                <ul className="text-muted-foreground space-y-1">
                  <li>• 300+ sunny days annually</li>
                  <li>• Mediterranean beaches & mountain views</li>
                  <li>• Rich cultural heritage & modern amenities</li>
                  <li>• International airport with direct EU flights</li>
                </ul>
              </div>
            </div>
            <p className="text-muted-foreground mt-4">
              <strong className="text-foreground">Future Homes' Antalya expertise:</strong> With local offices and Turkish-speaking staff, 
              we've facilitated over 2,000 successful property transactions in Antalya. Our comprehensive service includes property management, 
              rental programs, and citizenship application support.
            </p>
          </div>
        </div>
      </div>

      {/* ElevenLabs Widget */}
      <ElevenLabsWidget />
    </div>
  );
};

export default AntalyaPropertySearch;