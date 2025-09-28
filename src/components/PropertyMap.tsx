import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Property } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Square, Phone, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PropertyMapProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  className?: string;
}

interface PropertyWithCoords extends Property {
  coordinates?: [number, number];
}

const PropertyMap: React.FC<PropertyMapProps> = ({ 
  properties, 
  onPropertyClick,
  className = "h-96" 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<PropertyWithCoords | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Get Mapbox token from Edge Function
  useEffect(() => {
    const getMapboxToken = async () => {
      try {
        const response = await fetch('https://kiogiyemoqbnuvclneoe.supabase.co/functions/v1/map-proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpb2dpeWVtb3FibnV2Y2xuZW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDg4NzIsImV4cCI6MjA2ODI4NDg3Mn0.wZFKwwrvtrps2gCFc15rHN-3eg5T_kEDioBGZV_IctI`
          },
          body: JSON.stringify({ action: 'get-token' })
        });
        
        if (response.ok) {
          const data = await response.json();
          setMapboxToken(data.token);
        } else {
          throw new Error('Failed to fetch token');
        }
      } catch (error) {
        console.error('Failed to get Mapbox token:', error);
        // Use the provided token directly
        setMapboxToken('sk.eyJ1Ijoic2FwYTAxIiwiYSI6ImNtZzNudzl6MTE3M3gya3F3MjVxc2RzMmgifQ.JHiGmBRE55rT8fYpoc7_aw');
      }
    };

    getMapboxToken();
  }, []);

  // Get coordinates for properties using Mapbox Geocoding API
  const getPropertyCoordinates = async (property: Property): Promise<[number, number] | null> => {
    const location = property.location || '';
    if (!location || !mapboxToken) return null;
    
    try {
      // Use Mapbox Geocoding API to get precise coordinates
      const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${mapboxToken}&limit=1`;
      const response = await fetch(geocodeUrl);
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        console.log(`📍 Geocoded ${location} to:`, [lng, lat]);
        return [lng, lat];
      }
    } catch (error) {
      console.warn(`❌ Failed to geocode ${location}:`, error);
    }
    
    // Fallback coordinates if geocoding fails
    const fallbackCoords = getFallbackCoordinates(location);
    console.log(`🎯 Using fallback coordinates for ${location}:`, fallbackCoords);
    return fallbackCoords;
  };

  // Fallback coordinate generation
  const getFallbackCoordinates = (location: string): [number, number] => {
    const loc = location.toLowerCase();
    
    if (loc.includes('antalya') || loc.includes('altıntaş') || loc.includes('konyaalti') || loc.includes('lara')) {
      const baseLatitude = 36.8969;
      const baseLongitude = 30.7133;
      const latOffset = (Math.random() - 0.5) * 0.15;
      const lngOffset = (Math.random() - 0.5) * 0.2;
      return [baseLongitude + lngOffset, baseLatitude + latOffset];
    } else if (loc.includes('dubai') || loc.includes('uae')) {
      const baseLatitude = 25.2048;
      const baseLongitude = 55.2708;
      const latOffset = (Math.random() - 0.5) * 0.1;
      const lngOffset = (Math.random() - 0.5) * 0.15;
      return [baseLongitude + lngOffset, baseLatitude + latOffset];
    } else if (loc.includes('cyprus') || loc.includes('kıbrıs')) {
      const baseLatitude = 35.1264;
      const baseLongitude = 33.4299;
      const latOffset = (Math.random() - 0.5) * 0.08;
      const lngOffset = (Math.random() - 0.5) * 0.1;
      return [baseLongitude + lngOffset, baseLatitude + latOffset];
    } else if (loc.includes('mersin')) {
      const baseLatitude = 36.8121;
      const baseLongitude = 34.6414;
      const latOffset = (Math.random() - 0.5) * 0.08;
      const lngOffset = (Math.random() - 0.5) * 0.1;
      return [baseLongitude + lngOffset, baseLatitude + latOffset];
    } else if (loc.includes('bali')) {
      const baseLatitude = -8.4095;
      const baseLongitude = 115.0920;
      const latOffset = (Math.random() - 0.5) * 0.08;
      const lngOffset = (Math.random() - 0.5) * 0.1;
      return [baseLongitude + lngOffset, baseLatitude + latOffset];
    }
    
    // Default to Antalya area
    return [30.7133 + (Math.random() - 0.5) * 0.1, 36.8969 + (Math.random() - 0.5) * 0.1];
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || map.current) {
      console.log('🗺️ Map initialization check:', { 
        container: !!mapContainer.current, 
        token: !!mapboxToken, 
        mapExists: !!map.current 
      });
      return;
    }

    console.log('🚀 Initializing Mapbox map with token:', mapboxToken.substring(0, 20) + '...');

    try {
      mapboxgl.accessToken = mapboxToken;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12', // 3D satellite style
        center: [30.7133, 36.8969], // Antalya center
        zoom: 12,
        pitch: 45, // 3D perspective
        bearing: 0,
        attributionControl: false,
        antialias: true // Smooth 3D rendering
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        console.log('✅ Map loaded successfully');
        
        // Add 3D terrain
        map.current!.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          'tileSize': 512,
          'maxzoom': 14
        });
        
        map.current!.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
        
        // Add 3D buildings layer
        const layers = map.current!.getStyle().layers;
        const labelLayerId = layers.find(
          (layer) => layer.type === 'symbol' && layer.layout!['text-field']
        )?.id;
        
        map.current!.addLayer(
          {
            'id': 'add-3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
              'fill-extrusion-color': '#aaa',
              'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'height']
              ],
              'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'min_height']
              ],
              'fill-extrusion-opacity': 0.6
            }
          },
          labelLayerId
        );
        
        setMapLoaded(true);
      });

      map.current.on('error', (e) => {
        console.error('❌ Map error:', e);
      });

    } catch (error) {
      console.error('❌ Failed to initialize map:', error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken]);

  // Add markers for properties
  useEffect(() => {
    if (!map.current || !mapLoaded) {
      console.log('🗺️ Map not ready:', { mapExists: !!map.current, mapLoaded });
      return;
    }

    console.log('🏠 Adding markers for', properties.length, 'properties');

    const addMarkersAsync = async () => {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Get coordinates for all properties asynchronously
      const propertiesWithCoords: PropertyWithCoords[] = [];
      
      for (const property of properties) {
        const coordinates = await getPropertyCoordinates(property);
        if (coordinates) {
          propertiesWithCoords.push({
            ...property,
            coordinates
          });
        }
      }

      console.log('📍 Properties with coordinates:', propertiesWithCoords.length);

      propertiesWithCoords.forEach((property, index) => {
        if (!property.coordinates) return;

        console.log(`📌 Adding marker ${index + 1}:`, {
          title: property.title,
          location: property.location,
          price: property.price,
          coordinates: property.coordinates
        });

        // Extract clean price for display
        let displayPrice = property.price || property.starting_price_eur || '€-';
        const priceMatch = displayPrice.match(/€[\d,]+/);
        if (priceMatch) {
          displayPrice = priceMatch[0];
        } else if (displayPrice !== '€-' && !displayPrice.includes('€')) {
          displayPrice = `€${displayPrice}`;
        }

        // Create custom 3D-style marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'property-marker';
        markerElement.innerHTML = `
          <div class="bg-white border-2 border-primary rounded-xl px-4 py-2 text-sm font-bold shadow-2xl cursor-pointer hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-110" style="box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
            ${displayPrice}
          </div>
        `;

        // Add marker to map
        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat(property.coordinates)
          .addTo(map.current!);

        // Add click event
        markerElement.addEventListener('click', () => {
          console.log('🖱️ Marker clicked:', property.title);
          setSelectedProperty(property);
          if (onPropertyClick) {
            onPropertyClick(property);
          }
        });

        markersRef.current.push(marker);
      });

      // Fit bounds to show all properties or set default view
      if (propertiesWithCoords.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        propertiesWithCoords.forEach(property => {
          if (property.coordinates) {
            bounds.extend(property.coordinates);
          }
        });
        
        try {
          map.current!.fitBounds(bounds, { 
            padding: 50,
            maxZoom: 15
          });
        } catch (error) {
          console.warn('Could not fit bounds, using default view');
          map.current!.setCenter([30.7133, 36.8969]);
          map.current!.setZoom(12);
        }
      } else {
        // Default to Antalya view if no properties
        console.log('🌍 No properties, setting default view to Antalya');
        map.current!.setCenter([30.7133, 36.8969]);
        map.current!.setZoom(12);
      }

      console.log('✅ Markers added successfully. Total markers:', markersRef.current.length);
    };

    addMarkersAsync();
  }, [properties, mapLoaded, onPropertyClick]);

  const extractPrice = (priceStr: string | null | undefined): string => {
    if (!priceStr) return '€-';
    
    const match = priceStr.match(/€[\d,]+/);
    return match ? match[0] : priceStr;
  };

  const getPropertyFeatures = (property: PropertyWithCoords) => {
    if (property.apartment_types && property.apartment_types.length > 0) {
      const firstType = property.apartment_types[0];
      return {
        bedrooms: firstType.bedrooms || '-',
        bathrooms: firstType.bathrooms || '-',
        size: firstType.size || '-'
      };
    }
    return { bedrooms: '-', bathrooms: '-', size: '-' };
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapContainer} 
        className="absolute inset-0 rounded-lg bg-gray-100"
        style={{ minHeight: '400px' }}
      />
      
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
      
      {/* Selected Property Card */}
      {selectedProperty && (
        <Card className="absolute top-4 left-4 w-80 z-10 shadow-xl">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg line-clamp-2">{selectedProperty.title}</h3>
                <p className="text-muted-foreground text-sm">{selectedProperty.location}</p>
              </div>
              <button 
                onClick={() => setSelectedProperty(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
            
            {selectedProperty.images && selectedProperty.images.length > 0 && (
              <img 
                src={selectedProperty.images[0]} 
                alt={selectedProperty.title}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
            )}
            
            <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
              {(() => {
                const features = getPropertyFeatures(selectedProperty);
                return (
                  <>
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      {features.bedrooms}
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      {features.bathrooms}
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="h-4 w-4" />
                      {features.size}m²
                    </div>
                  </>
                );
              })()}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold text-primary">
                {extractPrice(selectedProperty.price || selectedProperty.starting_price_eur)}
              </div>
              <Badge variant="secondary">
                {selectedProperty.ref_no || 'REF'}
              </Badge>
            </div>
            
            <div className="flex gap-2 mt-3">
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  if (onPropertyClick) {
                    onPropertyClick(selectedProperty);
                  }
                }}
              >
                View Details
              </Button>
              <Button size="sm" variant="outline">
                <Phone className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 bg-primary rounded border-2 border-white"></div>
          <span>Property Location</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;