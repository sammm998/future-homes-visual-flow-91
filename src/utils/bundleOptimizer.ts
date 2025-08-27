// Bundle optimization utilities for reducing payload size
import React from 'react';

// Lazy load heavy dependencies
export const loadMotion = () => import('framer-motion');
export const loadGSAP = () => import('gsap');
export const loadSpline = () => import('@splinetool/react-spline');

// Code splitting utilities
export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) => {
  return React.lazy(importFn);
};

// Preload critical chunks based on user interaction
export const preloadCriticalChunks = () => {
  // Preload property search components if user is on homepage
  if (window.location.pathname === '/') {
    import('../pages/AntalyaPropertySearch');
    import('../pages/PropertyWizard');
  }
  
  // Preload property detail if user is on search pages
  if (window.location.pathname.includes('property') || 
      window.location.pathname.includes('antalya') ||
      window.location.pathname.includes('dubai')) {
    import('../pages/PropertyDetail');
  }
};

// Dynamic import with error handling
export const safeDynamicImport = async <T>(
  importFn: () => Promise<T>
): Promise<T | null> => {
  try {
    return await importFn();
  } catch (error) {
    console.warn('Failed to load module:', error);
    return null;
  }
};

// Resource priority hints
export const addResourceHint = (
  href: string, 
  rel: 'preload' | 'prefetch' | 'preconnect' | 'dns-prefetch',
  as?: string,
  crossOrigin?: string
) => {
  try {
    if (typeof document === 'undefined') return;
    
    const existing = document.querySelector(`link[href="${href}"][rel="${rel}"]`);
    if (existing) return;

    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    if (as) link.setAttribute('as', as);
    if (crossOrigin) link.crossOrigin = crossOrigin;
    
    document.head.appendChild(link);
  } catch (error) {
    console.warn(`Failed to add resource hint for ${href}:`, error);
  }
};

// Intelligent prefetching based on user behavior
export class IntelligentPrefetcher {
  private hoverTimeout: NodeJS.Timeout | null = null;
  private prefetchedUrls = new Set<string>();

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    try {
      if (typeof document === 'undefined') return;
      
      document.addEventListener('mouseover', this.handleMouseOver.bind(this), { passive: true });
      document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    } catch (error) {
      console.warn('Event listener setup failed:', error);
    }
  }

  private handleMouseOver(event: MouseEvent) {
    try {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (!link || !this.shouldPrefetch(link.href)) return;

      this.hoverTimeout = setTimeout(() => {
        this.prefetchRoute(link.href);
      }, 100); // Small delay to avoid prefetching on quick mouseovers
    } catch (error) {
      console.warn('Mouse over handler failed:', error);
    }
  }

  private handleTouchStart(event: TouchEvent) {
    try {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && this.shouldPrefetch(link.href)) {
        this.prefetchRoute(link.href);
      }
    } catch (error) {
      console.warn('Touch start handler failed:', error);
    }
  }

  private shouldPrefetch(url: string): boolean {
    if (this.prefetchedUrls.has(url)) return false;
    if (url.startsWith('mailto:') || url.startsWith('tel:')) return false;
    if (url.includes('#')) return false;
    if (!url.startsWith('/') && !url.includes(window.location.origin)) return false;
    
    return true;
  }

  private prefetchRoute(url: string) {
    try {
      if (this.prefetchedUrls.has(url)) return;
      
      this.prefetchedUrls.add(url);
      addResourceHint(url, 'prefetch');
    } catch (error) {
      console.warn('Route prefetch failed:', error);
    }
  }

  destroy() {
    try {
      if (this.hoverTimeout) {
        clearTimeout(this.hoverTimeout);
      }
      if (typeof document !== 'undefined') {
        document.removeEventListener('mouseover', this.handleMouseOver.bind(this));
        document.removeEventListener('touchstart', this.handleTouchStart.bind(this));
      }
    } catch (error) {
      console.warn('Prefetcher cleanup failed:', error);
    }
  }
}

// Initialize intelligent prefetcher
export const initIntelligentPrefetching = () => {
  try {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        try {
          new IntelligentPrefetcher();
        } catch (error) {
          console.warn('Intelligent prefetcher initialization failed:', error);
        }
      });
    } else {
      setTimeout(() => {
        try {
          new IntelligentPrefetcher();
        } catch (error) {
          console.warn('Intelligent prefetcher initialization failed:', error);
        }
      }, 100);
    }
  } catch (error) {
    console.warn('Intelligent prefetching initialization failed:', error);
  }
};

// Tree shaking helper - mark unused exports
export const __DEV__ = import.meta.env.DEV;
export const markAsUsed = (feature: string) => {
  if (__DEV__) {
    console.log(`Feature "${feature}" is being used`);
  }
};

export default {
  loadMotion,
  loadGSAP,
  loadSpline,
  preloadCriticalChunks,
  safeDynamicImport,
  addResourceHint,
  IntelligentPrefetcher,
  initIntelligentPrefetching
};