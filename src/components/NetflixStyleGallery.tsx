import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedPropertyImage } from './OptimizedPropertyImage';
import HeroProperty from './HeroProperty';
import PropertyRow from './PropertyRow';

interface Property {
  id: string;
  title: string;
  location: string;
  property_image: string;
  property_images: string[];
  price: string;
  bedrooms?: string;
  bathrooms?: string;
  sizes_m2?: string;
  description?: string;
  area?: string;
  status?: string;
}

interface PropertyRowData {
  title: string;
  properties: Property[];
}

const NetflixStyleGallery: React.FC = () => {
  const [propertyRows, setPropertyRows] = useState<PropertyRowData[]>([]);
  const [featuredProperty, setFeaturedProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('id, title, location, property_image, property_images, price, bedrooms, bathrooms, sizes_m2, description')
        .eq('is_active', true)
        .not('property_images', 'is', null)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Filter properties with images
      const propertiesWithImages = (data || []).filter(property => 
        property.property_images && 
        Array.isArray(property.property_images) && 
        property.property_images.length > 0
      );

      if (propertiesWithImages.length === 0) {
        setError('No properties with images found.');
        return;
      }

      // Set featured property (first one)
      setFeaturedProperty(propertiesWithImages[0]);

      // Group properties by location and create rows
      const locationGroups: { [key: string]: Property[] } = {};
      propertiesWithImages.forEach(property => {
        const location = property.location || 'Other';
        if (!locationGroups[location]) {
          locationGroups[location] = [];
        }
        locationGroups[location].push(property);
      });

      const rows: PropertyRowData[] = [];

      // Add "Recently Added" row with newest properties
      if (propertiesWithImages.length > 1) {
        rows.push({
          title: 'Recently Added',
          properties: propertiesWithImages.slice(1, 7) // Skip featured property
        });
      }

      // Add location-based rows
      Object.entries(locationGroups).forEach(([location, properties]) => {
        if (properties.length > 2) { // Only show locations with multiple properties
          rows.push({
            title: `Properties in ${location}`,
            properties: properties.slice(0, 8)
          });
        }
      });

      // Add premium properties row (high-priced ones)
      const premiumProperties = propertiesWithImages
        .filter(p => {
          const priceNum = parseInt(p.price.replace(/[^\d]/g, ''));
          return priceNum > 500000; // Adjust threshold as needed
        })
        .slice(0, 8);

      if (premiumProperties.length > 0) {
        rows.push({
          title: 'Premium Properties',
          properties: premiumProperties
        });
      }

      // Add "All Properties" row if we have more properties
      if (propertiesWithImages.length > 8) {
        rows.push({
          title: 'Explore All Properties',
          properties: propertiesWithImages.slice(0, 12)
        });
      }

      setPropertyRows(rows);

    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openImageModal = (property: Property, imageIndex: number = 0) => {
    setSelectedProperty(property);
    setCurrentImageIndex(imageIndex);
  };

  const closeImageModal = () => {
    setSelectedProperty(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedProperty && selectedProperty.property_images) {
      setCurrentImageIndex((prev) => 
        (prev + 1) % selectedProperty.property_images.length
      );
    }
  };

  const prevImage = () => {
    if (selectedProperty && selectedProperty.property_images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProperty.property_images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-foreground">Loading Gallery...</h2>
        </div>
      </div>
    );
  }

  if (error || !featuredProperty) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {error || 'No Properties Found'}
          </h2>
          <Button onClick={fetchProperties}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroProperty 
        property={featuredProperty} 
        onViewGallery={openImageModal}
      />

      {/* Property Rows */}
      <div className="py-8 space-y-8">
        {propertyRows.map((row, index) => (
          <PropertyRow
            key={index}
            title={row.title}
            properties={row.properties}
            onViewGallery={openImageModal}
          />
        ))}
      </div>

      {/* Image Modal */}
      <Dialog open={!!selectedProperty} onOpenChange={closeImageModal}>
        <DialogContent className="max-w-6xl w-full h-[90vh] p-0 bg-black">
          <DialogHeader className="absolute top-4 left-4 z-10 bg-black/70 text-white p-3 rounded-lg">
            <DialogTitle className="text-lg font-semibold">
              {selectedProperty?.title}
            </DialogTitle>
            <p className="text-sm opacity-90">
              Image {currentImageIndex + 1} of {selectedProperty?.property_images?.length || 0}
            </p>
          </DialogHeader>

          <Button
            onClick={closeImageModal}
            className="absolute top-4 right-4 z-10 bg-black/70 text-white hover:bg-black/90 rounded-full"
            size="icon"
          >
            <X className="w-4 h-4" />
          </Button>

          {selectedProperty && (
            <div className="relative w-full h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  <OptimizedPropertyImage
                    src={selectedProperty.property_images?.[currentImageIndex]}
                    alt={`${selectedProperty.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain"
                    priority={true}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              {selectedProperty.property_images && selectedProperty.property_images.length > 1 && (
                <>
                  <Button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/70 text-white hover:bg-black/90 rounded-full w-12 h-12"
                    size="icon"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  
                  <Button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/70 text-white hover:bg-black/90 rounded-full w-12 h-12"
                    size="icon"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}

              {/* Thumbnail Navigation */}
              {selectedProperty.property_images && selectedProperty.property_images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/70 p-3 rounded-lg max-w-full overflow-x-auto">
                  {selectedProperty.property_images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex ? 'border-white' : 'border-transparent hover:border-white/50'
                      }`}
                    >
                      <OptimizedPropertyImage
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        priority={false}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NetflixStyleGallery;