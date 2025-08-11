import { useEffect, useCallback } from 'react';

/**
 * Hook for advanced performance optimizations
 */
export const usePerformanceOptimization = () => {
  
  // Optimize images with better compression and formats
  const optimizeImages = useCallback(() => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Add loading="lazy" to images not in viewport
      if (!img.hasAttribute('loading')) {
        const rect = img.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight;
        if (!isInViewport) {
          img.setAttribute('loading', 'lazy');
        }
      }
      
      // Add decoding="async" for better performance
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
    });
  }, []);

  // Preload critical resources
  const preloadCriticalResources = useCallback(() => {
    const criticalResources = [
      { href: '/api/properties/featured', as: 'fetch', type: 'application/json' },
      { href: '/api/locations', as: 'fetch', type: 'application/json' },
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }, []);

  // Initialize service worker for caching
  const initServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator && 'caches' in window) {
      try {
        await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered');
      } catch (error) {
        console.log('Service Worker registration failed');
      }
    }
  }, []);

  // Optimize font loading
  const optimizeFonts = useCallback(() => {
    const fontFace = new FontFace(
      'Inter',
      'url(/fonts/inter-variable.woff2) format("woff2")',
      {
        display: 'swap',
        weight: '400 700'
      }
    );
    
    fontFace.load().then(() => {
      document.fonts.add(fontFace);
    });
  }, []);

  // Implement resource hints
  const addResourceHints = useCallback(() => {
    const hints = [
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//images.unsplash.com' },
      { rel: 'dns-prefetch', href: '//api.elevenlabs.io' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    ];

    hints.forEach(hint => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      if (hint.crossOrigin) link.crossOrigin = hint.crossOrigin;
      document.head.appendChild(link);
    });
  }, []);

  // Clean up unused CSS classes (development only)
  const removeUnusedCSS = useCallback(() => {
    if (import.meta.env.DEV) return;
    
    const unusedClasses = [
      'legacy-style',
      'old-component',
      'deprecated'
    ];
    
    unusedClasses.forEach(className => {
      const elements = document.querySelectorAll(`.${className}`);
      elements.forEach(el => el.classList.remove(className));
    });
  }, []);

  useEffect(() => {
    // Run all optimizations
    optimizeImages();
    preloadCriticalResources();
    initServiceWorker();
    optimizeFonts();
    addResourceHints();
    removeUnusedCSS();

    // Set up intersection observer for lazy loading
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      },
      { rootMargin: '50px 0px' }
    );

    // Observe all images with data-src
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));

    return () => {
      imageObserver.disconnect();
    };
  }, [optimizeImages, preloadCriticalResources, initServiceWorker, optimizeFonts, addResourceHints, removeUnusedCSS]);

  return {
    optimizeImages,
    preloadCriticalResources,
    initServiceWorker,
    optimizeFonts
  };
};