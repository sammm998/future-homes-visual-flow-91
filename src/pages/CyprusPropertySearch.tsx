import React, { useState, useMemo, useEffect } from 'react';

import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import PropertyFilter from "@/components/PropertyFilter";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Eye, Grid } from "lucide-react";
import { filterProperties, PropertyFilters } from "@/utils/propertyFilter";
import SEOHead from "@/components/SEOHead";
import { useProperties } from "@/hooks/useProperties";
import { useSEOLanguage } from "@/hooks/useSEOLanguage";
import { generateLocationSchema, generatePropertyListSchema, generateBreadcrumbSchema } from "@/utils/seoUtils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const CyprusPropertySearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { properties: allProperties, loading } = useProperties();
  
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

    // Load additional filters from location state if available
    if (location.state?.filters) {
      Object.keys(location.state.filters).forEach(key => {
        if (location.state.filters[key] && location.state.filters[key] !== '') {
          (urlFilters as any)[key] = location.state.filters[key];
        }
      });
    }

    setFilters(urlFilters);
    
    // Check if any filters are active (excluding location default, but including sortBy if changed)
    const hasActiveFilters = Object.entries(urlFilters).some(([key, value]) => {
      if (key === 'location') return false;
      if (key === 'sortBy') return value !== 'ref'; // Include sortBy if it's not default
      if (Array.isArray(value)) return value.length > 0;
      return value && value !== '';
    });
    
    setShowFiltered(hasActiveFilters);
  }, [searchParams, location.state]);
  
  // Filter properties to only show Cyprus properties
  const cyprusProperties = useMemo(() => {
    const filtered = allProperties.filter(property => {
      const hasLocation = property.location?.toLowerCase().includes('cyprus');
      const isNotSold = !property.status?.toLowerCase().includes('sold');
      return hasLocation && isNotSold;
    }).map(property => ({
      id: parseInt(property.ref_no) || parseInt(property.id),
      refNo: property.ref_no,
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
      coordinates: [35.3369, 33.3192] as [number, number] // Default Cyprus coordinates
    }));
    
    return filtered;
  }, [allProperties]);

  const properties = cyprusProperties;

  const filteredProperties = useMemo(() => {
    if (showFiltered) {
      return filterProperties(properties, filters);
    }
    // When no filters active, just sort by reference number
    return [...properties].sort((a, b) => {
      const refA = parseInt(a.refNo || '0');
      const refB = parseInt(b.refNo || '0');
      return refA - refB;
    });
  }, [properties, showFiltered, filters]);

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
    
    // Check if any meaningful filters are applied
    const hasFilters = Object.entries(newFilters).some(([key, value]) => {
      if (key === 'sortBy' || key === 'location') return false; // Don't count sortBy or default location
      return value && value !== '' && value !== 'Cyprus';
    });
    
    // Auto-trigger filtering when filters are applied
    setShowFiltered(hasFilters);
    
    // Update URL parameters with current filters
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '' && key !== 'location') {
        if (Array.isArray(value) && value.length > 0) {
          params.set(key, value.join(','));
        } else if (typeof value === 'string' && value !== '') {
          params.set(key, value);
        }
      }
    });
    
    // Use navigate with replace to update URL and React Router state
    const newSearch = params.toString();
    navigate(`${location.pathname}${newSearch ? '?' + newSearch : ''}`, { replace: true });
  };

  const handleSearch = () => {
    setShowFiltered(true);
  };

  const handlePropertyClick = (property: any) => {
    // Save current URL with all search params for back navigation
    const currentUrl = `${location.pathname}${location.search}`;
    navigate(`/property/${property.id}`, { 
      state: { 
        from: '/cyprus',
        returnUrl: currentUrl
      } 
    });
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Cyprus Property for Sale | EU Citizenship by Investment | Future Homes"
        description="Buy property in Cyprus and gain EU citizenship. Luxury homes, apartments & villas with citizenship program benefits. Expert guidance for European property investment & Cyprus Golden Visa."
        keywords="Cyprus property for sale, EU citizenship by investment, buy property Cyprus, Cyprus citizenship program, European property investment, Cyprus Golden Visa, luxury homes Cyprus, Cyprus real estate EU passport"
        canonicalUrl="https://futurehomesinternational.com/cyprus"
      />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* SEO Intro Content */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Properties In Cyprus
          </h1>
          <div className="prose max-w-none text-muted-foreground">
            <p className="mb-4">
              Discover exceptional Cyprus real estate opportunities offering EU citizenship and residence benefits. Our premium collection features luxury villas, modern apartments, and investment properties in Cyprus's most desirable locations, providing direct access to European Union citizenship through property investment.
            </p>
            <p className="mb-4">
              Cyprus offers the fastest EU citizenship program through real estate investment, with properties starting from €300,000. Whether you're seeking beautiful coastal properties in Limassol, luxury developments in Paphos, or investment opportunities in Nicosia, Cyprus combines Mediterranean lifestyle with European Union privileges.
            </p>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {properties.length} properties found
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


        {/* Mobile Layout: One property per screen */}
        <div className="block md:hidden">
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No properties found matching your criteria.</p>
                <Button 
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
                  variant="outline"
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              paginatedProperties.map((property, propertyIndex) => (
                <div key={`${property.id}-${propertyIndex}`} className="cursor-pointer min-h-[60vh] flex items-center justify-center" onClick={() => handlePropertyClick(property)}>
                  <div className="w-full max-w-sm mx-auto">
                    <PropertyCard property={property} />
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Mobile Pagination */}
          {filteredProperties.length > 0 && totalPages > 1 && (
            <div className="mt-8">
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
                            window.scrollTo({ top: 0, behavior: 'smooth' });
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
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>

        {/* Desktop Layout: Properties Grid */}
        <div className="hidden md:block">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {filteredProperties.length === 0 ? (
                  <div className="text-center py-12 col-span-full">
                    <p className="text-muted-foreground text-lg">No properties found matching your criteria.</p>
                    <Button 
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
                      variant="outline"
                      className="mt-4"
                    >
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  paginatedProperties.map((property, propertyIndex) => (
                    <div key={`${property.id}-${propertyIndex}`} className="cursor-pointer" onClick={() => handlePropertyClick(property)}>
                      <PropertyCard property={property} />
                    </div>
                  ))
                )}
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
                            if (currentPage > 1) {
                              setCurrentPage(currentPage - 1);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
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
                                window.scrollTo({ top: 0, behavior: 'smooth' });
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
                            if (currentPage < totalPages) {
                              setCurrentPage(currentPage + 1);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
               )}
        </div>
          </div>
        </div>
      </div>

      {/* SEO Concluding Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-foreground mb-4">Why Choose Cyprus for EU Property Investment?</h2>
          <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">EU Citizenship Benefits</h3>
              <ul className="space-y-2 text-sm">
                <li>• EU citizenship in 6-8 months through investment</li>
                <li>• Visa-free travel to 174+ countries</li>
                <li>• Access to all EU member states for living and working</li>
                <li>• Favorable tax environment with 12.5% corporate tax</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Investment Advantages</h3>
              <ul className="space-y-2 text-sm">
                <li>• Stable Mediterranean climate year-round</li>
                <li>• Strong rental yields and property appreciation</li>
                <li>• English-speaking business environment</li>
                <li>• Strategic location between Europe, Asia, and Africa</li>
              </ul>
            </div>
          </div>
          <p className="mt-6 text-sm">
            Our Cyprus investment specialists provide comprehensive support from property selection to citizenship application. Explore Cyprus properties and secure your European future today.
          </p>
        </div>
      </div>

    </div>
  );
};

export default CyprusPropertySearch;