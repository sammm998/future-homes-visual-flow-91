import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface GlobalPerformanceOptimizerProps {
  criticalImages?: string[];
  enableImageOptimization?: boolean;
  enableResourceHints?: boolean;
}

export const GlobalPerformanceOptimizer: React.FC<GlobalPerformanceOptimizerProps> = ({
  criticalImages = [],
  enableImageOptimization = true,
  enableResourceHints = true
}) => {
  useEffect(() => {
    if (!enableImageOptimization) return;

    // Set high priority for all images to load immediately
    const allImages = document.querySelectorAll('img');
    allImages.forEach((img) => {
      img.setAttribute('fetchpriority', 'high');
      img.setAttribute('loading', 'eager');
      // Add fade-in effect
      img.style.transition = 'opacity 0.3s ease-in-out';
    });
    
    // Preload images that are still loading
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (!img.complete) {
            // Force immediate loading
            const newImg = new Image();
            newImg.onload = () => {
              img.src = newImg.src;
            };
            newImg.src = img.src;
          }
          observer.unobserve(img);
        }
      });
    }, {
      threshold: 0,
      rootMargin: '200px' // Start loading 200px before visible
    });

    allImages.forEach(img => observer.observe(img));

    return () => observer.disconnect();
  }, [enableImageOptimization]);

  return (
    <Helmet>
      {/* DNS Prefetch for external domains */}
      {enableResourceHints && (
        <>
          <link rel="dns-prefetch" href="//cdn.futurehomesturkey.com" />
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <link rel="dns-prefetch" href="//fonts.gstatic.com" />
          
          {/* Preconnect to critical domains */}
          <link rel="preconnect" href="https://cdn.futurehomesturkey.com" crossOrigin="anonymous" />
          
          {/* Preload critical images */}
          {criticalImages.slice(0, 3).map((src, index) => (
            <link
              key={index}
              rel="preload"
              as="image"
              href={src}
              fetchPriority={index === 0 ? 'high' : 'auto'}
            />
          ))}
          
          {/* Critical CSS preload */}
          <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        </>
      )}
      
      {/* Performance optimization meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      
      {/* Reduce layout shift with proper image sizing */}
      <style>{`
        img {
          height: auto;
          max-width: 100%;
        }
        
        /* Reduce paint times */
        * {
          will-change: auto;
        }
        
        /* Optimize repaints */
        .property-card img {
          transform: translateZ(0);
        }
        
        /* Optimize animations */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </Helmet>
  );
};

export default GlobalPerformanceOptimizer;