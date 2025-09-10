import React from 'react';
import { Helmet } from 'react-helmet-async';
import PropertyImageGallery from '@/components/PropertyImageGallery';
import PropertyImageStats from '@/components/PropertyImageStats';
import { motion } from 'framer-motion';

const ImageGallery = () => {
  return (
    <>
      <Helmet>
        <title>Property Image Gallery - Future Homes Turkey</title>
        <meta name="description" content="Explore our comprehensive collection of property images from Turkey's most desirable locations including Antalya, Dubai, Cyprus, Mersin, and Bali." />
        <meta name="keywords" content="property images, Turkey real estate, Antalya properties, Dubai homes, Cyprus villas, property gallery" />
        <link rel="canonical" href="/gallery" />
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Complete Property
                <span className="text-transparent bg-clip-text bg-gradient-primary block">
                  Image Gallery
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Discover thousands of high-quality property images from our premium real estate collection across Turkey, Dubai, Cyprus, and beyond.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Statistics Section */}
        <PropertyImageStats />

        {/* Main Gallery */}
        <PropertyImageGallery />
      </main>
    </>
  );
};

export default ImageGallery;