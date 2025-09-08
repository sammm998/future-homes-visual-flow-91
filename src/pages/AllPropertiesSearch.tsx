import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useProperties } from "@/hooks/useProperties";
import { filterProperties, type PropertyFilters } from "@/utils/propertyFilter";
import { useCurrency } from "@/contexts/CurrencyContext";
import Navigation from "@/components/Navigation";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilter from "@/components/PropertyFilter";
import SEOHead from "@/components/SEOHead";
import ElevenLabsWidget from "@/components/ElevenLabsWidget";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const AllPropertiesSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { properties: allProperties, loading, error } = useProperties();

  const [currentPage, setCurrentPage] = useState(1);
  const [showFiltered, setShowFiltered] = useState(false);
  const propertiesPerPage = 12;

  // Initialize filters from URL params and location state
  const [filters, setFilters] = useState<PropertyFilters>(() => {
    const urlFilters: PropertyFilters = {
      propertyType: searchParams.get('propertyType') || 'all',
      bedrooms: searchParams.get('bedrooms') || 'all',
      location: searchParams.get('location') || 'all',
      district: searchParams.get('district') || 'all',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      minSquareFeet: searchParams.get('minSquareFeet') || '',
      maxSquareFeet: searchParams.get('maxSquareFeet') || '',
      facilities: searchParams.getAll('facilities'),
      referenceNo: searchParams.get('referenceNo') || '',
      sortBy: searchParams.get('sortBy') || 'newest'
    };

    // Override with location state if available
    if (location.state?.filters) {
      return { ...urlFilters, ...location.state.filters };
    }

    return urlFilters;
  });

  // Update URL when filters change
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        if (Array.isArray(value) && value.length > 0) {
          value.forEach(v => newSearchParams.append(key, v));
        } else if (!Array.isArray(value)) {
          newSearchParams.set(key, value.toString());
        }
      }
    });
    
    navigate(`?${newSearchParams.toString()}`, { replace: true });
  }, [filters, navigate]);

  // Check if filters are applied
  useEffect(() => {
    const hasFilters = Object.entries(filters).some(([key, value]) => {
      if (key === 'sortBy') return false;
      if (Array.isArray(value)) return value.length > 0;
      return value && value !== 'all' && value !== '';
    });
    setShowFiltered(hasFilters);
  }, [searchParams, location.state]);

  const properties = useMemo(() => {
    console.log('🏠 AllPropertiesSearch: Processing properties, total received:', allProperties?.length || 0);
    console.log('🏠 AllPropertiesSearch: First 2 raw properties:', allProperties?.slice(0, 2));
    
    const processed = allProperties.map((property, index) => ({
      id: property.id, // Keep original UUID ID
      refNo: property.ref_no || 'N/A',
      title: property.title || 'Untitled Property',
      location: property.location || 'Location not specified',
      price: property.price || property.starting_price_eur || '€0',
      bedrooms: property.bedrooms?.toString() || 'N/A',
      bathrooms: property.bathrooms?.toString() || 'N/A',
      area: property.sizes_m2?.toString() || 'N/A',
      status: property.status || 'available',
      image: property.property_image || (property.property_images && property.property_images.length > 0 ? property.property_images[0] : "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/default/general/default.webp"),
      coordinates: [39.9334, 32.8597] as [number, number], // Default Turkey coordinates
      features: Array.isArray(property.facilities) ? property.facilities : (property.facilities ? [property.facilities] : [])
    }));
    
    console.log('🏠 AllPropertiesSearch: First 2 processed properties:', processed.slice(0, 2));
    return processed;
  }, [allProperties]);

  // Apply filters to properties
  const filteredProperties = useMemo(() => {
    console.log('🔍 AllPropertiesSearch: Applying filters:', filters);
    console.log('🔍 AllPropertiesSearch: Properties before filtering:', properties.length);
    const filtered = filterProperties(properties, filters);
    console.log('🔍 AllPropertiesSearch: Properties after filtering:', filtered.length);
    console.log('🔍 AllPropertiesSearch: First filtered property:', filtered[0]);
    return filtered;
  }, [properties, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const endIndex = startIndex + propertiesPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        if (Array.isArray(value) && value.length > 0) {
          value.forEach(v => searchParams.append(key, v));
        } else if (!Array.isArray(value)) {
          searchParams.set(key, value.toString());
        }
      }
    });
    navigate(`?${searchParams.toString()}`);
  };

  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => setCurrentPage(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
            <p className="text-destructive">Error loading properties: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="All Properties - Find Your Perfect Property | Future Homes Turkey"
        description="Browse our complete collection of properties for sale. Find apartments, villas, and commercial properties across Turkey and international locations with Future Homes Turkey."
        keywords="properties for sale, real estate, Turkey properties, international real estate, property search"
        canonicalUrl="https://www.futurehomesturkey.com/properties"
      />
      
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">All Properties</h1>
          <p className="text-muted-foreground">
            {showFiltered 
              ? `Showing ${filteredProperties.length} filtered properties from our complete collection`
              : `Browse our complete collection of ${properties.length} available properties`
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <PropertyFilter 
              filters={filters}
              onFilterChange={handleFilterChange}
              onSearch={handleSearch}
            />
          </div>

          <div className="lg:col-span-3">
            {currentProperties.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria to see more results.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {currentProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        
                        {generatePaginationItems()}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <ElevenLabsWidget />
    </div>
  );
};

export default AllPropertiesSearch;