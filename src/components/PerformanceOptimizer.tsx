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
      {/* DNS Prefetch for actually used external domains */}
      <link rel="dns-prefetch" href="//kiogiyemoqbnuvclneoe.supabase.co" />
      <link rel="dns-prefetch" href="//static.elfsight.com" />
      
      {/* Preconnect to critical Supabase domain */}
      <link rel="preconnect" href="https://kiogiyemoqbnuvclneoe.supabase.co" crossOrigin="anonymous" />
      
      {/* Prefetch next likely pages */}
      {prefetchRoutes.map(route => (
        <link key={route} rel="prefetch" href={route} />
      ))}
      
      {/* Performance hints */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
    </Helmet>
  );
};