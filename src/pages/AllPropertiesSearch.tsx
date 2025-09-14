import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProperties } from "@/hooks/useProperties";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilter from "@/components/PropertyFilter";
import Navigation from "@/components/Navigation";
import SEOHead from "@/components/SEOHead";
import ElevenLabsWidget from "@/components/ElevenLabsWidget";
import { Button } from "@/components/ui/button";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

// Simple filter state interface
interface FilterState {
  propertyType: string;
  bedrooms: string;
  location: string;
  district: string;
  priceRange: [number, number];
  squareFeetRange: [number, number];
  facilities: string[];
  referenceNumber: string;
  sortBy: string;
}

// Simple filter function
const filterProperties = (properties: any[], filters: FilterState) => {
  return properties.filter(property => {
    if (filters.propertyType !== "all" && property.type !== filters.propertyType) return false;
    if (filters.bedrooms !== "all" && property.bedrooms.toString() !== filters.bedrooms) return false;
    if (filters.location !== "all" && property.location !== filters.location) return false;
    if (filters.district !== "all" && property.district !== filters.district) return false;
    if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) return false;
    if (property.area < filters.squareFeetRange[0] || property.area > filters.squareFeetRange[1]) return false;
    if (filters.referenceNumber && !property.reference.toLowerCase().includes(filters.referenceNumber.toLowerCase())) return false;
    if (filters.facilities.length > 0) {
      const hasAnyFacility = filters.facilities.some(facility => 
        property.facilities.some((pf: string) => pf.toLowerCase().includes(facility.toLowerCase()))
      );
      if (!hasAnyFacility) return false;
    }
    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "area-large": return b.area - a.area;
      case "area-small": return a.area - b.area;
      default: return 0;
    }
  });
};

const AllPropertiesSearch: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { properties, loading, error } = useProperties();

  const [filters, setFilters] = useState<FilterState>({
    propertyType: "all",
    bedrooms: "all",
    location: "all",
    district: "all",
    priceRange: [0, 10000000] as [number, number],
    squareFeetRange: [0, 10000] as [number, number],
    facilities: [],
    referenceNumber: "",
    sortBy: "newest"
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Load initial filters from URL params or navigation state
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const navigationState = location.state;

    const initialFilters: FilterState = {
      propertyType: searchParams.get('type') || navigationState?.propertyType || "all",
      bedrooms: searchParams.get('bedrooms') || navigationState?.bedrooms || "all",
      location: searchParams.get('location') || navigationState?.location || "all",
      district: searchParams.get('district') || navigationState?.district || "all",
      priceRange: [
        parseInt(searchParams.get('minPrice') || '0'),
        parseInt(searchParams.get('maxPrice') || '10000000')
      ] as [number, number],
      squareFeetRange: [
        parseInt(searchParams.get('minSqft') || '0'),
        parseInt(searchParams.get('maxSqft') || '10000')
      ] as [number, number],
      facilities: searchParams.get('facilities')?.split(',').filter(f => f) || navigationState?.facilities || [],
      referenceNumber: searchParams.get('ref') || navigationState?.referenceNumber || "",
      sortBy: (searchParams.get('sort')) || navigationState?.sortBy || "newest"
    };

    setFilters(initialFilters);
  }, [location.search, location.state]);

  // Process properties for display
  const processedProperties = useMemo(() => {
    if (!properties) return [];
    
    return properties
      .filter(property => property.is_active !== false)
      .map(property => ({
        ...property,
        id: property.id || `${property.ref_no}`,
        image: property.property_image || "/placeholder.svg", 
        price: parseFloat(property.price || "0") || 0,
        location: property.location || "",
        bedrooms: parseInt(property.bedrooms || "0") || 0,
        bathrooms: parseInt(property.bathrooms || "0") || 0,
        area: parseFloat(property.sizes_m2 || "0") || 0,
        type: property.property_type || "",
        facilities: property.amenities || [],
        reference: property.ref_no || "",
        title: property.title || "",
        description: property.description || "",
        district: property.property_district || ""
      }))
      .filter((property, index, self) => 
        index === self.findIndex(p => p.reference === property.reference)
      );
  }, [properties]);

  // Apply filters
  const filteredProperties = useMemo(() => {
    return filterProperties(processedProperties, filters);
  }, [processedProperties, filters]);

  // Paginate results
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProperties, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({
      propertyType: "all",
      bedrooms: "all",
      location: "all",
      district: "all",
      priceRange: [0, 10000000] as [number, number],
      squareFeetRange: [0, 10000] as [number, number],
      facilities: [],
      referenceNumber: "",
      sortBy: "newest"
    });
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handlePropertyClick = (property: any) => {
    navigate(`/property/${property.id}`, { state: { property } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading properties...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="All Properties - Premium Real Estate Listings"
        description="Browse our complete collection of premium properties. Find your perfect home, apartment, or investment opportunity with advanced search filters."
        keywords="real estate, properties, buy property, rent property, luxury homes, apartments"
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              All Properties
            </h1>
            <p className="text-lg text-muted-foreground">
              Found {filteredProperties.length} properties
            </p>
          </header>

          <PropertyFilter 
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            onReset={handleReset}
            horizontal={true}
          />

          {paginatedProperties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {paginatedProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination className="justify-center">
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(currentPage - 1)}
                          className="cursor-pointer"
                        />
                      </PaginationItem>
                    )}
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNumber)}
                            isActive={currentPage === pageNumber}
                            className="cursor-pointer"
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(currentPage + 1)}
                          className="cursor-pointer"
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                No properties found
              </h2>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search criteria to find more properties.
              </p>
              <Button onClick={handleReset} variant="outline">
                Clear All Filters
              </Button>
            </div>
          )}
        </main>

        <ElevenLabsWidget />
      </div>
    </>
  );
};

export default AllPropertiesSearch;