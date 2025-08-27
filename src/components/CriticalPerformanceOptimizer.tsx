import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface CriticalPerformanceOptimizerProps {
  criticalImages?: string[];
  enableAdvancedOptimizations?: boolean;
}

export const CriticalPerformanceOptimizer: React.FC<CriticalPerformanceOptimizerProps> = ({
  criticalImages = [
    '/assets/ai-avatar-D7A-cWee.jpg',
    '/hero-bg.webp',
    '/antalya-hero.webp'
  ],
  enableAdvancedOptimizations = true
}) => {
  
  useEffect(() => {
    if (!enableAdvancedOptimizations) return;

    // Implement advanced performance optimizations
    const optimizePerformance = () => {
      // 1. Optimize image loading priority
      const images = document.querySelectorAll('img');
      images.forEach((img, index) => {
        if (index < 3) {
          img.setAttribute('fetchpriority', 'high');
          img.setAttribute('loading', 'eager');
        } else {
          img.setAttribute('loading', 'lazy');
        }
      });

      // 2. Preload next likely navigation targets
      const currentPath = window.location.pathname;
      let nextRoutes: string[] = [];
      
      if (currentPath === '/') {
        nextRoutes = ['/property-wizard', '/antalya', '/dubai'];
      } else if (currentPath === '/property-wizard') {
        nextRoutes = ['/ai-property-search', '/antalya'];
      }

      nextRoutes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });

      // 3. Optimize font loading
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.as = 'font';
      fontLink.type = 'font/woff2';
      fontLink.href = '/fonts/inter.woff2';
      fontLink.crossOrigin = 'anonymous';
      document.head.appendChild(fontLink);

      // 4. Implement resource hints
      const hints = [
        { rel: 'dns-prefetch', href: '//kiogiyemoqbnuvclneoe.supabase.co' },
        { rel: 'dns-prefetch', href: '//cdn.futurehomesturkey.com' },
        { rel: 'preconnect', href: 'https://static.elfsight.com', crossOrigin: true },
        { rel: 'preconnect', href: 'https://universe-static.elfsightcdn.com', crossOrigin: true }
      ];

      hints.forEach(hint => {
        const existingLink = document.querySelector(`link[href="${hint.href}"]`);
        if (!existingLink) {
          const link = document.createElement('link');
          link.rel = hint.rel;
          link.href = hint.href;
          if (hint.crossOrigin) link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        }
      });

      // 5. Optimize CSS delivery
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
      stylesheets.forEach((stylesheet, index) => {
        if (index > 0) { // Keep first stylesheet as blocking
          stylesheet.setAttribute('media', 'print');
          stylesheet.addEventListener('load', () => {
            stylesheet.setAttribute('media', 'all');
          });
        }
      });

      // 6. Implement intersection observer for below-fold content
      if ('IntersectionObserver' in window) {
        const lazyElements = document.querySelectorAll('[data-lazy]');
        const lazyObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const element = entry.target;
              element.classList.add('animate-fade-in');
              lazyObserver.unobserve(element);
            }
          });
        }, { rootMargin: '50px' });

        lazyElements.forEach(element => lazyObserver.observe(element));
      }
    };

    // Run optimizations
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', optimizePerformance);
    } else {
      optimizePerformance();
    }

    // Cleanup function
    return () => {
      document.removeEventListener('DOMContentLoaded', optimizePerformance);
    };
  }, [enableAdvancedOptimizations]);

  return (
    <Helmet>
      {/* Critical resource preloads */}
      {criticalImages.map((src, index) => (
        <link
          key={src}
          rel="preload"
          as="image"
          href={src}
          fetchPriority={index === 0 ? "high" : "low"}
        />
      ))}
      
      {/* Advanced performance meta tags */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Cache control headers */}
      <meta httpEquiv="cache-control" content="public, max-age=31536000, immutable" />
      
      {/* Critical CSS improvements */}
      <style type="text/css">{`
        /* Eliminate render-blocking CSS */
        @media print {
          * { display: none !important; }
        }
        
        /* Optimize font loading */
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 400 700;
          font-display: swap;
          src: url('/fonts/inter.woff2') format('woff2');
        }
        
        /* Reduce layout shift */
        img { 
          height: auto; 
          max-width: 100%;
        }
        
        /* Optimize animations for performance */
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Optimize scrolling */
        * {
          scroll-behavior: smooth;
        }
        
        /* Reduce paint complexity */
        .optimize-paint {
          will-change: transform;
          transform: translateZ(0);
        }
        
        /* Critical above-the-fold optimization */
        .hero-section {
          contain: layout style paint;
        }
        
        /* Skeleton loading states */
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        /* Reduce CLS for images */
        .img-container {
          position: relative;
          overflow: hidden;
        }
        
        .img-container::before {
          content: '';
          display: block;
          width: 100%;
          padding-top: 56.25%; /* 16:9 aspect ratio */
        }
        
        .img-container img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>
    </Helmet>
  );
};

export default CriticalPerformanceOptimizer;