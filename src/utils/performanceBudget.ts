// Performance budget monitoring and optimization
interface PerformanceBudget {
  maxBundleSize: number; // KB
  maxImageSize: number; // KB  
  maxFCP: number; // First Contentful Paint in ms
  maxLCP: number; // Largest Contentful Paint in ms
  maxCLS: number; // Cumulative Layout Shift
  maxFID: number; // First Input Delay in ms
  maxTTI: number; // Time to Interactive in ms
}

const PERFORMANCE_BUDGET: PerformanceBudget = {
  maxBundleSize: 500, // 500KB
  maxImageSize: 200, // 200KB per image
  maxFCP: 1800, // 1.8s
  maxLCP: 2500, // 2.5s
  maxCLS: 0.1, // 0.1
  maxFID: 100, // 100ms
  maxTTI: 3800 // 3.8s
};

export class PerformanceBudgetMonitor {
  private static instance: PerformanceBudgetMonitor;
  private violations: Array<{
    metric: string;
    value: number;
    budget: number;
    timestamp: number;
  }> = [];

  static getInstance(): PerformanceBudgetMonitor {
    if (!PerformanceBudgetMonitor.instance) {
      PerformanceBudgetMonitor.instance = new PerformanceBudgetMonitor();
    }
    return PerformanceBudgetMonitor.instance;
  }

  startMonitoring() {
    if (import.meta.env.PROD) return; // Only in development

    this.monitorWebVitals();
    this.monitorResourceSizes();
    this.schedulePeriodicChecks();
  }

  private monitorWebVitals() {
    // Monitor Core Web Vitals
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
          this.checkMetric('FCP', entry.startTime, PERFORMANCE_BUDGET.maxFCP);
        }
      }
    }).observe({ entryTypes: ['paint'] });

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.checkMetric('LCP', entry.startTime, PERFORMANCE_BUDGET.maxLCP);
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          this.checkMetric('CLS', (entry as any).value, PERFORMANCE_BUDGET.maxCLS);
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }

  private monitorResourceSizes() {
    // Monitor resource sizes
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as PerformanceResourceTiming[]) {
        const size = entry.transferSize / 1024; // Convert to KB
        
        if (entry.name.includes('.js') || entry.name.includes('.css')) {
          this.checkMetric('Bundle Size', size, PERFORMANCE_BUDGET.maxBundleSize);
        }
        
        if (entry.name.includes('.jpg') || entry.name.includes('.png') || entry.name.includes('.webp')) {
          this.checkMetric('Image Size', size, PERFORMANCE_BUDGET.maxImageSize);
        }
      }
    }).observe({ entryTypes: ['resource'] });
  }

  private checkMetric(metric: string, value: number, budget: number) {
    if (value > budget) {
      const violation = {
        metric,
        value: Math.round(value * 100) / 100,
        budget,
        timestamp: Date.now()
      };
      
      this.violations.push(violation);
      
      console.warn(
        `🚨 Performance Budget Violation: ${metric}`,
        `\n📊 Current: ${violation.value}${this.getUnit(metric)}`,
        `\n🎯 Budget: ${budget}${this.getUnit(metric)}`,
        `\n⚡ Exceeded by: ${Math.round((value - budget) * 100) / 100}${this.getUnit(metric)}`
      );
    }
  }

  private getUnit(metric: string): string {
    if (metric.includes('Size')) return 'KB';
    if (metric === 'CLS') return '';
    return 'ms';
  }

  private schedulePeriodicChecks() {
    // Check TTI after page load
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation && navigation.domInteractive) {
        this.checkMetric('TTI', navigation.domInteractive, PERFORMANCE_BUDGET.maxTTI);
      }
    }, 5000);
  }

  getViolations() {
    return this.violations;
  }

  getViolationSummary() {
    const summary = this.violations.reduce((acc, violation) => {
      acc[violation.metric] = (acc[violation.metric] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return summary;
  }

  clearViolations() {
    this.violations = [];
  }
}

// Image optimization utilities
export const optimizeImageLoading = () => {
  const images = document.querySelectorAll('img');
  
  images.forEach((img, index) => {
    // Set loading priority for above-the-fold images
    if (index < 3) {
      img.setAttribute('fetchpriority', 'high');
      img.setAttribute('loading', 'eager');
    } else {
      img.setAttribute('loading', 'lazy');
    }
    
    // Add decode optimization
    img.setAttribute('decoding', 'async');
  });
};

// Bundle size optimization
export const analyzeBundleSize = () => {
  if (import.meta.env.PROD) return;
  
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  const jsResources = resources.filter(r => r.name.includes('.js'));
  const cssResources = resources.filter(r => r.name.includes('.css'));
  
  const totalJSSize = jsResources.reduce((acc, r) => acc + (r.transferSize || 0), 0) / 1024;
  const totalCSSSize = cssResources.reduce((acc, r) => acc + (r.transferSize || 0), 0) / 1024;
  
  console.log('📦 Bundle Analysis:', {
    'JavaScript': `${Math.round(totalJSSize)}KB`,
    'CSS': `${Math.round(totalCSSSize)}KB`,
    'Total': `${Math.round(totalJSSize + totalCSSSize)}KB`,
    'Budget': `${PERFORMANCE_BUDGET.maxBundleSize}KB`
  });
  
  return { totalJSSize, totalCSSSize };
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  const monitor = PerformanceBudgetMonitor.getInstance();
  monitor.startMonitoring();
  
  // Run optimization checks after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        optimizeImageLoading();
        analyzeBundleSize();
      }, 1000);
    });
  } else {
    setTimeout(() => {
      optimizeImageLoading();
      analyzeBundleSize();
    }, 1000);
  }
};