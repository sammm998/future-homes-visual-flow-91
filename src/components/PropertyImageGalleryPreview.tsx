import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Image, Sparkles, Eye, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import PropertyImageGallery from './PropertyImageGallery';

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
              <span className="block text-foreground mb-2">Immersive</span>
              <span className="block bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                Property Gallery
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
              Discover stunning visuals from our 
              <span className="font-semibold text-foreground"> premium property collection</span> across 
              <span className="font-semibold text-foreground"> multiple locations</span>.
            </p>
            <p className="text-lg text-muted-foreground/80 mb-8">
              Each image tells a story of luxury, comfort, and exceptional design.
            </p>
            
            {/* Interactive CTA Button */}
            <Link to="/gallery">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Button className="group relative bg-gradient-to-r from-primary via-primary-glow to-accent hover:from-primary/90 hover:via-primary-glow/90 hover:to-accent/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-2xl shadow-2xl shadow-primary/25 border-0 overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <Eye className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Explore Full Gallery
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </motion.div>
            </Link>
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
            <div className="relative bg-card/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <PropertyImageGallery limit={8} showFilters={false} />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 bg-gradient-to-r from-primary to-accent p-4 rounded-2xl shadow-lg">
              <Image className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-accent to-primary p-3 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
        
        {/* Bottom CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Link to="/gallery">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Button 
                variant="outline" 
                size="lg" 
                className="group bg-card/50 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 hover:bg-card/70 text-foreground hover:text-primary px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:from-primary-glow group-hover:to-accent font-bold">
                  Discover All Properties & Images
                </span>
                <ArrowRight className="w-5 h-5 ml-3 text-primary group-hover:translate-x-1 group-hover:text-accent transition-all duration-300" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PropertyImageGalleryPreview;