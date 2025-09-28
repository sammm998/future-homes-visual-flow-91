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

  // Get coordinates for properties based on their location
  const getPropertyCoordinates = (property: Property): [number, number] | null => {
    const location = property.location?.toLowerCase() || '';
    const refNo = property.ref_no || '';
    
    // Use more varied coordinates for different areas
    if (location.includes('antalya') || location.includes('altıntaş') || location.includes('konyaalti') || location.includes('lara')) {
      // Antalya area coordinates with variety
      const baseLatitude = 36.8969;
      const baseLongitude = 30.7133;
      const latOffset = (Math.random() - 0.5) * 0.15; // Larger spread
      const lngOffset = (Math.random() - 0.5) * 0.2;
      return [baseLongitude + lngOffset, baseLatitude + latOffset];
    } else if (location.includes('dubai') || location.includes('uae')) {
      const baseLatitude = 25.2048;
      const baseLongitude = 55.2708;
      const latOffset = (Math.random() - 0.5) * 0.1;
      const lngOffset = (Math.random() - 0.5) * 0.15;
      return [baseLongitude + lngOffset, baseLatitude + latOffset];
    } else if (location.includes('cyprus') || location.includes('kıbrıs')) {
      const baseLatitude = 35.1264;
      const baseLongitude = 33.4299;
      const latOffset = (Math.random() - 0.5) * 0.08;
      const lngOffset = (Math.random() - 0.5) * 0.1;
      return [baseLongitude + lngOffset, baseLatitude + latOffset];
    } else if (location.includes('mersin')) {
      const baseLatitude = 36.8121;
      const baseLongitude = 34.6414;
      const latOffset = (Math.random() - 0.5) * 0.08;
      const lngOffset = (Math.random() - 0.5) * 0.1;
      return [baseLongitude + lngOffset, baseLatitude + latOffset];
    } else if (location.includes('bali')) {
      const baseLatitude = -8.4095;
      const baseLongitude = 115.0920;
      const latOffset = (Math.random() - 0.5) * 0.08;
      const lngOffset = (Math.random() - 0.5) * 0.1;
      return [baseLongitude + lngOffset, baseLatitude + latOffset];
    }
    
    // Default to Antalya area for unknown locations
    return [30.7133 + (Math.random() - 0.5) * 0.1, 36.8969 + (Math.random() - 0.5) * 0.1];
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || map.current) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [30.7133, 36.8969], // Antalya center
      zoom: 10,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);
    });

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

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const propertiesWithCoords: PropertyWithCoords[] = properties.map(property => ({
      ...property,
      coordinates: getPropertyCoordinates(property)
    })).filter(property => property.coordinates !== null);

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

      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'property-marker';
      markerElement.innerHTML = `
        <div class="bg-white border-2 border-blue-600 rounded-lg px-3 py-1 text-sm font-semibold shadow-lg cursor-pointer hover:bg-blue-600 hover:text-white transition-colors">
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
        map.current.fitBounds(bounds, { 
          padding: 50,
          maxZoom: 15
        });
      } catch (error) {
        console.warn('Could not fit bounds, using default view');
        map.current.setCenter([30.7133, 36.8969]);
        map.current.setZoom(10);
      }
    } else {
      // Default to Antalya view if no properties
      console.log('🌍 No properties, setting default view to Antalya');
      map.current.setCenter([30.7133, 36.8969]);
      map.current.setZoom(10);
    }

    console.log('✅ Markers added successfully. Total markers:', markersRef.current.length);
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
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      
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