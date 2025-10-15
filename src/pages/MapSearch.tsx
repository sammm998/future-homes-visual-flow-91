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
            // Create custom marker
            const el = document.createElement('div');
            el.className = 'custom-marker';
            el.style.cursor = 'pointer';
            el.innerHTML = `
              <div style="
                background: hsl(var(--primary));
                color: white;
                width: 42px;
                height: 42px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 11px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                border: 3px solid white;
                transition: transform 0.2s;
              ">
                ${property.ref_no || '?'}
              </div>
            `;

            // Add hover effect
            el.addEventListener('mouseenter', () => {
              el.style.transform = 'scale(1.1)';
            });
            el.addEventListener('mouseleave', () => {
              el.style.transform = 'scale(1)';
            });

            // Create popup
            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div style="padding: 10px; max-width: 280px;">
                <h3 style="margin: 0 0 8px 0; font-weight: 600; font-size: 15px; line-height: 1.3;">${property.title}</h3>
                <p style="margin: 0 0 4px 0; font-size: 13px; color: #666;">📍 ${property.location}</p>
                <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: hsl(var(--primary));">${property.price}</p>
                <p style="margin: 0; font-size: 11px; color: #999;">Ref: ${property.ref_no}</p>
                <p style="margin: 4px 0 0 0; font-size: 11px; color: #2563eb;">Click marker to view details</p>
              </div>
            `);

            // Add marker with click handler
            const marker = new mapboxgl.Marker(el)
              .setLngLat(coords)
              .setPopup(popup)
              .addTo(map.current!);

            el.addEventListener('click', () => {
              if (property.slug) {
                navigate(`/property/${property.slug}`);
              } else if (property.ref_no) {
                navigate(`/property/${property.ref_no}`);
              }
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
