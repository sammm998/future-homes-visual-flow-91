// Image optimization utilities for better performance

export const getOptimizedImageUrl = (url: string, width?: number, quality = 80): string => {
  if (!url) return '/placeholder.svg';
  
  // If it's already a placeholder or local image, return as is
  if (url.includes('placeholder.svg') || url.startsWith('/')) {
    return url;
  }
  
  // For external images, try to optimize if possible
  if (url.includes('cdn.futurehomesturkey.com')) {
    // If width is specified, try to use thumbnail version
    if (width && width < 400 && !url.includes('/thumbs/')) {
      return url.replace('/uploads/', '/uploads/thumbs/');
    }
  }
  
  return url;
};

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

export const preloadCriticalImages = (urls: string[]) => {
  // Preload only the first few critical images
  const criticalUrls = urls.slice(0, 3);
  
  criticalUrls.forEach(url => {
    if (url && !url.includes('placeholder.svg')) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = getOptimizedImageUrl(url, 400);
      document.head.appendChild(link);
    }
  });
};

export const createImageSrcSet = (baseUrl: string): string => {
  if (!baseUrl || baseUrl.includes('placeholder.svg')) {
    return baseUrl;
  }
  
  // Create different sizes for responsive images
  const sizes = [320, 640, 1024, 1280];
  const srcSet = sizes.map(size => 
    `${getOptimizedImageUrl(baseUrl, size)} ${size}w`
  ).join(', ');
  
  return srcSet;
};