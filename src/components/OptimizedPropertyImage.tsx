import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedPropertyImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
}

export const OptimizedPropertyImage: React.FC<OptimizedPropertyImageProps> = ({
  src,
  alt,
  className,
  priority = false,
  width = 400,
  height = 300,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : '');
  const [fallbackAttempts, setFallbackAttempts] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Fallback image sources
  const getFallbackSrc = (originalSrc: string, attemptNumber: number): string => {
    // Try original first
    if (attemptNumber === 0) return originalSrc;
    
    // If CDN image fails, try placeholder
    if (attemptNumber === 1) {
      return "/placeholder.svg";
    }
    
    // Final fallback - base64 placeholder
    return blurPlaceholder;
  };

  // Create optimized image URLs
  const createOptimizedUrl = (originalUrl: string, targetWidth: number) => {
    if (!originalUrl || originalUrl.includes('placeholder.svg') || originalUrl.startsWith('data:')) {
      return originalUrl;
    }
    
    // Handle Supabase storage URLs with better optimization
    if (originalUrl.includes('supabase') && originalUrl.includes('storage')) {
      try {
        const url = new URL(originalUrl);
        url.searchParams.set('width', targetWidth.toString());
        url.searchParams.set('quality', '90');
        url.searchParams.set('format', 'webp');
        url.searchParams.set('resize', 'contain');
        return url.toString();
      } catch (error) {
        console.warn('Failed to optimize URL:', originalUrl);
        return originalUrl;
      }
    }
    
    // For external CDN URLs (like cdn.futurehomesturkey.com), return as-is
    if (originalUrl.includes('cdn.futurehomesturkey.com')) {
      return originalUrl;
    }
    
    return originalUrl;
  };

  // Create different sizes for responsive loading
  const createSrcSet = () => {
    if (!src || src.includes('placeholder.svg')) return '';
    
    const sizes = [400, 600, 800, 1200];
    return sizes
      .map(size => `${createOptimizedUrl(src, size)} ${size}w`)
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
    if (priority || !imgRef.current) {
      setCurrentSrc(src);
      return;
    }

    // Intersection Observer for lazy loading
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !currentSrc) {
            setCurrentSrc(src);
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '100px' // Start loading 100px before entering viewport
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => observerRef.current?.disconnect();
  }, [src, priority, currentSrc]);

  const handleLoad = () => {
    console.log('✅ Image loaded successfully:', src);
    setIsLoading(false);
  };

  const handleError = () => {
    console.log('❌ Image failed to load:', currentSrc, 'attempt:', fallbackAttempts);
    
    // Try fallback sources before showing error
    if (fallbackAttempts < 2) {
      const nextAttempt = fallbackAttempts + 1;
      const fallbackSrc = getFallbackSrc(src, nextAttempt);
      console.log('🔄 Trying fallback image:', fallbackSrc);
      setFallbackAttempts(nextAttempt);
      setCurrentSrc(fallbackSrc);
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
        srcSet={currentSrc ? createSrcSet() : undefined}
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