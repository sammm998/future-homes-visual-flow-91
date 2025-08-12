
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
        
        <CardContent className="p-4 sm:p-5">
          <h3 className="font-bold text-lg sm:text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
            {property.title}
          </h3>
          
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <MapPin size={16} className="flex-shrink-0 text-primary" />
            <span className="text-sm sm:text-base truncate font-medium">{property.location}</span>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/30">
            <div className="flex flex-col items-center text-center">
              <Bed size={20} className="text-primary mb-2" />
              <div className="font-bold text-sm mb-1">{property.bedrooms}</div>
              <div className="text-xs text-muted-foreground">Bedrooms</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <Bath size={20} className="text-primary mb-2" />
              <div className="font-bold text-sm mb-1">{property.bathrooms}</div>
              <div className="text-xs text-muted-foreground">Bathrooms</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <Square size={20} className="text-primary mb-2" />
              <div className="font-bold text-sm mb-1 truncate">{property.area}</div>
              <div className="text-xs text-muted-foreground">m²</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});

export default PropertyCard;
