import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Bath, Maximize2 } from 'lucide-react';
import { OptimizedPropertyImage } from './OptimizedPropertyImage';
import { Link } from 'react-router-dom';

interface Property {
  id: string | number;
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
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const getImageUrl = () => {
    console.log('🏠 PropertyCard image sources:', {
      property_image: property.image,
      property_images: property.property_images,
      first_image: property.property_images?.[0]
    });
    
    if (property.image) return property.image;
    if (property.property_images && property.property_images.length > 0) {
      return property.property_images[0];
    }
    return 'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/default/general/default.webp';
  };

  const getStatusConfig = (status: string) => {
    if (!status) return { variant: 'default' as const, text: 'Available', className: 'bg-green-500/90 text-white border-green-400' };
    
    const normalizedStatus = status.toLowerCase().trim();
    
    if (normalizedStatus.includes('sold')) {
      return { variant: 'destructive' as const, text: 'Sold', className: 'bg-red-500/90 text-white border-red-400' };
    }
    if (normalizedStatus.includes('under construction')) {
      return { variant: 'default' as const, text: 'Under Construction', className: 'bg-blue-500/90 text-white border-blue-400' };
    }
    if (normalizedStatus.includes('ready to move')) {
      return { variant: 'default' as const, text: 'Ready To Move', className: 'bg-emerald-500/90 text-white border-emerald-400' };
    }
    if (normalizedStatus.includes('for residence permit')) {
      return { variant: 'default' as const, text: 'For Residence Permit', className: 'bg-purple-500/90 text-white border-purple-400' };
    }
    if (normalizedStatus.includes('exclusive')) {
      return { variant: 'default' as const, text: 'Exclusive', className: 'bg-amber-500/90 text-white border-amber-400' };
    }
    if (normalizedStatus.includes('reserved')) {
      return { variant: 'secondary' as const, text: 'Reserved', className: 'bg-orange-500/90 text-white border-orange-400' };
    }
    if (normalizedStatus.includes('sea view')) {
      return { variant: 'default' as const, text: 'Sea View', className: 'bg-cyan-500/90 text-white border-cyan-400' };
    }
    if (normalizedStatus.includes('private pool')) {
      return { variant: 'default' as const, text: 'Private Pool', className: 'bg-teal-500/90 text-white border-teal-400' };
    }
    if (normalizedStatus.includes('available')) {
      return { variant: 'default' as const, text: 'Available', className: 'bg-green-500/90 text-white border-green-400' };
    }
    
    // Default case - capitalize first letter
    const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    return { variant: 'default' as const, text: capitalizedStatus, className: 'bg-gray-500/90 text-white border-gray-400' };
  };

  const statusConfig = getStatusConfig(property.status);

  return (
    <Link to={`/property/${property.id}`}>
      <Card className="group cursor-pointer hover:shadow-xl transition-all duration-500 overflow-hidden h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30">
        <div className="relative aspect-[4/3] overflow-hidden">
          <OptimizedPropertyImage
            src={getImageUrl()}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            priority={false}
          />
          
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3 z-10">
            <Badge 
              variant={statusConfig.variant}
              className={`${statusConfig.className} shadow-lg border backdrop-blur-sm font-medium px-3 py-1 text-xs uppercase tracking-wide`}
            >
              {statusConfig.text}
            </Badge>
          </div>

          {/* Price Badge */}
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-primary/90 text-primary-foreground shadow-lg border border-primary/30 backdrop-blur-sm font-bold px-3 py-1.5 text-sm">
              {property.price}
            </Badge>
          </div>

          {/* Additional features overlay */}
          <div className="absolute bottom-3 left-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-2 text-white text-xs">
              {property.bedrooms && (
                <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                  <Bed className="w-3 h-3" />
                  <span>{property.bedrooms}</span>
                </div>
              )}
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                <Bath className="w-3 h-3" />
                <span>{property.bathrooms || 'N/A'}</span>
              </div>
              {property.area && (
                <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                  <Maximize2 className="w-3 h-3" />
                  <span>{property.area}m²</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-5 space-y-3">
          <h3 className="font-bold text-foreground line-clamp-2 text-lg group-hover:text-primary transition-colors duration-300 leading-tight">
            {property.title}
          </h3>
          
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-primary" />
            <span className="truncate font-medium">{property.location}</span>
          </div>

          {/* Desktop view property details */}
          <div className="hidden md:flex items-center justify-between text-sm pt-2 border-t border-border/50">
            <div className="flex items-center gap-4 text-muted-foreground">
              {property.bedrooms && (
                <div className="flex items-center gap-1.5">
                  <Bed className="w-4 h-4 text-primary" />
                  <span className="font-medium">{property.bedrooms}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4 text-primary" />
                <span className="font-medium">{property.bathrooms || 'N/A'}</span>
              </div>
              {property.area && (
                <div className="flex items-center gap-1.5">
                  <Maximize2 className="w-4 h-4 text-primary" />
                  <span className="font-medium">{property.area}m²</span>
                </div>
              )}
            </div>
          </div>

          {property.refNo && (
            <div className="pt-2 border-t border-border/30">
              <span className="text-xs text-muted-foreground/80 font-mono bg-muted/30 px-2 py-1 rounded">
                Ref: {property.refNo}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default PropertyCard;