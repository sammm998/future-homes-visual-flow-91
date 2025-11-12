import React, { useState, useMemo } from 'react';
import { useProperties } from '@/hooks/useProperties';
import PropertyCard from './PropertyCard';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const PropertyListingSection = () => {
  const { properties, loading } = useProperties();
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Main location categories
  const locations = ['all', 'Antalya', 'Mersin', 'Dubai', 'Cyprus', 'Bali'];

  // Filter properties by main location category
  const filteredProperties = useMemo(() => {
    if (selectedLocation === 'all') {
      return properties;
    }
    return properties.filter(property => {
      const location = property.location?.toLowerCase() || '';
      const selectedLower = selectedLocation.toLowerCase();
      return location.includes(selectedLower);
    });
  }, [properties, selectedLocation]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  // Reset to page 1 when location filter changes
  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Browse Our Properties
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover premium properties across the world's most desirable locations
          </p>
        </div>

        {/* Location Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {locations.map((location) => (
            <Button
              key={location}
              variant={selectedLocation === location ? 'default' : 'outline'}
              onClick={() => handleLocationChange(location)}
              className={`
                px-6 py-2 rounded-full font-semibold transition-all duration-300
                ${selectedLocation === location 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
                  : 'bg-background hover:bg-primary/10 hover:border-primary/50'
                }
              `}
            >
              {location === 'all' ? 'All Locations' : location}
            </Button>
          ))}
        </div>

        {/* Property Grid */}
        {currentProperties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {currentProperties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={{
                    ...property,
                    area: property.sizes_m2 || '',
                    refNo: property.ref_no,
                  }} 
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded-full"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? 'default' : 'outline'}
                          onClick={() => setCurrentPage(pageNumber)}
                          className="w-10 h-10 rounded-full p-0"
                        >
                          {pageNumber}
                        </Button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return <span key={pageNumber} className="text-muted-foreground">...</span>;
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="rounded-full"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              No properties found for the selected location.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertyListingSection;
