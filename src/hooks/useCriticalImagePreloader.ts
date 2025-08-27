import { useEffect } from 'react';

interface CriticalImagePreloaderOptions {
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
  crossOrigin?: 'anonymous' | 'use-credentials';
}

export const useCriticalImagePreloader = (
  images: string[], 
  options: CriticalImagePreloaderOptions = {}
) => {
  const { priority = true, fetchPriority = 'high', crossOrigin = 'anonymous' } = options;

  useEffect(() => {
    if (!images.length) return;

    const preloadPromises = images.map((src, index) => {
      return new Promise<void>((resolve, reject) => {
        // Skip if already preloaded
        const existingLink = document.querySelector(`link[href="${src}"]`);
        if (existingLink) {
          resolve();
          return;
        }

        // For the first critical image, use link preload
        if (index === 0 && priority) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = src;
          link.fetchPriority = fetchPriority;
          if (crossOrigin) link.crossOrigin = crossOrigin;
          
          link.onload = () => resolve();
          link.onerror = () => reject(new Error(`Failed to preload ${src}`));
          
          document.head.appendChild(link);
        } else {
          // For other images, use Image constructor
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to preload ${src}`));
          img.src = src;
        }
      });
    });

    // Wait for all critical images to load
    Promise.allSettled(preloadPromises).then((results) => {
      const failed = results.filter(result => result.status === 'rejected');
      if (failed.length > 0) {
        console.warn(`Failed to preload ${failed.length} critical images`);
      }
    });

    // Cleanup function
    return () => {
      // Remove preload links that are no longer needed
      images.forEach(src => {
        const link = document.querySelector(`link[href="${src}"][rel="preload"]`);
        if (link && link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, [images, priority, fetchPriority, crossOrigin]);
};

// Hook for preloading next navigation targets
export const useRoutePreloader = (currentRoute: string) => {
  useEffect(() => {
    const routeMap: Record<string, string[]> = {
      '/': ['/property-wizard', '/antalya', '/dubai', '/ai-property-search'],
      '/property-wizard': ['/ai-property-search', '/antalya', '/testimonials'],
      '/antalya': ['/property/', '/dubai', '/cyprus'],
      '/dubai': ['/property/', '/antalya', '/france'],
      '/cyprus': ['/property/', '/mersin', '/antalya'],
      '/mersin': ['/property/', '/antalya', '/cyprus'],
      '/france': ['/property/', '/dubai', '/antalya'],
      '/ai-property-search': ['/property/', '/property-wizard'],
    };

    const nextRoutes = routeMap[currentRoute] || [];
    
    nextRoutes.forEach(route => {
      // Check if already prefetched
      const existingLink = document.querySelector(`link[href="${route}"][rel="prefetch"]`);
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      }
    });

    // Cleanup
    return () => {
      nextRoutes.forEach(route => {
        const link = document.querySelector(`link[href="${route}"][rel="prefetch"]`);
        if (link && link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, [currentRoute]);
};

export default useCriticalImagePreloader;