import React, { useState, useRef, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';
import { getOptimizedImageUrl } from '@/utils/imageOptimization';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
}

export const LazyImage: React.FC<LazyImageProps> = memo(({
  src,
  alt,
  className,
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3C/svg%3E",
  onLoad,
  onError,
  priority = false,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(priority ? src : placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!imgRef.current || priority) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && imageSrc === placeholder) {
            setImageSrc(src);
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start loading 50px before entering viewport
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => observerRef.current?.disconnect();
  }, [src, imageSrc, placeholder, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setIsError(true);
    setImageSrc(placeholder);
    onError?.();
  };

  const optimizedSrc = getOptimizedImageUrl(imageSrc, props.width as number);

  return (
    <img
      ref={imgRef}
      src={optimizedSrc}
      alt={alt}
      className={cn(
        'transition-opacity duration-300',
        isLoaded && !isError ? 'opacity-100' : 'opacity-80',
        className
      )}
      onLoad={handleLoad}
      onError={handleError}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      {...props}
    />
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;