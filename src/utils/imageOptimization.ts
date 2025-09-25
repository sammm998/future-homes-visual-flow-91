// Enhanced image optimization utilities for better performance

export const getOptimizedImageUrl = (url: string, width?: number, quality = 85): string => {
  if (!url) return '/placeholder.svg';
  
  // If it's already a placeholder or data URL, return as is
  if (url.includes('placeholder.svg') || url.startsWith('data:') || url.startsWith('/')) {
    return url;
  }
  
  // For Supabase storage URLs, add optimization parameters
  if (url.includes('supabase') && url.includes('storage')) {
    try {
      const optimizedUrl = new URL(url);
      if (width) optimizedUrl.searchParams.set('width', width.toString());
      optimizedUrl.searchParams.set('quality', quality.toString());
      optimizedUrl.searchParams.set('format', 'webp');
      return optimizedUrl.toString();
    } catch {
      return url; // Return original if URL parsing fails
    }
  }
  
  // For external CDN images, try to optimize
  if (url.includes('cdn.futurehomesturkey.com')) {
    if (width && width < 400 && !url.includes('/thumbs/')) {
      return url.replace('/uploads/', '/uploads/thumbs/');
    }
  }
  
  return url;
};

export const preloadImage = (src: string, priority = false): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (priority) {
      img.fetchPriority = 'high';
    }
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

export const preloadCriticalImages = (urls: string[], maxImages = 3) => {
  // Preload only the most critical images to avoid overwhelming the network
  const criticalUrls = urls.slice(0, maxImages);
  
  criticalUrls.forEach((url, index) => {
    if (url && !url.includes('placeholder.svg') && !url.startsWith('data:')) {
      const optimizedUrl = getOptimizedImageUrl(url, 400);
      
      // Use high priority preload for first image only
      if (index === 0) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = optimizedUrl;
        link.fetchPriority = 'high';
        document.head.appendChild(link);
      } else {
        // Regular image preloading for others
        preloadImage(optimizedUrl);
      }
    }
  });
};

export const createImageSrcSet = (baseUrl: string, sizes = [320, 640, 960, 1280]): string => {
  if (!baseUrl || baseUrl.includes('placeholder.svg') || baseUrl.startsWith('data:')) {
    return baseUrl;
  }
  
  // Create different sizes for responsive images
  const srcSet = sizes.map(size => 
    `${getOptimizedImageUrl(baseUrl, size)} ${size}w`
  ).join(', ');
  
  return srcSet;
};

// Compress images client-side if needed
export const compressImage = (file: File, maxWidth = 1920, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(resolve!, 'image/webp', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};