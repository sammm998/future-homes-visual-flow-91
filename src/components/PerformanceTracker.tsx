import React, { useEffect } from 'react';

interface PerformanceTrackerProps {
  enableLogging?: boolean;
  enableWebVitals?: boolean;
  enableUserTiming?: boolean;
}

export const PerformanceTracker: React.FC<PerformanceTrackerProps> = ({
  enableLogging = false,
  enableWebVitals = true,
  enableUserTiming = true
}) => {

  useEffect(() => {
    if (!enableWebVitals) return;

    // Track Core Web Vitals
    const trackWebVitals = () => {
      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (enableLogging) {
                console.log('LCP:', entry.startTime);
              }
              // Send to analytics
              if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'LCP', {
                  event_category: 'Web Vitals',
                  value: Math.round(entry.startTime),
                  non_interaction: true,
                });
              }
            }
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // First Input Delay / Interaction to Next Paint
          const inpObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (enableLogging) {
                console.log('INP:', (entry as any).processingStart - entry.startTime);
              }
            }
          });
          inpObserver.observe({ entryTypes: ['event'] });

          // Cumulative Layout Shift
          const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (enableLogging) {
                console.log('CLS:', (entry as any).value);
              }
              if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'CLS', {
                  event_category: 'Web Vitals',
                  value: Math.round((entry as any).value * 1000),
                  non_interaction: true,
                });
              }
            }
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });

          // First Contentful Paint
          const fcpObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.name === 'first-contentful-paint') {
                if (enableLogging) {
                  console.log('FCP:', entry.startTime);
                }
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'FCP', {
                    event_category: 'Web Vitals',
                    value: Math.round(entry.startTime),
                    non_interaction: true,
                  });
                }
              }
            }
          });
          fcpObserver.observe({ entryTypes: ['paint'] });

        } catch (error) {
          console.warn('Performance tracking not supported:', error);
        }
      }
    };

    // Track custom user timing
    const trackUserTiming = () => {
      if (!enableUserTiming || !('performance' in window)) return;

      // Mark key application moments
      performance.mark('app-start');
      
      // Track route changes
      const originalPushState = history.pushState;
      history.pushState = function(...args) {
        performance.mark('route-change-start');
        originalPushState.apply(history, args);
        
        // Measure route change after next tick
        setTimeout(() => {
          performance.mark('route-change-end');
          performance.measure('route-change', 'route-change-start', 'route-change-end');
          
          if (enableLogging) {
            const measures = performance.getEntriesByName('route-change');
            const latestMeasure = measures[measures.length - 1];
            console.log('Route change duration:', latestMeasure.duration);
          }
        }, 0);
      };
    };

    // Initialize tracking
    trackWebVitals();
    trackUserTiming();

    // Track resource loading performance
    const trackResourceTiming = () => {
      if (!('PerformanceObserver' in window)) return;

      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resource = entry as PerformanceResourceTiming;
          
          // Track slow resources
          if (resource.duration > 1000) {
            if (enableLogging) {
              console.warn('Slow resource:', resource.name, resource.duration);
            }
          }
          
          // Track large resources
          if (resource.transferSize > 100000) {
            if (enableLogging) {
              console.warn('Large resource:', resource.name, resource.transferSize);
            }
          }
        }
      });
      
      resourceObserver.observe({ entryTypes: ['resource'] });
    };

    trackResourceTiming();

    // Clean up performance observers
    return () => {
      // Observers will be garbage collected
    };
  }, [enableLogging, enableWebVitals, enableUserTiming]);

  // Track navigation timing on mount
  useEffect(() => {
    if (!('performance' in window) || !enableLogging) return;

    const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navTiming) {
      console.log('Navigation timing:', {
        domContentLoaded: navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart,
        loadComplete: navTiming.loadEventEnd - navTiming.loadEventStart,
        firstByte: navTiming.responseStart - navTiming.requestStart,
        domInteractive: navTiming.domInteractive - navTiming.domContentLoadedEventStart
      });
    }
  }, [enableLogging]);

  return null;
};

export default PerformanceTracker;