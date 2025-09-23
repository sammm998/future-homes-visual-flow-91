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
  console.log('🏙️ DubaiPropertySearch component starting...');
  console.log('🌍 User location and browser info:', {
    userAgent: navigator.userAgent,
    language: navigator.language,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    location: window.location.href
  });
  
  // Router hooks - must be called unconditionally at component top level
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  console.log('🏙️ Dubai route accessed:', location.pathname);
  
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

  // Load filters from URL on component mount
  useEffect(() => {
    const locationParam = searchParams.get('location');
    console.log('🔍 URL location param:', locationParam);
    
    if (locationParam && locationParam !== filters.location) {
      setFilters(prev => ({
        ...prev,
        location: locationParam
      }));
    }
  }, [searchParams]);

  // Filter and transform properties for Dubai
  const dubaiProperties = useMemo(() => {
    console.log('🏠 Processing all properties:', allProperties?.length || 0);
    
    if (!allProperties || allProperties.length === 0) {
      console.log('❌ No properties available');
      return [];
    }

    // Filter for Dubai properties, active status, and exclude sold properties
    const filtered = allProperties.filter(property => {
      const isDubai = property.location?.toLowerCase().includes('dubai');
      const isActive = (property as any).is_active === true;
      const isNotSold = !property.status?.toLowerCase().includes('sold');
      console.log('🔍 Property check:', {
        ref: property.ref_no,
        location: property.location,
        status: property.status,
        isDubai,
        isActive,
        isNotSold,
        included: isDubai && isActive && isNotSold
      });
      return isDubai && isActive && isNotSold;
    });

    console.log('✅ Filtered Dubai properties:', filtered.length);

    // Deduplicate by ref_no, keeping the most recent
    const uniqueProperties = filtered.reduce((acc, property) => {
      const key = property.ref_no || property.id;
      acc[key] = property;
      return acc;
    }, {} as Record<string, any>);

    const uniqueList = Object.values(uniqueProperties);
    console.log('🎯 Unique Dubai properties:', uniqueList.length);

    // Transform to expected format
    return uniqueList.map((property, index) => {
      console.log('🔄 Transforming property:', property.ref_no, property.title);
      
      // Determine property status - use original status from database
      let status = property.status || 'available';
      
      // Handle compound statuses (multiple statuses separated by commas)
      if (status.includes(',')) {
        // If multiple statuses, prioritize certain ones
        if (status.toLowerCase().includes('sold')) {
          status = 'sold';
        } else if (status.toLowerCase().includes('under construction')) {
          status = 'Under Construction';
        } else if (status.toLowerCase().includes('ready to move')) {
          status = 'Ready To Move';
        } else if (status.toLowerCase().includes('for residence permit')) {
          status = 'For Residence Permit';
        } else {
          // Use the first status if no priority match
          status = status.split(',')[0].trim();
        }
      }

      return {
        id: parseInt(property.ref_no) || index,
        refNo: property.ref_no,
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
    console.log('🏙️ Dubai page loading...');
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
    console.error('❌ Dubai page error:', error);
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

        {/* Introductory SEO Content */}
        <div className="mb-8 p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-border/20">
          <div className="prose prose-gray max-w-none dark:prose-invert">
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Explore Dubai's world-class real estate market, where luxury meets exceptional investment returns. As the Middle East's premier business hub 
              and global tourism destination, Dubai offers unparalleled opportunities for property investors seeking premium assets with guaranteed growth potential.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Future Homes has been Dubai's trusted property partner since 2008, with deep expertise in emirate regulations and market dynamics. 
              Our portfolio features exclusive developments in Downtown Dubai, Dubai Marina, and Palm Jumeirah, offering <strong className="text-foreground">guaranteed rental yields up to 8% annually</strong>. 
              Dubai's golden visa program provides long-term residency for property investors, making it an ideal choice for international buyers.
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
        </div>

        {/* Concluding SEO Content */}
        <div className="mt-12 p-6 bg-gradient-to-br from-accent/5 to-primary/5 rounded-lg border border-border/20">
          <div className="prose prose-gray max-w-none dark:prose-invert">
            <h2 className="text-2xl font-bold text-foreground mb-4">Dubai Property Investment Excellence</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Investment Advantages</h3>
                <ul className="text-muted-foreground space-y-1">
                  <li>• 0% property tax and capital gains tax</li>
                  <li>• Guaranteed 6-8% annual rental yields</li>
                  <li>• 10-year Golden Visa eligibility</li>
                  <li>• World's safest property investment environment</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Global Connectivity</h3>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Hub connecting 3 continents</li>
                  <li>• 240+ destinations from DXB airport</li>
                  <li>• Business-friendly regulations</li>
                  <li>• Luxury lifestyle & world-class amenities</li>
                </ul>
              </div>
            </div>
            <p className="text-muted-foreground mt-4">
              <strong className="text-foreground">Future Homes Dubai expertise:</strong> Our Dubai office has processed over 1,500 successful transactions, 
              specializing in off-plan and ready properties. We provide end-to-end service including RERA registration, mortgage assistance, 
              and property management with guaranteed rental programs.
            </p>
          </div>
        </div>
      </div>

      {/* ElevenLabs Widget */}
      <ElevenLabsWidget />
    </div>
  );
};

export default DubaiPropertySearch;
