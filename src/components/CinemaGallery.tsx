import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedPropertyImage } from './OptimizedPropertyImage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  MapPin, 
  Bed, 
  Bath, 
  Maximize2,
  Film,
  Info,
  Grid3X3,
  Search
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
  property_type?: string;
}

const CinemaGallery: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const propertyTypes = ['all', ...new Set(properties.map(p => p.property_type).filter(Boolean))];
  
  const currentProperty = properties[currentIndex];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % properties.length);
  }, [properties.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => 
      prev === 0 ? properties.length - 1 : prev - 1
    );
  }, [properties.length]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && properties.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % properties.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, properties.length]);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch(e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayback();
          break;
        case 'ArrowLeft':
          prevSlide();
          break;
        case 'ArrowRight':
          nextSlide();
          break;
        case 'KeyI':
          setShowInfo(!showInfo);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, showInfo, nextSlide, prevSlide, togglePlayback]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <Film className="w-16 h-16 text-red-500 mx-auto mb-4 animate-spin" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Loading Cinema...
          </h2>
          <p className="text-gray-400">Preparing your property showcase</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Cinema Screen Frame */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900/50 to-black" />
      
      {/* Left Side Info Panel */}
      <div className="absolute top-0 left-0 w-64 h-full bg-gradient-to-r from-black/95 via-gray-900/90 to-transparent z-10">
        <div className="p-6 pt-20">
          <div className="text-white">
            <h3 className="text-xl font-bold mb-4">Property Showcase</h3>
            <p className="text-gray-400 mb-6">Navigate through our exclusive property collection</p>
            
            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-primary mb-2">Quick Actions</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>• Space: Play/Pause</p>
                  <p>• ← →: Navigate</p>
                  <p>• I: Toggle Info</p>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-yellow-400 mb-2">Current Property</h4>
                {currentProperty && (
                  <div className="text-sm text-gray-300">
                    <p className="font-medium text-white">{currentProperty.title}</p>
                    <p>{currentProperty.location}</p>
                    <p className="text-primary font-bold mt-2">{currentProperty.price}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Screen */}
      <div className="relative h-screen w-full flex items-center justify-center px-64">
        <AnimatePresence mode="wait">
          {currentProperty && (
            <motion.div
              key={currentProperty.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="relative w-full h-full"
            >
              {/* Main Property Image */}
              <OptimizedPropertyImage
                src={currentProperty.property_image || currentProperty.property_images[0]}
                alt={currentProperty.title}
                className="w-full h-full object-cover"
                priority={true}
              />
              
              {/* Cinema Vignette */}
              <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/80" />
              
              {/* Film Grain Effect */}
              <div className="absolute inset-0 opacity-20 bg-gray-800/30 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Property Information Overlay */}
        <AnimatePresence>
          {showInfo && currentProperty && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20 bg-black/90 backdrop-blur-sm p-6 rounded-2xl border border-primary/30 max-w-lg"
            >
              <h2 className="text-3xl font-bold text-white mb-4 font-serif">
                {currentProperty.title}
              </h2>
              
              <div className="flex items-center gap-2 text-primary mb-4">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{currentProperty.location}</span>
              </div>

              <div className="flex items-center gap-6 text-white mb-6">
                {currentProperty.bedrooms && (
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-yellow-400" />
                    <span>{currentProperty.bedrooms}</span>
                  </div>
                )}
                {currentProperty.bathrooms && (
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5 text-blue-400" />
                    <span>{currentProperty.bathrooms}</span>
                  </div>
                )}
                {currentProperty.sizes_m2 && (
                  <div className="flex items-center gap-2">
                    <Maximize2 className="w-5 h-5 text-green-400" />
                    <span>{currentProperty.sizes_m2}m²</span>
                  </div>
                )}
              </div>

              <Badge className="bg-primary text-primary-foreground text-xl px-4 py-2 border-0">
                {currentProperty.price}
              </Badge>

              {currentProperty.description && (
                <p className="text-gray-300 mt-4 text-sm leading-relaxed">
                  {currentProperty.description}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cinema Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8 z-20">
        {/* Progress Bar */}
        <div className="w-full bg-gray-800 h-2 rounded-full mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary-foreground"
            initial={{ width: 0 }}
            animate={{ width: `${properties.length ? ((currentIndex + 1) / properties.length) * 100 : 0}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Film Strip Navigation */}
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {properties.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((property, idx) => {
                const actualIndex = Math.max(0, currentIndex - 2) + idx;
                return (
                  <button
                    key={property.id}
                    onClick={() => setCurrentIndex(actualIndex)}
                    className={`
                      w-16 h-12 rounded border-2 transition-all duration-300 overflow-hidden
                      ${actualIndex === currentIndex 
                        ? 'border-primary scale-110' 
                        : 'border-gray-600 opacity-60 hover:border-gray-400'
                      }
                    `}
                  >
                    <OptimizedPropertyImage
                      src={property.property_image || property.property_images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-4">
            <Button
              onClick={prevSlide}
              variant="ghost"
              size="lg"
              className="text-white hover:text-primary hover:bg-white/10 rounded-full"
            >
              <SkipBack className="w-6 h-6" />
            </Button>
            
            <Button
              onClick={togglePlayback}
              variant="ghost"
              size="lg"
              className="text-white hover:text-primary hover:bg-white/10 rounded-full"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </Button>
            
            <Button
              onClick={nextSlide}
              variant="ghost"
              size="lg"
              className="text-white hover:text-primary hover:bg-white/10 rounded-full"
            >
              <SkipForward className="w-6 h-6" />
            </Button>
          </div>

          {/* Info Toggle and See All */}
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowInfo(!showInfo)}
              variant="ghost"
              size="lg"
              className="text-white hover:text-primary hover:bg-white/10 rounded-full"
            >
              <Info className="w-6 h-6" />
            </Button>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6"
                >
                  <Grid3X3 className="w-5 h-5 mr-2" />
                  See All
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[80vh] bg-black/95 border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-white mb-4">
                    Select Property
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[60vh]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                    {properties.map((property, idx) => (
                      <button
                        key={property.id}
                        onClick={() => {
                          setCurrentIndex(idx);
                          setIsModalOpen(false);
                        }}
                        className={`
                          group relative overflow-hidden rounded-xl border-2 transition-all duration-300
                          ${currentIndex === idx 
                            ? 'border-primary shadow-lg shadow-primary/30' 
                            : 'border-gray-700 hover:border-gray-500'
                          }
                        `}
                      >
                        <div className="aspect-video">
                          <OptimizedPropertyImage
                            src={property.property_image || property.property_images[0]}
                            alt={property.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                          <h3 className="text-white font-bold text-lg mb-1 truncate">
                            {property.title}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-300 mb-2">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm truncate">{property.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge className="bg-primary text-primary-foreground text-sm">
                              {property.price}
                            </Badge>
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                              {property.bedrooms && (
                                <div className="flex items-center gap-1">
                                  <Bed className="w-3 h-3" />
                                  <span>{property.bedrooms}</span>
                                </div>
                              )}
                              {property.bathrooms && (
                                <div className="flex items-center gap-1">
                                  <Bath className="w-3 h-3" />
                                  <span>{property.bathrooms}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
            
            <div className="text-white/80 text-sm">
              {properties.length ? currentIndex + 1 : 0} / {properties.length}
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Controls Info */}
      <div className="absolute top-6 right-6 z-20 text-white/60 text-sm">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
          <p>Space: Play/Pause</p>
          <p>← →: Navigate</p>
          <p>I: Toggle Info</p>
        </div>
      </div>
    </div>
  );
};

export default CinemaGallery;