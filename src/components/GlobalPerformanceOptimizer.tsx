import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { preloadImage } from '@/utils/performanceMonitor';

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

    // Enhanced lazy loading with fade-in effect
    const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          
          // Handle data-src lazy loading
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('fade-in');
          }
          
          // Prioritize above-the-fold images for immediate fetch
          if (entry.boundingClientRect.top < window.innerHeight) {
            img.setAttribute('fetchpriority', 'high');
          }
          
          imageObserver.unobserve(img);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    images.forEach(img => imageObserver.observe(img));

    // Preload critical images
    criticalImages.forEach(src => {
      preloadImage(src).catch(console.warn);
    });

    return () => imageObserver.disconnect();
  }, [criticalImages, enableImageOptimization]);

  return (
    <Helmet>
      {enableResourceHints && (
        <>
          {/* DNS Prefetch for external domains */}
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <link rel="dns-prefetch" href="//images.unsplash.com" />
          <link rel="dns-prefetch" href="//kiogiyemoqbnuvclneoe.supabase.co" />
          <link rel="dns-prefetch" href="//lovable-uploads" />
          
          {/* Preconnect to critical resources */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://kiogiyemoqbnuvclneoe.supabase.co" />
          
          {/* Critical resource preloading */}
          <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
          <link rel="preload" href="/lovable-uploads/5506feef-2c81-4501-9f9d-5711a9dd3cce.png" as="image" />
          <link rel="preload" href="/lovable-uploads/4c6b5b9c-7b79-4474-b629-9e61e450f00b.png" as="image" />
          
          {/* Performance hints */}
          <meta httpEquiv="x-dns-prefetch-control" content="on" />
          
          {/* Critical CSS inlined to prevent FOUC */}
          <style>{`
            .fade-in { 
              animation: fadeIn 0.5s ease-in-out; 
            }
            @keyframes fadeIn { 
              from { opacity: 0; } 
              to { opacity: 1; } 
            }
            
            /* Optimize rendering performance */
            img { 
              content-visibility: auto;
              contain-intrinsic-size: 400px 300px;
            }
            
            /* Reduce layout shift */
            .property-card-skeleton {
              background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
              background-size: 200% 100%;
              animation: loading 1.5s infinite;
            }
            
            @keyframes loading {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
            
            /* Optimize paint performance */
            .hover-transform {
              will-change: transform;
              transform: translateZ(0);
            }
            
            /* Reduce repaints */
            .gpu-accelerated {
              transform: translate3d(0, 0, 0);
              backface-visibility: hidden;
            }
            
            /* Optimize animations for reduced motion */
            @media (prefers-reduced-motion: reduce) {
              *, ::before, ::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
              }
            }
          `}</style>
        </>
      )}
    </Helmet>
  );
};