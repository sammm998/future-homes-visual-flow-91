// Critical CSS utilities for above-the-fold content
export const injectCriticalCSS = () => {
  const criticalCSS = `
    /* Critical above-the-fold styles */
    .hero-section {
      min-height: 100vh;
      display: flex;
      align-items: center;
      background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-foreground)) 100%);
    }
    
    .nav-container {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 50;
      backdrop-filter: blur(10px);
    }
    
    /* Prevent layout shift */
    img[width][height] {
      aspect-ratio: attr(width) / attr(height);
    }
    
    /* Font optimization */
    @font-face {
      font-family: 'Inter';
      font-display: swap;
      font-weight: 400 700;
      src: url('/fonts/inter.woff2') format('woff2');
    }
    
    /* Loading states */
    .skeleton {
      background: linear-gradient(90deg, hsl(var(--muted)) 25%, hsl(var(--muted-foreground) / 0.1) 50%, hsl(var(--muted)) 75%);
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite;
    }
    
    @keyframes skeleton-loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    /* Reduce repaints */
    .smooth-scroll {
      scroll-behavior: smooth;
    }
    
    /* GPU acceleration for animations */
    .will-change-transform {
      will-change: transform;
    }
    
    .will-change-opacity {
      will-change: opacity;
    }
    
    /* Optimize reflows */
    .container {
      contain: layout style paint;
    }
    
    /* Preload hint styles */
    .preload-hint {
      content-visibility: auto;
      contain-intrinsic-size: 300px;
    }
  `;

  // Inject critical CSS inline
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  style.id = 'critical-css';
  document.head.insertBefore(style, document.head.firstChild);
};

// Preload critical resources
export const preloadCriticalResources = () => {
  const resources = [
    { href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2', crossorigin: true },
    { href: '/hero-bg.webp', as: 'image' },
    { href: '/antalya-hero.webp', as: 'image' }
  ];

  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    if (resource.type) link.type = resource.type;
    if (resource.crossorigin) link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Initialize performance optimizations
export const initPerformanceOptimizations = () => {
  // Inject critical CSS
  injectCriticalCSS();
  
  // Preload critical resources
  preloadCriticalResources();
  
  // Optimize images after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimizeImages);
  } else {
    optimizeImages();
  }
};

const optimizeImages = () => {
  // Add loading="lazy" to non-critical images
  const images = document.querySelectorAll('img:not([loading]):not([data-critical])');
  images.forEach((img, index) => {
    if (index > 2) { // First 3 images are critical
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    }
  });

  // Convert images to WebP where supported - Chrome compatible
  if ('HTMLPictureElement' in window && window.location.protocol !== 'file:') {
    try {
      const images = document.querySelectorAll('img[src*=".jpg"], img[src*=".png"]');
      images.forEach(img => {
        const src = (img as HTMLImageElement).src;
        if (src && src.includes('supabase') && !src.includes('format=')) {
          try {
            const url = new URL(src);
            url.searchParams.set('format', 'webp');
            (img as HTMLImageElement).src = url.toString();
          } catch (urlError) {
            // Skip invalid URLs
            console.warn('Failed to process image URL:', src);
          }
        }
      });
    } catch (e) {
      // Graceful degradation for Chrome compatibility
      console.warn('WebP conversion failed:', e);
    }
  }
};

export default {
  injectCriticalCSS,
  preloadCriticalResources,
  initPerformanceOptimizations
};