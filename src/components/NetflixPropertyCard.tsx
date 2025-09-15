import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Maximize2, Play } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { OptimizedPropertyImage } from './OptimizedPropertyImage';
import { formatPriceFromString } from '@/utils/priceFormatting';
import { motion } from 'framer-motion';

interface Property {
  id: string;
  title: string;
  location: string;
  property_image: string;
  property_images: string[];
  price: string;
  bedrooms?: string;
  bathrooms?: string;
  sizes_m2?: string;
  area?: string;
  status?: string;
}

interface PropertyCardProps {
  property: Property;
  onViewGallery: (property: Property) => void;
  index: number;
}

const NetflixPropertyCard: React.FC<PropertyCardProps> = ({ property, onViewGallery, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { formatPrice } = useCurrency();

  return (
    <motion.div
      className="flex-shrink-0 w-80 group cursor-pointer"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, zIndex: 10 }}
    >
      <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
        <div className="relative aspect-video overflow-hidden">
          <OptimizedPropertyImage
            src={property.property_image || property.property_images?.[0]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            priority={index < 4}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Image Count Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-black/70 text-white border-0 text-xs">
              {property.property_images?.length || 1} photos
            </Badge>
          </div>

          {/* Hover Content */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={() => onViewGallery(property)}
              size="lg"
              className="bg-white/90 text-black hover:bg-white border-0 shadow-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              View Gallery
            </Button>
          </motion.div>

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
              {property.title}
            </h3>
            
            <div className="flex items-center text-white/80 text-sm mb-3">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{property.location}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-primary font-bold text-xl">
                {formatPriceFromString(property.price || '0', formatPrice)}
              </span>
              
              <div className="flex items-center gap-3 text-white/80 text-sm">
                {property.bedrooms && (
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    <span>{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    <span>{property.bathrooms}</span>
                  </div>
                )}
                {(property.sizes_m2 || property.area) && (
                  <div className="flex items-center gap-1">
                    <Maximize2 className="w-4 h-4" />
                    <span>{property.sizes_m2 || property.area}m²</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Info Section (shown on hover) */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isHovered ? 'auto' : 0, 
            opacity: isHovered ? 1 : 0 
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <CardContent className="p-4 bg-card/90 backdrop-blur-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Property Type</span>
                <span className="text-sm font-medium">Residential</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="outline" className="text-xs">
                  {property.status || 'Available'}
                </Badge>
              </div>
              
              <Button
                onClick={() => onViewGallery(property)}
                variant="outline"
                size="sm"
                className="w-full mt-2"
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default NetflixPropertyCard;