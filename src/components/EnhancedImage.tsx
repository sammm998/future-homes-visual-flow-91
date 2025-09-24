import React, { useState, useRef, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';

interface EnhancedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: string;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png' | 'auto';
  lazy?: boolean;
}

const EnhancedImage: React.FC<EnhancedImageProps> = memo(({
  src,
  alt,
  className,
  priority = false,
  width,
  height,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  onLoad,
  onError,
  placeholder = '/placeholder.svg',
  quality = 85,
  format = 'auto',
  lazy = true
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : placeholder);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate optimized image URLs
  const getOptimizedSrc = (originalSrc: string) => {
    if (originalSrc.includes('supabase.co/storage/')) {
      const url = new URL(originalSrc);
      if (width) url.searchParams.set('width', width.toString());
      if (quality !== 85) url.searchParams.set('quality', quality.toString());
      if (format !== 'auto') url.searchParams.set('format', format);
      return url.toString();
    }
    return originalSrc;
  };

  // Create srcSet for responsive images
  const createSrcSet = (baseSrc: string) => {
    if (!baseSrc.includes('supabase.co/storage/')) return '';
    
    const breakpoints = [320, 640, 768, 1024, 1280, 1920];
    return breakpoints
      .map(bp => {
        const url = new URL(baseSrc);
        url.searchParams.set('width', bp.toString());
        url.searchParams.set('quality', quality.toString());
        if (format !== 'auto') url.searchParams.set('format', format);
        return `${url.toString()} ${bp}w`;
      })
      .join(', ');
  };

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (priority || !lazy) {
      setIsInView(true);
      return;
    }

    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => observerRef.current?.disconnect();
  }, [priority, lazy]);

  // Load actual image when in view
  useEffect(() => {
    if (isInView && currentSrc === placeholder) {
      setCurrentSrc(getOptimizedSrc(src));
    }
  }, [isInView, src, placeholder, currentSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
    setIsError(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsError(true);
    setIsLoaded(false);
    setCurrentSrc(placeholder);
    onError?.();
  };

  const optimizedSrc = getOptimizedSrc(currentSrc);
  const srcSet = createSrcSet(src);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Placeholder/skeleton while loading */}
      {!isLoaded && currentSrc !== placeholder && (
        <div 
          className={cn(
            'absolute inset-0 bg-muted animate-pulse',
            'bg-gradient-to-br from-muted to-muted-foreground/10'
          )}
          style={{ width, height }}
        />
      )}
      
      <img
        ref={imgRef}
        src={optimizedSrc}
        srcSet={isInView && srcSet ? srcSet : undefined}
        sizes={isInView && srcSet ? sizes : undefined}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-all duration-300 ease-in-out',
          isLoaded ? 'opacity-100' : 'opacity-0',
          isError && 'opacity-50',
          className
        )}
        style={{
          aspectRatio: width && height ? `${width}/${height}` : undefined,
          objectFit: 'cover',
          width: width || '100%',
          height: height || 'auto'
        }}
      />

      {/* Error state */}
      {isError && currentSrc === placeholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center text-muted-foreground">
            <div className="w-8 h-8 mx-auto mb-2 opacity-50">📷</div>
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
});

EnhancedImage.displayName = 'EnhancedImage';

export default EnhancedImage;