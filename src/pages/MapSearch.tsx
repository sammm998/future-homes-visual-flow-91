import React, { useEffect, useRef, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLocation, useNavigate } from '@/lib/router-compat';
import { supabase } from '@/integrations/legacy/client';
import { ArrowRight, BedDouble, Building2, Filter, Layers3, Loader2, MapPin, Search, SlidersHorizontal, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPropertyCoordinates } from '@/utils/propertyCoordinates';
import PropertyFilter from '@/components/PropertyFilter';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import { buildPropertyUrl, getCurrentLanguage } from '@/utils/slugHelpers';
import Navigation from '@/components/Navigation';
import { bedroomMatches, districtMatches, searchUnits, selectSearchPrice } from '@/utils/propertySearchSelection';

interface Property {
  id: string;
  ref_no: string;
  title: string;
  location: string;
  price: string;
  apartment_types?: unknown;
  property_prices_by_room?: string | null;
  price_currency?: string | null;
  selectedBedrooms?: string;
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
  property_images: string[] | null;
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
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter properties based on current filters (memoized for performance)
  const filteredProperties = useMemo(() => {
    const matches = properties.map(property => ({ ...property, selectedBedrooms: filters.bedrooms, price: selectSearchPrice(property, filters.bedrooms) })).filter((property: Property) => {
      // Property type filter
      if (filters.propertyType && property.property_type?.toLowerCase() !== filters.propertyType.toLowerCase()) {
        return false;
      }

      // Bedrooms filter
      const units = searchUnits(property);
      if (filters.bedrooms && units.length && !units.some(unit => bedroomMatches(unit.type, filters.bedrooms))) return false;
      if (filters.bedrooms && !units.length && filters.bedrooms !== 'studio') {
        const bedroomsMatch = property.bedrooms?.toLowerCase().includes(filters.bedrooms) || 
                             property.title?.toLowerCase().includes(`${filters.bedrooms}+1`);
        if (!bedroomsMatch) return false;
      }
      if (filters.bedrooms === 'studio' && !units.length && !bedroomMatches(property.bedrooms || '', 'studio')) {
        return false;
      }

      // Location filter
      if (filters.location && filters.location !== 'all') {
        if (!property.location?.toLowerCase().startsWith(filters.location.toLowerCase())) {
          return false;
        }
      }

      // District filter
      if (filters.district) {
        const districtMatch = districtMatches(property.property_district, filters.district);
        if (!districtMatch) return false;
      }

      // Reference number filter (tolerate quotes/# from pasted URLs)
      const refQuery = (filters.referenceNo || '').replace(/["'“”‘’#\s]/g, '').toLowerCase();
      if (refQuery && !property.ref_no?.replace(/["'#\s]/g, '').toLowerCase().includes(refQuery)) {
        return false;
      }


      // Price filter
      if (filters.minPrice || filters.maxPrice) {
        if (!property.price) return false;
        const priceValue = parseFloat(property.price?.replace(/[^0-9.]/g, '') || '0');
        if (filters.minPrice && priceValue < parseFloat(filters.minPrice)) return false;
        if (filters.maxPrice && priceValue > parseFloat(filters.maxPrice)) return false;
      }

      // Facilities filter - optimized
      if (filters.facilities?.length > 0) {
        const propertyAmenities = property.amenities || [];
        if (propertyAmenities.length === 0) return false;
        
        // Create a normalized set for faster lookup
        const normalizedAmenities = new Set(
          propertyAmenities.map(a => a.toLowerCase().replace(/\s+/g, '-'))
        );
        
        const hasAllFacilities = filters.facilities.every(facility => 
          normalizedAmenities.has(facility) || normalizedAmenities.has(facility.replace(/-/g, ' '))
        );
        if (!hasAllFacilities) return false;
      }

      return true;
    });
    return [...matches].sort((a, b) => {
      const price = (value: string) => Number(value?.replace(/[^0-9.]/g, '') || 0);
      if (filters.sortBy === 'price-low') return price(a.price) - price(b.price);
      if (filters.sortBy === 'price-high') return price(b.price) - price(a.price);
      return String(b.ref_no || '').localeCompare(String(a.ref_no || ''), undefined, { numeric: true });
    });
  }, [properties, filters]);


  const extractCoordinates = (url: string | null, refNo: string | null, location: string): [number, number] | null => {
    // First try to get from property coordinates map (with location context for Bali)
    const mappedCoords = getPropertyCoordinates(refNo, location);
    if (mappedCoords) return mappedCoords;
    
    // Fallback to URL parsing
    if (!url) return null;
    
    // A Google URL can contain both a viewport centre (@lat,lng) and the
    // actual place pin (!3dlat!4dlng). Always prefer the place pin.
    const coordMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (coordMatch) {
      return [parseFloat(coordMatch[2]), parseFloat(coordMatch[1])]; // [lng, lat]
    }

    const queryMatch = url.match(/[?&]q=(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
    if (queryMatch) {
      return [parseFloat(queryMatch[2]), parseFloat(queryMatch[1])];
    }

    const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) {
      return [parseFloat(atMatch[2]), parseFloat(atMatch[1])]; // [lng, lat]
    }
    
    return null;
  };

  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('map-proxy', {
          body: { action: 'get-token' }
        });
        
        if (error) throw error;
        if (data?.token) {
          setMapboxToken(data.token);
        } else {
          toast({
            title: "Map Error",
            description: "Could not load map. Please try again later.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
        toast({
          title: "Map Error",
          description: "Could not connect to map service.",
          variant: "destructive"
        });
      }
    };

    fetchMapboxToken();
  }, []);

  useEffect(() => {
    const container = mapContainer.current;
    if (!container || !mapboxToken) return;

    const initMap = async () => {
      try {
        // Fetch all active properties
        const { data: propertiesData, error } = await supabase
          .from('properties')
          .select('id, ref_no, title, location, price, apartment_types, property_prices_by_room, price_currency, google_maps_embed, slug, slug_sv, slug_tr, slug_ar, slug_ru, slug_no, slug_da, slug_fa, slug_ur, slug_es, slug_de, slug_fr, slug_id, property_image, property_images, property_type, bedrooms, property_district, amenities')
          .eq('is_active', true).or('status.is.null,status.not.ilike.%sold%');

        if (error) throw error;

        setProperties((propertiesData as any) || []);

        // Initialize map
        mapboxgl.accessToken = mapboxToken;
        
        map.current = new mapboxgl.Map({
          container,
          style: mapStyle,
          center: [35, 35], // Centered on Middle East
          zoom: 3,
          pitch: 0,
        });

        map.current.on('load', () => {
          console.log('Map loaded successfully');
          setLoading(false);
        });

        map.current.on('error', (e) => {
          console.error('Map error:', e);
          toast({
            title: "Map Error",
            description: "Failed to load map tiles.",
            variant: "destructive"
          });
        });

        // Add navigation controls
        map.current.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true,
          }),
          'top-right'
        );

        // Add terrain/satellite control
        map.current.on('load', () => {
          // Add 3D terrain
          map.current?.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
          });
          map.current?.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
        });

      } catch (error) {
        console.error('Error initializing map:', error);
        toast({
          title: "Error",
          description: "Failed to load properties on map.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };

    initMap();

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, navigate]);

  // Update map style when changed
  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyle);
    }
  }, [mapStyle]);

  // Update markers when filtered properties change (optimized)
  useEffect(() => {
    const activeMap = map.current;
    if (!activeMap) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    setSelectedProperty(current => filteredProperties.find(property => property.id === current?.id) || null);

    const bounds = new mapboxgl.LngLatBounds();

    // Create all markers at once (no batching)
    filteredProperties.forEach((property: Property) => {
      const coords = extractCoordinates(property.google_maps_embed, property.ref_no, property.location);
      
      if (!coords) return;

      bounds.extend(coords);
      
      // Simplified marker - using favicon for fast loading
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.setAttribute('aria-label', `${property.title}, ${property.location}`);

      // Add marker with anchor set to center for stable positioning
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'center',
        pitchAlignment: 'viewport',
        rotationAlignment: 'viewport'
      })
        .setLngLat(coords)
        .addTo(activeMap);

      markersRef.current.push(marker);

      // Show popup on click
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        console.log('Marker clicked:', property.ref_no);
        
        setSelectedProperty(property);
        map.current?.easeTo({ center: coords, zoom: Math.max(map.current.getZoom(), 11), duration: 650, essential: true });
      });
    });

    // Fit bounds once after all markers are added
    if (markersRef.current.length > 0 && map.current) {
      map.current.fitBounds(bounds, {
        padding: 80,
        maxZoom: 12,
        duration: 800
      });
    }

    console.log(`Added ${markersRef.current.length} markers to map`);
  }, [filteredProperties, isMobile, lang]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    setIsMobileFilterOpen(false);
    setIsDesktopFilterOpen(false);
  };

  const selectProperty = (property: Property) => {
    setSelectedProperty(property);
    const coords = extractCoordinates(property.google_maps_embed, property.ref_no, property.location);
    if (coords && map.current) map.current.easeTo({ center: coords, zoom: Math.max(map.current.getZoom(), 11), duration: 650, essential: true });
  };

  const openProperty = (property: Property) => navigate(buildPropertyUrl(property, lang));

  return (
    <div className="flex h-[100svh] flex-col overflow-hidden bg-ivory text-navy">
      <Navigation />
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="shrink-0 px-4 pb-3 pt-4 sm:px-6 lg:px-8 lg:pb-5 lg:pt-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div><p className="mb-1 text-[9px] font-bold uppercase text-gold">Future Homes International</p><h1 className="font-serif text-2xl font-semibold sm:text-3xl">{t('nav.map_search')}</h1></div>
          <p className="text-xs text-navy/55">{filteredProperties.length} {t('common.properties')}</p>
        </div>
        <div className="grid gap-2 rounded-md border border-navy/10 bg-background p-2 shadow-[var(--shadow-luxe)] sm:grid-cols-[minmax(12rem,1.5fr)_1fr_1fr_auto]">
          <label className="flex h-11 items-center gap-2 rounded-sm border border-navy/10 px-3 focus-within:border-gold"><Search className="h-4 w-4 text-gold"/><input value={filters.referenceNo} onChange={(event)=>setFilters(current=>({...current,referenceNo:event.target.value}))} placeholder={t('search.ref_no')} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-navy/35"/></label>
          <Select value={filters.location} onValueChange={(value) => setFilters(c => ({...c, location:value, district:''}))}><SelectTrigger className="h-11 border-navy/10 bg-background"><MapPin className="h-4 w-4 text-gold"/><SelectValue placeholder={t('filter.select_location')}/></SelectTrigger><SelectContent>{['all','Antalya','Istanbul','Mersin','Dubai','Cyprus','Bali'].map(v=><SelectItem key={v} value={v}>{v==='all'?t('info.all'):v}</SelectItem>)}</SelectContent></Select>
          <Select value={filters.sortBy} onValueChange={(value) => setFilters(c => ({...c, sortBy:value}))}><SelectTrigger className="hidden h-11 border-navy/10 bg-background sm:flex"><Layers3 className="h-4 w-4 text-gold"/><SelectValue placeholder={t('search.sort_by')}/></SelectTrigger><SelectContent><SelectItem value="ref">{t('search.newest')}</SelectItem><SelectItem value="price-low">{t('search.price_low')}</SelectItem><SelectItem value="price-high">{t('search.price_high')}</SelectItem></SelectContent></Select>
          <Button className="h-11 bg-navy px-5 text-navy-foreground hover:bg-gold hover:text-gold-foreground" onClick={()=>isMobile?setIsMobileFilterOpen(true):setIsDesktopFilterOpen(v=>!v)}><SlidersHorizontal/>{t('nav.search')}</Button>
        </div>
        {isDesktopFilterOpen && <div className="absolute inset-x-8 top-40 z-[100] max-h-[55vh] overflow-y-auto border border-navy/10 bg-background p-6 shadow-[var(--shadow-luxe)]"><div className="mb-3 flex justify-end"><Button variant="ghost" size="icon" onClick={()=>setIsDesktopFilterOpen(false)}><X/></Button></div><PropertyFilter filters={filters} onFilterChange={handleFilterChange} onSearch={handleSearch}/></div>}
      </header>
      <div className="grid min-h-0 flex-1 grid-rows-[42svh_1fr] gap-3 px-4 pb-4 sm:px-6 lg:grid-cols-[minmax(29rem,46%)_1fr] lg:grid-rows-1 lg:gap-5 lg:px-8 lg:pb-7">
        <section className="order-2 min-h-0 overflow-y-auto rounded-md border border-navy/10 bg-background lg:order-1">
          <div className="divide-y divide-navy/10">
            {filteredProperties.map((property,index)=><article key={property.id} className={`group grid min-h-36 cursor-pointer grid-cols-[7.5rem_1fr] p-3 transition-colors sm:grid-cols-[9rem_1fr] ${selectedProperty?.id===property.id?'bg-ivory':'hover:bg-ivory/60'}`} onClick={()=>selectProperty(property)}>
              <div className="relative min-h-32 overflow-hidden rounded-sm bg-navy">{(property.property_image || property.property_images?.[0])?<img src={property.property_image || property.property_images?.[0] || ''} alt={property.title} loading={index<3?'eager':'lazy'} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"/>:<div className="flex h-full items-center justify-center text-gold"><Building2/></div>}<span className="absolute left-2 top-2 rounded-sm bg-navy/85 px-2 py-1 text-[8px] font-bold text-navy-foreground">REF {property.ref_no}</span></div>
              <div className="flex min-w-0 flex-col justify-between px-4 py-1"><div><p className="flex items-center gap-1 truncate text-[9px] font-bold uppercase text-gold"><MapPin className="h-3 w-3"/>{property.location}</p><h2 className="mt-2 line-clamp-2 font-serif text-sm font-semibold sm:text-base">{property.title}</h2><div className="mt-3 flex gap-3 text-[10px] text-navy/50">{property.bedrooms&&<span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5"/>{property.bedrooms}</span>}<span className="truncate">{property.property_type}</span></div></div><div className="flex items-end justify-between"><strong className="truncate text-sm sm:text-base">{property.price || t('home.price_on_request')}</strong><Button size="icon" variant="ghost" className="h-9 w-9 text-navy hover:bg-navy hover:text-navy-foreground" onClick={event=>{event.stopPropagation();openProperty(property)}} aria-label={t('card.view_property')}><ArrowRight/></Button></div></div>
            </article>)}
          </div>
        </section>
        <section className="relative order-1 min-h-0 overflow-hidden rounded-md border border-navy/10 bg-navy shadow-[var(--shadow-luxe)] lg:order-2"><div ref={mapContainer} className="h-full w-full"/>{loading&&<div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-navy/60"><Loader2 className="h-10 w-10 animate-spin text-gold"/></div>}<div className="absolute left-3 top-3 z-[60] flex gap-1 rounded-sm border border-navy/10 bg-background/95 p-1 shadow-[var(--shadow-luxe)]"><Button size="sm" className="bg-navy text-navy-foreground" onClick={()=>setMapStyle('mapbox://styles/mapbox/streets-v12')}>Street</Button><Button size="sm" variant="ghost" onClick={()=>setMapStyle('mapbox://styles/mapbox/satellite-streets-v12')}>Satellite</Button><Button size="icon" variant="ghost" className="h-9 w-9" aria-label="3D" onClick={()=>map.current?.easeTo({pitch:map.current.getPitch()===0?60:0,duration:800})}><Layers3/></Button></div>
          {selectedProperty&&<article className="absolute bottom-4 left-4 right-4 z-[70] grid max-w-md grid-cols-[7rem_1fr] overflow-hidden rounded-sm border border-gold/40 bg-navy text-navy-foreground shadow-[var(--shadow-luxe)] sm:left-auto sm:grid-cols-[8rem_1fr]">
            <div className="min-h-32 bg-ivory">{(selectedProperty.property_image || selectedProperty.property_images?.[0])?<img src={selectedProperty.property_image || selectedProperty.property_images?.[0] || ''} alt={selectedProperty.title} className="h-full w-full object-cover"/>:<div className="flex h-full items-center justify-center text-gold"><Building2/></div>}</div>
            <div className="relative flex min-w-0 flex-col justify-between p-4 pr-11"><Button variant="ghost" size="icon" className="absolute right-1 top-1 h-9 w-9 text-navy-foreground/60 hover:bg-navy-foreground/10 hover:text-navy-foreground" onClick={()=>setSelectedProperty(null)} aria-label="Close"><X/></Button><div><p className="text-[9px] font-bold uppercase text-gold">REF {selectedProperty.ref_no} · {selectedProperty.location}</p><h2 className="mt-2 line-clamp-2 font-serif text-sm font-semibold">{selectedProperty.title}</h2></div><div className="mt-3 flex items-end justify-between gap-2"><strong className="truncate text-sm">{selectedProperty.price || t('home.price_on_request')}</strong><Button size="sm" className="h-9 shrink-0 bg-gold text-gold-foreground hover:bg-ivory" onClick={()=>openProperty(selectedProperty)}>{t('card.view_property')}<ArrowRight/></Button></div></div>
          </article>}
        </section>
      </div>
      {isMobileFilterOpen&&<div className="fixed inset-0 z-[200] bg-navy/55 backdrop-blur-sm lg:hidden" onClick={()=>setIsMobileFilterOpen(false)}><aside className="absolute inset-y-0 left-0 w-[min(92vw,24rem)] overflow-y-auto bg-ivory p-4" onClick={e=>e.stopPropagation()}><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-semibold">{t('nav.search')}</h2><Button variant="ghost" size="icon" onClick={()=>setIsMobileFilterOpen(false)}><X/></Button></div><PropertyFilter filters={filters} onFilterChange={handleFilterChange} onSearch={handleSearch}/></aside></div>}
      <style>{`.custom-marker{width:34px;height:34px;cursor:pointer;overflow:hidden;border:2px solid hsl(var(--ivory));border-radius:999px;background:hsl(var(--navy)) url('/favicon.png') center/contain no-repeat;box-shadow:0 8px 22px hsl(var(--navy)/.3);transition:180ms ease}.custom-marker:hover{border-color:hsl(var(--gold));transform:translateY(-2px) scale(1.06)}.mapboxgl-ctrl-top-right{top:58px;right:10px}[data-radix-popper-content-wrapper],[role='listbox']{z-index:300!important}`}</style>
    </main>
    </div>
  );
};

export default MapSearch;
