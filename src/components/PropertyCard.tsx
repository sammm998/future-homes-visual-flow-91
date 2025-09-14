import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Bath, Maximize2, Star, Heart } from 'lucide-react';
import { OptimizedPropertyImage } from './OptimizedPropertyImage';
import { Link } from 'react-router-dom';
import { GlowCard } from '@/components/ui/spotlight-card';

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

  const getStatusColor = () => {
    switch(property.status?.toLowerCase()) {
      case 'available': return 'bg-green-500/90';
      case 'sold': return 'bg-red-500/90';
      case 'reserved': return 'bg-orange-500/90';
      default: return 'bg-blue-500/90';
    }
  };

  return (
    <Link to={`/property/${property.id}`} className="block h-full">
      <GlowCard 
        customSize={true} 
        glowColor="blue"
        className="group cursor-pointer transition-all duration-500 hover:scale-[1.02] h-full w-full p-0 overflow-hidden animate-fade-in"
      >
        {/* Property Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
          <OptimizedPropertyImage
            src={getImageUrl()}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
            priority={false}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <Badge className={`${getStatusColor()} text-white border-0 shadow-lg backdrop-blur-sm animate-scale-in`}>
              {property.status}
            </Badge>
          </div>

          {/* Price Badge */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0 shadow-lg backdrop-blur-sm font-bold animate-scale-in">
              {property.price}
            </Badge>
          </div>

          {/* Favorite Button */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors cursor-pointer">
              <Heart className="w-4 h-4 text-white hover:text-red-400 transition-colors" />
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5 flex-1 flex flex-col bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          {/* Title */}
          <h3 className="font-bold text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors duration-300 text-lg leading-tight">
            {property.title}
          </h3>
          
          {/* Location */}
          <div className="flex items-center text-muted-foreground text-sm mb-4">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-primary" />
            <span className="truncate font-medium">{property.location}</span>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-4 text-sm mb-4">
            {property.bedrooms && (
              <div className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                <Bed className="w-4 h-4 text-primary" />
                <span className="font-medium">{property.bedrooms}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <Bath className="w-4 h-4 text-primary" />
              <span className="font-medium">{property.bathrooms || 'N/A'}</span>
            </div>
            {property.area && (
              <div className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                <Maximize2 className="w-4 h-4 text-primary" />
                <span className="font-medium">{property.area}m²</span>
              </div>
            )}
          </div>

          {/* Reference Number */}
          {property.refNo && (
            <div className="mt-auto pt-3 border-t border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">Ref: {property.refNo}</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">Premium</span>
                </div>
              </div>
            </div>
          )}

          {/* Hover Action */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm">
              View Details →
            </div>
          </div>
        </div>
      </GlowCard>
    </Link>
  );
};

export default PropertyCard;