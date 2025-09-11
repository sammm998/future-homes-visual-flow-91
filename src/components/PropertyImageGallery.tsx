import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, MapPin, Image, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedPropertyImage } from './OptimizedPropertyImage';

interface Property {
  id: string;
  title: string;
  location: string;
  property_image: string;
  property_images: string[];
  price: string;
  bedrooms?: string;
  bathrooms?: string;
}

interface PropertyImageGalleryProps {
  locationFilter?: string;
  limit?: number;
  showFilters?: boolean;
}

const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({
  locationFilter,
  limit,
  showFilters = true
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [thumbnailPage, setThumbnailPage] = useState(0);
  const [locationFilters, setLocationFilters] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>(locationFilter || 'all');
  const [error, setError] = useState<string | null>(null);

  const THUMBNAILS_PER_PAGE = 8; // Number of thumbnails to show per page

  useEffect(() => {
    fetchProperties();
  }, [selectedLocation, limit]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('properties')
        .select('id, title, location, property_image, property_images, price, bedrooms, bathrooms')
        .eq('is_active', true)
        .not('property_images', 'is', null);

      if (selectedLocation !== 'all') {
        query = query.ilike('location', `%${selectedLocation}%`);
      }

      if (limit) {
        query = query.limit(limit);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      // Filter out properties without images
      const propertiesWithImages = (data || []).filter(property => 
        property.property_images && 
        Array.isArray(property.property_images) && 
        property.property_images.length > 0
      );

      setProperties(propertiesWithImages);

      // Extract unique locations for filters
      if (showFilters) {
        const locations = [...new Set(propertiesWithImages.map(p => p.location))];
        setLocationFilters(locations);
      }

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
    setThumbnailPage(0); // Reset to first page when opening modal
  };

  const closeImageModal = () => {
    setSelectedProperty(null);
    setCurrentImageIndex(0);
    setThumbnailPage(0);
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

  const getTotalImages = () => {
    return properties.reduce((total, property) => {
      return total + (property.property_images?.length || 0);
    }, 0);
  };

  const getThumbnailPagination = () => {
    if (!selectedProperty?.property_images) return { currentThumbnails: [], totalPages: 0 };
    
    const totalImages = selectedProperty.property_images.length;
    const totalPages = Math.ceil(totalImages / THUMBNAILS_PER_PAGE);
    const startIndex = thumbnailPage * THUMBNAILS_PER_PAGE;
    const endIndex = Math.min(startIndex + THUMBNAILS_PER_PAGE, totalImages);
    const currentThumbnails = selectedProperty.property_images.slice(startIndex, endIndex);
    
    return { currentThumbnails, totalPages, startIndex };
  };

  const nextThumbnailPage = () => {
    const { totalPages } = getThumbnailPagination();
    if (thumbnailPage < totalPages - 1) {
      setThumbnailPage(prev => prev + 1);
    }
  };

  const prevThumbnailPage = () => {
    if (thumbnailPage > 0) {
      setThumbnailPage(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Loading Property Gallery...</h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Error Loading Gallery</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchProperties}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Property Image Gallery
          </h2>
          <p className="text-xl text-muted-foreground mb-6">
            Explore {properties.length} properties with {getTotalImages()} total images
          </p>
          
          {/* Location Filter */}
          {showFilters && locationFilters.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <Button
                variant={selectedLocation === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedLocation('all')}
                size="sm"
              >
                All Locations ({properties.length})
              </Button>
              {locationFilters.map((location) => (
                <Button
                  key={location}
                  variant={selectedLocation === location ? 'default' : 'outline'}
                  onClick={() => setSelectedLocation(location)}
                  size="sm"
                >
                  {location}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Properties Grid */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="group cursor-pointer hover:shadow-elegant transition-all duration-300 overflow-hidden">
                  <div 
                    className="relative aspect-[4/3] overflow-hidden"
                    onClick={() => openImageModal(property, 0)}
                  >
                    <OptimizedPropertyImage
                      src={property.property_image || property.property_images?.[0]}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      priority={false}
                    />
                    
                    {/* Image Count Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-black/70 text-white border-0">
                        <Image className="w-3 h-3 mr-1" />
                        {property.property_images?.length || 0}
                      </Badge>
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* View Gallery Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="sm" className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                        View Gallery
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                      {property.title}
                    </h3>
                    
                    <div className="flex items-center text-muted-foreground text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.location}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">
                        {property.price}
                      </span>
                      
                      {(property.bedrooms || property.bathrooms) && (
                        <div className="text-xs text-muted-foreground">
                          {property.bedrooms && `${property.bedrooms} bed`}
                          {property.bedrooms && property.bathrooms && ' • '}
                          {property.bathrooms && `${property.bathrooms} bath`}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Image className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Properties Found</h3>
            <p className="text-muted-foreground">No properties with images found for the selected filters.</p>
          </div>
        )}

        {/* Image Modal */}
        <Dialog open={!!selectedProperty} onOpenChange={closeImageModal}>
          <DialogContent className="max-w-6xl w-full h-[90vh] p-0">
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
              className="absolute top-4 right-4 z-10 bg-black/70 text-white hover:bg-black/90"
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
                      className="w-full h-full object-contain bg-black"
                      priority={true}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                {selectedProperty.property_images && selectedProperty.property_images.length > 1 && (
                  <>
                    <Button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/70 text-white hover:bg-black/90"
                      size="icon"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    
                    <Button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/70 text-white hover:bg-black/90"
                      size="icon"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </>
                )}

                {/* Thumbnail Navigation with Pagination */}
                {selectedProperty.property_images && selectedProperty.property_images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
                    <div className="bg-black/80 backdrop-blur-sm p-4 rounded-2xl">
                      {(() => {
                        const { currentThumbnails, totalPages, startIndex } = getThumbnailPagination();
                        return (
                          <>
                            {/* Thumbnails Grid */}
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-4">
                              {currentThumbnails.map((image, index) => {
                                const globalIndex = startIndex + index;
                                return (
                                  <button
                                    key={globalIndex}
                                    onClick={() => setCurrentImageIndex(globalIndex)}
                                    className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                      globalIndex === currentImageIndex 
                                        ? 'border-white scale-105 shadow-lg' 
                                        : 'border-white/30 hover:border-white/60'
                                    }`}
                                  >
                                    <OptimizedPropertyImage
                                      src={image}
                                      alt={`Thumbnail ${globalIndex + 1}`}
                                      className="w-full h-full object-cover"
                                      priority={false}
                                    />
                                  </button>
                                );
                              })}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                              <div className="flex items-center justify-center gap-4">
                                <button
                                  onClick={prevThumbnailPage}
                                  disabled={thumbnailPage === 0}
                                  className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:hover:bg-white/20 text-white rounded-lg transition-colors duration-300 disabled:cursor-not-allowed"
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                  <span className="text-sm">Previous</span>
                                </button>

                                {/* Page Indicators */}
                                <div className="flex gap-2">
                                  {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                      key={index}
                                      onClick={() => setThumbnailPage(index)}
                                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                        index === thumbnailPage 
                                          ? 'bg-white scale-125' 
                                          : 'bg-white/50 hover:bg-white/75'
                                      }`}
                                    />
                                  ))}
                                </div>

                                <button
                                  onClick={nextThumbnailPage}
                                  disabled={thumbnailPage === totalPages - 1}
                                  className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:hover:bg-white/20 text-white rounded-lg transition-colors duration-300 disabled:cursor-not-allowed"
                                >
                                  <span className="text-sm">Next</span>
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            )}

                            {/* Image Counter */}
                            <div className="text-center mt-3">
                              <span className="text-white/80 text-sm">
                                Showing {startIndex + 1}-{Math.min(startIndex + THUMBNAILS_PER_PAGE, selectedProperty.property_images.length)} of {selectedProperty.property_images.length} images
                              </span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default PropertyImageGallery;