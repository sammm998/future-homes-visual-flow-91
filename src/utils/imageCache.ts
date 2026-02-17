// Global image cache system for instant image loading
class ImageCacheManager {
  private cache: Map<string, HTMLImageElement> = new Map();
  private loading: Set<string> = new Set();
  private preloadQueue: string[] = [];
  private isProcessing = false;

  // Preload a single image and store in cache
  preload(url: string): Promise<void> {
    if (!url || this.cache.has(url) || this.loading.has(url)) {
      return Promise.resolve();
    }

    // Skip placeholder images
    if (url.includes('placeholder') || url.startsWith('data:')) {
      return Promise.resolve();
    }

    this.loading.add(url);

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.cache.set(url, img);
        this.loading.delete(url);
        resolve();
      };
      img.onerror = () => {
        this.loading.delete(url);
        resolve();
      };
      // Use high priority for faster loading
      img.fetchPriority = 'high';
      img.decoding = 'async';
      img.src = url;
    });
  }

  // Batch preload multiple images
  async preloadBatch(urls: string[]): Promise<void> {
    const validUrls = urls.filter(url => 
      url && 
      !this.cache.has(url) && 
      !this.loading.has(url) &&
      !url.includes('placeholder') &&
      !url.startsWith('data:')
    );

    // Preload first 3 immediately (high priority)
    const immediate = validUrls.slice(0, 3);
    await Promise.all(immediate.map(url => this.preload(url)));

    // Queue the rest for background loading
    const rest = validUrls.slice(6);
    this.preloadQueue.push(...rest);
    this.processQueue();
  }

  // Process background preload queue
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.preloadQueue.length === 0) return;
    
    this.isProcessing = true;

    while (this.preloadQueue.length > 0) {
      const batch = this.preloadQueue.splice(0, 4);
      await Promise.all(batch.map(url => this.preload(url)));
      // Small delay to not block main thread
      await new Promise(r => setTimeout(r, 50));
    }

    this.isProcessing = false;
  }

  // Check if image is cached
  isCached(url: string): boolean {
    return this.cache.has(url);
  }

  // Get cached image element
  getCached(url: string): HTMLImageElement | undefined {
    return this.cache.get(url);
  }

  // Clear cache (for memory management)
  clear(): void {
    this.cache.clear();
    this.loading.clear();
    this.preloadQueue = [];
  }

  // Get cache stats
  getStats(): { cached: number; loading: number; queued: number } {
    return {
      cached: this.cache.size,
      loading: this.loading.size,
      queued: this.preloadQueue.length,
    };
  }
}

// Singleton instance
export const imageCache = new ImageCacheManager();

// Helper to preload property images
export const preloadPropertyImages = (properties: any[]): void => {
  const imageUrls: string[] = [];

  properties.forEach(property => {
    // Primary image
    if (property.property_image) {
      imageUrls.push(property.property_image);
    }
    if (property.image) {
      imageUrls.push(property.image);
    }
    // First 2 from gallery
    if (property.property_images && Array.isArray(property.property_images)) {
      imageUrls.push(...property.property_images.slice(0, 2));
    }
  });

  imageCache.preloadBatch(imageUrls);
};

// Preload images for next page of results
export const preloadNextPageImages = (properties: any[]): void => {
  const imageUrls = properties
    .slice(0, 8)
    .map(p => p.property_image || p.image)
    .filter(Boolean);
  
  imageCache.preloadBatch(imageUrls);
};

export default imageCache;
