// Critical CSS utilities for above-the-fold content
export const injectCriticalCSS = () => {
  try {
    if (typeof document === 'undefined') return;
    
    // Check if critical CSS is already injected
    if (document.querySelector('#critical-css')) return;
    
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
  } catch (error) {
    console.warn('Critical CSS injection failed:', error);
  }
};

// Preload critical resources
export const preloadCriticalResources = () => {
  try {
    if (typeof document === 'undefined') return;
    
    const resources = [
      { href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2', crossorigin: true },
      { href: '/hero-bg.webp', as: 'image' },
      { href: '/antalya-hero.webp', as: 'image' }
    ];

    resources.forEach(resource => {
      try {
        // Check if resource is already preloaded
        if (document.querySelector(`link[href="${resource.href}"][rel="preload"]`)) return;
        
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        if (resource.type) link.type = resource.type;
        if (resource.crossorigin) link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      } catch (error) {
        console.warn(`Failed to preload resource ${resource.href}:`, error);
      }
    });
  } catch (error) {
    console.warn('Critical resources preloading failed:', error);
  }
};

// Initialize performance optimizations
export const initPerformanceOptimizations = () => {
  try {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    
    // Inject critical CSS
    injectCriticalCSS();
    
    // Preload critical resources
    preloadCriticalResources();
    
    // Optimize images after page load
    const runImageOptimization = () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(optimizeImages);
      } else {
        setTimeout(optimizeImages, 100);
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runImageOptimization);
    } else {
      runImageOptimization();
    }
  } catch (error) {
    console.warn('Performance optimizations initialization failed:', error);
  }
};

const optimizeImages = () => {
  try {
    if (typeof document === 'undefined') return;
    
    // Add loading="lazy" to non-critical images
    const images = document.querySelectorAll('img:not([loading]):not([data-critical])');
    images.forEach((img, index) => {
      try {
        if (index > 2) { // First 3 images are critical
          img.setAttribute('loading', 'lazy');
          img.setAttribute('decoding', 'async');
        }
      } catch (error) {
        console.warn('Image lazy loading optimization failed:', error);
      }
    });

    // Convert images to WebP where supported
    if ('HTMLPictureElement' in window) {
      const images = document.querySelectorAll('img[src*=".jpg"], img[src*=".png"]');
      images.forEach(img => {
        try {
          const src = (img as HTMLImageElement).src;
          if (src && src.includes('supabase') && !src.includes('format=')) {
            const url = new URL(src);
            url.searchParams.set('format', 'webp');
            (img as HTMLImageElement).src = url.toString();
          }
        } catch (error) {
          console.warn('WebP conversion failed:', error);
        }
      });
    }
  } catch (error) {
    console.warn('Image optimization failed:', error);
  }
};

export default {
  injectCriticalCSS,
  preloadCriticalResources,
  initPerformanceOptimizations
};