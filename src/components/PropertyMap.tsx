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
        const response = await fetch('/functions/v1/map-proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'get-token' })
        });
        
        if (response.ok) {
          const data = await response.json();
          setMapboxToken(data.token);
        }
      } catch (error) {
        console.error('Failed to get Mapbox token:', error);
        // Fallback to provided token
        setMapboxToken('sk.eyJ1Ijoic2FwYTAxIiwiYSI6ImNtZzNudzl6MTE3M3gya3F3MjVxc2RzMmgifQ.JHiGmBRE55rT8fYpoc7_aw');
      }
    };

    getMapboxToken();
  }, []);

  // Mock coordinates for properties (in a real app, these would come from the database)
  const getPropertyCoordinates = (property: Property): [number, number] | null => {
    const location = property.location?.toLowerCase() || '';
    
    // Default coordinates for major cities
    if (location.includes('antalya')) {
      return [30.7133 + (Math.random() - 0.5) * 0.1, 36.8969 + (Math.random() - 0.5) * 0.1];
    } else if (location.includes('dubai')) {
      return [55.2708 + (Math.random() - 0.5) * 0.1, 25.2048 + (Math.random() - 0.5) * 0.1];
    } else if (location.includes('cyprus')) {
      return [33.4299 + (Math.random() - 0.5) * 0.1, 35.1264 + (Math.random() - 0.5) * 0.1];
    } else if (location.includes('mersin')) {
      return [34.6414 + (Math.random() - 0.5) * 0.1, 36.8121 + (Math.random() - 0.5) * 0.1];
    } else if (location.includes('bali')) {
      return [115.0920 + (Math.random() - 0.5) * 0.1, -8.4095 + (Math.random() - 0.5) * 0.1];
    }
    
    // Default to Antalya area
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
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const propertiesWithCoords: PropertyWithCoords[] = properties.map(property => ({
      ...property,
      coordinates: getPropertyCoordinates(property)
    })).filter(property => property.coordinates !== null);

    propertiesWithCoords.forEach((property) => {
      if (!property.coordinates) return;

      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'property-marker';
      markerElement.innerHTML = `
        <div class="bg-white border-2 border-primary rounded-lg px-2 py-1 text-sm font-semibold shadow-lg cursor-pointer hover:bg-primary hover:text-white transition-colors">
          ${property.price || property.starting_price_eur || '€-'}
        </div>
      `;

      // Add marker to map
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(property.coordinates)
        .addTo(map.current!);

      // Add click event
      markerElement.addEventListener('click', () => {
        setSelectedProperty(property);
        if (onPropertyClick) {
          onPropertyClick(property);
        }
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all properties
    if (propertiesWithCoords.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      propertiesWithCoords.forEach(property => {
        if (property.coordinates) {
          bounds.extend(property.coordinates);
        }
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
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