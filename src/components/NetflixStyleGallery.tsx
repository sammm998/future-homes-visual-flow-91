import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { OptimizedPropertyImage } from './OptimizedPropertyImage';
import HeroProperty from './HeroProperty';
import PropertyRow from './PropertyRow';
import PropertyFilters from './PropertyFilters';
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
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [featuredProperty, setFeaturedProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [locations, setLocations] = useState<string[]>([]);

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

      // Store all properties for filtering
      setAllProperties(propertiesWithImages);

      // Get unique locations
      const uniqueLocations = [...new Set(propertiesWithImages.map(p => p.location).filter(Boolean))];
      setLocations(uniqueLocations);

      // Apply filters and create rows
      filterAndSetProperties(propertiesWithImages, selectedLocation, priceRange);

    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSetProperties = (properties: Property[], location: string, price: string) => {
    let filteredProperties = [...properties];

    // Filter by location
    if (location !== 'all') {
      filteredProperties = filteredProperties.filter(p => p.location === location);
    }

    // Filter by price range
    if (price !== 'all') {
      filteredProperties = filteredProperties.filter(p => {
        if (!p.price || typeof p.price !== 'string') return false;
        const priceNum = parseInt(p.price.replace(/[^\d]/g, ''));
        if (isNaN(priceNum)) return false;
        if (price === '0-250000') return priceNum < 250000;
        if (price === '250000-500000') return priceNum >= 250000 && priceNum <= 500000;
        if (price === '500000-1000000') return priceNum >= 500000 && priceNum <= 1000000;
        if (price === '1000000+') return priceNum > 1000000;
        return true;
      });
    }

    // Set featured property (first one)
    setFeaturedProperty(filteredProperties[0] || null);

    // Group properties by location and create rows
    const locationGroups: { [key: string]: Property[] } = {};
    filteredProperties.forEach(property => {
      const loc = property.location || 'Other';
      if (!locationGroups[loc]) {
        locationGroups[loc] = [];
      }
      locationGroups[loc].push(property);
    });

    const rows: PropertyRowData[] = [];

    // Add "Recently Added" row with newest properties
    if (filteredProperties.length > 1) {
      rows.push({
        title: 'Recently Added',
        properties: filteredProperties.slice(1, 7)
      });
    }

    // Add location-based rows
    Object.entries(locationGroups).forEach(([loc, props]) => {
      if (props.length > 2) {
        rows.push({
          title: `Properties in ${loc}`,
          properties: props.slice(0, 8)
        });
      }
    });

    // Add premium properties row
    const premiumProperties = filteredProperties
      .filter(p => {
        if (!p.price || typeof p.price !== 'string') return false;
        const priceNum = parseInt(p.price.replace(/[^\d]/g, ''));
        return !isNaN(priceNum) && priceNum > 500000;
      })
      .slice(0, 8);

    if (premiumProperties.length > 0) {
      rows.push({
        title: 'Premium Properties',
        properties: premiumProperties
      });
    }

    // Add "All Properties" row
    if (filteredProperties.length > 8) {
      rows.push({
        title: 'Explore All Properties',
        properties: filteredProperties.slice(0, 12)
      });
    }

    setPropertyRows(rows);
  };

  const openImageModal = (property: Property) => {
    console.log('Opening modal for property:', property.title, 'with images:', property.property_images?.length);
    setSelectedProperty(property);
  };

  const closeImageModal = () => {
    setSelectedProperty(null);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    filterAndSetProperties(allProperties, location, priceRange);
  };

  const handlePriceRangeChange = (price: string) => {
    setPriceRange(price);
    filterAndSetProperties(allProperties, selectedLocation, price);
  };

  const handleClearFilters = () => {
    setSelectedLocation('all');
    setPriceRange('all');
    filterAndSetProperties(allProperties, 'all', 'all');
  };

  const hasActiveFilters = selectedLocation !== 'all' || priceRange !== 'all';

  // Convert property images to gallery items for circular gallery
  const getGalleryItems = (property: Property): GalleryItem[] => {
    console.log('Converting property to gallery items:', property.title, property.property_images);
    if (!property.property_images || !Array.isArray(property.property_images)) {
      return [];
    }
    return property.property_images.map((imageUrl, index) => ({
      common: property.title,
      binomial: property.location || '',
      photo: {
        url: imageUrl,
        text: `${property.title} - Image ${index + 1}`,
        by: 'Property Gallery'
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
      {/* Hero Section with more top margin */}
      <div className="pt-20">
        <HeroProperty 
          property={featuredProperty} 
          onViewGallery={openImageModal}
        />
      </div>

      {/* Filters */}
      <PropertyFilters
        locations={locations}
        selectedLocation={selectedLocation}
        onLocationChange={handleLocationChange}
        priceRange={priceRange}
        onPriceRangeChange={handlePriceRangeChange}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
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
        <DialogContent className="max-w-full w-full h-screen p-0 bg-black overflow-hidden">
          {selectedProperty && (
            <>
              <Button
                onClick={closeImageModal}
                className="absolute top-4 right-4 z-50 bg-black/70 text-white hover:bg-black/90 rounded-full"
                size="icon"
              >
                <X className="w-4 h-4" />
              </Button>
              
              <div className="w-full bg-background text-foreground" style={{ height: '500vh' }}>
                <div className="w-full h-screen sticky top-0 flex flex-col items-center justify-center overflow-hidden">
                  <div className="text-center mb-8 absolute top-16 z-10">
                    <h1 className="text-4xl font-bold text-white">{selectedProperty.title}</h1>
                    <p className="text-white/70">{selectedProperty.location}</p>
                    <p className="text-white/60 mt-2">Scroll to rotate the gallery</p>
                  </div>
                  <div className="w-full h-full">
                    <CircularGallery items={getGalleryItems(selectedProperty)} />
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NetflixStyleGallery;