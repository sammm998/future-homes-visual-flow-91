import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Camera, MapPin, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Property {
  id: string;
  title: string;
  location: string;
  property_images: string[];
}

const PropertyGallery = () => {
  const [selectedApartment, setSelectedApartment] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [cardImageIndices, setCardImageIndices] = useState<{ [key: string]: number }>({});

  // Function to prioritize exterior images
  const prioritizeExteriorImages = (images: string[]) => {
    const exteriorKeywords = [
      'exterior', 'outside', 'facade', 'building', 'view', 'balcony', 'terrace', 
      'outdoor', 'front', 'entrance', 'garden', 'pool', 'villa', 'apartment_building',
      'complex', 'development', 'residence', 'tower', 'block', 'street', 'panoramic',
      'swimming', 'landscape', 'courtyard', 'plaza', 'walkway', 'palm', 'tree'
    ];
    
    const sketchPlanKeywords = [
      'sketch', 'plan', 'floor', 'layout', 'blueprint', 'drawing', 'diagram',
      'floorplan', 'plan_', 'cizim', 'proje', 'technical', 'architectural',
      'dimensions', 'measurement', 'scale', 'draft', 'scheme', 'design_plan',
      'floor_plan', 'layout_plan', 'apartment_plan', 'unit_plan'
    ];
    
    const interiorKeywords = [
      'interior', 'inside', 'room', 'kitchen', 'bathroom', 'bedroom', 'living', 
      'indoor', 'salon', 'wc', 'yatak', 'mutfak', 'banyo', 'oda', 'ic'
    ];
    
    return images.sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      
      // Heavily penalize sketches, plans, and technical drawings
      const aIsSketch = sketchPlanKeywords.some(keyword => aLower.includes(keyword));
      const bIsSketch = sketchPlanKeywords.some(keyword => bLower.includes(keyword));
      
      // Check if image contains interior keywords
      const aIsInterior = interiorKeywords.some(keyword => aLower.includes(keyword));
      const bIsInterior = interiorKeywords.some(keyword => bLower.includes(keyword));
      
      // Check if image contains exterior keywords
      const aIsExterior = exteriorKeywords.some(keyword => aLower.includes(keyword));
      const bIsExterior = exteriorKeywords.some(keyword => bLower.includes(keyword));
      
      // Heavily deprioritize sketches and plans (send to end)
      if (aIsSketch && !bIsSketch) return 1;
      if (!aIsSketch && bIsSketch) return -1;
      
      // Strongly prioritize exterior images
      if (aIsExterior && !bIsExterior) return -1;
      if (!aIsExterior && bIsExterior) return 1;
      
      // Deprioritize interior images
      if (aIsInterior && !bIsInterior) return 1;
      if (!aIsInterior && bIsInterior) return -1;
      
      // If neither has clear indicators, assume first images in array are more likely to be exterior
      return 0;
    });
  };

  // Fetch properties with Supabase image URLs
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('id, title, location, property_images')
          .eq('is_active', true)
          .not('property_images', 'is', null);

        if (error) throw error;

        // Filter properties that have images with Supabase URLs
        const propertiesWithSupabaseImages = data
          .filter(property => 
            property.property_images && 
            property.property_images.length > 0 &&
            property.property_images.some((img: string) => 
              img.includes('https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/')
            ) &&
            // Exclude the specific property
            !(property.title === "Apartments for sale close to daily needs in Mersin, Erdemli" && 
              property.location === "Mersin")
          )
          .map(property => ({
            ...property,
            property_images: prioritizeExteriorImages(
              property.property_images.filter((img: string) => 
                img.includes('https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/')
              )
            )
          }));

        setProperties(propertiesWithSupabaseImages.slice(0, 50)); // Limit to 50 properties
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const selectedPropertyData = selectedApartment !== null ? properties[selectedApartment] : null;

  return (
    <>
      <SEOHead
        title="Property Gallery - Premium Real Estate Collection | Future Homes"
        description="Explore our stunning collection of premium properties with high-quality images showcasing luxury apartments, modern interiors, and exceptional amenities in prime locations."
        keywords="property gallery, luxury apartments, real estate images, premium properties, modern homes, apartment photos"
        canonicalUrl="/property-gallery"
      />
      
      <Navigation />
      
      <div className="min-h-screen bg-background">
        {/* Enhanced Hero Section */}
        <section className="relative py-24 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary-glow/5 to-accent/10" />
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          
          <div className="container mx-auto px-4 text-center relative z-10">
            {/* Breadcrumb */}
            <div className="mb-8">
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <Camera className="w-8 h-8 text-primary" />
                <h1 className="text-5xl md:text-7xl font-bold">
                  <span className="gradient-text">Immersive</span>{' '}
                  <span className="text-foreground">Property Gallery</span>
                </h1>
              </div>
              
              <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-primary-glow mx-auto mb-8 rounded-full" />
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-6 max-w-4xl mx-auto leading-relaxed">
                Discover stunning visuals from our <strong className="text-primary">premium property collection</strong> across <strong className="text-primary">multiple locations</strong>.
              </p>
              
              <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
                Each image tells a story of luxury, comfort, and exceptional design.
              </p>
            </motion.div>
            
            {/* Enhanced Statistics */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-8 mb-16"
            >
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 min-w-[160px] border border-primary/10 hover:border-primary/20 transition-all hover:shadow-lg hover:scale-105 group">
                <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                  {properties.length}+
                </div>
                <div className="text-sm uppercase tracking-wide text-muted-foreground font-semibold">Properties</div>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 min-w-[160px] border border-primary/10 hover:border-primary/20 transition-all hover:shadow-lg hover:scale-105 group">
                <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                  {properties.reduce((acc, prop) => acc + prop.property_images.length, 0)}+
                </div>
                <div className="text-sm uppercase tracking-wide text-muted-foreground font-semibold">Total Images</div>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 min-w-[160px] border border-primary/10 hover:border-primary/20 transition-all hover:shadow-lg hover:scale-105 group">
                <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">4K</div>
                <div className="text-sm uppercase tracking-wide text-muted-foreground font-semibold">HD Quality</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3D Apartment Gallery */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* Apartment Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {properties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      className="group relative cursor-pointer"
                      whileHover={{ y: -10 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => {
                        setSelectedApartment(index);
                        setCurrentImageIndex(0);
                      }}
                    >
                      {/* 3D Card Container */}
                      <div className="relative h-[400px] perspective-1000">
                        <motion.div 
                          className="relative w-full h-full preserve-3d group-hover:rotateY-12 transition-transform duration-500"
                          style={{
                            transformStyle: 'preserve-3d'
                          }}
                        >
                          {/* Main Image */}
                          <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl">
                            <img
                              src={property.property_images[cardImageIndices[property.id] || 0]}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            
                            {/* Navigation Arrows on Card */}
                            {property.property_images.length > 1 && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const currentIndex = cardImageIndices[property.id] || 0;
                                    setCardImageIndices({
                                      ...cardImageIndices,
                                      [property.id]: currentIndex === 0 ? property.property_images.length - 1 : currentIndex - 1
                                    });
                                  }}
                                >
                                  <ChevronLeft className="w-6 h-6" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const currentIndex = cardImageIndices[property.id] || 0;
                                    setCardImageIndices({
                                      ...cardImageIndices,
                                      [property.id]: currentIndex === property.property_images.length - 1 ? 0 : currentIndex + 1
                                    });
                                  }}
                                >
                                  <ChevronRight className="w-6 h-6" />
                                </Button>
                              </>
                            )}
                            
                            {/* Floating Info Panel */}
                            <motion.div 
                              className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{property.title}</h3>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-1">{property.location}</p>
                              <div className="flex justify-between items-center">
                                <span className="text-primary font-semibold">{property.property_images.length} Images</span>
                                <Button size="sm" className="gap-2">
                                  <Eye className="w-4 h-4" />
                                  Explore
                                </Button>
                              </div>
                            </motion.div>

                            {/* 3D Shadow Effect */}
                            <div className="absolute inset-0 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] pointer-events-none" />
                          </div>
                          
                          {/* Side Panel Effect */}
                          <div className="absolute inset-0 bg-primary/20 rounded-2xl transform translateZ-[-20px] rotateY-[15deg] opacity-60" />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
            
            {/* Call to Action */}
            <div className="text-center mt-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center gap-6"
              >
                <Button asChild size="lg" className="gap-2 bg-gradient-to-r from-primary to-blue-600 hover:shadow-lg transform hover:scale-105 transition-all">
                  <Link to="/contact-us">
                    <MapPin className="w-5 h-5" />
                    Schedule Consultation
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="gap-2 hover:shadow-lg transform hover:scale-105 transition-all">
                  <Link to="/about-us">
                    Read more about us
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Full Screen Image Modal */}
        <AnimatePresence>
          {selectedApartment !== null && selectedPropertyData && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApartment(null)}
            >
              <div className="relative w-full h-full max-w-6xl max-h-screen p-4">
                {/* Header */}
                <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">{selectedPropertyData.title}</h2>
                    <p className="text-white/80">{selectedPropertyData.location}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedApartment(null);
                    }}
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>

                {/* Main Image */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <motion.img
                    key={currentImageIndex}
                    src={selectedPropertyData.property_images[currentImageIndex]}
                    alt={selectedPropertyData.title}
                    className="max-w-full max-h-full object-contain rounded-lg"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => e.stopPropagation()}
                  />

                  {/* Navigation Arrows */}
                  {selectedPropertyData.property_images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 bg-black/50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(prev => 
                            prev === 0 ? selectedPropertyData.property_images.length - 1 : prev - 1
                          );
                        }}
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 bg-black/50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(prev => 
                            prev === selectedPropertyData.property_images.length - 1 ? 0 : prev + 1
                          );
                        }}
                      >
                        <ChevronRight className="w-6 h-6" />
                      </Button>
                    </>
                  )}
                </div>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                  {currentImageIndex + 1} / {selectedPropertyData.property_images.length}
                </div>

                {/* Thumbnail Strip */}
                {selectedPropertyData.property_images.length > 1 && (
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto scrollbar-hide px-4">
                    {selectedPropertyData.property_images.map((image, index) => (
                      <button
                        key={index}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex ? 'border-primary scale-110' : 'border-white/30 hover:border-white/60'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(index);
                        }}
                      >
                        <img
                          src={image}
                          alt={`${selectedPropertyData.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default PropertyGallery;