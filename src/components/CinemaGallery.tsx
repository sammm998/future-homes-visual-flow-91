import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedPropertyImage } from './OptimizedPropertyImage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Info
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
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

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
  
  let filteredProperties = properties;
  if (filterLocation !== 'all') {
    filteredProperties = filteredProperties.filter(p => p.location === filterLocation);
  }
  if (filterType !== 'all') {
    filteredProperties = filteredProperties.filter(p => p.property_type === filterType);
  }

  const currentProperty = filteredProperties[currentIndex];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredProperties.length);
  }, [filteredProperties.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => 
      prev === 0 ? filteredProperties.length - 1 : prev - 1
    );
  }, [filteredProperties.length]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && filteredProperties.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % filteredProperties.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, filteredProperties.length]);

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
      
      {/* Side Panels */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-gray-900 to-gray-800/50 z-10" />
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-gray-900 to-gray-800/50 z-10" />
      
      {/* Main Screen */}
      <div className="relative h-screen w-full flex items-center justify-center">
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
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="absolute left-40 top-1/2 transform -translate-y-1/2 z-20 bg-black/90 backdrop-blur-sm p-8 rounded-r-2xl border-l-4 border-primary max-w-md"
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
            animate={{ width: `${filteredProperties.length ? ((currentIndex + 1) / filteredProperties.length) * 100 : 0}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Film Strip Navigation */}
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {filteredProperties.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((property, idx) => {
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

          {/* Info Toggle */}
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowInfo(!showInfo)}
              variant="ghost"
              size="lg"
              className="text-white hover:text-primary hover:bg-white/10 rounded-full"
            >
              <Info className="w-6 h-6" />
            </Button>
            
            <div className="text-white/80 text-sm">
              {filteredProperties.length ? currentIndex + 1 : 0} / {filteredProperties.length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4 mt-6">
          {/* Location Filter */}
          <div className="flex justify-center gap-3 flex-wrap">
            {locations.map((location) => (
              <Button
                key={location}
                onClick={() => {
                  setFilterLocation(location);
                  setCurrentIndex(0);
                }}
                variant={filterLocation === location ? "default" : "ghost"}
                className={`
                  px-4 py-2 rounded-full transition-all duration-300
                  ${filterLocation === location 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {location === 'all' ? 'All Locations' : location}
              </Button>
            ))}
          </div>

          {/* Property Type Filter */}
          <div className="flex justify-center gap-3 flex-wrap">
            {propertyTypes.map((type) => (
              <Button
                key={type}
                onClick={() => {
                  setFilterType(type);
                  setCurrentIndex(0);
                }}
                variant={filterType === type ? "default" : "ghost"}
                className={`
                  px-4 py-2 rounded-full transition-all duration-300
                  ${filterType === type 
                    ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {type === 'all' ? 'All Types' : type}
              </Button>
            ))}
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