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
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Create optimized image URLs
  const createOptimizedUrl = (originalUrl: string, targetWidth: number) => {
    if (!originalUrl || originalUrl.includes('placeholder.svg') || originalUrl.startsWith('data:')) {
      return originalUrl;
    }
    
    // If it's a Supabase storage URL, add optimization parameters
    if (originalUrl.includes('supabase') && originalUrl.includes('storage')) {
      const url = new URL(originalUrl);
      url.searchParams.set('width', targetWidth.toString());
      url.searchParams.set('quality', '85');
      url.searchParams.set('format', 'webp');
      return url.toString();
    }
    
    return originalUrl;
  };

  // Create different sizes for responsive loading
  const createSrcSet = () => {
    if (!src || src.includes('placeholder.svg')) return '';
    
    const sizes = [320, 640, 960, 1280];
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
    setIsLoading(false);
  };

  const handleError = () => {
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
        sizes={sizes}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          isLoading ? "opacity-0" : "opacity-100",
          error && "opacity-50",
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
      
      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center text-muted-foreground">
            <div className="w-12 h-12 mx-auto mb-2 opacity-50">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
            </div>
            <p className="text-xs">Image not available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedPropertyImage;