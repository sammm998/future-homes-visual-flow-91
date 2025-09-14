import React, { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '@/contexts/CurrencyContext';
import { ArrowRight, MapPin, Bed, Bath, Square } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  property_image: string;
  bedrooms?: string;
  bathrooms?: string;
  sizes_m2?: string;
  ref_no?: string;
}

const ModernPropertyShowcase = () => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback properties in case database fetch fails
  const fallbackProperties = [
    {
      id: "fallback-1",
      title: "Luxury Marina Apartments",
      location: "Dubai, Marina",
      price: formatPrice(1110000),
      property_image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      bedrooms: "1-6",
      bathrooms: "2-7",
      sizes_m2: "78-1,505"
    },
    {
      id: "fallback-2", 
      title: "Twin Villas Launch Price",
      location: "Antalya, Kemer",
      price: formatPrice(350000),
      property_image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      bedrooms: "3",
      bathrooms: "2",
      sizes_m2: "115"
    },
    {
      id: "fallback-3",
      title: "Magnificent Complex", 
      location: "Dubai, JVC",
      price: formatPrice(313000),
      property_image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      bedrooms: "1-2",
      bathrooms: "1-2", 
      sizes_m2: "70-112"
    },
    {
      id: "fallback-4",
      title: "Investment Apartments",
      location: "Antalya, Aksu", 
      price: formatPrice(135000),
      property_image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop",
      bedrooms: "1-2",
      bathrooms: "1-2",
      sizes_m2: "75-104"
    },
    {
      id: "fallback-5",
      title: "Modern Design Apartments",
      location: "Antalya, Aksu",
      price: formatPrice(147000), 
      property_image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      bedrooms: "1-2",
      bathrooms: "1-2",
      sizes_m2: "60-100"
    },
    {
      id: "fallback-6",
      title: "Ready Luxury Apartment",
      location: "Antalya, Altintas",
      price: formatPrice(110000),
      property_image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop", 
      bedrooms: "1",
      bathrooms: "1",
      sizes_m2: "72"
    }
  ];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Fetch specific properties by ref_no first, then fill with others
        const specificRefNumbers = ['10003', '10028', '1180'];
        
        const { data: specificData, error: specificError } = await supabase
          .from('properties')
          .select('id, title, location, price, property_image, property_images, bedrooms, bathrooms, sizes_m2, ref_no')
          .eq('is_active', true)
          .in('ref_no', specificRefNumbers)
          .not('property_image', 'is', null);
        
        const { data: otherData, error: otherError } = await supabase
          .from('properties')
          .select('id, title, location, price, property_image, property_images, bedrooms, bathrooms, sizes_m2, ref_no')
          .eq('is_active', true)
          .not('ref_no', 'in', `(${specificRefNumbers.map(n => `'${n}'`).join(',')})`)
          .not('property_image', 'is', null)
          .order('created_at', { ascending: false })
          .limit(6);
        
        const error = specificError || otherError;
        const data = [...(specificData || []), ...(otherData || [])];

        if (error) {
          console.error('Error fetching properties:', error);
          setProperties(fallbackProperties);
        } else if (data && data.length > 0) {
          // Filter and prioritize properties with facade/exterior images
          const processedProperties = data
            .map(prop => {
              // Find the best facade image
              let facadeImage = prop.property_image;
              
              // If property_images exists, look for exterior/general images
              if (prop.property_images && Array.isArray(prop.property_images) && prop.property_images.length > 0) {
                // Prioritize images with 'general' in path and avoid 'interior' images
                const exteriorImages = prop.property_images.filter(img => 
                  img.includes('/general/') && !img.includes('/interior/')
                );
                if (exteriorImages.length > 0) {
                  facadeImage = exteriorImages[0];
                }
              }
              
              // Skip properties where main image is interior
              if (facadeImage && facadeImage.includes('/interior/')) {
                return null;
              }
              
              return {
                ...prop,
                property_image: facadeImage || prop.property_image,
                price: prop.price || formatPrice(200000),
                bedrooms: prop.bedrooms || '1-2',
                bathrooms: prop.bathrooms || '1-2', 
                sizes_m2: prop.sizes_m2 || '60-100'
              };
            })
            .filter(Boolean) // Remove null entries
            .filter(prop => 
              // Additional filter: prioritize properties with facade indicators in URL
              prop.property_image && (
                prop.property_image.includes('/general/') ||
                prop.property_image.includes('apartment-') ||
                prop.property_image.includes('property-')
              )
            );
          
          // If we have fewer than 6 facade properties, fill with the available ones
          if (processedProperties.length < 6) {
            const extendedProperties = [...processedProperties];
            while (extendedProperties.length < 6 && processedProperties.length > 0) {
              extendedProperties.push(...processedProperties.slice(0, Math.min(processedProperties.length, 6 - extendedProperties.length)));
            }
            setProperties(extendedProperties.slice(0, 6));
          } else {
            setProperties(processedProperties.slice(0, 6));
          }
        } else {
          // Only use fallback if no real properties exist
          setProperties(fallbackProperties);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties(fallbackProperties);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [formatPrice]);

  const handlePropertyClick = (property: Property) => {
    // Only navigate to real property IDs (UUIDs), not fallback IDs
    if (property.id.startsWith('fallback-')) {
      navigate('/properties'); // Navigate to properties page for fallback items
    } else {
      navigate(`/property/${property.ref_no || property.id}`);
    }
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-b from-background via-secondary/10 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-muted rounded w-96 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-[400px] bg-muted rounded-3xl"></div>
              <div className="space-y-8">
                <div className="h-[240px] bg-muted rounded-2xl"></div>
                <div className="h-[240px] bg-muted rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const featuredProperty = properties[0];
  const sideProperties = properties.slice(1, 3);
  const regularProperties = properties.slice(3, 6);

  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-br from-background via-secondary/8 to-background overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.02]"></div>
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-primary/15 to-accent/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-l from-accent/12 to-primary/12 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-primary-glow/10 to-accent/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <div className="relative">
          {/* Floating Elements */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-r from-primary/25 to-accent/25 rounded-full blur-3xl animate-pulse"></div>
          
          <motion.div 
            className="text-center mb-24 relative z-10" 
            initial={{ opacity: 0, y: 50 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Enhanced Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }} 
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }} 
              className="mb-10"
            >
              <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary/20 via-accent/15 to-primary/20 text-primary rounded-full text-sm font-bold uppercase tracking-wider border-2 border-primary/30 backdrop-blur-lg shadow-2xl shadow-primary/10">
                <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full mr-3 animate-pulse"></div>
                ✨ Exclusive Properties
                <div className="w-2 h-2 bg-gradient-to-r from-accent to-primary rounded-full ml-3 animate-pulse"></div>
              </div>
            </motion.div>

            {/* Enhanced Main Title */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 1, delay: 0.4 }} 
              className="mb-10"
            >
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-6 tracking-tight">
                <motion.span 
                  className="block text-foreground mb-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  Luxury
                </motion.span>
                <motion.span 
                  className="block bg-gradient-to-r from-primary via-primary-glow via-accent to-primary-glow bg-clip-text text-transparent bg-[length:200%_100%] animate-[gradient_3s_ease-in-out_infinite]"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  Properties
                </motion.span>
              </h2>
              
              {/* Enhanced Decorative Elements */}
              <motion.div 
                className="flex justify-center items-center gap-6 mb-8"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.0, type: "spring" }}
              >
                <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
                <div className="w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
                <div className="w-20 h-0.5 bg-gradient-to-l from-transparent via-accent to-transparent rounded-full"></div>
              </motion.div>
            </motion.div>

            {/* Enhanced Description */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.8, delay: 1.2 }} 
              className="max-w-5xl mx-auto"
            >
              <p className="text-2xl sm:text-3xl text-muted-foreground leading-relaxed mb-8 font-light">
                Discover handpicked 
                <span className="font-semibold text-foreground bg-gradient-to-r from-primary/20 to-accent/20 px-2 py-1 rounded-lg"> luxury properties</span> across 
                <span className="font-semibold text-foreground bg-gradient-to-r from-accent/20 to-primary/20 px-2 py-1 rounded-lg"> Turkey, Dubai, Cyprus</span>, and beyond.
              </p>
              <p className="text-xl text-muted-foreground/80 mb-12">
                Each property represents the pinnacle of architectural excellence and investment opportunity.
              </p>
            </motion.div>

            {/* Enhanced Statistics */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.8, delay: 1.4 }} 
              className="flex flex-wrap justify-center gap-8 mt-16"
            >
              {[
                { number: "160+", label: "Luxury Properties", delay: 0 },
                { number: "15+", label: "Prime Locations", delay: 0.1 },
                { number: "98%", label: "Client Satisfaction", delay: 0.2 }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 1.6 + stat.delay }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group"
                >
                  <div className="bg-card/60 backdrop-blur-xl border-2 border-primary/20 group-hover:border-primary/40 rounded-3xl px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 text-center min-w-[160px]">
                    <div className="text-3xl font-black text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
                      {stat.number}
                    </div>
                    <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Featured Properties Grid */}
        {featuredProperty && (
          <div className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Large Featured Property */}
              <motion.div 
                className="lg:col-span-2 group cursor-pointer" 
                onClick={() => handlePropertyClick(featuredProperty)} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="relative overflow-hidden rounded-3xl bg-card shadow-2xl h-[400px] md:h-[500px]">
                  <img 
                    src={featuredProperty.property_image} 
                    alt={featuredProperty.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute top-6 right-6">
                    <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                      {featuredProperty.price}
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                      {featuredProperty.title}
                    </h3>
                    <div className="flex items-center text-white/90 mb-4">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span className="text-lg">{featuredProperty.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-white/80">
                        {featuredProperty.sizes_m2 && (
                          <div className="flex items-center">
                            <Square className="w-4 h-4 mr-1" />
                            <span className="text-sm">{featuredProperty.sizes_m2} m²</span>
                          </div>
                        )}
                        {featuredProperty.bedrooms && (
                          <div className="flex items-center">
                            <Bed className="w-4 h-4 mr-1" />
                            <span className="text-sm">{featuredProperty.bedrooms} bed</span>
                          </div>
                        )}
                        {featuredProperty.bathrooms && (
                          <div className="flex items-center">
                            <Bath className="w-4 h-4 mr-1" />
                            <span className="text-sm">{featuredProperty.bathrooms} bath</span>
                          </div>
                        )}
                      </div>
                      <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Side Featured Properties */}
              <div className="space-y-8">
                {sideProperties.map((property, index) => (
                  <motion.div 
                    key={property.id} 
                    className="group cursor-pointer" 
                    onClick={() => handlePropertyClick(property)} 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  >
                    <div className="relative overflow-hidden rounded-2xl bg-card shadow-xl h-[240px]">
                      <img 
                        src={property.property_image} 
                        alt={property.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                      <div className="absolute top-4 right-4">
                        <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {property.price}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-primary-glow transition-colors">
                          {property.title}
                        </h4>
                        <div className="flex items-center text-white/80 text-sm mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{property.location}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-white/70">
                          <span>{property.sizes_m2 ? `${property.sizes_m2} m²` : ''}</span>
                          <span>{property.bedrooms} bed • {property.bathrooms} bath</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Regular Properties Grid */}
        {regularProperties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {regularProperties.map((property, index) => (
              <motion.div 
                key={property.id} 
                className="group cursor-pointer" 
                onClick={() => handlePropertyClick(property)} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative overflow-hidden h-56">
                    <img 
                      src={property.property_image} 
                      alt={property.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop';
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                        {property.price}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {property.title}
                    </h4>
                    <div className="flex items-center text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{property.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="font-medium">{property.sizes_m2 ? `${property.sizes_m2} m²` : ''}</span>
                      <span>{property.bedrooms} bed • {property.bathrooms} bath</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <motion.div 
          className="text-center" 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button 
            onClick={() => navigate('/properties')} 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-primary-foreground rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
          >
            Explore All Properties
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(ModernPropertyShowcase);