import React, { memo } from 'react';
import { MapPin } from 'lucide-react';
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

  const getStatusText = (status: string) => {
    if (!status) return t('card.status_available');
    
    const normalizedStatus = status.toLowerCase().trim();
    
    if (normalizedStatus.includes('sold')) {
      return t('card.status_sold');
    }
    if (normalizedStatus.includes('under construction')) {
      return t('card.status_under_construction');
    }
    if (normalizedStatus.includes('ready to move')) {
      return t('card.status_ready');
    }
    if (normalizedStatus.includes('for residence permit')) {
      return t('card.status_residence_permit');
    }
    if (normalizedStatus.includes('exclusive')) {
      return t('card.status_exclusive');
    }
    if (normalizedStatus.includes('sea view')) {
      return t('card.status_sea_view');
    }
    if (normalizedStatus.includes('private pool')) {
      return t('card.status_private_pool');
    }
    if (normalizedStatus.includes('available')) {
      return t('card.status_available');
    }
    
    const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    return capitalizedStatus;
  };

  const statusText = getStatusText(property.status);

  return (
    <Link
      to={propertyUrl}
      state={{ returnUrl }}
      className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4"
    >
      <article className="group relative h-full w-full overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[var(--shadow-luxe)]">
        {/* Image Section */}
        <div className="relative aspect-[4/5] overflow-hidden bg-navy">
          <OptimizedPropertyImage
            src={getImageUrl() ?? ''}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            priority={priority}
          />

          {/* Status — sharp pill top-left */}
          <div className="absolute top-4 left-4">
            <span
              className="bg-navy px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-navy-foreground"
            >
              {statusText}
            </span>
          </div>

          {/* Live viewing badge — top-right */}
          <div className="absolute top-4 right-4 transition-opacity duration-300 group-hover:opacity-90">
            <LiveViewers propertyId={String(property.id)} compact />
          </div>

          {/* REF Chip — bottom-left */}
          {property.refNo && (
            <div className="absolute bottom-4 right-4">
              <span
                className="rounded-sm bg-navy/70 px-2 py-0.5 text-[10px] text-navy-foreground backdrop-blur-sm"
              >
                REF #{property.refNo}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="space-y-5 p-6 md:p-7">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-gold" strokeWidth={2.5} />
              <span
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-foreground"
              >
                {(property as any).location_translated || property.location}
              </span>
            </div>
            <h3
                className="line-clamp-2 min-h-[3.5rem] text-2xl font-semibold leading-tight text-navy transition-colors group-hover:text-gold-foreground"
            >
              {property.title}
            </h3>
          </div>

          {/* Specs Row */}
          <div className="flex items-end justify-between border-t border-border pt-5">
            <div className="flex flex-col">
              <span
                className="text-[10px] uppercase tracking-normal text-muted-foreground"
              >
                {t('card.price')}
              </span>
              <span
                className="text-lg font-bold text-navy"
              >
                <span className="mr-1 text-xs font-medium uppercase text-gold-foreground">{t('card.from')}</span>
                 {formatPriceFromString(property.price || '0', formatPrice)}
                 {Number(property.buyer_fee_percent) > 0 && <span className="ml-1 text-xs">+{property.buyer_fee_percent}%</span>}
              </span>
            </div>
            <div className="flex gap-4">
              {property.bedrooms && (
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold text-navy">
                    {property.bedrooms}
                  </span>
                  <span className="text-[10px] uppercase text-muted-foreground">
                    {t('card.beds')}
                  </span>
                </div>
              )}
              <div className="flex flex-col items-center border-l border-[#e8edf3] pl-4">
                <span className="text-sm font-bold text-navy">
                  {property.bathrooms || '–'}
                </span>
                <span className="text-[10px] uppercase text-muted-foreground">
                  {t('card.bath')}
                </span>
              </div>
              {property.area && (
                <div className="flex flex-col items-center border-l border-[#e8edf3] pl-4">
                  <span className="text-sm font-bold text-navy">
                    {property.area} <span className="text-[10px]">m²</span>
                  </span>
                  <span className="text-[10px] uppercase text-muted-foreground">
                    {t('card.area')}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex w-full items-center justify-between border-t border-border pt-4 text-xs font-bold uppercase tracking-widest text-navy transition-colors group-hover:text-gold-foreground">
            {t('card.view_property')}
            <span className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors group-hover:border-navy group-hover:bg-navy group-hover:text-navy-foreground">
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
});

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;