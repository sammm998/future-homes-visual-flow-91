import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPropertyCoordinates } from '@/utils/propertyCoordinates';
import PropertyFilter from '@/components/PropertyFilter';
import markerIcon from '@/assets/marker-icon.jpeg';

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
}

const MapSearch = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
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

  // Filter properties based on current filters
  const filterProperties = (propertiesToFilter: Property[]) => {
    return propertiesToFilter.filter((property: Property) => {
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

      return true;
    });
  };

  // Apply filters whenever they change
  useEffect(() => {
    if (properties.length > 0) {
      const filtered = filterProperties(properties);
      setFilteredProperties(filtered);
    }
  }, [filters, properties]);

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
          .select('id, ref_no, title, location, price, google_maps_embed, slug, property_image, property_type, bedrooms, property_district')
          .eq('is_active', true);

        if (error) throw error;

        setProperties(propertiesData || []);
        setFilteredProperties(propertiesData || []);

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

  // Update map style when changed
  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyle);
    }
  }, [mapStyle]);

  // Update markers when filtered properties change
  useEffect(() => {
    if (!map.current || filteredProperties.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const bounds = new mapboxgl.LngLatBounds();
    let markerCount = 0;

    filteredProperties.forEach((property: Property) => {
      const coords = extractCoordinates(property.google_maps_embed, property.ref_no, property.location);
      
      if (coords) {
        // Use property image or fallback to placeholder
        const markerImageUrl = property.property_image || '/placeholder.svg';
        
        // Create custom marker element with property image
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.cursor = 'pointer';
        el.innerHTML = `
          <div style="
            width: 50px;
            height: 50px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            border: 2px solid white;
          ">
            <img src="${markerImageUrl}" alt="${property.title}" style="
              width: 100%;
              height: 100%;
              object-fit: cover;
            " onerror="this.src='${markerIcon}'" />
          </div>
        `;

        // Create rich popup with property card
        const popupContent = document.createElement('div');
        popupContent.style.cssText = 'padding: 0; min-width: 300px; max-width: 350px;';
        
        const imageUrl = property.property_image || '/placeholder.svg';
        
        popupContent.innerHTML = `
          <div style="
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          ">
            ${property.property_image ? `
              <div style="
                width: 100%;
                height: 180px;
                overflow: hidden;
                background: #f0f0f0;
              ">
                <img 
                  src="${imageUrl}" 
                  alt="${property.title}"
                  style="
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  "
                  onerror="this.style.display='none'; this.parentElement.style.height='0px';"
                />
              </div>
            ` : ''}
            <div style="padding: 16px;">
              <div style="
                display: inline-block;
                background: linear-gradient(135deg, #ff5722 0%, #ff1744 100%);
                color: white;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
                margin-bottom: 10px;
              ">
                REF: ${property.ref_no}
              </div>
              <h3 style="
                margin: 0 0 12px 0;
                font-weight: 700;
                font-size: 17px;
                line-height: 1.3;
                color: #1a1a1a;
              ">${property.title}</h3>
              <div style="
                display: flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 12px;
                color: #666;
                font-size: 13px;
              ">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>${property.location}</span>
              </div>
              <div style="
                font-size: 22px;
                font-weight: 700;
                color: #ff5722;
                margin-bottom: 16px;
              ">${property.price}</div>
              <button 
                id="visit-property-${property.id}"
                style="
                  width: 100%;
                  background: linear-gradient(135deg, #ff5722 0%, #ff1744 100%);
                  color: white;
                  border: none;
                  padding: 12px 20px;
                  border-radius: 8px;
                  font-size: 14px;
                  font-weight: 600;
                  cursor: pointer;
                  transition: all 0.2s;
                  box-shadow: 0 2px 8px rgba(255, 87, 34, 0.3);
                "
                onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(255, 87, 34, 0.4)';"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(255, 87, 34, 0.3)';"
              >
                Visit Property →
              </button>
            </div>
          </div>
        `;

        // Create popup
        const popup = new mapboxgl.Popup({ 
          offset: 30,
          closeButton: true,
          closeOnClick: false,
          maxWidth: '400px'
        }).setDOMContent(popupContent);

        // Add marker
        const marker = new mapboxgl.Marker(el)
          .setLngLat(coords)
          .setPopup(popup)
          .addTo(map.current!);

        markersRef.current.push(marker);

        // Handle click to show popup
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          
          // Close previous popup if exists
          if (currentPopupRef.current) {
            currentPopupRef.current.remove();
          }
          
          // Show new popup and store reference
          popup.addTo(map.current!);
          currentPopupRef.current = popup;
          
          // Add event listener to the button after popup is shown
          setTimeout(() => {
            const visitBtn = document.getElementById(`visit-property-${property.id}`);
            if (visitBtn) {
              visitBtn.addEventListener('click', () => {
                // Use ref_no as primary identifier
                if (property.ref_no) {
                  window.location.href = `/property/${property.ref_no}`;
                } else if (property.slug) {
                  window.location.href = `/property/${property.slug}`;
                }
              });
            }
          }, 100);
        });

        bounds.extend(coords);
        markerCount++;
      }
    });

    // Fit map to markers if any exist
    if (markerCount > 0 && map.current) {
      map.current.fitBounds(bounds, {
        padding: { top: 100, bottom: 100, left: 100, right: 100 },
        maxZoom: 12
      });
    }

    console.log(`Map updated with ${markerCount} properties`);
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
      
      {/* Left Sidebar Filter */}
      <div className="w-80 flex-shrink-0 h-screen flex flex-col bg-background border-r z-10">
        <div className="flex-1 overflow-y-auto p-4">
          <PropertyFilter 
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            horizontal={false}
          />
        </div>
        
        {/* Results Counter - Fixed at bottom */}
        <div className="flex-shrink-0 border-t p-4 bg-background">
          <div className="bg-muted/50 px-4 py-3 rounded-lg">
            <p className="text-sm font-medium">
              Showing <span className="text-primary font-bold">{filteredProperties.length}</span> properties
            </p>
          </div>
        </div>
      </div>

      {/* Map Style Controls - Moved to top-left, next to zoom controls */}
      <div className="absolute top-4 left-[336px] z-10 flex gap-2 bg-background/95 backdrop-blur-sm rounded-lg p-1 shadow-lg">
        <button
          onClick={() => setMapStyle('mapbox://styles/mapbox/streets-v12')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
            mapStyle === 'mapbox://styles/mapbox/streets-v12'
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          }`}
        >
          Street
        </button>
        <button
          onClick={() => setMapStyle('mapbox://styles/mapbox/satellite-streets-v12')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
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
          className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-all"
        >
          3D
        </button>
      </div>
      
      <div 
        ref={mapContainer} 
        className="flex-1 h-screen"
      />
    </div>
  );
};

export default MapSearch;
