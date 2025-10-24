import React, { useEffect, useRef, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPropertyCoordinates } from '@/utils/propertyCoordinates';
import PropertyFilter from '@/components/PropertyFilter';
import { Menu, X } from 'lucide-react';

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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isMobile, setIsMobile] = useState(false);

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

        // Initialize map
        mapboxgl.accessToken = mapboxToken;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
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

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <SEOHead
        title="Property Map Search | Interactive Property Finder on Map"
        description="Search properties on an interactive map. Explore available properties in Turkey, Dubai, Cyprus and more with our visual map search tool."
        keywords="property map search, interactive map, property location search, map property finder, visual property search"
        canonicalUrl="https://futurehomesturkey.com/map-search"
      />
      {/* Loading State */}
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
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.background = 'white';
      el.style.borderRadius = '50%';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      el.style.overflow = 'hidden';
      el.style.backgroundImage = 'url(/favicon.png)';
      el.style.backgroundSize = 'contain';
      el.style.backgroundPosition = 'center';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.transition = 'all 0.2s ease';
      
      // Hover effect
      el.addEventListener('mouseenter', () => {
        el.style.borderColor = '#0066CC';
        el.style.borderWidth = '4px';
        el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.borderColor = 'white';
        el.style.borderWidth = '3px';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      });

      // Create popup content lazily on click
      const createPopup = () => {
        const popupContent = document.createElement('div');
        popupContent.innerHTML = `
          <div style="padding: 0; min-width: 280px;">
            ${property.property_image ? `
              <img src="${property.property_image}" alt="${property.title}" 
                style="width: 100%; height: 150px; object-fit: cover; display: block;" />
            ` : ''}
            <div style="padding: 12px;">
              <div style="background: #0066CC; color: white; padding: 3px 8px; 
                border-radius: 8px; font-size: 10px; display: inline-block; margin-bottom: 8px;">
                REF: ${property.ref_no}
              </div>
              <h3 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 700;">${property.title}</h3>
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">${property.location}</p>
              <div style="font-size: 18px; font-weight: 700; color: #0066CC; margin-bottom: 10px;">
                ${property.price}
              </div>
              <button onclick="window.location.href='/property/${property.ref_no || property.slug}'"
                style="width: 100%; background: #0066CC; color: white; border: none; 
                padding: 8px; border-radius: 6px; font-size: 13px; cursor: pointer;">
                Visit Property →
              </button>
            </div>
          </div>
        `;
        
        return new mapboxgl.Popup({ 
          offset: 25,
          closeButton: true,
          closeOnClick: false,
          maxWidth: '300px'
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
        e.preventDefault();
        
        console.log('Marker clicked:', property.ref_no);
        
        // On mobile, show fullscreen modal
        if (isMobile) {
          setSelectedProperty(property);
        } else {
          // On desktop, show regular popup
          if (currentPopupRef.current) {
            currentPopupRef.current.remove();
          }
          
          const popup = createPopup();
          marker.setPopup(popup);
          popup.addTo(map.current!);
          currentPopupRef.current = popup;
          
          // Wait for popup to render, then center it perfectly
          setTimeout(() => {
            const mapContainer = map.current!.getContainer();
            const mapHeight = mapContainer.clientHeight;
            
            // Calculate offset to center popup (move marker down so popup appears in center)
            // Popup is ~300px tall, so offset marker down by 150px
            map.current!.easeTo({
              center: coords,
              offset: [0, 150] as [number, number], // Move view up so popup is centered
              duration: 500,
              essential: true
            });
          }, 50);
        }
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
  }, [filteredProperties]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    // Filters are already applied through useEffect
    toast({
      title: "Search Complete",
      description: `Found ${filteredProperties.length} properties matching your criteria.`,
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex">
      {loading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-[1000] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading properties map...</p>
          </div>
        </div>
      )}

      {/* Mobile Fullscreen Property Modal */}
      {selectedProperty && isMobile && (
        <div className="fixed inset-0 z-[200] bg-background flex flex-col">
          {/* Close Button */}
          <button
            onClick={() => setSelectedProperty(null)}
            className="absolute top-3 right-3 z-10 bg-background/95 backdrop-blur-sm p-2 rounded-full shadow-lg border"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Property Content - Fixed height sections */}
          <div className="flex-1 flex flex-col h-full">
            {/* Image Section - Fixed height */}
            {selectedProperty.property_image && (
              <div className="h-[35vh] flex-shrink-0">
                <img 
                  src={selectedProperty.property_image} 
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Content Section - Flexible but constrained */}
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <div className="flex-1 space-y-2 min-h-0">
                <div className="inline-block bg-primary text-primary-foreground px-2 py-1 rounded-lg text-xs font-medium">
                  REF: {selectedProperty.ref_no}
                </div>
                
                <h2 className="text-xl font-bold line-clamp-2">{selectedProperty.title}</h2>
                
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="line-clamp-1">{selectedProperty.location}</span>
                </p>
                
                <div className="text-2xl font-bold text-primary">
                  {selectedProperty.price}
                </div>
                
                <div className="flex gap-4 text-xs text-muted-foreground">
                  {selectedProperty.bedrooms && (
                    <span><span className="font-medium">Bedrooms:</span> {selectedProperty.bedrooms}</span>
                  )}
                  {selectedProperty.property_type && (
                    <span><span className="font-medium">Type:</span> {selectedProperty.property_type}</span>
                  )}
                </div>
              </div>
              
              {/* Button - Always visible at bottom */}
              <button
                onClick={() => navigate(`/property/${selectedProperty.ref_no || selectedProperty.slug}`)}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium shadow-lg hover:opacity-90 transition-opacity mt-3 flex-shrink-0"
              >
                Visit Property →
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Filter Toggle Button */}
      <button
        onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        className="md:hidden fixed top-4 left-4 z-[100] bg-background/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border"
      >
        {isMobileFilterOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Left Sidebar Filter - Desktop & Mobile Drawer */}
      <div className={`
        fixed md:relative
        ${isMobileFilterOpen ? 'left-0' : '-left-full md:left-0'}
        top-0 h-screen w-72 flex-shrink-0 flex flex-col bg-background border-r z-[90]
        transition-all duration-300 ease-in-out
      `}>
        <div className="flex-1 overflow-y-auto p-3 pt-16 md:pt-3">
          <PropertyFilter 
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            horizontal={false}
          />
        </div>
        
        {/* Results Counter - Fixed at bottom */}
        <div className="flex-shrink-0 border-t p-3 bg-background">
          <div className="bg-muted/50 px-3 py-2 rounded-lg">
            <p className="text-xs font-medium">
              Showing <span className="text-primary font-bold">{filteredProperties.length}</span> properties
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileFilterOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-[80]"
          onClick={() => setIsMobileFilterOpen(false)}
        />
      )}

      {/* Map Style Controls */}
      <div className="absolute top-4 left-4 md:left-[304px] z-[60] flex gap-2 bg-background/95 backdrop-blur-sm rounded-lg p-1 shadow-lg mt-14 md:mt-0">
        <button
          onClick={() => setMapStyle('mapbox://styles/mapbox/streets-v12')}
          className={`px-2 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium transition-all ${
            mapStyle === 'mapbox://styles/mapbox/streets-v12'
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          }`}
        >
          Street
        </button>
        <button
          onClick={() => setMapStyle('mapbox://styles/mapbox/satellite-streets-v12')}
          className={`px-2 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium transition-all ${
            mapStyle === 'mapbox://styles/mapbox/satellite-streets-v12'
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          }`}
        >
          Satellite
        </button>
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
          className="px-2 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium hover:bg-accent transition-all"
        >
          3D
        </button>
      </div>
      
      <div 
        ref={mapContainer} 
        className="flex-1 h-screen"
      />
      
      <style>{`
        .mapboxgl-ctrl-top-right {
          top: 120px !important;
        }
        
        @media (min-width: 768px) {
          .mapboxgl-ctrl-top-right {
            top: 10px !important;
          }
        }
        
        /* Ensure Select dropdowns appear above map elements */
        [data-radix-popper-content-wrapper] {
          z-index: 150 !important;
        }
        
        /* Ensure all radix popover content is above other elements */
        [role="dialog"],
        [role="menu"],
        [role="listbox"] {
          z-index: 150 !important;
        }
      `}</style>
    </div>
  );
};

export default MapSearch;
