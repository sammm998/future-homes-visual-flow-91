// Web Vitals optimization utilities
export const optimizeLCP = () => {
  try {
    if (typeof document === 'undefined') return;
    
    // Preload LCP image
    const heroImage = document.querySelector('.hero-image, [data-hero-image]') as HTMLImageElement;
    if (heroImage && heroImage.src && !document.querySelector(`link[href="${heroImage.src}"]`)) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = heroImage.src;
      link.fetchPriority = 'high';
      document.head.appendChild(link);
    }

    // Optimize hero fonts
    if (!document.querySelector('link[href="/fonts/inter.woff2"]')) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = '/fonts/inter.woff2';
      document.head.appendChild(link);
    }
  } catch (error) {
    console.warn('LCP optimization failed:', error);
  }
};

export const optimizeINP = () => {
  try {
    if (typeof document === 'undefined') return { scheduler: () => {}, debounce: () => {} };
    
    // Debounce rapid interactions
    const debouncedHandlers = new Map();
    
    const debounce = (func: Function, wait: number) => {
      let timeout: NodeJS.Timeout;
      return function executedFunction(...args: any[]) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    };

    // Optimize button interactions
    const handleClick = (e: Event) => {
      try {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'BUTTON' || target.closest('button'))) {
          // Add visual feedback immediately
          target.style.transform = 'scale(0.95)';
          setTimeout(() => {
            if (target.style) {
              target.style.transform = '';
            }
          }, 150);
        }
      } catch (error) {
        console.warn('Button interaction optimization failed:', error);
      }
    };

    document.addEventListener('click', handleClick, { passive: true });

    // Break up long tasks
    const scheduler = (callback: Function) => {
      if ('scheduler' in window) {
        (window as any).scheduler.postTask(callback, { priority: 'user-blocking' });
      } else {
        setTimeout(callback, 0);
      }
    };

    return { scheduler, debounce };
  } catch (error) {
    console.warn('INP optimization failed:', error);
    return { scheduler: () => {}, debounce: () => {} };
  }
};

export const optimizeCLS = () => {
  try {
    if (typeof document === 'undefined') return;
    
    // Set dimensions for images to prevent layout shift
    const images = document.querySelectorAll('img:not([width]):not([height])');
    images.forEach(img => {
      try {
        const image = img as HTMLImageElement;
        if (image.naturalWidth && image.naturalHeight) {
          image.width = image.naturalWidth;
          image.height = image.naturalHeight;
        } else {
          // Set aspect ratio for unknown dimensions
          image.style.aspectRatio = '16/9';
        }
      } catch (error) {
        console.warn('Image dimension optimization failed:', error);
      }
    });

    // Reserve space for dynamic content
    const dynamicElements = document.querySelectorAll('[data-dynamic]');
    dynamicElements.forEach(el => {
      try {
        const element = el as HTMLElement;
        if (!element.style.minHeight) {
          element.style.minHeight = '200px';
        }
      } catch (error) {
        console.warn('Dynamic element optimization failed:', error);
      }
    });

    // Preload fonts to prevent text shift
    const fontPreloads = ['/fonts/inter.woff2'];

    fontPreloads.forEach(font => {
      try {
        if (!document.querySelector(`link[href="${font}"]`)) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'font';
          link.type = 'font/woff2';
          link.crossOrigin = 'anonymous';
          link.href = font;
          document.head.appendChild(link);
        }
      } catch (error) {
        console.warn('Font preload failed:', error);
      }
    });
  } catch (error) {
    console.warn('CLS optimization failed:', error);
  }
};

export const optimizeFCP = () => {
  try {
    if (typeof document === 'undefined') return;
    
    // Inline critical CSS
    if (!document.querySelector('#fcp-critical-css')) {
      const criticalCSS = `
        body { font-family: Inter, system-ui, sans-serif; }
        .nav-container { display: flex; }
        .hero-section { display: block; min-height: 100vh; }
        .container { max-width: 1200px; margin: 0 auto; }
      `;

      const style = document.createElement('style');
      style.id = 'fcp-critical-css';
      style.textContent = criticalCSS;
      document.head.appendChild(style);
    }

    // Remove render-blocking stylesheets for non-critical CSS
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
    stylesheets.forEach(link => {
      try {
        link.setAttribute('media', 'print');
        link.setAttribute('onload', "this.media='all'; this.onload=null;");
      } catch (error) {
        console.warn('Stylesheet optimization failed:', error);
      }
    });
  } catch (error) {
    console.warn('FCP optimization failed:', error);
  }
};

export const optimizeTTFB = () => {
  try {
    if (typeof document === 'undefined') return;
    
    // Preconnect to critical origins
    const origins = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://images.unsplash.com'
    ];

    origins.forEach(origin => {
      try {
        if (!document.querySelector(`link[href="${origin}"][rel="preconnect"]`)) {
          const link = document.createElement('link');
          link.rel = 'preconnect';
          link.href = origin;
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        }
      } catch (error) {
        console.warn('Preconnect failed:', error);
      }
    });

    // DNS prefetch for external resources
    const dnsPrefetch = [
      '//api.elevenlabs.io',
      '//cdnjs.cloudflare.com'
    ];

    dnsPrefetch.forEach(domain => {
      try {
        if (!document.querySelector(`link[href="${domain}"][rel="dns-prefetch"]`)) {
          const link = document.createElement('link');
          link.rel = 'dns-prefetch';
          link.href = domain;
          document.head.appendChild(link);
        }
      } catch (error) {
        console.warn('DNS prefetch failed:', error);
      }
    });
  } catch (error) {
    console.warn('TTFB optimization failed:', error);
  }
};

// Initialize all Web Vitals optimizations
export const initWebVitalsOptimizations = () => {
  try {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    
    const runOptimizations = () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          optimizeLCP();
          optimizeCLS();
          optimizeFCP();
          optimizeTTFB();
          optimizeINP();
        });
      } else {
        setTimeout(() => {
          optimizeLCP();
          optimizeCLS();
          optimizeFCP();
          optimizeTTFB();
          optimizeINP();
        }, 100);
      }
    };

    // Run optimizations based on loading state
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runOptimizations);
    } else {
      runOptimizations();
    }
  } catch (error) {
    console.warn('Web Vitals optimizations initialization failed:', error);
  }
};

export default {
  optimizeLCP,
  optimizeINP,
  optimizeCLS,
  optimizeFCP,
  optimizeTTFB,
  initWebVitalsOptimizations
};