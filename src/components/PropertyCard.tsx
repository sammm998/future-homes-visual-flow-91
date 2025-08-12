
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square } from "lucide-react";
import { useCurrency } from '@/contexts/CurrencyContext';
import LazyImage from './LazyImage';
import { useMemoizedStatus, useMemoizedPrice } from '@/utils/memoization';


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
    image: string;
  };
}

const PropertyCard: React.FC<PropertyCardProps> = memo(({ property }) => {
  const { formatPrice } = useCurrency();
  
  const statusInfo = useMemoizedStatus(property.status);
  const formattedPrice = useMemoizedPrice(property.price, formatPrice);

  return (
    <Link to={`/property/${property.id}`} state={{ from: window.location.pathname + window.location.search }} className="block w-full">
      <Card className="group overflow-hidden hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
        <div className="relative">
          <LazyImage 
            src={property.image} 
            alt={property.title}
            className="w-full h-40 sm:h-48 md:h-52 object-cover group-hover:scale-105 transition-transform duration-300"
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
              {formattedPrice}
            </div>
          </div>
        </div>
        
        <CardContent className="p-3 sm:p-4 md:p-5">
          <h3 className="font-bold text-sm sm:text-lg md:text-xl mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
            {property.title}
          </h3>
          
          <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground mb-3 sm:mb-4">
            <MapPin size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm md:text-base truncate">{property.location}</span>
          </div>

          <div className="grid grid-cols-3 gap-1 sm:gap-2 text-xs sm:text-sm md:text-base text-muted-foreground">
            <div className="flex flex-col sm:flex-row items-center gap-1">
              <Bed size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="font-medium text-center sm:text-left">{property.bedrooms}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-1">
              <Bath size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="font-medium text-center sm:text-left">{property.bathrooms}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-1">
              <Square size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="font-medium truncate text-center sm:text-left">{property.area}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});

export default PropertyCard;
