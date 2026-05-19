import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Bed, Bath, Maximize2 } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { OptimizedPropertyImage } from './OptimizedPropertyImage';
import { formatPriceFromString } from '@/utils/priceFormatting';
import { Link, useLocation } from 'react-router-dom';
import { buildPropertyUrl, getCurrentLanguage } from '@/utils/slugHelpers';
import LiveViewers from './LiveViewers';

interface Property {
  id: string | number;
  refNo?: string;
  ref_no?: string;
  slug?: string;
  slug_sv?: string;
  slug_tr?: string;
  slug_ar?: string;
  slug_ru?: string;
  slug_no?: string;
  slug_da?: string;
  slug_fa?: string;
  slug_ur?: string;
  slug_es?: string;
  slug_de?: string;
  slug_fr?: string;
  slug_id?: string;
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

const PropertyCard: React.FC<PropertyCardProps> = memo(({ property, priority = false }) => {
  const { formatPrice } = useCurrency();
  const routeLocation = useLocation();
  
  // Get current language parameter to preserve it in links
  const lang = getCurrentLanguage(routeLocation.search);
  
  // Build translated URL with proper path segment
  const propertyUrl = buildPropertyUrl(property, lang);
  
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
    
    // Prioritize the main image (property_image) set in CMS
    if (isValidImageUrl(property.image)) return property.image;
    
    if (property.property_images && Array.isArray(property.property_images)) {
      const validImage = property.property_images.find(img => isValidImageUrl(img));
      if (validImage) return validImage;
    }
    
    return defaultImage;
  };

  const getStatusConfig = (status: string) => {
    if (!status) return { variant: 'default' as const, text: 'Available', className: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25' };
    
    const normalizedStatus = status.toLowerCase().trim();
    
    if (normalizedStatus.includes('sold')) {
      return { variant: 'default' as const, text: 'SOLD', className: 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/25' };
    }
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
    
    const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    return { variant: 'default' as const, text: capitalizedStatus, className: 'bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg shadow-gray-500/25' };
  };

  const statusConfig = getStatusConfig(property.status);

  return (
    <Link to={propertyUrl} className="block h-full">
      <Card className="group relative cursor-pointer overflow-hidden h-full bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-foreground/5 hover:border-border transition-all duration-500 hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <OptimizedPropertyImage
            src={getImageUrl()}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-[1200ms] ease-out"
            priority={priority}
          />

          {/* Soft top gradient for badge legibility */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

          {/* Status pill — minimal, single chip */}
          <div className="absolute top-3 left-3 z-10">
            <div className={`${statusConfig.className} backdrop-blur-md rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] shadow-sm`}>
              {statusConfig.text}
            </div>
          </div>

          {/* Live viewers — bottom right, fades on hover */}
          <div className="absolute bottom-3 right-3 z-10 transition-opacity duration-300 group-hover:opacity-0">
            <LiveViewers propertyId={String(property.id)} compact />
          </div>

          {/* REF chip — bottom left */}
          {property.refNo && (
            <div className="absolute bottom-3 left-3 z-10 transition-opacity duration-300 group-hover:opacity-0">
              <span className="inline-flex items-center rounded-full bg-black/55 backdrop-blur-md text-white text-[10px] font-mono tracking-wider px-2.5 py-1">
                #{property.refNo}
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-5 space-y-3">
          {/* Location eyebrow */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em]">
              {(property as any).location_translated || property.location}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-foreground text-[17px] leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300 min-h-[2.6em]">
            {property.title}
          </h3>

          {/* Price — hero element */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">From</span>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {formatPriceFromString(property.price || '0', formatPrice)}
            </span>
          </div>

          {/* Specs row */}
          <div className="flex items-center gap-4 pt-3 border-t border-border/60 text-muted-foreground">
            {property.bedrooms && (
              <div className="flex items-center gap-1.5">
                <Bed className="w-4 h-4" />
                <span className="text-sm font-medium text-foreground">{property.bedrooms}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4" />
              <span className="text-sm font-medium text-foreground">{property.bathrooms || '–'}</span>
            </div>
            {property.area && (
              <div className="flex items-center gap-1.5 ml-auto">
                <Maximize2 className="w-4 h-4" />
                <span className="text-sm font-medium text-foreground">{property.area} m²</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;