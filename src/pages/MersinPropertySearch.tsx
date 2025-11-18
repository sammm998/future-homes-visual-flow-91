import React, { useState, useMemo, useEffect } from 'react';
import ElevenLabsWidget from "@/components/ElevenLabsWidget";
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import PropertyFilter from "@/components/PropertyFilter";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Eye, Grid } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import { filterProperties, PropertyFilters } from "@/utils/propertyFilter";
import SEOHead from "@/components/SEOHead";
import { useSEOLanguage } from "@/hooks/useSEOLanguage";
import useImagePreloading from "@/hooks/useImagePreloading";
import { preloadCriticalImages } from "@/utils/imageOptimization";
import OptimizedPropertyImage from "@/components/OptimizedPropertyImage";
import GlobalPerformanceOptimizer from "@/components/GlobalPerformanceOptimizer";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { preloadImages, forceImageLoading } from '@/utils/imagePreloader';

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);
  
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
    
    // Check if any filters are active (excluding location and sortBy defaults)
    const hasActiveFilters = Object.entries(urlFilters).some(([key, value]) => {
      if (key === 'location' || key === 'sortBy') return false;
      if (Array.isArray(value)) return value.length > 0;
      return value && value !== '';
    });
    
    setShowFiltered(hasActiveFilters);
  }, [searchParams, location.state]);
  
  // Filter properties to only show Mersin properties
  const mersinProperties = useMemo(() => {
    console.log('🏠 MersinPropertySearch: Processing properties, total received:', allProperties?.length || 0);
    console.log('📝 MersinPropertySearch: Sample properties:', allProperties?.slice(0, 2));
    
    const filtered = allProperties.filter(property => {
      const hasLocation = property.location?.toLowerCase().includes('mersin');
      const isNotSold = !property.status?.toLowerCase().includes('sold');
      console.log('🔍 Property', property.ref_no, '- Location:', property.location, '- Status:', property.status, '- Matches Mersin:', hasLocation, '- Not Sold:', isNotSold);
      return hasLocation && isNotSold;
    }).map(property => ({
      id: parseInt(property.ref_no) || parseInt(property.id),
      refNo: property.ref_no, // Add this mapping for reference number filtering
      title: property.title,
      location: property.location,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.sizes_m2,
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
      image: property.property_image || (property.property_images && property.property_images.length > 0 ? property.property_images[0] : "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/default/general/default.webp"),
      property_images: property.property_images,
      coordinates: [36.7987, 34.6420] as [number, number] // Default Mersin coordinates
    }));
    
    console.log('✅ MersinPropertySearch: Filtered Mersin properties:', filtered.length);
    console.log('📊 MersinPropertySearch: Sample filtered:', filtered.slice(0, 2));
    return filtered;
  }, [allProperties]);

  const properties = mersinProperties;

  // Preload critical images for better performance
  const propertyImages = useMemo(() => 
    properties.slice(0, 12).map(p => p.image).filter(Boolean), 
    [properties]
  );
  
  useImagePreloading(propertyImages, { priority: true });
  
  // Force immediate image loading
  useEffect(() => {
    const timer = setTimeout(() => {
      forceImageLoading();
      // Preload all property images
      preloadImages(propertyImages);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [propertyImages]);

  const filteredProperties = useMemo(() => {
    if (showFiltered) {
      return filterProperties(properties, filters);
    }
    return properties;
  }, [properties, showFiltered, filters]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProperties, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    const hasFilters = Object.entries(newFilters).some(([key, value]) => {
      return value && value !== '' && key !== 'location' && value !== 'ref';
    });
    
    setShowFiltered(hasFilters);

    // Update URL with filter parameters
    const searchParams = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '' && key !== 'location') {
        if (Array.isArray(value) && value.length > 0) {
          searchParams.set(key, value.join(','));
        } else if (typeof value === 'string' && value !== '') {
          // Map filter keys to URL parameter names for consistency
          const paramMap: Record<string, string> = {
            minPrice: 'priceMin',
            maxPrice: 'priceMax',
            minSquareFeet: 'areaMin',
            maxSquareFeet: 'areaMax'
          };
          const paramName = paramMap[key] || key;
          searchParams.set(paramName, value);
        }
      }
    });
    
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handlePropertyClick = (property: any) => {
    navigate(`/property/${property.id}`, { 
      state: { from: '/mersin' }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading properties...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-destructive mb-4">Error loading properties: {error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalPerformanceOptimizer 
        criticalImages={propertyImages}
        enableImageOptimization={true}
        enableResourceHints={true}
      />
      <SEOHead
        title="Mersin Properties & Turkish Citizenship | Future Homes"
        description="Turkish citizenship via Mersin properties. Mediterranean coastline real estate with investment opportunities. Expert guidance included."
        keywords="Mersin properties, Turkish citizenship, property investment Mersin, Mediterranean real estate, Mersin apartments"
        canonicalUrl={canonicalUrl}
        hreflangUrls={Object.fromEntries(hreflangUrls.map(h => [h.code, h.url]))}
      />
      <Navigation />
      
      {/* SEO Introductory Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="prose max-w-none mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Mersin Properties: Your Gateway to Turkish Citizenship</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Discover exceptional property investment opportunities in Mersin, Turkey's hidden gem along the Mediterranean coast. 
            With affordable prices starting from competitive rates, Mersin offers an excellent pathway to Turkish citizenship through property investment.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-muted-foreground mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">✅ Turkish Citizenship Eligible</h3>
              <p className="text-sm">Properties qualifying for Turkish citizenship by investment program with expert legal guidance included.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">🏖️ Mediterranean Lifestyle</h3>
              <p className="text-sm">Beautiful coastline properties with modern amenities, perfect for both investment and vacation homes.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">💰 Excellent Value</h3>
              <p className="text-sm">Competitive prices compared to other coastal Turkish cities, offering exceptional return on investment potential.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Properties in Mersin
          </h2>
          <p className="text-muted-foreground">
            {filteredProperties.length} properties found
          </p>
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
            {/* No Properties Message */}
            {filteredProperties.length === 0 && (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">No properties found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or browse all properties.
                  </p>
                  <Button onClick={() => {
                    setFilters({
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
                    setShowFiltered(false);
                  }}>
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}

            {/* Mobile Layout: One property per screen */}
            {filteredProperties.length > 0 && (
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
            )}

            {/* Desktop Layout: Properties Grid */}
            {filteredProperties.length > 0 && (
              <div className="hidden md:block">
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
            )}
          </div>
        </div>
      </div>

      {/* SEO Concluding Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-foreground mb-4">Why Choose Mersin for Property Investment?</h2>
          <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Investment Benefits</h3>
              <ul className="space-y-2 text-sm">
                <li>• Turkish citizenship eligibility with affordable properties</li>
                <li>• Excellent value for money compared to other coastal cities</li>
                <li>• Growing infrastructure and development projects</li>
                <li>• Strong rental demand from locals and tourists</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Lifestyle Benefits</h3>
              <ul className="space-y-2 text-sm">
                <li>• Beautiful Mediterranean coastline and beaches</li>
                <li>• Rich historical sites including ancient Tarsus</li>
                <li>• Modern amenities and healthcare facilities</li>
                <li>• Authentic Turkish culture with friendly locals</li>
              </ul>
            </div>
          </div>
          <p className="mt-6 text-sm">
            Discover Mersin's exceptional property investment opportunities with our expert guidance. Contact us to explore how Mersin real estate can provide both lifestyle benefits and Turkish citizenship pathways.
          </p>
        </div>
      </div>

      {/* ElevenLabs Widget */}
      <ElevenLabsWidget />
    </div>
  );
};

export default MersinPropertySearch;