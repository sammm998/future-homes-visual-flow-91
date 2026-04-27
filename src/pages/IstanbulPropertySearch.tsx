import React, { useState, useMemo, useEffect } from 'react';

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
import { generateLocationSchema, generatePropertyListSchema, generateBreadcrumbSchema } from "@/utils/seoUtils";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { buildPropertyUrl, getCurrentLanguage } from "@/utils/slugHelpers";

const IstanbulPropertySearch = () => {
  const { canonicalUrl, hreflangUrls } = useSEOLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { properties: allProperties, loading } = useProperties();
  
  const [filters, setFilters] = useState<PropertyFilters>({
    propertyType: '',
    bedrooms: '',
    location: 'Istanbul',
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

  // Restore page and scroll position when returning from property detail
  useEffect(() => {
    const state = location.state as { 
      returnedFromProperty?: boolean;
      savedPage?: number;
      savedScrollY?: number;
    } | null;

    if (state?.returnedFromProperty) {
      if (state.savedPage) {
        setCurrentPage(state.savedPage);
      }
      if (state.savedScrollY !== undefined) {
        const timer = setTimeout(() => {
          window.scrollTo({ top: state.savedScrollY, behavior: 'instant' });
        }, 100);
        return () => clearTimeout(timer);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const urlFilters: PropertyFilters = {
      propertyType: searchParams.get('propertyType') || '',
      bedrooms: searchParams.get('bedrooms') || '',
      location: searchParams.get('location') || 'Istanbul',
      district: searchParams.get('district') || '',
      minPrice: searchParams.get('priceMin') || searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('priceMax') || searchParams.get('maxPrice') || '',
      minSquareFeet: searchParams.get('areaMin') || searchParams.get('minSquareFeet') || '',
      maxSquareFeet: searchParams.get('areaMax') || searchParams.get('maxSquareFeet') || '',
      facilities: searchParams.get('facilities')?.split(',').filter(Boolean) || [],
      sortBy: searchParams.get('sortBy') as any || 'ref',
      referenceNo: searchParams.get('referenceNumber') || searchParams.get('referenceNo') || ''
    };

    const stateFilters = location.state?.filters;
    if (stateFilters) {
      Object.keys(stateFilters).forEach(key => {
        if (stateFilters[key] && stateFilters[key] !== '') {
          urlFilters[key as keyof PropertyFilters] = stateFilters[key];
        }
      });
    }
    setFilters(urlFilters);

    const hasActiveFilters = Object.entries(urlFilters).some(([key, value]) => {
      if (key === 'location') return false;
      if (key === 'sortBy') return value !== 'ref';
      if (Array.isArray(value)) return value.length > 0;
      return value && value !== '';
    });
    
    setShowFiltered(hasActiveFilters);
  }, [searchParams, location.state]);

  const istanbulProperties = useMemo(() => {
    const filteredProperties = allProperties.filter(property => 
      property.location?.toLowerCase().includes('istanbul') && 
      (property as any).is_active === true && 
      !property.status?.toLowerCase().includes('sold')
    );

    const uniqueProperties = filteredProperties.reduce((acc, property) => {
      acc[property.ref_no || property.id] = property;
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(uniqueProperties).map((property, index) => ({
      id: property.id, // Keep original UUID for key
      refNo: property.ref_no,
      ref_no: property.ref_no,
      slug: property.slug, // Add slug for SEO-friendly URLs
      title: property.title,
      location: property.location,
      price: property.price,
      bedrooms: property.bedrooms || '',
      bathrooms: property.bathrooms || '',
      area: property.sizes_m2 || '',
      status: (() => {
        let status = property.status || 'available';
        if (status.includes(',')) {
          if (status.toLowerCase().includes('sold')) return 'sold';
          if (status.toLowerCase().includes('under construction')) return 'Under Construction';
          if (status.toLowerCase().includes('ready to move')) return 'Ready To Move';
          if (status.toLowerCase().includes('for residence permit')) return 'For Residence Permit';
          return status.split(',')[0].trim();
        }
        return status;
      })(),
      image: property.property_image || property.property_images && property.property_images[0] || '',
      coordinates: [0, 0] as [number, number],
      features: property.property_facilities || [],
      property_images: property.property_images || [],
      description: property.description || '',
      facilities: property.property_facilities?.join(', ') || '',
      uuid: property.id
    }));
  }, [allProperties]);

  const filteredProperties = useMemo(() => {
    if (showFiltered) {
      return filterProperties(istanbulProperties, filters);
    }
    return [...istanbulProperties].sort((a, b) => {
      const refA = parseInt(a.refNo || '0');
      const refB = parseInt(b.refNo || '0');
      return refB - refA; // Descending order (highest ref first)
    });
  }, [istanbulProperties, filters, showFiltered]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProperties, currentPage, itemsPerPage]);

  const handleFilterChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    setShowFiltered(true);
    setCurrentPage(1);

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

    const newSearch = params.toString();
    navigate(`${location.pathname}${newSearch ? '?' + newSearch : ''}`, { replace: true });
  };

  const handleSearch = () => {
    setShowFiltered(true);
    setCurrentPage(1);
  };

  const handlePropertyClick = (property: any) => {
    const currentUrl = `${location.pathname}${location.search}`;
    const currentScrollY = window.scrollY;
    
    // Get current language and build translated URL
    const lang = getCurrentLanguage(location.search);
    const propertyUrl = buildPropertyUrl(property, lang);
    
    navigate(propertyUrl, {
      state: {
        from: '/istanbul',
        returnUrl: currentUrl,
        savedPage: currentPage,
        savedScrollY: currentScrollY
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Buy Property in Istanbul | Real Estate & Apartments for Sale | Future Homes" 
        description="Discover premium properties in Istanbul. Luxury apartments, villas & investment opportunities in Turkey's largest city. Citizenship programs available. Expert guidance from Future Homes International." 
        keywords="Istanbul real estate, buy property Istanbul, property for sale, Istanbul apartments, citizenship by investment, property investment Istanbul, Istanbul homes" 
        canonicalUrl={canonicalUrl} 
        hreflangUrls={Object.fromEntries(hreflangUrls.map(h => [h.code, h.url]))}
        structuredData={[
          generateLocationSchema('Istanbul', 'Premium real estate in Istanbul, Turkey\'s cultural and economic capital. Luxury apartments, villas & investment properties with citizenship programs.'),
          generateBreadcrumbSchema([
            { name: 'Home', url: 'https://futurehomesinternational.com' },
            { name: 'Istanbul Properties', url: 'https://futurehomesinternational.com/istanbul' }
          ]),
          generatePropertyListSchema(
            istanbulProperties.slice(0, 10).map(p => ({
              title: p.title,
              price: p.price,
              url: `https://futurehomesinternational.com/property/${p.slug || p.refNo || p.uuid}`,
              image: p.image
            })),
            'Properties for Sale in Istanbul'
          )
        ]}
        breadcrumbs={[
          { name: 'Home', url: 'https://futurehomesinternational.com' },
          { name: 'Istanbul Properties', url: 'https://futurehomesinternational.com/istanbul' }
        ]}
      />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Properties In Istanbul
          </h1>
          <div className="prose max-w-none text-muted-foreground">
            <p className="mb-4">
              Discover exceptional real estate opportunities in Istanbul, Turkey's cultural and economic heart where East meets West. Our carefully curated collection features luxury apartments, stunning villas, and investment properties perfect for those seeking Turkish citizenship through real estate investment.
            </p>
            <p className="mb-4">
              Istanbul offers a unique blend of ancient history and modern living, with world-class infrastructure, vibrant culture, and endless business opportunities. Whether you're looking for a city center apartment, Bosphorus view property, or investment opportunity, we have the perfect property for you.
            </p>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {loading ? 'Loading...' : `${istanbulProperties.length} properties found`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
            <PropertyFilter filters={filters} onFilterChange={handleFilterChange} onSearch={handleSearch} horizontal={false} />
          </div>

          <div className="block lg:hidden mb-6">
            <PropertyFilter filters={filters} onFilterChange={handleFilterChange} onSearch={handleSearch} horizontal={true} />
          </div>

          <div className="flex-1 min-w-0">
            {/* Mobile Layout */}
            <div className="block md:hidden">
              <div className="space-y-6">
                {paginatedProperties.map((property, propertyIndex) => (
                  <div key={`${property.id}-${propertyIndex}`} className="cursor-pointer min-h-[60vh] flex items-center justify-center" onClick={() => handlePropertyClick(property)}>
                    <div className="w-full max-w-sm mx-auto">
                      <PropertyCard property={property} priority={propertyIndex < 3} />
                    </div>
                  </div>
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" onClick={e => {
                          e.preventDefault();
                          if (currentPage > 1) {
                            setCurrentPage(currentPage - 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }} className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''} />
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
                            <PaginationLink href="#" onClick={e => {
                              e.preventDefault();
                              setCurrentPage(pageNum);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }} isActive={pageNum === currentPage}>
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext href="#" onClick={e => {
                          e.preventDefault();
                          if (currentPage < totalPages) {
                            setCurrentPage(currentPage + 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Showing {filteredProperties.length} of {istanbulProperties.length} properties
                  </span>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {paginatedProperties.map((property, propertyIndex) => (
                  <div key={`${property.id}-${propertyIndex}`} className="cursor-pointer" onClick={() => handlePropertyClick(property)}>
                    <PropertyCard property={property} priority={propertyIndex < 6} />
                  </div>
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" onClick={e => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }} className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''} />
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
                            <PaginationLink href="#" onClick={e => {
                              e.preventDefault();
                              setCurrentPage(pageNum);
                            }} isActive={pageNum === currentPage}>
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext href="#" onClick={e => {
                          e.preventDefault();
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                        }} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}

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
                    <Button onClick={() => {
                      setFilters({
                        propertyType: '',
                        bedrooms: '',
                        location: 'Istanbul',
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
                    }} variant="outline">
                      Clear Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-foreground mb-4">Why Choose Istanbul for Your Property Investment?</h2>
          <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Investment Benefits</h3>
              <ul className="space-y-2 text-sm">
                <li>• Turkish citizenship eligibility with $400,000+ investment</li>
                <li>• Strong rental yields in Turkey's largest city</li>
                <li>• Gateway between Europe and Asia</li>
                <li>• Growing real estate market with high demand</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Lifestyle Advantages</h3>
              <ul className="space-y-2 text-sm">
                <li>• Rich cultural heritage spanning millennia</li>
                <li>• World-class dining and entertainment</li>
                <li>• Excellent transportation infrastructure</li>
                <li>• International business and education hub</li>
              </ul>
            </div>
          </div>
          <p className="mt-6 text-sm">
            Our expert team provides comprehensive support throughout your property purchase journey, from initial selection to citizenship application assistance. Contact us today to explore the best investment opportunities in Istanbul.
          </p>
        </div>
      </div>

      
    </div>
  );
};

export default IstanbulPropertySearch;
