import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Bath, Maximize2 } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { OptimizedPropertyImage } from './OptimizedPropertyImage';
import { formatPriceFromString } from '@/utils/priceFormatting';
import { Link } from 'react-router-dom';

interface Property {
  id: string | number;
  refNo?: string;
  ref_no?: string;
  slug?: string;
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
  priority?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, priority = false }) => {
  const { formatPrice } = useCurrency();
  const getImageUrl = () => {
    const defaultImage = 'https://cdn.futurehomesturkey.com/uploads/thumbs/pages/default/general/default.webp';
    
    const isValidImageUrl = (url: string | undefined | null): boolean => {
      if (!url || typeof url !== 'string') return false;
      const trimmed = url.trim();
      if (!trimmed || trimmed === '' || trimmed === 'null' || trimmed === 'undefined') return false;
      if (trimmed.includes('placeholder.svg')) return false;
      if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:')) return false;
      return true;
    };
    
    if (property.property_images && Array.isArray(property.property_images)) {
      const validImage = property.property_images.find(img => isValidImageUrl(img));
      if (validImage) return validImage;
    }
    
    if (isValidImageUrl(property.image)) return property.image;
    
    return defaultImage;
  };

  const getStatusConfig = (status: string) => {
    if (!status) return { variant: 'default' as const, text: 'Available', className: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25' };
    
    const normalizedStatus = status.toLowerCase().trim();
    
    // Remove "sold" status as per user request - no properties should show as sold
    if (normalizedStatus.includes('under construction')) {
      return { variant: 'default' as const, text: 'Under Construction', className: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' };
    }
    if (normalizedStatus.includes('ready to move')) {
      return { variant: 'default' as const, text: 'Ready To Move', className: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25' };
    }
    if (normalizedStatus.includes('for residence permit')) {
      return { variant: 'default' as const, text: 'For Residence Permit', className: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25' };
    }
    if (normalizedStatus.includes('exclusive')) {
      return { variant: 'default' as const, text: 'Exclusive', className: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25' };
    }
    if (normalizedStatus.includes('sea view')) {
      return { variant: 'default' as const, text: 'Sea View', className: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25' };
    }
    if (normalizedStatus.includes('private pool')) {
      return { variant: 'default' as const, text: 'Private Pool', className: 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/25' };
    }
    if (normalizedStatus.includes('available')) {
      return { variant: 'default' as const, text: 'Available', className: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25' };
    }
    
    // Default case - capitalize first letter and use gradient
    const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    return { variant: 'default' as const, text: capitalizedStatus, className: 'bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg shadow-gray-500/25' };
  };

  const statusConfig = getStatusConfig(property.status);
  
  // Use slug for SEO-friendly URLs, fallback to refNo or id
  const propertyUrl = property.slug 
    ? `/property/${property.slug}` 
    : property.refNo || property.ref_no 
      ? `/property/${property.refNo || property.ref_no}` 
      : `/property/${property.id}`;

  return (
    <Link to={propertyUrl}>
      <Card className="group cursor-pointer overflow-hidden h-full bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-md border border-border/20 hover:border-primary/40 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden">
          <OptimizedPropertyImage
            src={getImageUrl()}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            priority={priority}
          />
          
          {/* Modern gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
          
          {/* Glass morphism status badge */}
          <div className="absolute top-4 left-4 z-10 max-w-[calc(50%-1rem)]">
            <div className={`${statusConfig.className} backdrop-blur-md border border-white/20 rounded-xl px-2 py-1.5 text-xs font-bold uppercase tracking-wide`}>
              {statusConfig.text}
            </div>
          </div>

          {/* Modern price badge */}
          <div className="absolute top-4 right-4 z-10 max-w-[calc(50%-1rem)]">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-2.5 py-1.5">
              <span className="text-white font-bold text-lg drop-shadow-lg">
                {formatPriceFromString(property.price || '0', formatPrice)}
              </span>
            </div>
          </div>

          {/* Modern info overlay on hover */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <div className="flex items-center justify-center gap-6">
              {property.bedrooms && (
                <div className="flex flex-col items-center text-white">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 mb-1">
                    <Bed className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium">{property.bedrooms}</span>
                </div>
              )}
              <div className="flex flex-col items-center text-white">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 mb-1">
                  <Bath className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium">{property.bathrooms || 'N/A'}</span>
              </div>
              {property.area && (
                <div className="flex flex-col items-center text-white">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 mb-1">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium">{property.area}m²</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="font-bold text-foreground text-xl leading-tight mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {property.title}
            </h3>
            
            <div className="flex items-center text-muted-foreground">
              <div className="bg-primary/10 rounded-full p-1.5 mr-3">
                <MapPin className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-medium text-sm">{property.location}</span>
            </div>
          </div>

          {/* Modern property specs */}
          <div className="flex items-center gap-6 pt-4 border-t border-border/30">
            {property.bedrooms && (
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 rounded-lg p-1.5">
                  <Bed className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground">{property.bedrooms}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 rounded-lg p-1.5">
                <Bath className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-sm font-semibold text-foreground">{property.bathrooms || 'N/A'}</span>
            </div>
            {property.area && (
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 rounded-lg p-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground">{property.area}m²</span>
              </div>
            )}
          </div>

          {property.refNo && (
            <div className="pt-3 border-t border-border/20">
              <div className="inline-flex items-center bg-muted/50 rounded-lg px-3 py-1.5">
                <span className="text-xs font-mono text-muted-foreground">
                  REF: <span className="font-bold text-foreground">{property.refNo}</span>
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default PropertyCard;