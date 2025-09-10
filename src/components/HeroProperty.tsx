import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Bath, Maximize2, Play, Info } from 'lucide-react';
import { OptimizedPropertyImage } from './OptimizedPropertyImage';
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
  description?: string;
  area?: string;
  status?: string;
}

interface HeroPropertyProps {
  property: Property;
  onViewGallery: (property: Property) => void;
}

const HeroProperty: React.FC<HeroPropertyProps> = ({ property, onViewGallery }) => {
  return (
    <section className="relative h-[85vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <OptimizedPropertyImage
          src={property.property_image || property.property_images?.[0]}
          alt={property.title}
          className="w-full h-full object-cover"
          priority={true}
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <Badge className="mb-4 bg-primary/90 text-primary-foreground">
                Featured Property
              </Badge>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                {property.title}
              </h1>

              {/* Location */}
              <div className="flex items-center text-white/80 text-lg mb-6">
                <MapPin className="w-5 h-5 mr-2" />
                {property.location}
              </div>

              {/* Property Details */}
              <div className="flex items-center gap-6 text-white/90 mb-6">
                <div className="text-2xl font-bold text-primary">
                  {property.price}
                </div>
                
                <div className="flex items-center gap-4">
                  {property.bedrooms && (
                    <div className="flex items-center gap-1">
                      <Bed className="w-5 h-5" />
                      <span>{property.bedrooms} bed</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-1">
                      <Bath className="w-5 h-5" />
                      <span>{property.bathrooms} bath</span>
                    </div>
                  )}
                  {property.sizes_m2 && (
                    <div className="flex items-center gap-1">
                      <Maximize2 className="w-5 h-5" />
                      <span>{property.sizes_m2}m²</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <p className="text-white/80 text-lg mb-8 leading-relaxed max-w-xl">
                  {property.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => onViewGallery(property)}
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 text-lg px-8"
                >
                  <Play className="w-5 h-5 mr-2" />
                  View Gallery
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 text-lg px-6"
                >
                  <Info className="w-5 h-5 mr-2" />
                  More Info
                </Button>
              </div>

              {/* Image Count */}
              <div className="mt-6">
                <Badge variant="outline" className="border-white/30 text-white bg-black/30">
                  {property.property_images?.length || 1} Photos Available
                </Badge>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Fade to Content */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroProperty;