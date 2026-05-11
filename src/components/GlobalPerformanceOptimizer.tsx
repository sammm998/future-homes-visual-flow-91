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

    // Only optimize images near viewport, not all images
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.style.transition = 'opacity 0.3s ease-in-out';
          observer.unobserve(img);
        }
      });
    }, {
      threshold: 0,
      rootMargin: '100px'
    });

    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => observer.observe(img));

    return () => observer.disconnect();
  }, [enableImageOptimization]);

  return (
    <Helmet>
      {/* DNS Prefetch for external domains */}
      {enableResourceHints && (
        <>
          <link rel="dns-prefetch" href="//kiogiyemoqbnuvclneoe.supabase.co" />
          
          {/* Preload critical images - max 2 to avoid network saturation */}
          {criticalImages.slice(0, 2).map((src, index) => (
            <link
              key={index}
              rel="preload"
              as="image"
              href={src}
              fetchPriority={index === 0 ? 'high' : 'auto'}
            />
          ))}
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