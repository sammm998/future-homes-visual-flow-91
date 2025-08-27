import React, { useState, useRef, useEffect } from 'react';
import { optimizeLovableImage, generateResponsiveSrcSet, generateSizesAttribute, getBestImageFormat } from '@/utils/imageOptimizer';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
  responsive?: boolean;
  quality?: number;
  lqip?: string; // Low Quality Image Placeholder
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  style,
  onClick,
  responsive = true,
  quality = 85,
  lqip
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(lqip || '');
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate optimized image URLs
  const optimizedSrc = optimizeLovableImage(src, { 
    quality, 
    width, 
    height,
    format: getBestImageFormat()
  });
  
  const srcSet = responsive ? generateResponsiveSrcSet(src) : undefined;
  const sizes = responsive ? generateSizesAttribute() : undefined;

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Progressive loading effect
  useEffect(() => {
    if (!isInView || !imgRef.current) return;

    const img = new Image();
    
    img.onload = () => {
      setCurrentSrc(optimizedSrc);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setHasError(true);
    };
    
    img.src = optimizedSrc;
  }, [isInView, optimizedSrc]);

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={style}
      onClick={onClick}
    >
      {/* Progressive loading with blur effect */}
      {lqip && !isLoaded && (
        <img
          src={lqip}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-105 transition-opacity duration-300"
          style={{ width, height }}
        />
      )}
      
      {!isLoaded && !hasError && !lqip && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="text-muted-foreground text-sm">Loading...</div>
        </div>
      )}
      
      {hasError && (
        <div 
          className="absolute inset-0 bg-muted flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="text-muted-foreground text-sm">Failed to load</div>
        </div>
      )}

      <img
        ref={imgRef}
        src={currentSrc || optimizedSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-300 ${
          isLoaded ? 'opacity-100 filter-none scale-100' : 'opacity-0'
        } ${lqip ? 'absolute inset-0' : ''}`}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'low'}
        decoding="async"
        width={width}
        height={height}
        onLoad={() => {
          setIsLoaded(true);
          if (lqip) {
            // Remove blur effect
            const lqipImg = imgRef.current?.previousElementSibling as HTMLElement;
            if (lqipImg) {
              lqipImg.style.opacity = '0';
            }
          }
        }}
        onError={() => setHasError(true)}
        style={{
          width: width ? `${width}px` : undefined,
          height: height ? `${height}px` : undefined,
        }}
      />
    </div>
  );
};