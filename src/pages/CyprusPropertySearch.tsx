import React, { useState, useMemo, useEffect } from 'react';
import ElevenLabsWidget from "@/components/ElevenLabsWidget";
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import PropertyFilter from "@/components/PropertyFilter";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Eye, Grid } from "lucide-react";
import { filterProperties, PropertyFilters } from "@/utils/propertyFilter";
import SEOHead from "@/components/SEOHead";
import { useProperties } from "@/hooks/useProperties";
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
    
    // Show filtered results if any filters are applied
    const hasFilters = Object.entries(urlFilters).some(([key, value]) => {
      return value && value !== '' && value !== 'ref' && value !== 'Cyprus';
    });
    
    setShowFiltered(hasFilters);
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
    return properties;
  }, [properties, filters, showFiltered]);

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
  };

  const handleSearch = () => {
    setShowFiltered(true);
  };

  const handlePropertyClick = (property: any) => {
    // Navigate to the property detail page using the UUID
    navigate(`/property/${property.id}`, { 
      state: { from: '/cyprus' } 
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
        title="Cyprus Real Estate - EU Citizenship Through Property Investment | Future Homes"
        description="Discover Cyprus properties with EU citizenship benefits. Luxury homes, apartments & villas. Cyprus citizenship by investment programs. Expert guidance for European property investment."
        keywords="Cyprus real estate, EU citizenship by investment, Cyprus property for sale, European property investment, Cyprus citizenship program, luxury homes Cyprus, property investment Europe, Cyprus Golden Visa"
        canonicalUrl="https://futurehomesturkey.com/cyprus"
      />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Properties In Cyprus
          </h1>
          <p className="text-muted-foreground">
            {properties.length} properties found
          </p>
        </div>

        {/* Introductory SEO Content */}
        <div className="mb-8 space-y-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Discover Cyprus real estate opportunities offering the unique advantage of EU citizenship through property investment. 
            As an EU member state with Mediterranean charm, Cyprus provides the perfect gateway to European residency while enjoying year-round luxury living.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Future Homes has specialized in Cyprus citizenship by investment since the program's inception, successfully guiding over 800 families to EU citizenship. 
            Our expertise covers all major cities including Limassol, Paphos, and Nicosia, with properties starting from €300,000. 
            <strong className="text-foreground">Cyprus offers the fastest EU citizenship route</strong> - typically completed within 6-8 months through our streamlined process.
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

          {/* Concluding SEO Content */}
          <div className="mt-16 border-t border-border/20 pt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Cyprus EU Citizenship & Investment Benefits</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">EU Advantages</h3>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>• EU passport with visa-free travel to 170+ countries</li>
                  <li>• Right to live, work, study anywhere in EU</li>
                  <li>• Access to EU healthcare and education systems</li>
                  <li>• 12.5% corporate tax rate (lowest in EU)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Investment Climate</h3>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>• Stable property market with steady appreciation</li>
                  <li>• No inheritance tax for EU residents</li>
                  <li>• English common law legal system</li>
                  <li>• Strong rental yields in tourist areas</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Future Homes Cyprus expertise:</strong> As authorized citizenship consultants, 
              we've maintained a 100% success rate in Cyprus citizenship applications. Our comprehensive service includes legal documentation, 
              property due diligence, and ongoing residency compliance support throughout the EU citizenship journey.
            </p>
          </div>
        </div>
      </div>

      {/* ElevenLabs Widget */}
      <ElevenLabsWidget />
    </div>
  );
};

export default CyprusPropertySearch;