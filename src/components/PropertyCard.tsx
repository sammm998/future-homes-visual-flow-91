import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Bed, Bath, Maximize2 } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { OptimizedPropertyImage } from './OptimizedPropertyImage';
import { formatPriceFromString } from '@/utils/priceFormatting';
import { Link, useLocation } from '@/lib/router-compat';
import { buildPropertyUrl, getCurrentLanguage } from '@/utils/slugHelpers';
import LiveViewers from './LiveViewers';
import { useTranslation } from '@/hooks/useTranslation';

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
  buyer_fee_percent?: number | null;
}

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = memo(({ property, priority = false }) => {
  const { formatPrice } = useCurrency();
  const { t } = useTranslation();
  const routeLocation = useLocation();
  
  // Get current language parameter to preserve it in links
  const lang = getCurrentLanguage(routeLocation.search);
  
  // Build translated URL with proper path segment
  const propertyUrl = buildPropertyUrl(property, lang);
  const returnUrl = `${routeLocation.pathname}${routeLocation.search}`;
  
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
    if (!status) return { variant: 'default' as const, text: t('card.status_available'), className: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25' };
    
    const normalizedStatus = status.toLowerCase().trim();
    
    if (normalizedStatus.includes('sold')) {
      return { variant: 'default' as const, text: t('card.status_sold'), className: 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/25' };
    }
    if (normalizedStatus.includes('under construction')) {
      return { variant: 'default' as const, text: t('card.status_under_construction'), className: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' };
    }
    if (normalizedStatus.includes('ready to move')) {
      return { variant: 'default' as const, text: t('card.status_ready'), className: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25' };
    }
    if (normalizedStatus.includes('for residence permit')) {
      return { variant: 'default' as const, text: t('card.status_residence_permit'), className: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25' };
    }
    if (normalizedStatus.includes('exclusive')) {
      return { variant: 'default' as const, text: t('card.status_exclusive'), className: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25' };
    }
    if (normalizedStatus.includes('sea view')) {
      return { variant: 'default' as const, text: t('card.status_sea_view'), className: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25' };
    }
    if (normalizedStatus.includes('private pool')) {
      return { variant: 'default' as const, text: t('card.status_private_pool'), className: 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/25' };
    }
    if (normalizedStatus.includes('available')) {
      return { variant: 'default' as const, text: t('card.status_available'), className: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25' };
    }
    
    const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    return { variant: 'default' as const, text: capitalizedStatus, className: 'bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg shadow-gray-500/25' };
  };

  const statusConfig = getStatusConfig(property.status);

  return (
    <Link
      to={propertyUrl}
      state={{ returnUrl }}
      className="block h-full"
    >
      <article className="group relative w-full h-full bg-card overflow-hidden cinematic-card rounded-md">
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-secondary">
          <OptimizedPropertyImage
            src={getImageUrl() ?? ''}
            alt={property.title}
            className="w-full h-full object-cover animate-kenburns transition-[filter] duration-700 group-hover:saturate-[1.08]"
            priority={priority}
          />

          {/* Status — sharp pill top-left */}
          <div className="absolute top-4 left-4">
            <span
              className="px-3 py-1.5 bg-brand-secondary/90 backdrop-blur-md text-brand-foreground text-[10px] font-bold tracking-[0.16em] uppercase"
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
                className="px-2.5 py-1 bg-brand-secondary/65 backdrop-blur-sm text-brand-foreground text-[10px] rounded-sm"
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
                <MapPin className="w-3 h-3 text-primary" strokeWidth={2.5} />
              <span
                  className="text-[11px] font-bold tracking-[0.16em] text-primary uppercase"
                style={{ fontFamily: 'Epilogue, sans-serif' }}
              >
                {(property as any).location_translated || property.location}
              </span>
            </div>
            <h3
              className="text-2xl font-bold leading-tight text-card-foreground line-clamp-2 group-hover:text-primary transition-colors"
              style={{ fontFamily: 'Urbanist, sans-serif' }}
            >
              {property.title}
            </h3>
          </div>

          {/* Specs Row */}
          <div className="flex items-center justify-between border-y border-border py-4">
            <div className="flex flex-col">
              <span
                className="text-[10px] text-muted-foreground uppercase"
                style={{ fontFamily: 'Epilogue, sans-serif' }}
              >
                {t('card.price')}
              </span>
              <span
                className="text-lg font-bold text-card-foreground"
                style={{ fontFamily: 'Urbanist, sans-serif' }}
              >
                <span className="text-xs font-medium mr-1 uppercase text-primary">{t('card.from')}</span>
                 {formatPriceFromString(property.price || '0', formatPrice)}
                 {Number(property.buyer_fee_percent) > 0 && <span className="ml-1 text-xs">+{property.buyer_fee_percent}%</span>}
              </span>
            </div>
            <div className="flex gap-4">
              {property.bedrooms && (
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold text-primary" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                    {property.bedrooms}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase" style={{ fontFamily: 'Epilogue, sans-serif' }}>
                    {t('card.beds')}
                  </span>
                </div>
              )}
              <div className="flex flex-col items-center border-l border-border pl-4">
                <span className="text-sm font-bold text-primary" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                  {property.bathrooms || '–'}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase" style={{ fontFamily: 'Epilogue, sans-serif' }}>
                  {t('card.bath')}
                </span>
              </div>
              {property.area && (
                <div className="flex flex-col items-center border-l border-border pl-4">
                  <span className="text-sm font-bold text-primary" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                    {property.area} <span className="text-[10px]">m²</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase" style={{ fontFamily: 'Epilogue, sans-serif' }}>
                    {t('card.area')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div
            className="w-full group/btn flex items-center justify-center gap-2 bg-brand-secondary text-brand-foreground py-3.5 font-bold text-xs uppercase tracking-[0.14em] transition-all duration-300 group-hover:bg-primary"
            style={{ fontFamily: 'Urbanist, sans-serif' }}
          >
            {t('card.view_property')}
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