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
    // Use a proper fallback image URL instead of /placeholder.svg
    return 'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/default/general/default.webp';
  };

  return (
    <Link to={`/property/${property.id}`}>
      <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
        <div className="relative aspect-[4/3] overflow-hidden">
          <OptimizedPropertyImage
            src={getImageUrl()}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            priority={false}
          />
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <Badge 
              variant={property.status === 'Available' ? 'default' : 'secondary'}
              className="bg-white/90 text-black shadow-sm"
            >
              {property.status}
            </Badge>
          </div>

          {/* Price Badge */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary text-primary-foreground shadow-sm">
              {property.price}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          
          <div className="flex items-center text-muted-foreground text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              {property.bedrooms && (
                <div className="flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  <span>{property.bedrooms}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms || 'N/A'}</span>
              </div>
              {property.area && (
                <div className="flex items-center gap-1">
                  <Maximize2 className="w-4 h-4" />
                  <span>{property.area}m²</span>
                </div>
              )}
            </div>
          </div>

          {property.refNo && (
            <div className="mt-2 pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">Ref: {property.refNo}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default PropertyCard;