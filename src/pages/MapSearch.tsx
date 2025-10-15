import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

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

  // Extract coordinates from Google Maps URL
  const extractCoordinates = (url: string | null): [number, number] | null => {
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
        }
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
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
          zoom: 4,
          pitch: 45,
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
          const coords = extractCoordinates(property.google_maps_embed);
          
          if (coords) {
            // Create custom marker
            const el = document.createElement('div');
            el.className = 'custom-marker';
            el.style.width = '40px';
            el.style.height = '40px';
            el.style.cursor = 'pointer';
            el.innerHTML = `
              <div style="
                background: hsl(var(--primary));
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                border: 2px solid white;
              ">
                ${property.ref_no || '?'}
              </div>
            `;

            // Create popup
            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div style="padding: 8px; max-width: 250px;">
                <h3 style="margin: 0 0 8px 0; font-weight: 600; font-size: 14px;">${property.title}</h3>
                <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">📍 ${property.location}</p>
                <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: hsl(var(--primary));">${property.price}</p>
                <p style="margin: 0; font-size: 11px; color: #999;">Ref: ${property.ref_no}</p>
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
            padding: { top: 50, bottom: 50, left: 50, right: 50 },
            maxZoom: 15
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        setLoading(false);
      }
    };

    initMap();

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, navigate]);

  return (
    <div className="relative w-full h-screen">
      {loading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading properties map...</p>
          </div>
        </div>
      )}
      
      <div ref={mapContainer} className="absolute inset-0" />
      
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
