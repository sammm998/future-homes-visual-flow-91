// Advanced image optimization utilities for maximum performance

interface ImageOptimizationConfig {
  quality: number;
  format: 'webp' | 'avif' | 'jpeg' | 'png';
  width?: number;
  height?: number;
  progressive?: boolean;
}

// Create optimized image URLs for different services
export const createOptimizedImageUrl = (
  originalUrl: string, 
  config: Partial<ImageOptimizationConfig> = {}
): string => {
  const { quality = 85, format = 'webp', width, height } = config;

  // Handle different image services
  if (originalUrl.includes('supabase')) {
    const url = new URL(originalUrl);
    url.searchParams.set('quality', quality.toString());
    url.searchParams.set('format', format);
    if (width) url.searchParams.set('width', width.toString());
    if (height) url.searchParams.set('height', height.toString());
    return url.toString();
  }

  // Handle CDN images
  if (originalUrl.includes('cdn.futurehomesturkey.com')) {
    const url = new URL(originalUrl);
    url.searchParams.set('q', quality.toString());
    url.searchParams.set('f', format);
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    return url.toString();
  }

  // Return original URL if no optimization available
  return originalUrl;
};

// Generate responsive image srcset
export const generateResponsiveSrcSet = (
  baseUrl: string,
  sizes: number[] = [320, 640, 960, 1280, 1920]
): string => {
  return sizes
    .map(size => {
      const optimizedUrl = createOptimizedImageUrl(baseUrl, { 
        width: size,
        quality: size > 1280 ? 75 : 85 // Lower quality for larger images
      });
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
};

// Client-side image compression for uploads
export const compressImageFile = (
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas toBlob failed'));
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => reject(new Error('Image load failed'));
    img.src = URL.createObjectURL(file);
  });
};

// Progressive image loading with blur-up effect
export const createProgressiveImage = (
  lowQualityUrl: string,
  highQualityUrl: string,
  container: HTMLElement
): void => {
  const lowQualityImg = new Image();
  const highQualityImg = new Image();

  lowQualityImg.onload = () => {
    container.style.backgroundImage = `url(${lowQualityUrl})`;
    container.style.filter = 'blur(5px)';
    container.style.transition = 'filter 0.3s ease';
  };

  highQualityImg.onload = () => {
    container.style.backgroundImage = `url(${highQualityUrl})`;
    container.style.filter = 'none';
  };

  lowQualityImg.src = createOptimizedImageUrl(lowQualityUrl, { 
    quality: 20, 
    width: 50 
  });
  highQualityImg.src = highQualityUrl;
};

// Lazy loading with Intersection Observer v2
export const createAdvancedLazyLoader = (
  images: NodeListOf<HTMLImageElement>
): IntersectionObserver => {
  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          const srcset = img.dataset.srcset;

          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
          }

          if (srcset) {
            img.srcset = srcset;
            img.removeAttribute('data-srcset');
          }

          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    },
    {
      // Load images 100px before they come into view
      rootMargin: '100px 0px',
      threshold: 0.01
    }
  );

  images.forEach(img => imageObserver.observe(img));
  return imageObserver;
};

// Image preloading with priority hints
export const preloadCriticalImages = (
  imageUrls: string[],
  priority: 'high' | 'low' = 'high'
): Promise<void[]> => {
  const preloadPromises = imageUrls.map((url, index) => {
    return new Promise<void>((resolve, reject) => {
      if (index === 0) {
        // Use link preload for the first image
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        link.fetchPriority = priority;
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to preload ${url}`));
        document.head.appendChild(link);
      } else {
        // Use Image constructor for subsequent images
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to preload ${url}`));
        img.src = url;
      }
    });
  });

  return Promise.all(preloadPromises);
};

// Automatic format detection and optimization
export const getBestImageFormat = (): 'avif' | 'webp' | 'jpeg' => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  // Check AVIF support
  if (canvas.toDataURL('image/avif').startsWith('data:image/avif')) {
    return 'avif';
  }

  // Check WebP support
  if (canvas.toDataURL('image/webp').startsWith('data:image/webp')) {
    return 'webp';
  }

  // Fallback to JPEG
  return 'jpeg';
};

// Performance monitoring for images
export const trackImagePerformance = (imageUrl: string): void => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.name.includes(imageUrl)) {
          console.log(`Image ${imageUrl} load time:`, entry.duration);
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }
};

export default {
  createOptimizedImageUrl,
  generateResponsiveSrcSet,
  compressImageFile,
  createProgressiveImage,
  createAdvancedLazyLoader,
  preloadCriticalImages,
  getBestImageFormat,
  trackImagePerformance
};