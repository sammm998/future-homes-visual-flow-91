import React, { memo } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
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
      <article className="group relative h-[30rem] w-full overflow-hidden rounded-lg bg-navy shadow-[var(--shadow-luxe)] transition-all duration-700 hover:-translate-y-2 sm:h-[34rem] lg:h-[31rem] xl:h-[29rem] min-[1600px]:h-[27rem] min-[1800px]:h-[30rem]">
        <div className="absolute inset-0 overflow-hidden bg-navy">
          <OptimizedPropertyImage
            src={getImageUrl() ?? ''}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            priority={priority}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/35 to-navy/5 transition-opacity duration-700 group-hover:opacity-95" />
          <div className="absolute inset-0 border border-navy-foreground/15 transition-colors duration-500 group-hover:border-gold/40" />

          <div className="absolute left-5 top-5 max-w-[52%] sm:left-7 sm:top-7">
            <span
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-navy-foreground/20 bg-navy/45 px-3 py-2 text-[9px] font-bold uppercase text-navy-foreground backdrop-blur-md"
            >
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
              </span>
              <span className="truncate">
              {statusText}
              </span>
            </span>
          </div>

          {/* Live viewing badge — top-right */}
          <div className="absolute right-5 top-5 transition-opacity duration-300 group-hover:opacity-90 sm:right-7 sm:top-7">
            <LiveViewers propertyId={String(property.id)} compact />
          </div>

          {/* REF Chip — bottom-left */}
          {property.refNo && (
            <div className="absolute right-5 top-16 sm:right-7 sm:top-[5rem]">
              <span
                className="rounded-sm bg-navy/55 px-2 py-1 text-[9px] font-semibold text-navy-foreground/80 backdrop-blur-sm"
              >
                REF #{property.refNo}
              </span>
            </div>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 min-w-0 p-6 text-navy-foreground sm:p-7 lg:p-6 min-[1800px]:p-8">
          <div className="min-w-0 space-y-4 transition-transform duration-700 group-hover:-translate-y-1">
            <div className="flex min-w-0 items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2} />
              <span
                className="truncate text-[10px] font-bold uppercase text-gold"
              >
                {(property as any).location_translated || property.location}
              </span>
            </div>
            <h3
                className="line-clamp-2 min-h-[3.25rem] text-xl font-semibold leading-tight text-navy-foreground sm:text-2xl lg:text-xl min-[1800px]:text-2xl"
            >
              {property.title}
            </h3>
          </div>

          <div className="mt-6 grid grid-cols-3 divide-x divide-navy-foreground/15 border-y border-navy-foreground/15 py-4 transition-transform duration-700 group-hover:-translate-y-1 min-[1800px]:mt-7 min-[1800px]:py-5">
            <div className="min-w-0 px-1 text-center first:pl-0 sm:px-2">
              <span className="block truncate text-[9px] font-bold uppercase text-navy-foreground/55">{t('card.beds')}</span>
              <span className="mt-1 block truncate text-base font-semibold text-navy-foreground">{property.bedrooms || '–'}</span>
            </div>
            <div className="min-w-0 px-1 text-center sm:px-2">
              <span className="block truncate text-[9px] font-bold uppercase text-navy-foreground/55">{t('card.bath')}</span>
              <span className="mt-1 block truncate text-base font-semibold text-navy-foreground">{property.bathrooms || '–'}</span>
            </div>
            <div className="min-w-0 px-1 text-center last:pr-0 sm:px-2">
              <span className="block truncate text-[9px] font-bold uppercase text-navy-foreground/55">{t('card.area')}</span>
              <span className="mt-1 block truncate text-base font-semibold text-navy-foreground">{property.area ? `${property.area} m²` : '–'}</span>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-5">
            <div className="min-w-0">
              <span className="block text-[9px] font-bold uppercase text-navy-foreground/55">{t('card.price')}</span>
              <span className="mt-1 block truncate text-xl font-bold text-navy-foreground sm:text-2xl">
                <span className="mr-1 text-[9px] font-semibold uppercase text-gold">{t('card.from')}</span>
                {formatPriceFromString(property.price || '0', formatPrice)}
                {Number(property.buyer_fee_percent) > 0 && <span className="ml-1 text-[10px]">+{property.buyer_fee_percent}%</span>}
              </span>
            </div>
            <span className="flex h-12 shrink-0 items-center gap-2 bg-ivory px-5 text-[9px] font-extrabold uppercase text-navy transition-colors duration-300 group-hover:bg-gold">
              <span className="hidden sm:inline">{t('card.view_property')}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
});

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;