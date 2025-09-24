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
    // Enhanced lazy loading with fade-in effect
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease-in-out';
            img.src = img.dataset.src;
            img.onload = () => {
              img.style.opacity = '1';
              img.removeAttribute('data-src');
            };
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px',
      threshold: 0.1
    });

    images.forEach(img => imageObserver.observe(img));

    // Prioritize above-the-fold images
    const aboveFoldImages = document.querySelectorAll('img');
    aboveFoldImages.forEach((img, index) => {
      if (index < 3 && img.getBoundingClientRect().top < window.innerHeight) {
        img.setAttribute('fetchpriority', 'high');
      }
    });

    return () => imageObserver.disconnect();
  }, []);

  useEffect(() => {
    // Enhanced image preloading with WebP support
    preloadImages.forEach((src, index) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      if (index === 0) {
        link.setAttribute('fetchpriority', 'high');
      }
      // Try WebP format first
      if (src.includes('.jpg') || src.includes('.png')) {
        link.href = src.replace(/\.(jpg|png)/, '.webp');
      }
      document.head.appendChild(link);
    });

    // Prefetch next routes during idle time
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        prefetchRoutes.forEach(route => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = route;
          document.head.appendChild(link);
        });
      });
    }
  }, [preloadImages, prefetchRoutes]);

  return (
    <Helmet>
      {/* Enhanced DNS Prefetch for external domains */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//images.unsplash.com" />
      <link rel="dns-prefetch" href="//api.elevenlabs.io" />
      <link rel="dns-prefetch" href="//kiogiyemoqbnuvclneoe.supabase.co" />
      <link rel="dns-prefetch" href="//unpkg.com" />
      
      {/* Preconnect to critical resources */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://kiogiyemoqbnuvclneoe.supabase.co" />
      
      {/* Critical font preloading with font-display optimization */}
      <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" as="style" />
      
      {/* Prefetch next likely pages */}
      {prefetchRoutes.map(route => (
        <link key={route} rel="prefetch" href={route} />
      ))}
      
      {/* Enhanced performance hints */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Critical resource hints */}
      <link rel="preload" href="/placeholder.svg" as="image" />
      
      {/* Service Worker registration hint */}
      <link rel="prefetch" href="/sw.js" />
    </Helmet>
  );
};