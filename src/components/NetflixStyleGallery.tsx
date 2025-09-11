import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { OptimizedPropertyImage } from './OptimizedPropertyImage';
import HeroProperty from './HeroProperty';
import PropertyRow from './PropertyRow';
import { CircularGallery, GalleryItem } from '@/components/ui/circular-gallery';

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

  const openImageModal = (property: Property) => {
    setSelectedProperty(property);
  };

  const closeImageModal = () => {
    setSelectedProperty(null);
  };

  // Transform property images to gallery items for the circular gallery modal
  const getGalleryItemsFromProperty = (property: Property): GalleryItem[] => {
    if (!property.property_images || property.property_images.length === 0) return [];
    
    return property.property_images.map((imageUrl, index) => ({
      common: property.title,
      binomial: `${property.location} • Image ${index + 1}`,
      photo: {
        url: imageUrl,
        text: `${property.title} in ${property.location} - Image ${index + 1}`,
        pos: 'center',
        by: `${property.bedrooms || 0} bed • ${property.bathrooms || 0} bath • ${property.sizes_m2 || 0}m²`
      }
    }));
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

      {/* Circular Gallery Modal */}
      <Dialog open={!!selectedProperty} onOpenChange={closeImageModal}>
        <DialogContent className="max-w-full w-full h-full p-0 bg-background border-0">
          <Button
            onClick={closeImageModal}
            className="absolute top-4 right-4 z-50 bg-black/70 text-white hover:bg-black/90 rounded-full"
            size="icon"
          >
            <X className="w-4 h-4" />
          </Button>

          {selectedProperty && (
            <div className="w-full h-full" style={{ height: '100vh' }}>
              <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
                <div className="text-center mb-8 absolute top-16 z-10">
                  <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                    {selectedProperty.title}
                  </h1>
                  <p className="text-muted-foreground mt-2">{selectedProperty.location} • Scroll to rotate images</p>
                </div>
                <div className="w-full h-full">
                  <CircularGallery items={getGalleryItemsFromProperty(selectedProperty)} />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NetflixStyleGallery;