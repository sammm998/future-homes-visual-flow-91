import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import futureHomesLogo from '@/assets/future-homes-logo.png';
import { imageCache } from '@/utils/imageCache';

interface OptimizedPropertyImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  showCenteredLogo?: boolean;
}

export const OptimizedPropertyImage: React.FC<OptimizedPropertyImageProps> = ({
  src,
  alt,
  className,
  priority = false,
  width = 400,
  height = 300,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  showCenteredLogo = false
}) => {
  // Helper to validate image URL
  const isValidImageUrl = (url: string | undefined | null): boolean => {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    if (!trimmed || trimmed === '' || trimmed === 'null' || trimmed === 'undefined') return false;
    if (trimmed.includes('placeholder.svg')) return false;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:')) return false;
    return true;
  };

  // Get valid source or default
  const getValidSrc = (originalSrc: string): string => {
    if (isValidImageUrl(originalSrc)) return originalSrc;
    return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
  };

  const validSrc = getValidSrc(src);
  
  // Check if image is already cached - if so, skip loading state entirely
  const isCached = imageCache.isCached(validSrc);
  
  const [isLoading, setIsLoading] = useState(!isCached);
  const [error, setError] = useState(false);
  const [fallbackAttempts, setFallbackAttempts] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(validSrc);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Immediately preload to cache if priority
  useEffect(() => {
    if (priority && validSrc) {
      imageCache.preload(validSrc);
    }
  }, [priority, validSrc]);

  // Fallback image sources - improved for faster fallback
  const getFallbackSrc = (originalSrc: string, attemptNumber: number): string => {
    if (attemptNumber === 0) return originalSrc;
    
    // For CDN images that fail, go straight to Unsplash fallback
    if (originalSrc.includes('cdn.futurehomesturkey.com')) {
      return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
    }
    
    // Try without query params for Supabase
    if (attemptNumber === 1 && originalSrc.includes('supabase')) {
      try {
        const url = new URL(originalSrc);
        url.search = '';
        return url.toString();
      } catch {
        return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
      }
    }
    
    // Default fallback for any other failed image
    return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
  };

  // Create optimized image URLs - return as-is to avoid transformation issues
  const createOptimizedUrl = (originalUrl: string, targetWidth: number) => {
    if (!originalUrl || originalUrl.includes('placeholder.svg') || originalUrl.startsWith('data:')) {
      return originalUrl;
    }
    
    // Return URLs as-is to avoid transformation failures
    // Both Supabase and CDN URLs should work without additional parameters
    return originalUrl;
  };

  // Create different sizes for responsive loading
  const createSrcSet = (baseSrc: string) => {
    if (!baseSrc || baseSrc.includes('placeholder.svg') || baseSrc.startsWith('data:')) return '';

    const widths = [400, 600, 800, 1200];
    return widths
      .map(w => `${createOptimizedUrl(baseSrc, w)} ${w}w`)
      .join(', ');
  };

  // Blur placeholder as base64
  const blurPlaceholder = "data:image/svg+xml;base64," + btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
    </svg>
  `);

  useEffect(() => {
    // Reset state when src changes
    setFallbackAttempts(0);
    setError(false);
    
    const newValidSrc = getValidSrc(src);
    
    // Check cache first - if cached, no loading needed
    if (imageCache.isCached(newValidSrc)) {
      setCurrentSrc(newValidSrc);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setCurrentSrc(newValidSrc);
    
    // Preload to cache for future use
    imageCache.preload(newValidSrc);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    
    // Try fallback sources before showing error
    if (fallbackAttempts < 3) {
      const nextAttempt = fallbackAttempts + 1;
      const fallbackSrc = getFallbackSrc(src, nextAttempt);
      setFallbackAttempts(nextAttempt);
      setCurrentSrc(fallbackSrc);
      setError(false);
      setIsLoading(true);
      return;
    }
    
    // All fallbacks failed
    setError(true);
    setIsLoading(false);
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Loading placeholder */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse"
          style={{
            backgroundImage: `url(${blurPlaceholder})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}
      
      {/* Actual image */}
      <img
        ref={imgRef}
        src={currentSrc ? createOptimizedUrl(currentSrc, width) : blurPlaceholder}
        srcSet={currentSrc ? createSrcSet(currentSrc) : undefined}
        sizes={sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-all duration-500",
          isLoading ? "opacity-0 scale-105 blur-sm" : "opacity-100 scale-100 blur-0",
          error && "opacity-50",
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
      
      {/* Logo stamp overlay */}
      {!isLoading && !error && (
        <div className={cn(
          "absolute opacity-90",
          showCenteredLogo 
            ? "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
            : "bottom-4 right-4"
        )}>
          <img 
            src={futureHomesLogo} 
            alt="Future Homes" 
            className={cn(
              "h-auto drop-shadow-lg bg-white/80 backdrop-blur-sm rounded-lg p-2",
              showCenteredLogo ? "w-24" : "w-16"
            )}
          />
        </div>
      )}
      
      {/* Error state with better fallback */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/80 to-muted">
          <div className="text-center text-muted-foreground p-4">
            <div className="w-16 h-16 mx-auto mb-3 opacity-60">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <p className="text-sm font-medium">Property Image</p>
            <p className="text-xs opacity-75">Available upon request</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedPropertyImage;