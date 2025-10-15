import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Menu, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPropertyCoordinates } from '@/utils/propertyCoordinates';
import PropertyFilter from '@/components/PropertyFilter';
import markerIcon from '@/assets/marker-icon.jpeg';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

interface Property {
  id: string;
  ref_no: string;
  title: string;
  location: string;
  price: string;
  google_maps_embed: string | null;
  slug: string | null;
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
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
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
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Filter properties based on current filters (memoized for performance)
  const filteredProperties = useMemo(() => {
    return properties.filter((property: Property) => {
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

      // Reference number filter
      if (filters.referenceNo && !property.ref_no?.toLowerCase().includes(filters.referenceNo.toLowerCase())) {
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
  }, [properties, filters]);


  const extractCoordinates = (url: string | null, refNo: string | null, location: string): [number, number] | null => {
    // First try to get from property coordinates map (with location context for Bali)
    const mappedCoords = getPropertyCoordinates(refNo, location);
    if (mappedCoords) return mappedCoords;
    
    // Fallback to URL parsing
    if (!url) return null;
    
    // Match patterns like @25.0365811,55.2066422 or !3d25.0391345!4d55.2176352
    const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) {
      return [parseFloat(atMatch[2]), parseFloat(atMatch[1])]; // [lng, lat]
    }
    
    const coordMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (coordMatch) {
      return [parseFloat(coordMatch[2]), parseFloat(coordMatch[1])]; // [lng, lat]
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
          .select('id, ref_no, title, location, price, google_maps_embed, slug, property_image, property_type, bedrooms, property_district, amenities')
          .eq('is_active', true);

        if (error) throw error;

        setProperties(propertiesData || []);

        // Initialize map with optimized settings
        mapboxgl.accessToken = mapboxToken;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: mapStyle,
          center: [35, 35],
          zoom: isMobile ? 2 : 3,
          pitch: 0,
          // Performance optimizations
          maxTileCacheSize: 50,
          renderWorldCopies: false,
          touchZoomRotate: true,
          touchPitch: true,
          attributionControl: false, // Remove attribution for cleaner look
        });

        map.current.on('load', () => {
          setLoading(false);
        });

        map.current.on('error', (e) => {
          console.error('Map error:', e);
          setLoading(false);
        });

        // Add navigation controls with mobile optimization and higher z-index
        const nav = new mapboxgl.NavigationControl({
          visualizePitch: !isMobile,
          showCompass: !isMobile,
        });
        
        map.current.addControl(nav, 'top-right');
        
        // Increase z-index for navigation controls using CSS
        setTimeout(() => {
          const navControls = document.querySelector('.mapboxgl-ctrl-top-right');
          if (navControls instanceof HTMLElement) {
            navControls.style.zIndex = '50';
          }
        }, 100);

        // Only add terrain on desktop for better performance
        if (!isMobile) {
          map.current.on('load', () => {
            if (map.current) {
              map.current.addSource('mapbox-dem', {
                'type': 'raster-dem',
                'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
                'tileSize': 512,
                'maxzoom': 14
              });
              map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
            }
          });
        }

      } catch (error) {
        console.error('Error initializing map:', error);
        setLoading(false);
      }
    };

