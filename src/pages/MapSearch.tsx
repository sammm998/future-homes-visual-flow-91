import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPropertyCoordinates } from '@/utils/propertyCoordinates';

interface Property {
  id: string;
  ref_no: string;
  title: string;
  location: string;
  price: string;
  google_maps_embed: string | null;
  slug: string | null;
}

const MapSearch = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Extract coordinates from Google Maps URL or use mapping
  const extractCoordinates = (url: string | null, refNo: string | null): [number, number] | null => {
    // First try to get from property coordinates map
    const mappedCoords = getPropertyCoordinates(refNo);
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
        const { data: properties, error } = await supabase
          .from('properties')
          .select('id, ref_no, title, location, price, google_maps_embed, slug')
          .eq('is_active', true);

        if (error) throw error;

        // Initialize map
        mapboxgl.accessToken = mapboxToken;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
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

        map.current.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true,
          }),
          'top-right'
        );

        // Add markers for each property with coordinates
        const bounds = new mapboxgl.LngLatBounds();
        let markerCount = 0;

        properties?.forEach((property: Property) => {
          const coords = extractCoordinates(property.google_maps_embed, property.ref_no);
          
          if (coords) {
            // Create custom marker element
            const el = document.createElement('div');
            el.className = 'custom-marker';
            el.style.cursor = 'pointer';
            el.innerHTML = `
              <div style="
                background: hsl(var(--primary));
                color: white;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 11px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                border: 3px solid white;
              ">
                ${property.ref_no || '?'}
              </div>
            `;

            // Create rich popup with property card
            const popupContent = document.createElement('div');
            popupContent.style.cssText = 'padding: 0; min-width: 300px; max-width: 350px;';
            popupContent.innerHTML = `
              <div style="
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
              ">
                <div style="padding: 16px;">
                  <div style="
                    display: inline-block;
                    background: hsl(var(--primary));
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
                    color: hsl(var(--primary));
                    margin-bottom: 16px;
                  ">${property.price}</div>
                  <button 
                    id="visit-property-${property.id}"
                    style="
                      width: 100%;
                      background: hsl(var(--primary));
                      color: white;
                      border: none;
                      padding: 12px 20px;
                      border-radius: 8px;
                      font-size: 14px;
                      font-weight: 600;
                      cursor: pointer;
                      transition: all 0.2s;
                      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    "
                    onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.2)';"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.15)';"
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

            // Handle click to show popup
            el.addEventListener('click', (e) => {
              e.stopPropagation();
              popup.addTo(map.current!);
              
              // Add event listener to the button after popup is shown
              setTimeout(() => {
                const visitBtn = document.getElementById(`visit-property-${property.id}`);
                if (visitBtn) {
                  visitBtn.addEventListener('click', () => {
                    if (property.slug) {
                      navigate(`/property/${property.slug}`);
                    } else if (property.ref_no) {
                      navigate(`/property/${property.ref_no}`);
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
        if (markerCount > 0) {
          map.current.fitBounds(bounds, {
            padding: { top: 100, bottom: 100, left: 100, right: 100 },
            maxZoom: 12
          });
        }

        console.log(`Map initialized with ${markerCount} properties`);
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
    <div className="relative w-full min-h-screen">
      {loading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-[1000] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading properties map...</p>
          </div>
        </div>
      )}
      
      <div 
        ref={mapContainer} 
        className="w-full h-screen"
        style={{ minHeight: '100vh' }}
      />
      
      <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-sm z-10">
        <h1 className="text-2xl font-bold mb-2">Property Map Search</h1>
        <p className="text-sm text-muted-foreground">
          Click on any marker to view property details. Markers show the reference number of each property.
        </p>
      </div>
    </div>
  );
};

export default MapSearch;
