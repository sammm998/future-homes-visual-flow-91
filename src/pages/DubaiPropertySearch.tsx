import React, { useState, useMemo, useEffect } from 'react';
import ElevenLabsWidget from "@/components/ElevenLabsWidget";
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import PropertyFilter from "@/components/PropertyFilter";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Eye, Grid } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import SEOHead from "@/components/SEOHead";
import { filterProperties, PropertyFilters } from "@/utils/propertyFilter";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const DubaiPropertySearch = () => {
  // Router hooks - must be called unconditionally at component top level
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Data hooks
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
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
  
  // Filter properties to show Dubai properties only
  const dubaiProperties = useMemo(() => {
    const filteredProperties = allProperties.filter(property => 
      property.location?.toLowerCase().includes('dubai')
    );
    
    // Deduplicate by ref_no, keeping the most recent one (last in array)
    const uniqueProperties = filteredProperties.reduce((acc, property) => {
      acc[property.ref_no || property.id] = property;
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(uniqueProperties).map((property, index) => {
      // Use database status as primary source, fallback to facilities extraction
      let status = property.status || 'available';
      
      // If no status from database, try to extract from facilities
      if (!property.status || property.status === 'available') {
        const facilities = property.property_facilities || [];
        const facilitiesString = property.facilities || '';
        
        // Combine all facility sources
        const allFacilities = [...facilities, ...facilitiesString.split(',').map(f => f.trim())];
        
        // Check for exact matches first, then substring matches
        if (allFacilities.some(f => f === 'Under Construction' || f.toLowerCase().includes('under construction'))) {
          status = 'Under Construction';
        } else if (allFacilities.some(f => f === 'Ready to Move' || f.toLowerCase().includes('ready to move'))) {
          status = 'Ready to Move';
        } else if (allFacilities.some(f => f.toLowerCase().includes('sea view'))) {
          status = 'Sea View';
        } else if (allFacilities.some(f => f.toLowerCase().includes('private pool'))) {
          status = 'Private Pool';
        } else if (allFacilities.some(f => f.toLowerCase().includes('for residence permit'))) {
          status = 'For Residence Permit';
        }
      }

      return {
        id: parseInt(property.ref_no || index.toString()), // Use ref_no as numeric ID, fallback to index
        refNo: property.ref_no, // Add this mapping
        title: property.title,
        location: property.location,
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.sizes_m2,
        status: status,
        image: property.property_image || (property.property_images && property.property_images[0]) || "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/default/general/default.webp",
        property_images: property.property_images || [], // Use correct field name
        coordinates: [25.0470, 55.2000] as [number, number], // Default Dubai coordinates
        // Store original UUID for navigation
        uuid: property.id
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
      state: { from: '/dubai' } 
    });
  };


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
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedProperties.map((property, propertyIndex) => (
                  <div key={`${property.id}-${propertyIndex}`} className="cursor-pointer" onClick={() => handlePropertyClick(property)}>
                    <PropertyCard property={property} />
                  </div>
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

      {/* ElevenLabs Widget */}
      <ElevenLabsWidget />
    </div>
  );
};

export default DubaiPropertySearch;