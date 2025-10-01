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

    // Only optimize above-the-fold images
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      // First 3 images load eagerly (above the fold)
      if (index < 3) {
        img.setAttribute('fetchpriority', 'high');
        img.setAttribute('loading', 'eager');
      } else {
        // Rest lazy load
        img.setAttribute('loading', 'lazy');
      }
    });
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