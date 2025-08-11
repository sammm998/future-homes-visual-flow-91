import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface PerformanceOptimizerProps {
  preloadImages?: string[];
  prefetchRoutes?: string[];
}

export const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  preloadImages = [],
  prefetchRoutes = []
}) => {
  
  useEffect(() => {
    // Lazy load images that are not in viewport
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });

    images.forEach(img => imageObserver.observe(img));

    return () => imageObserver.disconnect();
  }, []);

  useEffect(() => {
    // Preload critical images
    preloadImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }, [preloadImages]);

  useEffect(() => {
    // Enable resource hints for faster loading
    const enableResourceHints = () => {
      // Critical CSS preload
      const criticalFonts = [
        '/fonts/inter-400.woff2',
        '/fonts/inter-500.woff2',
        '/fonts/inter-600.woff2',
      ];
      
      criticalFonts.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        link.href = font;
        document.head.appendChild(link);
      });
    };

    enableResourceHints();
  }, []);

  return (
    <Helmet>
      {/* DNS Prefetch for external domains */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//images.unsplash.com" />
      <link rel="dns-prefetch" href="//api.elevenlabs.io" />
      
      {/* Preconnect to critical resources */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Critical CSS inlining hint */}
      <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      
      {/* Prefetch next likely pages */}
      {prefetchRoutes.map(route => (
        <link key={route} rel="prefetch" href={route} />
      ))}
      
      {/* Performance hints */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      
      {/* Critical resource hints */}
      <link rel="preload" href="/placeholder.svg" as="image" />
    </Helmet>
  );
};