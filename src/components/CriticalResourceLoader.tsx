import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface CriticalResourceLoaderProps {
  criticalImages?: string[];
  criticalFonts?: string[];
  prefetchRoutes?: string[];
  dnsPrefetch?: string[];
  preconnect?: string[];
}

export const CriticalResourceLoader: React.FC<CriticalResourceLoaderProps> = ({
  criticalImages = [],
  criticalFonts = ['/fonts/inter.woff2'],
  prefetchRoutes = ['/antalya', '/dubai', '/cyprus', '/france'],
  dnsPrefetch = [
    '//fonts.googleapis.com',
    '//fonts.gstatic.com',
    '//images.unsplash.com',
    '//api.elevenlabs.io'
  ],
  preconnect = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ]
}) => {
  
  useEffect(() => {
    // Preload critical images with high priority
    criticalImages.slice(0, 3).forEach((src, index) => {
      if (!src || src.includes('placeholder.svg')) return;
      
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.fetchPriority = index === 0 ? 'high' : 'low';
      document.head.appendChild(link);
    });

    // Preload critical fonts
    criticalFonts.forEach(fontUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = fontUrl;
      document.head.appendChild(link);
    });

    // Prefetch likely next pages
    prefetchRoutes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });

  }, [criticalImages, criticalFonts, prefetchRoutes]);

  return (
    <Helmet>
      {/* DNS Prefetch for external domains */}
      {dnsPrefetch.map(domain => (
        <link key={domain} rel="dns-prefetch" href={domain} />
      ))}
      
      {/* Preconnect to critical origins */}
      {preconnect.map(origin => (
        <link key={origin} rel="preconnect" href={origin} crossOrigin="anonymous" />
      ))}
      
      {/* Resource hints for better performance */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      <link rel="preload" href="/placeholder.svg" as="image" />
      
      {/* Critical CSS will be inlined */}
      <style>{`
        /* Critical above-the-fold CSS */
        .hero-section { display: block; }
        .nav-container { display: flex; }
        
        /* Reduce CLS by setting dimensions */
        img[width][height] { aspect-ratio: attr(width) / attr(height); }
        
        /* Font display optimization */
        @font-face {
          font-family: 'Inter';
          font-display: swap;
          src: url('/fonts/inter.woff2') format('woff2');
        }
        
        /* Critical loading states */
        .loading-skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </Helmet>
  );
};

export default CriticalResourceLoader;