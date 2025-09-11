import React from 'react';
import { Helmet } from 'react-helmet-async';
import ModernGallery from '@/components/ModernGallery';

const ImageGallery = () => {
  return (
    <>
      <Helmet>
        <title>Property Gallery - Future Homes Turkey</title>
        <meta name="description" content="Explore our comprehensive collection of premium properties from Turkey's most desirable locations including Antalya, Dubai, Cyprus, Mersin, and Bali." />
        <meta name="keywords" content="property gallery, Turkey real estate, Antalya properties, Dubai homes, Cyprus villas, premium properties" />
        <link rel="canonical" href="/gallery" />
      </Helmet>

      <ModernGallery />
    </>
  );
};

export default ImageGallery;