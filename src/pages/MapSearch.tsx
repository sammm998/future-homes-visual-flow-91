import React, { useEffect, useRef, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLocation, useNavigate } from '@/lib/router-compat';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, BedDouble, Building2, Filter, Layers3, Loader2, MapPin, Menu, Search, SlidersHorizontal, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPropertyCoordinates } from '@/utils/propertyCoordinates';
import PropertyFilter from '@/components/PropertyFilter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import { buildPropertyUrl, getCurrentLanguage } from '@/utils/slugHelpers';

interface Property {
  id: string;
  ref_no: string;
  title: string;
  location: string;
  price: string;
  google_maps_embed: string | null;
  slug: string | null;
  slug_sv?: string | null;
  slug_tr?: string | null;
  slug_ar?: string | null;
  slug_ru?: string | null;
  slug_no?: string | null;
  slug_da?: string | null;
  slug_fa?: string | null;
  slug_ur?: string | null;
  slug_es?: string | null;
  slug_de?: string | null;
  slug_fr?: string | null;
  slug_id?: string | null;
  property_image: string | null;
  property_type: string | null;
  bedrooms: string | null;
  property_district: string | null;
  amenities: string[] | null;
}

const MapSearch = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/streets-v12');
  const [filters, setFilters] = useState({
    propertyType: '',
    bedrooms: '',
    location: '',
    district: '',
    minPrice: '',
    maxPrice: '',
    minSquareFeet: '',
    maxSquareFeet: '',
    facilities: [] as string[],
    referenceNo: '',
    sortBy: ''
  });
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const currentPopupRef = useRef<mapboxgl.Popup | null>(null);
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isDesktopFilterOpen, setIsDesktopFilterOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const lang = getCurrentLanguage(routeLocation.search);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return (
    <main className="h-[100svh] overflow-hidden bg-ivory text-navy">
      {loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-navy/85 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 text-navy-foreground">
            <Loader2 className="h-10 w-10 animate-spin text-gold" />
            <p className="text-sm">{t('city.loading')}</p>
          </div>
        </div>
      )}

      <div className="grid h-full grid-rows-[42svh_1fr] lg:grid-cols-[minmax(34rem,44%)_1fr] lg:grid-rows-1">
        <section className="order-2 flex min-h-0 flex-col border-r border-navy/10 bg-ivory lg:order-1">
          <header className="shrink-0 border-b border-navy/10 bg-ivory px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase text-gold">Future Homes International</p>
                <h1 className="text-2xl font-semibold leading-tight sm:text-3xl">{t('nav.map_search')}</h1>
                <p className="mt-2 text-xs text-navy/60">
                  {t('common.showing')} <strong className="text-navy">{filteredProperties.length}</strong> {t('common.properties')}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="hidden shrink-0 border-navy/15 bg-transparent text-navy hover:border-gold hover:bg-background lg:inline-flex"
                onClick={() => setIsDesktopFilterOpen((open) => !open)}
                aria-label={t('nav.search')}
              >
                <SlidersHorizontal />
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <Select value={filters.location} onValueChange={(value) => setFilters((current) => ({ ...current, location: value, district: '' }))}>
                <SelectTrigger className="h-11 border-navy/15 bg-background text-navy">
                  <MapPin className="h-4 w-4 text-gold" />
                  <SelectValue placeholder={t('filter.select_location')} />
                </SelectTrigger>
                <SelectContent>
                  {['all', 'Antalya', 'Istanbul', 'Mersin', 'Dubai', 'Cyprus', 'Bali'].map((location) => (
                    <SelectItem key={location} value={location}>{location === 'all' ? t('info.all') : location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filters.sortBy} onValueChange={(value) => setFilters((current) => ({ ...current, sortBy: value }))}>
                <SelectTrigger className="hidden h-11 border-navy/15 bg-background text-navy sm:flex">
                  <Layers3 className="h-4 w-4 text-gold" />
                  <SelectValue placeholder={t('search.sort_by')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ref">{t('search.newest')}</SelectItem>
                  <SelectItem value="price-low">{t('search.price_low')}</SelectItem>
                  <SelectItem value="price-high">{t('search.price_high')}</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="h-11 bg-navy px-4 text-navy-foreground hover:bg-navy/90 lg:hidden"
                onClick={() => setIsMobileFilterOpen(true)}
                aria-label={t('nav.search')}
              >
                <Filter />
                <span className="hidden sm:inline">{t('nav.search')}</span>
              </Button>
            </div>
          </header>

          {isDesktopFilterOpen && (
            <div className="max-h-[48vh] shrink-0 overflow-y-auto border-b border-navy/10 bg-background px-5 py-5 lg:px-8">
              <PropertyFilter filters={filters} onFilterChange={handleFilterChange} onSearch={handleSearch} horizontal={false} />
            </div>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
            <div className="space-y-4">
              {filteredProperties.map((property, index) => {
                const active = selectedProperty?.id === property.id;
                return (
                  <article
                    key={property.id}
                    className={`group grid min-h-40 cursor-pointer grid-cols-[8.5rem_1fr] overflow-hidden border bg-background transition-all duration-300 sm:grid-cols-[11rem_1fr] ${active ? 'border-gold shadow-[var(--shadow-luxe)]' : 'border-navy/10 hover:border-gold/60'}`}
                    onClick={() => selectProperty(property)}
                  >
                    <div className="relative min-h-40 overflow-hidden bg-navy">
                      {property.property_image ? (
                        <img
                          src={property.property_image}
                          alt={property.title}
                          loading={index < 3 ? 'eager' : 'lazy'}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gold"><Building2 className="h-7 w-7" /></div>
                      )}
                      <span className="absolute left-3 top-3 bg-navy/85 px-2 py-1 text-[9px] font-bold uppercase text-navy-foreground backdrop-blur-sm">REF {property.ref_no}</span>
                    </div>
                    <div className="flex min-w-0 flex-col justify-between p-4 sm:p-5">
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 truncate text-[10px] font-bold uppercase text-gold">
                          <MapPin className="h-3 w-3 shrink-0" /> {property.location}
                        </p>
                        <h2 className="mt-2 line-clamp-2 text-sm font-semibold leading-snug sm:text-base">{property.title}</h2>
                        <div className="mt-3 flex items-center gap-3 text-[11px] text-navy/55">
                          {property.bedrooms && <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{property.bedrooms}</span>}
                          {property.property_type && <span className="truncate">{property.property_type}</span>}
                        </div>
                      </div>
                      <div className="mt-4 flex items-end justify-between gap-3 border-t border-navy/10 pt-3">
                        <strong className="truncate text-sm text-navy sm:text-base">{property.price}</strong>
                        <Button
                          size="icon"
                          className="h-9 w-9 shrink-0 bg-navy text-navy-foreground hover:bg-gold hover:text-gold-foreground"
                          onClick={(event) => {
                            event.stopPropagation();
                            navigate(buildPropertyUrl(property, lang));
                          }}
                          aria-label={t('card.view_property')}
                        >
                          <ArrowRight />
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative order-1 min-h-0 bg-navy lg:order-2">
          <div ref={mapContainer} className="h-full w-full" />
          <div className="absolute left-4 top-4 z-[60] flex gap-1 border border-navy/10 bg-background/95 p-1 shadow-[var(--shadow-luxe)] backdrop-blur-sm">
            <Button
              size="sm"
              variant={mapStyle === 'mapbox://styles/mapbox/streets-v12' ? 'default' : 'ghost'}
              className={mapStyle === 'mapbox://styles/mapbox/streets-v12' ? 'bg-navy text-navy-foreground hover:bg-navy/90' : 'text-navy'}
              onClick={() => setMapStyle('mapbox://styles/mapbox/streets-v12')}
            >Street</Button>
            <Button
              size="sm"
              variant={mapStyle === 'mapbox://styles/mapbox/satellite-streets-v12' ? 'default' : 'ghost'}
              className={mapStyle === 'mapbox://styles/mapbox/satellite-streets-v12' ? 'bg-navy text-navy-foreground hover:bg-navy/90' : 'text-navy'}
              onClick={() => setMapStyle('mapbox://styles/mapbox/satellite-streets-v12')}
            >Satellite</Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 text-navy"
              onClick={() => map.current?.easeTo({ pitch: map.current.getPitch() === 0 ? 60 : 0, duration: 800 })}
              aria-label="3D"
            ><Layers3 /></Button>
          </div>
        </section>
      </div>

      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[200] bg-navy/55 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileFilterOpen(false)}>
          <aside className="absolute inset-y-0 left-0 w-[min(92vw,24rem)] overflow-y-auto bg-ivory p-4" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-navy">{t('nav.search')}</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileFilterOpen(false)} aria-label="Close"><X /></Button>
            </div>
            <PropertyFilter filters={filters} onFilterChange={handleFilterChange} onSearch={handleSearch} horizontal={false} />
          </aside>
        </div>
      )}

      <style>{`
        .custom-marker {
          width: 38px;
          height: 38px;
          cursor: pointer;
          overflow: hidden;
          border: 3px solid hsl(var(--ivory));
          border-radius: 999px;
          background: hsl(var(--ivory)) url('/favicon.png') center / contain no-repeat;
          box-shadow: 0 8px 22px hsl(var(--navy) / 0.3);
          transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
        }
        .custom-marker:hover { border-color: hsl(var(--gold)); box-shadow: 0 10px 28px hsl(var(--navy) / 0.45); transform: translateY(-2px); }
        .mapboxgl-ctrl-top-right { top: 64px; right: 12px; }
        [data-radix-popper-content-wrapper], [role='dialog'], [role='menu'], [role='listbox'] { z-index: 300 !important; }
      `}</style>
    </main>
  );
};

export default MapSearch;
