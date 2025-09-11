import React, { useState, useEffect } from 'react';
import { CircularGallery, GalleryItem } from '@/components/ui/circular-gallery';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatPriceFromString } from '@/utils/priceFormatting';

interface Property {
  id: string;
  title: string;
  location: string;
  property_image: string;
  property_images: string[];
  price: string;
  bedrooms: string;
  bathrooms: string;
  sizes_m2: string;
  description: string;
  property_type: string;
  ref_no?: string;
}

const ModernGallery = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Fetch specific properties by ref_no first, then fill with others
        const specificRefNumbers = ['10003', '10028', '1180'];
        
        const { data: specificData, error: specificError } = await supabase
          .from('properties')
          .select('id, title, location, price, property_image, property_images, bedrooms, bathrooms, sizes_m2, description, property_type, ref_no')
          .eq('is_active', true)
          .in('ref_no', specificRefNumbers)
          .not('property_image', 'is', null);
        
        const { data: otherData, error: otherError } = await supabase
          .from('properties')
          .select('id, title, location, price, property_image, property_images, bedrooms, bathrooms, sizes_m2, description, property_type, ref_no')
          .eq('is_active', true)
          .not('ref_no', 'in', `(${specificRefNumbers.map(n => `'${n}'`).join(',')})`)
          .not('property_image', 'is', null)
          .order('created_at', { ascending: false })
          .limit(6);
        
        const error = specificError || otherError;
        const combinedData = [...(specificData || []), ...(otherData || [])];

        if (error) {
          console.error('Error fetching properties:', error);
          return;
        }

        // Filter properties that have facade images (general/exterior images)
        const propertiesWithFacades = combinedData.filter(property => {
          if (!property.property_image) return false;
          
          // Check if main image or any image contains 'general' and not 'interior'
          const hasExteriorImage = property.property_image.includes('/general/') && 
                                   !property.property_image.includes('/interior/');
          
          if (hasExteriorImage) return true;
          
          // Check other images
          if (property.property_images && property.property_images.length > 0) {
            return property.property_images.some(img => 
              img.includes('/general/') && !img.includes('/interior/')
            );
          }
          
          return false;
        });

        setProperties(propertiesWithFacades.slice(0, 12)); // Limit to 12 properties
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Transform properties to gallery items
  const galleryItems: GalleryItem[] = properties.map(property => {
    // Find the best facade image
    let imageUrl = property.property_image;
    
    if (property.property_images && property.property_images.length > 0) {
      const facadeImage = property.property_images.find(img => 
        img.includes('/general/') && !img.includes('/interior/')
      );
      if (facadeImage) {
        imageUrl = facadeImage;
      }
    }

    const priceText = formatPriceFromString(property.price || '0', formatPrice);
    const details = [
      property.bedrooms && `${property.bedrooms} bed`,
      property.bathrooms && `${property.bathrooms} bath`,
      property.sizes_m2 && `${property.sizes_m2}m²`
    ].filter(Boolean).join(' • ');

    return {
      common: property.title,
      binomial: `${property.location} • ${priceText}`,
      photo: {
        url: imageUrl,
        text: `${property.title} in ${property.location}`,
        pos: 'center',
        by: details || property.property_type || 'Future Homes Turkey'
      }
    };
  });

  if (loading) {
    return (
      <div className="w-full bg-background text-foreground" style={{ height: '100vh' }}>
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-lg text-muted-foreground">Loading amazing properties...</p>
        </div>
      </div>
    );
  }

  if (galleryItems.length === 0) {
    return (
      <div className="w-full bg-background text-foreground" style={{ height: '100vh' }}>
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">No Properties Found</h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background text-foreground" style={{ height: '500vh' }}>
      <div className="w-full h-screen sticky top-0 flex flex-col items-center justify-center overflow-hidden">
        <div className="text-center mb-8 absolute top-16 z-10">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
            Property Gallery
          </h1>
          <p className="text-muted-foreground mt-2">Scroll to rotate • Discover premium properties</p>
        </div>
        <div className="w-full h-full">
          <CircularGallery items={galleryItems} />
        </div>
      </div>
    </div>
  );
};

export default ModernGallery;