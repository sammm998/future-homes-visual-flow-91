import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  style?: React.CSSProperties;
  onClick?: () => void;
  'data-index'?: number;
  webpSrc?: string;
  avifSrc?: string;
}

export const OptimizedImageLoader: React.FC<OptimizedImageLoaderProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  quality = 85,
  style,
  onClick,
  webpSrc,
  avifSrc,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  // Progressive image loading: try modern formats first
  const tryLoadImage = useCallback(async () => {
    const sources = [
      avifSrc && `${avifSrc}?quality=${quality}&w=${width || 800}`,
      webpSrc && `${webpSrc}?quality=${quality}&w=${width || 800}`,
      `${src}?quality=${quality}&w=${width || 800}`
    ].filter(Boolean);

    for (const source of sources) {
      try {
        const img = new Image();
        img.src = source;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        setCurrentSrc(source);
        return;
      } catch {
        continue;
      }
    }
    
    // If all modern formats fail, try original
    setCurrentSrc(src);
  }, [src, webpSrc, avifSrc, quality, width]);

  useEffect(() => {
    if (!priority) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        { 
          threshold: 0.1, 
          rootMargin: '100px' // Load images 100px before they come into view
        }
      );

      if (placeholderRef.current) {
        observer.observe(placeholderRef.current);
      }

      return () => observer.disconnect();
    }
  }, [priority]);

  useEffect(() => {
    if (isInView && !currentSrc) {
      tryLoadImage();
    }
  }, [isInView, tryLoadImage, currentSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const skeletonStyle = {
    width: width || '100%',
    height: height || 'auto',
    aspectRatio: width && height ? `${width}/${height}` : undefined,
  };

  return (
    <div
      ref={placeholderRef}
      className={cn('relative overflow-hidden', className)}
      style={style}
      onClick={onClick}
      {...props}
    >
      {/* Skeleton loader */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse rounded-inherit"
          style={skeletonStyle}
        />
      )}
      
      {/* Error state */}
      {hasError && (
        <div 
          className="absolute inset-0 bg-muted flex items-center justify-center rounded-inherit"
          style={skeletonStyle}
        >
          <div className="text-muted-foreground text-sm">
            Image unavailable
          </div>
        </div>
      )}

      {/* Actual image */}
      {isInView && currentSrc && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          className={cn(
            'transition-opacity duration-500 rounded-inherit',
            isLoaded && !hasError ? 'opacity-100' : 'opacity-0',
            className
          )}
          style={style}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          width={width}
          height={height}
          {...props}
        />
      )}
    </div>
  );
};