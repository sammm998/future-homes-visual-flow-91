import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperties } from '@/hooks/useProperties';
import Navigation from '@/components/Navigation';
import { OptimizedImage } from '@/components/OptimizedImage';
import { VirtualTourViewer } from '@/components/VirtualTourViewer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

const VirtualTour = () => {
  const navigate = useNavigate();
  const { properties, loading } = useProperties();
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const propertiesWithImages = properties?.filter(
    (p) => p.property_images && p.property_images.length > 1
  ) || [];

  if (selectedProperty) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background pt-20">
          <div className="container mx-auto px-4 py-8">
            <Button
              variant="ghost"
              onClick={() => setSelectedProperty(null)}
              className="mb-4 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Tillbaka till lägenheter
            </Button>
            <VirtualTourViewer property={selectedProperty} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Virtuell Rundtur
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Välj en lägenhet och utforska alla bilder i en interaktiv 360-graders miljö
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-card rounded-lg overflow-hidden animate-pulse"
                >
                  <div className="aspect-video bg-muted"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : propertiesWithImages.length === 0 ? (
            <div className="text-center py-12">
              <Home className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">
                Inga lägenheter med flera bilder hittades
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propertiesWithImages.map((property) => (
                <div
                  key={property.id}
                  onClick={() => setSelectedProperty(property)}
                  className="bg-card rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-lg group"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <OptimizedImage
                      src={property.property_image || property.property_images?.[0]}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">
                        Starta Rundtur
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {property.location}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        {property.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {property.property_images?.length || 0} bilder
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VirtualTour;
