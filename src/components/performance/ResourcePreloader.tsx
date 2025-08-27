import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface ResourcePreloaderProps {
  criticalImages?: string[];
  criticalFonts?: string[];
  prefetchRoutes?: string[];
  enableServiceWorker?: boolean;
}

export const ResourcePreloader: React.FC<ResourcePreloaderProps> = ({
  criticalImages = [],
  criticalFonts = [],
  prefetchRoutes = [],
  enableServiceWorker = true,
}) => {
  
  useEffect(() => {
    // Preload critical images with high priority
    criticalImages.forEach((src, index) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.fetchPriority = index === 0 ? 'high' : 'auto';
      document.head.appendChild(link);
    });

    // Preload critical fonts
    criticalFonts.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.href = src;
      link.crossOrigin = 'anonymous';
      link.type = 'font/woff2';
      document.head.appendChild(link);
    });

    // Service Worker registration
    if (enableServiceWorker && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, [criticalImages, criticalFonts, enableServiceWorker]);

  return (
    <Helmet>
      {/* DNS Prefetch for external domains */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//api.elevenlabs.io" />
      <link rel="dns-prefetch" href="//kiogiyemoqbnuvclneoe.supabase.co" />
      
      {/* Preconnect to critical resources */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://kiogiyemoqbnuvclneoe.supabase.co" />
      
      {/* Critical CSS inline hint */}
      <style>{`
        /* Critical above-the-fold styles */
        body { margin: 0; font-family: Inter, system-ui, sans-serif; }
        .loading-skeleton { 
          background: linear-gradient(90deg, hsl(var(--muted)) 25%, hsl(var(--muted)/0.5) 50%, hsl(var(--muted)) 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        /* Preload font display */
        @font-face {
          font-family: 'Inter';
          font-display: swap;
        }
      `}</style>
      
      {/* Prefetch next likely pages */}
      {prefetchRoutes.map(route => (
        <link key={route} rel="prefetch" href={route} />
      ))}
      
      {/* Performance hints */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      
      {/* Viewport optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    </Helmet>
  );
};