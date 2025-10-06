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
    });

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

  return (
    <Helmet>
      {/* DNS Prefetch for external domains */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//images.unsplash.com" />
      <link rel="dns-prefetch" href="//kiogiyemoqbnuvclneoe.supabase.co" />
      
      {/* Preconnect to critical resources */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://kiogiyemoqbnuvclneoe.supabase.co" />
      
      {/* Critical CSS and fonts preload */}
      <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      
      {/* Prefetch next likely pages */}
      {prefetchRoutes.map(route => (
        <link key={route} rel="prefetch" href={route} />
      ))}
      
      {/* Preload critical images */}
      {preloadImages.slice(0, 3).map(src => (
        <link key={src} rel="preload" href={src} as="image" />
      ))}
      
      {/* Performance hints */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      
      {/* Critical resource hints */}
      <link rel="preload" href="/placeholder.svg" as="image" />
      
      {/* Enable HTTP/3 hint */}
      <meta httpEquiv="Accept-CH" content="DPR, Viewport-Width, Width" />
    </Helmet>
  );
};