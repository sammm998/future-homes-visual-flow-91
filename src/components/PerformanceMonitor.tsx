import React, { useEffect } from 'react';

interface PerformanceMonitorProps {
  logLevel?: 'none' | 'basic' | 'detailed';
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  logLevel = 'none' 
}) => {
  useEffect(() => {
    if (logLevel === 'none') return;

    // Monitor Core Web Vitals
    const observeWebVitals = () => {
      // First Contentful Paint
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (logLevel === 'detailed') {
            console.log('FCP:', entry.startTime);
          }
        }
      }).observe({ entryTypes: ['paint'] });

      // Cumulative Layout Shift
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (logLevel === 'detailed') {
            console.log('CLS:', (entry as any).value);
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });

      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (logLevel === 'detailed') {
            console.log('LCP:', entry.startTime);
          }
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    };

    // Preload critical resources (no-op: removed non-existent font preload)
    const preloadCriticalResources = () => {
      // No custom fonts to preload - system fonts are used
    };

    // Optimize images loading
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach((img) => {
        if (img.getBoundingClientRect().top < window.innerHeight * 1.5) {
          img.setAttribute('loading', 'eager');
        }
      });
    };

    preloadCriticalResources();
    observeWebVitals();
    optimizeImages();

    // Clean up
    return () => {
      // Cleanup performance observers if needed
    };
  }, [logLevel]);

  return null;
};

export default PerformanceMonitor;