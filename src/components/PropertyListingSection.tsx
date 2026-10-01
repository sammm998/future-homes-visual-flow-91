import React, { useState, useMemo } from 'react';
import { useProperties } from '@/hooks/useProperties';
import PropertyCard from './PropertyCard';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { useTranslation } from '@/hooks/useTranslation';

const PropertyListingSection = () => {
  const { properties, loading } = useProperties();
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();
  const itemsPerPage = 4;

  const locations = ['all', 'Antalya', 'Istanbul', 'Mersin', 'Dubai', 'Cyprus', 'Bali'];

  const filteredProperties = useMemo(() => {
    let filtered = [];
    const matchesLocation = (propertyLocation: string | undefined, targetLocation: string) => {
      if (!propertyLocation) return false;
      const normalized = propertyLocation.toLowerCase().trim();
      const target = targetLocation.toLowerCase();
      return normalized === target || normalized.startsWith(target + ',') || normalized.startsWith(target + ' ');
    };
    
    if (selectedLocation === 'all') {
      const locationGroups = {
        Antalya: properties.filter(p => matchesLocation(p.location, 'antalya')),
        Istanbul: properties.filter(p => matchesLocation(p.location, 'istanbul')),
        Mersin: properties.filter(p => matchesLocation(p.location, 'mersin')),
        Dubai: properties.filter(p => matchesLocation(p.location, 'dubai')),
        Cyprus: properties.filter(p => matchesLocation(p.location, 'cyprus')),
        Bali: properties.filter(p => matchesLocation(p.location, 'bali')),
      };
      Object.values(locationGroups).forEach(group => {
        if (group.length > 0) {
          const sorted = group.sort((a, b) => {
            const parsePrice = (price: string) => parseInt(price.replace(/[^\d]/g, '')) || 0;
            const priceA = parsePrice(a.price || '0');
            const priceB = parsePrice(b.price || '0');
            const getMidRangePriority = (price: number) => price >= 1400 && price <= 5000 ? 1 : price > 5000 ? 2 : 3;
            const diff = getMidRangePriority(priceA) - getMidRangePriority(priceB);
            return diff !== 0 ? diff : priceA - priceB;
          });
          filtered.push(sorted[0]);
        }
      });
    } else {
      filtered = properties.filter(property => matchesLocation(property.location, selectedLocation));
      filtered = filtered.sort((a, b) => {
        const parsePrice = (price: string) => parseInt(price.replace(/[^\d]/g, '')) || 0;
        const priceA = parsePrice(a.price || '0');
        const priceB = parsePrice(b.price || '0');
        const getMidRangePriority = (price: number) => price >= 1400 && price <= 5000 ? 1 : price > 5000 ? 2 : 3;
        const diff = getMidRangePriority(priceA) - getMidRangePriority(priceB);
        return diff !== 0 ? diff : priceA - priceB;
      });
    }
    return filtered;
  }, [properties, selectedLocation]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, startIndex + itemsPerPage);

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <section className="bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-12 grid gap-6 border-b border-border pb-8 md:grid-cols-[1fr_1.2fr] md:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-gold">Future Homes Collection</p>
            <h2 className="max-w-2xl text-4xl font-semibold leading-tight text-navy md:text-6xl">{t('home.browse_properties')}</h2>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:justify-self-end">{t('home.browse_subtitle')}</p>
        </div>

        <div className="mb-12 flex flex-wrap gap-2">
          {locations.map((location) => (
            <Button
              key={location}
              variant={selectedLocation === location ? 'default' : 'outline'}
              onClick={() => handleLocationChange(location)}
              className={`rounded-md px-5 py-2 font-medium transition-all duration-300 ${
                selectedLocation === location 
                  ? 'bg-navy text-navy-foreground' 
                  : 'bg-background hover:border-gold hover:bg-ivory'
              }`}
            >
              {location === 'all' ? t('home.all_locations') : location}
            </Button>
          ))}
        </div>

        {currentProperties.length > 0 ? (
          <>
            <div className="mb-12 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
              {currentProperties.map((property, index) => (
                <PropertyCard key={property.id} property={{ ...property, area: property.sizes_m2 || '', refNo: property.ref_no }} priority={index === 0} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="rounded-full">
                  <ChevronLeft className="w-4 h-4 mr-2" />{t('home.previous')}
                </Button>
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    if (pageNumber === 1 || pageNumber === totalPages || (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)) {
                      return <Button key={pageNumber} variant={currentPage === pageNumber ? 'default' : 'outline'} onClick={() => setCurrentPage(pageNumber)} className="w-10 h-10 rounded-full p-0">{pageNumber}</Button>;
                    } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                      return <span key={pageNumber} className="text-muted-foreground">...</span>;
                    }
                    return null;
                  })}
                </div>
                <Button variant="outline" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="rounded-full">
                  {t('home.next')}<ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">{t('home.no_properties')}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertyListingSection;
