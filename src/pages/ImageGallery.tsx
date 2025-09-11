import React from 'react';
import { Helmet } from 'react-helmet-async';
import NetflixStyleGallery from '@/components/NetflixStyleGallery';

const ImageGallery = () => {
  return (
    <>
      <Helmet>
        <title>Property Gallery - 3D Circular View | Future Homes Turkey</title>
        <meta name="description" content="Experience our premium properties in an innovative 3D circular gallery. Scroll to explore luxury homes from Turkey's most desirable locations including Antalya, Dubai, Cyprus, Mersin, and Bali." />
        <meta name="keywords" content="3D property gallery, circular gallery, Turkey real estate, Antalya properties, Dubai homes, Cyprus villas, premium properties, interactive gallery" />
        <link rel="canonical" href="/gallery" />
      </Helmet>

      <NetflixStyleGallery />
    </>
  );
};

export default ImageGallery;