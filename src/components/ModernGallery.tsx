import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, List, MapPin, Bed, Bath, Square, Heart, Search, Filter, Eye } from 'lucide-react';
import { useProperties } from '@/hooks/useProperties';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import OptimizedPropertyImage from '@/components/OptimizedPropertyImage';
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
}

const ModernGallery = () => {
  const { properties, loading } = useProperties();
  const { formatPrice } = useCurrency();
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filteredProperties = properties.filter((property: Property) => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || property.location === selectedLocation;
    const matchesType = selectedType === 'all' || property.property_type === selectedType;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  const locations = [...new Set(properties.map((p: Property) => p.location))].filter(Boolean);
  const propertyTypes = [...new Set(properties.map((p: Property) => p.property_type))].filter(Boolean);

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg text-muted-foreground">Loading amazing properties...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/20">
      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
            Property Gallery
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover exceptional properties across Turkey's most prestigious locations
          </p>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto mt-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 bg-background/80 backdrop-blur-sm border-border/50"
              />
            </div>
            
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full md:w-48 h-12 bg-background/80 backdrop-blur-sm border-border/50">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-48 h-12 bg-background/80 backdrop-blur-sm border-border/50">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {propertyTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>
      </section>

      {/* View Mode Toggle */}
      <div className="px-6 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p className="text-muted-foreground">
            {filteredProperties.length} properties found
          </p>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="gap-2"
            >
              <Grid className="w-4 h-4" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'masonry' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('masonry')}
              className="gap-2"
            >
              <List className="w-4 h-4" />
              Masonry
            </Button>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            layout
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'columns-1 md:columns-2 lg:columns-3 space-y-6'
            }`}
          >
            <AnimatePresence>
              {filteredProperties.map((property: Property, index) => (
                <motion.div
                  key={property.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={viewMode === 'masonry' ? 'break-inside-avoid mb-6' : ''}
                >
                  <Card className="group overflow-hidden border-border/50 bg-background/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className="relative overflow-hidden">
                      <OptimizedPropertyImage
                        src={property.property_image}
                        alt={property.title}
                        className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                          viewMode === 'masonry' ? 'h-auto' : 'h-64'
                        }`}
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Heart Icon */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-4 right-4 w-8 h-8 p-0 bg-background/20 backdrop-blur-sm hover:bg-background/40"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(property.id);
                        }}
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            favorites.has(property.id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-white'
                          }`} 
                        />
                      </Button>

                      {/* View Gallery Button */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            className="absolute bottom-4 right-4 gap-2 bg-primary/90 hover:bg-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                            onClick={() => setSelectedProperty(property)}
                          >
                            <Eye className="w-4 h-4" />
                            View Gallery
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          {selectedProperty && (
                            <PropertyGalleryModal property={selectedProperty} />
                          )}
                        </DialogContent>
                      </Dialog>

                      {/* Price Badge */}
                      <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground backdrop-blur-sm">
                        {formatPriceFromString(property.price || '0', formatPrice)}
                      </Badge>
                    </div>

                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                            {property.title}
                          </h3>
                          <div className="flex items-center gap-1 text-muted-foreground mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>{property.location}</span>
                          </div>
                        </div>

                        <div className="flex gap-4 text-sm text-muted-foreground">
                          {property.bedrooms && (
                            <div className="flex items-center gap-1">
                              <Bed className="w-4 h-4" />
                              <span>{property.bedrooms}</span>
                            </div>
                          )}
                          {property.bathrooms && (
                            <div className="flex items-center gap-1">
                              <Bath className="w-4 h-4" />
                              <span>{property.bathrooms}</span>
                            </div>
                          )}
                          {property.sizes_m2 && (
                            <div className="flex items-center gap-1">
                              <Square className="w-4 h-4" />
                              <span>{property.sizes_m2}m²</span>
                            </div>
                          )}
                        </div>

                        {property.description && (
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {property.description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const PropertyGalleryModal = ({ property }: { property: Property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = property.property_images || [property.property_image];

  return (
    <div className="space-y-6">
      <div className="relative">
        <OptimizedPropertyImage
          src={images[currentImageIndex]}
          alt={`${property.title} - Image ${currentImageIndex + 1}`}
          className="w-full h-96 object-cover rounded-lg"
        />
        
        {images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentImageIndex 
                    ? 'border-primary' 
                    : 'border-transparent hover:border-border'
                }`}
              >
                <OptimizedPropertyImage
                  src={image}
                  alt={`${property.title} - Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">{property.title}</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{property.location}</span>
          </div>
        </div>

        <div className="flex gap-6">
          {property.bedrooms && (
            <div className="flex items-center gap-2">
              <Bed className="w-5 h-5 text-primary" />
              <span>{property.bedrooms} Bedrooms</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-2">
              <Bath className="w-5 h-5 text-primary" />
              <span>{property.bathrooms} Bathrooms</span>
            </div>
          )}
          {property.sizes_m2 && (
            <div className="flex items-center gap-2">
              <Square className="w-5 h-5 text-primary" />
              <span>{property.sizes_m2}m²</span>
            </div>
          )}
        </div>

        <div className="text-3xl font-bold text-primary">
          €{(() => {
            const priceStr = property.price || '0';
            const numericValue = parseInt(priceStr.replace(/[^\d]/g, ''));
            return isNaN(numericValue) ? '0' : numericValue.toLocaleString();
          })()}
        </div>

        {property.description && (
          <p className="text-muted-foreground leading-relaxed">
            {property.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default ModernGallery;