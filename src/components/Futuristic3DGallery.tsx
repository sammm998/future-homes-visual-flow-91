import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedPropertyImage } from './OptimizedPropertyImage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Eye, 
  Zap,
  Layers,
  Globe,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

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

const Futuristic3DGallery: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_active', true)
        .not('property_images', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const filteredProperties = (data || []).filter(property => 
        property.property_images && 
        Array.isArray(property.property_images) && 
        property.property_images.length > 0
      );

      setProperties(filteredProperties);
    } catch (err) {
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const locations = ['all', ...new Set(properties.map(p => p.location))];
  const filteredProperties = filterLocation === 'all' 
    ? properties 
    : properties.filter(p => p.location === filterLocation);

  const openPropertyModal = (property: Property) => {
    setSelectedProperty(property);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedProperty(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedProperty?.property_images) {
      setCurrentImageIndex((prev) => 
        (prev + 1) % selectedProperty.property_images.length
      );
    }
  };

  const prevImage = () => {
    if (selectedProperty?.property_images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProperty.property_images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <div className="w-24 h-24 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-purple-400/20 border-b-purple-400 rounded-full animate-spin animate-reverse mx-auto"></div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Initializing 3D Property Matrix
          </h2>
          <p className="text-slate-300">Loading holographic property data...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-grid-cyan-500/5 bg-grid-16" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-400/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-40 w-48 h-48 bg-purple-400/10 rounded-full blur-xl animate-pulse animation-delay-2000" />
      <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-blue-400/10 rounded-full blur-xl animate-pulse animation-delay-4000" />

      {/* Header */}
      <div className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Layers className="w-8 h-8 text-cyan-400" />
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Future Homes
              </h1>
              <Globe className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-xl text-slate-300 mb-8">
              Advanced 3D Property Visualization System
            </p>
            
            {/* Location Filter */}
            <div className="flex justify-center gap-3 flex-wrap">
              {locations.map((location) => (
                <Button
                  key={location}
                  onClick={() => setFilterLocation(location)}
                  variant={filterLocation === location ? "default" : "outline"}
                  className={`
                    px-6 py-2 rounded-full transition-all duration-300 backdrop-blur-sm
                    ${filterLocation === location 
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25' 
                      : 'border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/50'
                    }
                  `}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {location === 'all' ? 'All Locations' : location}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Properties Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onHoverStart={() => setHoveredId(property.id)}
                onHoverEnd={() => setHoveredId(null)}
                className="group relative"
              >
                <div className={`
                  relative bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden
                  border border-cyan-400/20 hover:border-cyan-400/50 transition-all duration-500
                  ${hoveredId === property.id ? 'transform scale-105 shadow-2xl shadow-cyan-500/20' : ''}
                `}>
                  {/* Holographic Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Property Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <OptimizedPropertyImage
                      src={property.property_image || property.property_images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      priority={index < 8}
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* 3D Hologram Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 shadow-lg">
                        <Eye className="w-3 h-3 mr-1" />
                        3D View
                      </Badge>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
                        {property.price}
                      </Badge>
                    </div>

                    {/* Image Count */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Badge variant="outline" className="bg-black/70 border-cyan-400/50 text-cyan-400">
                        {property.property_images.length} Images
                      </Badge>
                    </div>
                  </div>

                  {/* Property Info */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2">
                      {property.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm">{property.location}</span>
                    </div>

                    {/* Property Stats */}
                    <div className="flex items-center gap-4 text-sm text-slate-300">
                      {property.bedrooms && (
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4 text-purple-400" />
                          <span>{property.bedrooms}</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center gap-1">
                          <Bath className="w-4 h-4 text-blue-400" />
                          <span>{property.bathrooms}</span>
                        </div>
                      )}
                      {property.sizes_m2 && (
                        <div className="flex items-center gap-1">
                          <Maximize2 className="w-4 h-4 text-cyan-400" />
                          <span>{property.sizes_m2}m²</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => openPropertyModal(property)}
                      className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 shadow-lg transition-all duration-300 group/btn"
                    >
                      <span>Enter 3D Tour</span>
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Button>
                  </div>

                  {/* Scan Lines Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent animate-pulse" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredProperties.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Properties Found</h3>
              <p className="text-slate-400">Try selecting a different location filter.</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Property Modal */}
      <Dialog open={!!selectedProperty} onOpenChange={closeModal}>
        <DialogContent className="max-w-6xl w-full h-[90vh] p-0 bg-slate-900 border-cyan-400/30">
          <DialogHeader className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-sm text-white p-4 rounded-lg border border-cyan-400/30">
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {selectedProperty?.title}
            </DialogTitle>
            <p className="text-sm text-slate-300">
              Holographic Scan {currentImageIndex + 1} of {selectedProperty?.property_images?.length || 0}
            </p>
          </DialogHeader>

          <Button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 bg-slate-900/90 backdrop-blur-sm text-cyan-400 hover:bg-slate-800 border border-cyan-400/30 rounded-full"
            size="icon"
          >
            <X className="w-4 h-4" />
          </Button>

          {selectedProperty && (
            <div className="relative w-full h-full bg-slate-900">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full"
                >
                  <OptimizedPropertyImage
                    src={selectedProperty.property_images?.[currentImageIndex]}
                    alt={`${selectedProperty.title} - Scan ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain"
                    priority={true}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              {selectedProperty.property_images && selectedProperty.property_images.length > 1 && (
                <>
                  <Button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-slate-900/90 backdrop-blur-sm text-cyan-400 hover:bg-slate-800 border border-cyan-400/30 rounded-full w-12 h-12"
                    size="icon"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  
                  <Button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-slate-900/90 backdrop-blur-sm text-cyan-400 hover:bg-slate-800 border border-cyan-400/30 rounded-full w-12 h-12"
                    size="icon"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}

              {/* Progress Indicators */}
              {selectedProperty.property_images && selectedProperty.property_images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-slate-900/90 backdrop-blur-sm p-3 rounded-lg border border-cyan-400/30">
                  {selectedProperty.property_images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'bg-cyan-400 w-8' 
                          : 'bg-cyan-400/30 hover:bg-cyan-400/50'
                      }`}
                    />
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

export default Futuristic3DGallery;