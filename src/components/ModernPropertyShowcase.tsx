import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ModernPropertyShowcase = () => {
  const navigate = useNavigate();

  const propertyImages = [
    "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4636/general/apartment-321429.webp",
    "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3184/general/property-antalya-kemer-general-3184-0.webp", 
    "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4563/general/apartment-320190.webp",
    "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3128/general/property-antalya-aksu-general-3128-0.webp",
    "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3202/general/property-antalya-aksu-general-3202-0.webp",
    "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4630/general/apartment-321354.webp",
    "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4566/general/apartment-320512.webp",
    "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4567/general/apartment-320513.webp",
    "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4568/general/apartment-320514.webp",
    "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4569/general/apartment-320515.webp",
    "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4570/general/apartment-320516.webp",
    "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4571/general/apartment-320517.webp"
  ];

  const locations = [
    { name: "ANTALYA", top: "15%", left: "12%" },
    { name: "DUBAI", top: "45%", left: "85%" },
    { name: "CYPRUS", top: "75%", left: "15%" },
    { name: "MERSIN", top: "25%", left: "70%" }
  ];

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Premium Properties Tag */}
            <div>
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
                Premium Properties
              </span>
              
              {/* Main Heading */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Discover your{" "}
                <span className="block mt-2">
                  <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                    dream home
                  </span>{" "}
                  from
                </span>
                <span className="block mt-2">
                  our exclusive
                </span>
                <span className="block mt-2">
                  collection
                </span>
              </h2>
            </div>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
              Explore our handpicked selection of luxury properties across 
              Turkey, Dubai, Cyprus, and France. Each property offers unique 
              features and exceptional value for your investment.
            </p>
            
            {/* CTA Button */}
            <motion.button
              onClick={() => navigate('/properties')}
              className="inline-block px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Properties
            </motion.button>
          </motion.div>

          {/* Right Content - Property Images Grid */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Property Images Masonry Grid */}
            <div className="grid grid-cols-4 gap-3 h-[600px] overflow-hidden rounded-2xl">
              {/* Column 1 */}
              <div className="flex flex-col gap-3">
                <div className="h-[180px] rounded-lg overflow-hidden">
                  <img 
                    src={propertyImages[0]} 
                    alt="Luxury Property"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="h-[140px] rounded-lg overflow-hidden">
                  <img 
                    src={propertyImages[1]} 
                    alt="Luxury Property"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="h-[160px] rounded-lg overflow-hidden">
                  <img 
                    src={propertyImages[2]} 
                    alt="Luxury Property"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Column 2 */}
              <div className="flex flex-col gap-3">
                <div className="h-[160px] rounded-lg overflow-hidden">
                  <img 
                    src={propertyImages[3]} 
                    alt="Luxury Property"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="h-[200px] rounded-lg overflow-hidden">
                  <img 
                    src={propertyImages[4]} 
                    alt="Luxury Property"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="h-[120px] rounded-lg overflow-hidden">
                  <img 
                    src={propertyImages[5]} 
                    alt="Luxury Property"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Column 3 */}
              <div className="flex flex-col gap-3">
                <div className="h-[140px] rounded-lg overflow-hidden">
                  <img 
                    src={propertyImages[6]} 
                    alt="Luxury Property"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="h-[180px] rounded-lg overflow-hidden">
                  <img 
                    src={propertyImages[7]} 
                    alt="Luxury Property"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="h-[160px] rounded-lg overflow-hidden">
                  <img 
                    src={propertyImages[8]} 
                    alt="Luxury Property"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Column 4 */}
              <div className="flex flex-col gap-3">
                <div className="h-[200px] rounded-lg overflow-hidden">
                  <img 
                    src={propertyImages[9]} 
                    alt="Luxury Property"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="h-[160px] rounded-lg overflow-hidden">
                  <img 
                    src={propertyImages[10]} 
                    alt="Luxury Property"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="h-[120px] rounded-lg overflow-hidden">
                  <img 
                    src={propertyImages[11]} 
                    alt="Luxury Property"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Location Labels */}
            {locations.map((location, index) => (
              <motion.div
                key={location.name}
                className="absolute bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20"
                style={{ top: location.top, left: location.left }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <span className="text-sm font-semibold text-foreground tracking-wider">
                  {location.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(ModernPropertyShowcase);