    initMap();

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, isMobile]);

  // Update map style when changed
  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyle);
    }
  }, [mapStyle]);

  // Update markers when filtered properties change (optimized with debouncing)
  useEffect(() => {
    if (!map.current || filteredProperties.length === 0) return;

    // Longer debounce for better performance on mobile
    const timer = setTimeout(() => {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      const bounds = new mapboxgl.LngLatBounds();
      const markerSize = isMobile ? 40 : 50;

      // Create all markers
      filteredProperties.forEach((property: Property) => {
        const coords = extractCoordinates(property.google_maps_embed, property.ref_no, property.location);
        
        if (!coords) return;

        bounds.extend(coords);
        
        // Optimized marker element
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.cssText = `
          width: ${markerSize}px;
          height: ${markerSize}px;
          background: white;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          cursor: pointer;
          overflow: hidden;
          background-image: url('${property.property_image || markerIcon}');
          background-size: cover;
          background-position: center;
          transition: transform 0.2s;
        `;

        // Hover effect
        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.1)';
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
        });

        // Create popup content lazily on click
        const createPopup = () => {
          const popupWidth = isMobile ? '250px' : '280px';
          const popupContent = document.createElement('div');
          popupContent.innerHTML = `
            <div style="padding: 0; min-width: ${popupWidth};">
              ${property.property_image ? `
                <img src="${property.property_image}" alt="${property.title}" 
                  loading="lazy"
                  style="width: 100%; height: ${isMobile ? '120px' : '150px'}; object-fit: cover; display: block;" />
              ` : ''}
              <div style="padding: ${isMobile ? '10px' : '12px'};">
                <div style="background: hsl(var(--primary)); color: white; padding: 3px 8px; 
                  border-radius: 8px; font-size: ${isMobile ? '9px' : '10px'}; display: inline-block; margin-bottom: 8px;">
                  REF: ${property.ref_no}
                </div>
                <h3 style="margin: 0 0 8px 0; font-size: ${isMobile ? '14px' : '15px'}; font-weight: 700;">${property.title}</h3>
                <p style="margin: 0 0 8px 0; font-size: ${isMobile ? '11px' : '12px'}; color: #666;">${property.location}</p>
                <div style="font-size: ${isMobile ? '16px' : '18px'}; font-weight: 700; color: hsl(var(--primary)); margin-bottom: 10px;">
                  ${property.price}
                </div>
                <button onclick="window.location.href='/property/${property.ref_no || property.slug}'"
                  style="width: 100%; background: hsl(var(--primary)); color: white; border: none; 
                  padding: ${isMobile ? '10px' : '8px'}; border-radius: 6px; font-size: ${isMobile ? '14px' : '13px'}; 
                  cursor: pointer; touch-action: manipulation;">
                  Visit Property →
                </button>
              </div>
            </div>
          `;
          
          return new mapboxgl.Popup({ 
            offset: 25,
            closeButton: true,
            closeOnClick: false,
            maxWidth: popupWidth
          }).setDOMContent(popupContent);
        };

        // Add marker
        const marker = new mapboxgl.Marker(el)
          .setLngLat(coords)
          .addTo(map.current!);

        markersRef.current.push(marker);

        // Show popup on click
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          
          if (currentPopupRef.current) {
            currentPopupRef.current.remove();
          }
          
          const popup = createPopup();
          popup.addTo(map.current!);
          currentPopupRef.current = popup;
        });
      });

      // Fit bounds with device-specific padding
      if (markersRef.current.length > 0 && map.current) {
        map.current.fitBounds(bounds, {
          padding: isMobile ? 50 : 80,
          maxZoom: isMobile ? 11 : 12,
          duration: 400
        });
      }
    }, isMobile ? 500 : 300); // Longer debounce on mobile

    return () => clearTimeout(timer);
  }, [filteredProperties, isMobile]);

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
    if (isMobile) {
      setFilterMenuOpen(false);
    }
  }, [isMobile]);

  const handleSearch = useCallback(() => {
    toast({
      title: "Search Complete",
      description: `Found ${filteredProperties.length} properties matching your criteria.`,
    });
    if (isMobile) {
      setFilterMenuOpen(false);
    }
  }, [filteredProperties.length, toast, isMobile]);

  return (
    <div className="relative w-full h-screen overflow-hidden flex">
      {loading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-[1000] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Loading map...</p>
          </div>
        </div>
      )}
      
      {/* Mobile Filter Toggle Button - positioned below map controls */}
      {isMobile && (
        <Button
          onClick={() => setFilterMenuOpen(!filterMenuOpen)}
          className="fixed top-16 left-4 z-20 shadow-lg"
          size="icon"
        >
          {filterMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}

      {/* Left Sidebar Filter - Responsive */}
      <div 
        className={`
          ${isMobile 
            ? 'fixed inset-y-0 left-0 w-[85vw] max-w-sm transform transition-transform duration-300 ease-in-out z-30' 
            : 'w-72 flex-shrink-0 relative z-10'
          }
          ${isMobile && !filterMenuOpen ? '-translate-x-full' : 'translate-x-0'}
          h-screen flex flex-col bg-background border-r shadow-lg
        `}
      >
        <div className="flex-1 overflow-y-auto p-3">
          <PropertyFilter 
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            horizontal={false}
          />
        </div>
        
        {/* Results Counter */}
        <div className="flex-shrink-0 border-t p-3 bg-background">
          <div className="bg-muted/50 px-3 py-2 rounded-lg">
            <p className="text-xs font-medium">
              Showing <span className="text-primary font-bold">{filteredProperties.length}</span> properties
            </p>
          </div>
        </div>
      </div>

      {/* Mobile backdrop */}
      {isMobile && filterMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setFilterMenuOpen(false)}
        />
      )}

      {/* Map Style Controls - Responsive positioning with higher z-index */}
      <div 
        className={`
          absolute top-4 z-[60] flex gap-1 bg-background/95 backdrop-blur-sm rounded-lg p-1 shadow-lg
          ${isMobile ? 'left-4 right-4 justify-center' : 'left-[304px]'}
          ${isMobile && filterMenuOpen ? 'hidden' : 'flex'}
        `}
      >
        <button
          onClick={() => setMapStyle('mapbox://styles/mapbox/streets-v12')}
          className={`px-2 md:px-3 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all ${
            mapStyle === 'mapbox://styles/mapbox/streets-v12'
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          }`}
        >
          Street
        </button>
        <button
          onClick={() => setMapStyle('mapbox://styles/mapbox/satellite-streets-v12')}
          className={`px-2 md:px-3 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all ${
            mapStyle === 'mapbox://styles/mapbox/satellite-streets-v12'
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          }`}
        >
          Satellite
        </button>
        {!isMobile && (
          <button
            onClick={() => {
              if (map.current) {
                const currentPitch = map.current.getPitch();
                map.current.easeTo({
                  pitch: currentPitch === 0 ? 60 : 0,
                  duration: 1000
                });
              }
            }}
            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-all"
          >
            3D
          </button>
        )}
      </div>
      
      <div 
        ref={mapContainer} 
        className="flex-1 h-screen"
      />
    </div>
  );
};

export default MapSearch;
