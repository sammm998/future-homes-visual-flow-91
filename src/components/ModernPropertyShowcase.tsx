import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '@/contexts/CurrencyContext';
import { ArrowRight, MapPin, Bed, Bath, Square } from 'lucide-react';
const ModernPropertyShowcase = () => {
  const navigate = useNavigate();
  const {
    formatPrice
  } = useCurrency();
  const featuredProperties = [{
    id: 4636,
    title: "Luxury Marina Apartments",
    location: "Dubai, Marina",
    price: formatPrice(1110000),
    image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4636/general/apartment-321429.webp",
    area: "78-1,505 m²",
    bedrooms: "1-6",
    bathrooms: "2-7",
    featured: true
  }, {
    id: 3184,
    title: "Twin Villas Launch Price",
    location: "Antalya, Kemer",
    price: formatPrice(350000),
    image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3184/general/property-antalya-kemer-general-3184-0.webp",
    area: "115 m²",
    bedrooms: 3,
    bathrooms: 2
  }, {
    id: 4563,
    title: "Magnificent Complex",
    location: "Dubai, JVC",
    price: formatPrice(313000),
    image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4563/general/apartment-320190.webp",
    area: "70-112 m²",
    bedrooms: "1-2",
    bathrooms: "1-2"
  }];
  const regularProperties = [{
    id: 3128,
    title: "Investment Apartments",
    location: "Antalya, Aksu",
    price: formatPrice(135000),
    image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3128/general/property-antalya-aksu-general-3128-0.webp",
    area: "75-104 m²",
    bedrooms: "1-2",
    bathrooms: "1-2"
  }, {
    id: 3202,
    title: "Modern Design Apartments",
    location: "Antalya, Aksu",
    price: formatPrice(147000),
    image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3202/general/property-antalya-aksu-general-3202-0.webp",
    area: "60-100 m²",
    bedrooms: "1-2",
    bathrooms: "1-2"
  }, {
    id: 4630,
    title: "Ready Luxury Apartment",
    location: "Antalya, Altintas",
    price: formatPrice(110000),
    image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4630/general/apartment-321354.webp",
    area: "72 m²",
    bedrooms: 1,
    bathrooms: 1
  }];
  const handlePropertyClick = (property: any) => {
    navigate(`/property/${property.id}`);
  };
  return <section className="py-16 md:py-24 bg-gradient-to-b from-background via-secondary/10 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="relative">
          {/* Background Elements */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl"></div>
          
          <motion.div className="text-center mb-20 relative z-10" initial={{
          opacity: 0,
          y: 40
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.8,
          ease: "easeOut"
        }}>
            {/* Badge */}
            <motion.div initial={{
            opacity: 0,
            scale: 0.8
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6,
            delay: 0.2
          }} className="mb-8">
              <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary/15 to-accent/15 text-primary rounded-full text-sm font-bold uppercase tracking-wider border border-primary/20 backdrop-blur-sm">
                ✨ Premium Properties
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.8,
            delay: 0.4
          }} className="mb-8">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4">
                <span className="block text-foreground mb-2">Discover Your</span>
                <span className="block bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                  Dream Home
                </span>
              </h2>
              
              {/* Decorative line */}
              <div className="mx-auto w-24 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </motion.div>

            {/* Description */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.8,
            delay: 0.6
          }} className="max-w-4xl mx-auto">
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed mb-6">
                Explore our handpicked selection of 
                <span className="font-semibold text-foreground"> luxury properties</span> across 
                <span className="font-semibold text-foreground"> Turkey, Dubai, Cyprus, and France</span>.
              </p>
              <p className="text-lg text-muted-foreground/80">
                Each property offers unique features and exceptional value for your investment.
              </p>
            </motion.div>

            {/* Statistics or highlights */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.8,
            delay: 0.8
          }} className="flex flex-wrap justify-center gap-8 mt-12 text-center">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl px-6 py-4">
                <div className="text-2xl font-bold text-primary">100+</div>
                <div className="text-sm text-muted-foreground">Premium Properties</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl px-6 py-4">
                <div className="text-2xl font-bold text-primary">15+</div>
                <div className="text-sm text-muted-foreground">Prime Locations</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl px-6 py-4">
                <div className="text-2xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Client Satisfaction</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Featured Properties Grid */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Large Featured Property */}
            <motion.div className="lg:col-span-2 group cursor-pointer" onClick={() => handlePropertyClick(featuredProperties[0])} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6,
            delay: 0.1
          }}>
              <div className="relative overflow-hidden rounded-3xl bg-card shadow-2xl h-[400px] md:h-[500px]">
                <img src={featuredProperties[0].image} alt={featuredProperties[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute top-6 right-6">
                  <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                    {featuredProperties[0].price}
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {featuredProperties[0].title}
                  </h3>
                  <div className="flex items-center text-white/90 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span className="text-lg">{featuredProperties[0].location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-white/80">
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-1" />
                        <span className="text-sm">{featuredProperties[0].area}</span>
                      </div>
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        <span className="text-sm">{featuredProperties[0].bedrooms} bed</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        <span className="text-sm">{featuredProperties[0].bathrooms} bath</span>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Side Featured Properties */}
            <div className="space-y-8">
              {featuredProperties.slice(1).map((property, index) => <motion.div key={property.id} className="group cursor-pointer" onClick={() => handlePropertyClick(property)} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.6,
              delay: 0.2 + index * 0.1
            }}>
                  <div className="relative overflow-hidden rounded-2xl bg-card shadow-xl h-[240px]">
                    <img src={property.image} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                        <span>{property.area}</span>
                        <span>{property.bedrooms} bed • {property.bathrooms} bath</span>
                      </div>
                    </div>
                  </div>
                </motion.div>)}
            </div>
          </div>
        </div>

        {/* Regular Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {regularProperties.map((property, index) => <motion.div key={property.id} className="group cursor-pointer" onClick={() => handlePropertyClick(property)} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: index * 0.1
        }}>
              <div className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative overflow-hidden h-56">
                  <img src={property.image} alt={property.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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
                    <span className="font-medium">{property.area}</span>
                    <span>{property.bedrooms} bed • {property.bathrooms} bath</span>
                  </div>
                </div>
              </div>
            </motion.div>)}
        </div>

        {/* CTA Button */}
        <motion.div className="text-center" initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6,
        delay: 0.2
      }}>
          <button onClick={() => navigate('/properties')} className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-primary-foreground rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
            Explore All Properties
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>
    </section>;
};
export default memo(ModernPropertyShowcase);