// Advanced caching utilities for optimal performance

interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of items in cache
  staleWhileRevalidate: boolean;
}

class AdvancedCache {
  private cache = new Map<string, {
    data: any;
    timestamp: number;
    hits: number;
    lastAccessed: number;
  }>();
  
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      ttl: 10 * 60 * 1000, // 10 minutes default
      maxSize: 100,
      staleWhileRevalidate: true,
      ...config
    };
  }

  set(key: string, data: any, customTtl?: number): void {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.config.maxSize) {
      this.evictLeastRecentlyUsed();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hits: 0,
      lastAccessed: Date.now()
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // Update access statistics
    item.hits++;
    item.lastAccessed = Date.now();

    // Check if item is expired
    const isExpired = Date.now() - item.timestamp > this.config.ttl;
    
    if (isExpired) {
      if (this.config.staleWhileRevalidate) {
        // Return stale data but trigger revalidation
        this.triggerRevalidation(key);
        return item.data;
      } else {
        this.cache.delete(key);
        return null;
      }
    }

    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    const isExpired = Date.now() - item.timestamp > this.config.ttl;
    if (isExpired && !this.config.staleWhileRevalidate) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  getStats() {
    const items = Array.from(this.cache.values());
    return {
      size: this.cache.size,
      totalHits: items.reduce((sum, item) => sum + item.hits, 0),
      avgHits: items.length ? items.reduce((sum, item) => sum + item.hits, 0) / items.length : 0,
      oldestItem: Math.min(...items.map(item => item.timestamp)),
      newestItem: Math.max(...items.map(item => item.timestamp))
    };
  }

  private evictLeastRecentlyUsed(): void {
    let lruKey = '';
    let lruTime = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccessed < lruTime) {
        lruTime = item.lastAccessed;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
    }
  }

  private triggerRevalidation(key: string): void {
    // Placeholder for revalidation logic
    // In a real implementation, this would trigger a background fetch
    setTimeout(() => {
      console.log(`Revalidating cache key: ${key}`);
    }, 0);
  }
}

// Global cache instances for different data types
export const imageCache = new AdvancedCache({
  ttl: 30 * 60 * 1000, // 30 minutes for images
  maxSize: 50,
  staleWhileRevalidate: true
});

export const apiCache = new AdvancedCache({
  ttl: 5 * 60 * 1000, // 5 minutes for API responses
  maxSize: 100,
  staleWhileRevalidate: true
});

export const routeCache = new AdvancedCache({
  ttl: 60 * 60 * 1000, // 1 hour for route data
  maxSize: 20,
  staleWhileRevalidate: false
});

// Utility functions for cache management
export const getCacheKey = (url: string, params?: Record<string, any>): string => {
  const baseKey = url;
  if (!params) return baseKey;
  
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${JSON.stringify(params[key])}`)
    .join('&');
  
  return `${baseKey}?${sortedParams}`;
};

// Cache warming for critical resources
export const warmCache = async (criticalUrls: string[]): Promise<void> => {
  const warmPromises = criticalUrls.map(async (url) => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        apiCache.set(url, data);
      }
    } catch (error) {
      console.warn(`Failed to warm cache for ${url}:`, error);
    }
  });

  await Promise.allSettled(warmPromises);
};

// Performance monitoring for cache effectiveness
export const monitorCachePerformance = (): void => {
  if (typeof window !== 'undefined') {
    setInterval(() => {
      const imageStats = imageCache.getStats();
      const apiStats = apiCache.getStats();
      const routeStats = routeCache.getStats();

      if (import.meta.env.DEV) {
        console.log('Cache Performance Stats:', {
          images: imageStats,
          api: apiStats,
          routes: routeStats
        });
      }
    }, 60000); // Log every minute in development
  }
};

// Initialize cache monitoring
if (import.meta.env.DEV) {
  monitorCachePerformance();
}

export default AdvancedCache;