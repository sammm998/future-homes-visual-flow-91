
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square } from "lucide-react";
import { useCurrency } from '@/contexts/CurrencyContext';
import OptimizedPropertyImage from './OptimizedPropertyImage';
import ApartmentTypesDisplay from './ApartmentTypesDisplay';
import { useMemoizedStatus, useMemoizedPrice } from '@/utils/memoization';
import { parseApartmentTypes, getStartingPrice } from '@/utils/apartmentTypes';


interface PropertyCardProps {
  property: {
    id: number;
    refNo?: string;
    title: string;
    location: string;
    price: string;
    bedrooms: string;
    bathrooms: string;
    area: string;
    status: string;
    image?: string;
    property_images?: string[];
    apartment_types?: any;
  };
}

const PropertyCard: React.FC<PropertyCardProps> = memo(({ property }) => {
  const { formatPrice } = useCurrency();
  
  const statusInfo = useMemoizedStatus(property.status);
  const apartmentTypes = parseApartmentTypes(property.apartment_types);
  const displayPrice = apartmentTypes.length > 0 
    ? getStartingPrice(apartmentTypes, property.price)
    : property.price;

  return (
    <Link to={`/property/${property.id}`} state={{ from: window.location.pathname + window.location.search }} className="block w-full">
      <Card className="group overflow-hidden hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
        <div className="relative">
          <OptimizedPropertyImage 
            src={property.image || (property.property_images && property.property_images.length > 0 ? property.property_images[0] : '/placeholder.svg')} 
            alt={property.title}
            className="w-full h-40 sm:h-48 md:h-52 group-hover:scale-105 transition-transform duration-300"
            width={400}
            height={300}
            priority={false}
          />
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex gap-1 sm:gap-2 flex-wrap">
            <Badge className={`${statusInfo.color} text-white text-xs font-medium px-1 sm:px-2 py-1`}>
              {statusInfo.text}
            </Badge>
            <Badge variant="secondary" className="bg-gray-800 text-white text-xs font-medium px-1 sm:px-2 py-1">
              {property.refNo || property.id}
            </Badge>
          </div>
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
            <div className="bg-white/95 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-2 rounded-lg font-bold text-sm sm:text-lg md:text-xl text-foreground shadow-lg">
              {displayPrice}
            </div>
          </div>
        </div>
        
        <CardContent className="p-4 sm:p-5 md:p-6 space-y-4">
          {/* Title Section */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg sm:text-xl md:text-2xl line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
              {property.title}
            </h3>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin size={16} className="flex-shrink-0 text-primary/70" />
              <span className="text-sm sm:text-base font-medium truncate">{property.location}</span>
            </div>
          </div>

          {/* Apartment Types or Property Features */}
          <div className="border-t border-border/50 pt-4">
            {apartmentTypes.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-foreground">Available Types</h4>
                <ApartmentTypesDisplay apartmentTypes={apartmentTypes} variant="compact" />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="flex flex-col items-center gap-2 p-2 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors">
                  <Bed size={18} className="text-primary" />
                  <span className="font-semibold text-sm text-foreground">{property.bedrooms}</span>
                  <span className="text-xs text-muted-foreground">Sovrum</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-2 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors">
                  <Bath size={18} className="text-primary" />
                  <span className="font-semibold text-sm text-foreground">{property.bathrooms}</span>
                  <span className="text-xs text-muted-foreground">Badrum</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-2 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors">
                  <Square size={18} className="text-primary" />
                  <span className="font-semibold text-sm text-foreground truncate">{property.area}</span>
                  <span className="text-xs text-muted-foreground">m²</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});

export default PropertyCard;
