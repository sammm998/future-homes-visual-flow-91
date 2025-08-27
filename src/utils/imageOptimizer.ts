// Advanced image optimization utilities for better performance

export interface ImageOptimization {
  format: 'webp' | 'avif' | 'jpeg' | 'png';
  quality: number;
  width?: number;
  height?: number;
}

// Convert Lovable uploads to optimized formats
export function optimizeLovableImage(
  originalUrl: string, 
  options: Partial<ImageOptimization> = {}
): string {
  if (!originalUrl.includes('lovable-uploads')) {
    return originalUrl;
  }

  const config = {
    format: 'webp' as const,
    quality: 85,
    ...options
  };

  // For Lovable uploads, we'll use URL parameters for optimization
  const url = new URL(originalUrl);
  
  // Add optimization parameters
  url.searchParams.set('format', config.format);
  url.searchParams.set('quality', config.quality.toString());
  
  if (config.width) {
    url.searchParams.set('w', config.width.toString());
  }
  
  if (config.height) {
    url.searchParams.set('h', config.height.toString());
  }

  return url.toString();
}

// Generate responsive srcset for images
export function generateResponsiveSrcSet(
  originalUrl: string,
  sizes: number[] = [320, 640, 960, 1280, 1920]
): string {
  return sizes
    .map(size => {
      const optimizedUrl = optimizeLovableImage(originalUrl, {
        width: size,
        format: 'webp',
        quality: size <= 640 ? 90 : 85 // Higher quality for smaller images
      });
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
}

// Generate sizes attribute for responsive images
export function generateSizesAttribute(
  breakpoints: { [key: string]: string } = {
    '(max-width: 640px)': '100vw',
    '(max-width: 1024px)': '50vw',
    '(max-width: 1280px)': '33vw'
  },
  defaultSize = '25vw'
): string {
  const sizes = Object.entries(breakpoints)
    .map(([media, size]) => `${media} ${size}`)
    .join(', ');
  
  return `${sizes}, ${defaultSize}`;
}

// Check if browser supports modern image formats
export function getBestImageFormat(): 'avif' | 'webp' | 'jpeg' {
  // Check AVIF support
  const avifCanvas = document.createElement('canvas');
  const avifSupported = avifCanvas.toDataURL('image/avif').indexOf('image/avif') === 5;
  
  if (avifSupported) {
    return 'avif';
  }

  // Check WebP support
  const webpCanvas = document.createElement('canvas');
  const webpSupported = webpCanvas.toDataURL('image/webp').indexOf('image/webp') === 5;
  
  if (webpSupported) {
    return 'webp';
  }

  return 'jpeg';
}

// Create optimized image URL with automatic format detection
export function createOptimizedImageUrl(
  originalUrl: string,
  options: Partial<ImageOptimization> = {}
): string {
  const bestFormat = getBestImageFormat();
  
  return optimizeLovableImage(originalUrl, {
    format: bestFormat,
    quality: 85,
    ...options
  });
}

// Preload critical images with modern formats
export function preloadCriticalImages(
  imageUrls: string[],
  options: Partial<ImageOptimization> = {}
): void {
  imageUrls.forEach((url, index) => {
    const optimizedUrl = createOptimizedImageUrl(url, options);
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = optimizedUrl;
    
    // High priority for first image (likely LCP)
    if (index === 0) {
      link.setAttribute('fetchpriority', 'high');
    }
    
    document.head.appendChild(link);
  });
}

// Progressive image loading with LQIP (Low Quality Image Placeholder)
export function createProgressiveImageLoader(
  container: HTMLElement,
  highQualityUrl: string,
  lowQualityUrl?: string
): void {
  const img = container.querySelector('img');
  if (!img) return;

  // If LQIP is provided, load it first
  if (lowQualityUrl) {
    img.src = lowQualityUrl;
    img.style.filter = 'blur(5px)';
    img.style.transform = 'scale(1.1)';
  }

  // Create high quality image
  const highQualityImg = new Image();
  
  highQualityImg.onload = () => {
    img.src = highQualityUrl;
    img.style.filter = 'none';
    img.style.transform = 'scale(1)';
    img.style.transition = 'all 0.3s ease-out';
  };

  highQualityImg.src = highQualityUrl;
}

// Lazy loading with Intersection Observer
export function createAdvancedLazyLoader(): IntersectionObserver {
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          
          // Load the actual image
          const dataSrc = img.dataset.src;
          if (dataSrc) {
            // Create optimized URL
            const optimizedSrc = createOptimizedImageUrl(dataSrc);
            
            // Use progressive loading if LQIP is available
            const lqip = img.dataset.lqip;
            if (lqip) {
              createProgressiveImageLoader(img.parentElement!, optimizedSrc, lqip);
            } else {
              img.src = optimizedSrc;
            }
            
            // Set up responsive attributes
            const dataSrcset = img.dataset.srcset;
            if (dataSrcset) {
              img.srcset = dataSrcset;
            }
            
            // Cleanup
            img.removeAttribute('data-src');
            img.removeAttribute('data-srcset');
            img.removeAttribute('data-lqip');
            
            // Add loaded class for CSS animations
            img.classList.add('loaded');
          }
          
          imageObserver.unobserve(img);
        }
      });
    },
    {
      rootMargin: '50px 0px', // Start loading 50px before entering viewport
      threshold: 0.1
    }
  );

  return imageObserver;
}

// Initialize lazy loading for all images with data-src
export function initImageOptimization(): void {
  const observer = createAdvancedLazyLoader();
  
  // Observe all images with data-src
  document.querySelectorAll('img[data-src]').forEach(img => {
    observer.observe(img);
  });
  
  // Watch for new images added dynamically
  const mutationObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          const lazyImages = element.querySelectorAll('img[data-src]');
          lazyImages.forEach(img => observer.observe(img));
        }
      });
    });
  });
  
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Note: initImageOptimization should be called from React components, not auto-initialized