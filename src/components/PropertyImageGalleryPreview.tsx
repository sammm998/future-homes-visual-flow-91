import React from 'react';
import { Image, Sparkles, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const PropertyImageGalleryPreview = () => {
  return (
    <section className="relative py-24 bg-gradient-to-br from-background via-secondary/5 to-background overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-accent/8 to-primary/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Modern Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary/15 via-accent/10 to-primary/15 text-primary rounded-full text-sm font-bold uppercase tracking-wider border border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Visual Gallery
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
              <span className="block text-foreground mb-2">Discover</span>
              <span className="block bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                Our Properties
              </span>
            </h2>
            
            {/* Decorative Elements */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-primary rounded-full"></div>
              <Star className="w-6 h-6 text-primary" />
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-primary rounded-full"></div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-4xl mx-auto mb-10"
          >
            <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed mb-4">
              Explore stunning visuals from our 
              <span className="font-semibold text-foreground"> exclusive property portfolio</span> across 
              <span className="font-semibold text-foreground"> multiple locations</span>.
            </p>
            <p className="text-lg text-muted-foreground/80">
              Each image tells a story of luxury, comfort, and exceptional design.
            </p>
          </motion.div>
        </motion.div>
        
        {/* Enhanced Gallery Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <div className="relative">
            {/* Glass Container */}
            <div className="relative bg-card/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
              
              {/* Gallery Preview Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
                  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop", 
                  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
                  "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop",
                  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
                  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
                  "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=400&h=300&fit=crop",
                  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop"
                ].map((src, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
                  >
                    <img 
                      src={src}
                      alt={`Property ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Image Counter */}
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {index + 1}/117
                    </div>
                    
                    {/* Hover Effect */}
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
                        <div className="text-xs font-semibold text-gray-800">Premium Property</div>
                        <div className="text-xs text-gray-600">Turkey • Dubai • Cyprus</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Gallery Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.8 }}
                className="flex flex-wrap justify-center gap-6 text-center"
              >
                <div className="bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-2xl px-4 py-3">
                  <div className="text-lg font-bold text-primary">117+</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Images</div>
                </div>
                <div className="bg-accent/10 backdrop-blur-sm border border-accent/20 rounded-2xl px-4 py-3">
                  <div className="text-lg font-bold text-foreground">6</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Properties</div>
                </div>
                <div className="bg-primary-glow/10 backdrop-blur-sm border border-primary-glow/20 rounded-2xl px-4 py-3">
                  <div className="text-lg font-bold text-primary-glow">4K</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">HD Quality</div>
                </div>
              </motion.div>
            </div>
            
            {/* Enhanced Floating Elements */}
            <motion.div 
              className="absolute -top-8 -right-8 bg-gradient-to-r from-primary via-primary-glow to-accent p-6 rounded-3xl shadow-2xl"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Image className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-8 -left-8 bg-gradient-to-r from-accent via-primary-glow to-primary p-5 rounded-2xl shadow-2xl"
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -3, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            
            {/* Interactive Gallery Indicator */}
            <motion.div
              className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-2 text-white font-semibold text-sm"
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🎯 Interactive Gallery Preview
            </motion.div>
          </div>
        </motion.div>
        
      </div>
    </section>
  );
};

export default PropertyImageGalleryPreview;