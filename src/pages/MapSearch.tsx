import React, { useEffect, useRef, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLocation, useNavigate } from '@/lib/router-compat';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, BedDouble, Building2, Filter, Layers3, Loader2, MapPin, SlidersHorizontal, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPropertyCoordinates } from '@/utils/propertyCoordinates';
import PropertyFilter from '@/components/PropertyFilter';
import { Button } from '@/components/ui/button';
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
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter properties based on current filters (memoized for performance)
  const filteredProperties = useMemo(() => {
    const matches = properties.filter((property: Property) => {
      // Property type filter
      if (filters.propertyType && property.property_type?.toLowerCase() !== filters.propertyType.toLowerCase()) {
        return false;
      }

      // Bedrooms filter
      if (filters.bedrooms && filters.bedrooms !== 'studio') {
        const bedroomsMatch = property.bedrooms?.toLowerCase().includes(filters.bedrooms) || 
                             property.title?.toLowerCase().includes(`${filters.bedrooms}+1`);
        if (!bedroomsMatch) return false;
      }
      if (filters.bedrooms === 'studio' && !property.bedrooms?.toLowerCase().includes('studio')) {
        return false;
      }

      // Location filter
      if (filters.location && filters.location !== 'all') {
        if (!property.location?.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      // District filter
      if (filters.district) {
        const districtMatch = property.property_district?.toLowerCase().includes(filters.district.toLowerCase()) ||
                             property.location?.toLowerCase().includes(filters.district.toLowerCase());
        if (!districtMatch) return false;
      }

      // Reference number filter (tolerate quotes/# from pasted URLs)
      const refQuery = (filters.referenceNo || '').replace(/["'“”‘’#\s]/g, '').toLowerCase();
      if (refQuery && !property.ref_no?.replace(/["'#\s]/g, '').toLowerCase().includes(refQuery)) {
        return false;
      }


      // Price filter
      if (filters.minPrice || filters.maxPrice) {
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
    if (!mapContainer.current || !mapboxToken) return;

    const initMap = async () => {
      try {
        // Fetch all active properties
        const { data: propertiesData, error } = await supabase
          .from('properties')
          .select('id, ref_no, title, location, price, google_maps_embed, slug, slug_sv, slug_tr, slug_ar, slug_ru, slug_no, slug_da, slug_fa, slug_ur, slug_es, slug_de, slug_fr, slug_id, property_image, property_type, bedrooms, property_district, amenities')
          .eq('is_active', true);

        if (error) throw error;

        setProperties((propertiesData as any) || []);

        // Initialize map
        mapboxgl.accessToken = mapboxToken;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
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
          map.current!.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
          });
          map.current!.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
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
    if (!map.current || filteredProperties.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

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
        .addTo(map.current!);

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

__MAP_RETURN__
};

export default MapSearch;
