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
      <article className="group relative w-full h-full bg-white overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-1">
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#1e3a5f]">
          <OptimizedPropertyImage
            src={getImageUrl()}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            priority={priority}
          />

          {/* Status — sharp pill top-left */}
          <div className="absolute top-4 left-4">
            <span
              className="px-3 py-1 bg-[#0f1b3d] text-white text-[10px] font-bold tracking-widest uppercase"
              style={{ fontFamily: 'Urbanist, sans-serif' }}
            >
              {statusConfig.text}
            </span>
          </div>

          {/* Live viewing badge — top-right */}
          <div className="absolute top-4 right-4 transition-opacity duration-300 group-hover:opacity-90">
            <LiveViewers propertyId={String(property.id)} compact />
          </div>

          {/* REF Chip — bottom-left */}
          {property.refNo && (
            <div className="absolute bottom-4 left-4">
              <span
                className="px-2 py-0.5 bg-black/40 backdrop-blur-sm text-white text-[10px] rounded"
                style={{ fontFamily: 'Epilogue, sans-serif' }}
              >
                REF #{property.refNo}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-[#3b6fa0]" strokeWidth={2.5} />
              <span
                className="text-[11px] font-bold tracking-[0.2em] text-[#3b6fa0] uppercase"
                style={{ fontFamily: 'Epilogue, sans-serif' }}
              >
                {(property as any).location_translated || property.location}
              </span>
            </div>
            <h3
              className="text-2xl font-bold leading-tight text-[#0f1b3d] line-clamp-2 group-hover:text-[#1e3a5f] transition-colors"
              style={{ fontFamily: 'Urbanist, sans-serif' }}
            >
              {property.title}
            </h3>
          </div>

          {/* Specs Row */}
          <div className="flex items-center justify-between border-y border-[#e8edf3] py-4">
            <div className="flex flex-col">
              <span
                className="text-[10px] text-gray-400 uppercase tracking-tighter"
                style={{ fontFamily: 'Epilogue, sans-serif' }}
              >
                Price
              </span>
              <span
                className="text-lg font-bold text-[#0f1b3d]"
                style={{ fontFamily: 'Urbanist, sans-serif' }}
              >
                <span className="text-xs font-medium mr-1 uppercase text-[#3b6fa0]">from</span>
                {formatPriceFromString(property.price || '0', formatPrice)}
              </span>
            </div>
            <div className="flex gap-4">
              {property.bedrooms && (
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold text-[#1e3a5f]" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                    {property.bedrooms}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase" style={{ fontFamily: 'Epilogue, sans-serif' }}>
                    Beds
                  </span>
                </div>
              )}
              <div className="flex flex-col items-center border-l border-[#e8edf3] pl-4">
                <span className="text-sm font-bold text-[#1e3a5f]" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                  {property.bathrooms || '–'}
                </span>
                <span className="text-[10px] text-gray-400 uppercase" style={{ fontFamily: 'Epilogue, sans-serif' }}>
                  Bath
                </span>
              </div>
              {property.area && (
                <div className="flex flex-col items-center border-l border-[#e8edf3] pl-4">
                  <span className="text-sm font-bold text-[#1e3a5f]" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                    {property.area} <span className="text-[10px]">m²</span>
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase" style={{ fontFamily: 'Epilogue, sans-serif' }}>
                    Area
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div
            className="w-full group/btn flex items-center justify-center gap-2 bg-[#0f1b3d] text-white py-3.5 font-bold text-xs uppercase tracking-widest transition-colors group-hover:bg-[#1e3a5f]"
            style={{ fontFamily: 'Urbanist, sans-serif' }}
          >
            View Property
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
});

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;