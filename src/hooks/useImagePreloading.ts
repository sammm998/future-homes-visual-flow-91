import { useEffect } from 'react';

interface PreloadOptions {
  priority?: boolean;
  format?: 'webp' | 'jpeg' | 'png';
  quality?: number;
  width?: number;
}

export const useImagePreloading = (images: string[], options: PreloadOptions = {}) => {
  const { priority = false, format = 'webp', quality = 90, width = 600 } = options;

  useEffect(() => {
    if (!images.length) return;

    const preloadImages = () => {
      // Only preload first 3 critical images to avoid overwhelming the network
      const criticalImages = priority ? images.slice(0, 3) : images.slice(0, 1);
      
      criticalImages.forEach((src, index) => {
        if (!src || src.includes('placeholder.svg') || src.startsWith('data:')) return;

        // Create optimized URL for preloading
        let optimizedSrc = src;
        if (src.includes('supabase') && src.includes('storage')) {
          const url = new URL(src);
          url.searchParams.set('width', width.toString());
          url.searchParams.set('quality', quality.toString());
          url.searchParams.set('format', format);
          url.searchParams.set('resize', 'contain');
          optimizedSrc = url.toString();
        }

        // Use link preload for critical images, regular Image for others
        if (priority && index === 0) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = optimizedSrc;
          link.fetchPriority = 'high';
          document.head.appendChild(link);
        } else {
          // Regular image preloading
          const img = new Image();
          img.src = optimizedSrc;
        }
      });
    };

    // Use requestIdleCallback to avoid blocking critical rendering
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(preloadImages);
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(preloadImages, 100);
    }
  }, [images, priority, format, quality, width]);
};

export default useImagePreloading;