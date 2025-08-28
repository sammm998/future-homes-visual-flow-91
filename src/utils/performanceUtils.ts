// Performance optimization utilities

export const lazyLoadImage = (img: HTMLImageElement) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLImageElement;
        if (target.dataset.src) {
          target.src = target.dataset.src;
          target.removeAttribute('data-src');
          target.classList.remove('lazy');
          observer.unobserve(target);
        }
      }
    });
  });
  
  observer.observe(img);
  return observer;
};

export const preloadRoute = (route: string) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = route;
  document.head.appendChild(link);
};

export const preloadImage = (src: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
};

export const optimizeImages = () => {
  // Add loading="lazy" to images that are not above the fold
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach((img, index) => {
    if (index > 2) { // First 3 images load normally
      img.setAttribute('loading', 'lazy');
    }
  });
};

export const removeUnusedCSS = () => {
  // This would be handled by the build process
  // But we can help by removing unused styles
  const unusedSelectors = [
    '.unused-class',
    '.legacy-style'
  ];
  
  unusedSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => el.remove());
  });
};

export const deferNonCriticalJS = () => {
  // Defer loading of non-critical JavaScript
  const scripts = document.querySelectorAll('script[data-defer]');
  scripts.forEach(script => {
    if (script instanceof HTMLScriptElement) {
      script.defer = true;
    }
  });
};

export const enableServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  }
};