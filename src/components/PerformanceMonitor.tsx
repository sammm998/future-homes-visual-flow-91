import React, { useEffect } from 'react';

interface PerformanceMonitorProps {
  logLevel?: 'none' | 'basic' | 'detailed';
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  logLevel = 'none' 
}) => {
  useEffect(() => {
    if (logLevel === 'none') return;

    let cumulativeLayoutShift = 0;

    // Enhanced Core Web Vitals monitoring
    const observeWebVitals = () => {
      // First Contentful Paint
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fcp = Math.round(entry.startTime);
          if (logLevel === 'detailed') {
            console.log(`🎨 FCP: ${fcp}ms ${fcp < 1800 ? '✅' : '⚠️'}`);
          }
          
          // Report to analytics in production
          if (import.meta.env.PROD && 'gtag' in window) {
            (window as any).gtag('event', 'web_vitals', {
              event_category: 'Performance',
              event_label: 'FCP',
              value: fcp
            });
          }
        }
      }).observe({ entryTypes: ['paint'] });

      // Cumulative Layout Shift
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            cumulativeLayoutShift += (entry as any).value;
            if (logLevel === 'detailed') {
              console.log(`📐 CLS: ${cumulativeLayoutShift.toFixed(3)} ${cumulativeLayoutShift < 0.1 ? '✅' : '⚠️'}`);
            }
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });

      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const lcp = Math.round(entry.startTime);
          if (logLevel === 'detailed') {
            console.log(`🖼️ LCP: ${lcp}ms ${lcp < 2500 ? '✅' : '⚠️'}`);
          }
          
          // Report to analytics
          if (import.meta.env.PROD && 'gtag' in window) {
            (window as any).gtag('event', 'web_vitals', {
              event_category: 'Performance',
              event_label: 'LCP',
              value: lcp
            });
          }
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fid = Math.round((entry as any).processingStart - entry.startTime);
          if (logLevel === 'detailed') {
            console.log(`⚡ FID: ${fid}ms ${fid < 100 ? '✅' : '⚠️'}`);
          }
          
          // Report to analytics
          if (import.meta.env.PROD && 'gtag' in window) {
            (window as any).gtag('event', 'web_vitals', {
              event_category: 'Performance',
              event_label: 'FID',
              value: fid
            });
          }
        }
      }).observe({ entryTypes: ['first-input'] });

      // Time to First Byte
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const ttfb = Math.round(navigation.responseStart - navigation.requestStart);
        if (logLevel === 'detailed') {
          console.log(`🌐 TTFB: ${ttfb}ms ${ttfb < 600 ? '✅' : '⚠️'}`);
        }
      }
    };

    // Enhanced resource preloading
    const preloadCriticalResources = () => {
      // Preload critical fonts with font-display swap
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.as = 'font';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
      fontLink.crossOrigin = 'anonymous';
      document.head.appendChild(fontLink);

      // Preload critical images
      const criticalImages = ['/placeholder.svg', '/lovable-uploads/9b08d909-a9da-4946-942a-c24106cd57f7.png'];
      criticalImages.forEach(src => {
        const imgLink = document.createElement('link');
        imgLink.rel = 'preload';
        imgLink.as = 'image';
        imgLink.href = src;
        document.head.appendChild(imgLink);
      });
    };

    // Enhanced image optimization
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach((img, index) => {
        // Prioritize above-the-fold images
        if (index < 3 && img.getBoundingClientRect().top < window.innerHeight) {
          img.setAttribute('loading', 'eager');
          img.setAttribute('fetchpriority', 'high');
        } else {
          img.setAttribute('loading', 'lazy');
        }
        
        // Add decode optimization
        img.setAttribute('decoding', 'async');
      });
    };

    // Register service worker
    const registerServiceWorker = () => {
      if ('serviceWorker' in navigator && import.meta.env.PROD) {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            if (logLevel === 'detailed') {
              console.log('✅ SW registered:', registration);
            }
          })
          .catch(error => {
            console.error('❌ SW registration failed:', error);
          });
      }
    };

    preloadCriticalResources();
    observeWebVitals();
    optimizeImages();
    registerServiceWorker();

    // Clean up
    return () => {
      // Cleanup performance observers if needed
    };
  }, [logLevel]);

  return null;
};

export default PerformanceMonitor;