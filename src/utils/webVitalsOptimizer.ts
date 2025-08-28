// Web Vitals optimization utilities
export const optimizeLCP = () => {
  // Preload LCP image
  const heroImage = document.querySelector('.hero-image, [data-hero-image]') as HTMLImageElement;
  if (heroImage && heroImage.src) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = heroImage.src;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  }

  // Optimize hero fonts
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'font';
  link.type = 'font/woff2';
  link.crossOrigin = 'anonymous';
  link.href = '/fonts/inter.woff2';
  document.head.appendChild(link);
};

export const optimizeINP = () => {
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
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      // Add visual feedback immediately
      target.style.transform = 'scale(0.95)';
      setTimeout(() => {
        target.style.transform = '';
      }, 150);
    }
  });

  // Break up long tasks
  const scheduler = (callback: Function) => {
    if ('scheduler' in window) {
      (window as any).scheduler.postTask(callback, { priority: 'user-blocking' });
    } else {
      setTimeout(callback, 0);
    }
  };

  return { scheduler, debounce };
};

export const optimizeCLS = () => {
  // Set dimensions for images to prevent layout shift
  const images = document.querySelectorAll('img:not([width]):not([height])');
  images.forEach(img => {
    const image = img as HTMLImageElement;
    if (image.naturalWidth && image.naturalHeight) {
      image.width = image.naturalWidth;
      image.height = image.naturalHeight;
    } else {
      // Set aspect ratio for unknown dimensions
      image.style.aspectRatio = '16/9';
    }
  });

  // Reserve space for dynamic content
  const dynamicElements = document.querySelectorAll('[data-dynamic]');
  dynamicElements.forEach(el => {
    const element = el as HTMLElement;
    if (!element.style.minHeight) {
      element.style.minHeight = '200px';
    }
  });

  // Preload fonts to prevent text shift
  const fontPreloads = [
    '/fonts/inter.woff2'
  ];

  fontPreloads.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = font;
    document.head.appendChild(link);
  });
};

export const optimizeFCP = () => {
  // Inline critical CSS
  const criticalCSS = `
    body { font-family: Inter, system-ui, sans-serif; }
    .nav-container { display: flex; }
    .hero-section { display: block; min-height: 100vh; }
    .container { max-width: 1200px; margin: 0 auto; }
  `;

  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.appendChild(style);

  // Remove render-blocking stylesheets for non-critical CSS
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
  stylesheets.forEach(link => {
    link.setAttribute('media', 'print');
    link.setAttribute('onload', "this.media='all'; this.onload=null;");
  });
};

export const optimizeTTFB = () => {
  // Preconnect to critical origins
  const origins = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://images.unsplash.com'
  ];

  origins.forEach(origin => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // DNS prefetch for external resources
  const dnsPrefetch = [
    '//api.elevenlabs.io',
    '//cdnjs.cloudflare.com'
  ];

  dnsPrefetch.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
};

// Initialize all Web Vitals optimizations
export const initWebVitalsOptimizations = () => {
  // Run optimizations based on loading state
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      optimizeLCP();
      optimizeCLS();
      optimizeFCP();
      optimizeTTFB();
      optimizeINP();
    });
  } else {
    optimizeLCP();
    optimizeCLS();
    optimizeFCP();
    optimizeTTFB();
    optimizeINP();
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