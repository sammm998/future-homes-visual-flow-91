import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AdvancedImageOptimizerProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const AdvancedImageOptimizer: React.FC<AdvancedImageOptimizerProps> = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate optimized image sources with next-gen formats
  const generateOptimizedSources = (originalSrc: string) => {
    if (!originalSrc || originalSrc.includes('placeholder.svg') || originalSrc.startsWith('data:')) {
      return { webp: originalSrc, avif: originalSrc, fallback: originalSrc };
    }

    // For Supabase storage URLs, add optimization parameters
    if (originalSrc.includes('supabase') && originalSrc.includes('storage')) {
      const baseUrl = originalSrc.split('?')[0];
      const params = new URLSearchParams();
      
      if (width) params.set('width', width.toString());
      params.set('quality', '85');
      params.set('resize', 'cover');

      return {
        avif: `${baseUrl}?${params.toString()}&format=avif`,
        webp: `${baseUrl}?${params.toString()}&format=webp`,
        fallback: `${baseUrl}?${params.toString()}&format=jpeg`
      };
    }

    return { webp: originalSrc, avif: originalSrc, fallback: originalSrc };
  };

  // Generate srcSet for responsive images
  const generateSrcSet = (baseSrc: string, format: string) => {
    if (!baseSrc || baseSrc.includes('placeholder.svg') || baseSrc.startsWith('data:')) {
      return baseSrc;
    }

    if (baseSrc.includes('supabase') && baseSrc.includes('storage')) {
      const baseUrl = baseSrc.split('?')[0];
      const widths = [320, 640, 960, 1280, 1920];
      
      return widths.map(w => {
        const params = new URLSearchParams();
        params.set('width', w.toString());
        params.set('quality', '85');
        params.set('resize', 'cover');
        params.set('format', format);
        return `${baseUrl}?${params.toString()} ${w}w`;
      }).join(', ');
    }

    return baseSrc;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => observerRef.current?.disconnect();
  }, [priority]);

  // Set current source when in view
  useEffect(() => {
    if (isInView) {
      const sources = generateOptimizedSources(src);
      setCurrentSrc(sources.fallback);
    }
  }, [isInView, src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    onError?.();
  };

  const sources = generateOptimizedSources(src);

  return (
    <div 
      ref={imgRef}
      className={cn("relative overflow-hidden", className)}
      style={{ width, height }}
    >
      {!isLoaded && isInView && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse rounded-inherit"
          style={{ width, height }}
        />
      )}
      
      {isInView && (
        <picture>
          {/* AVIF format for modern browsers */}
          <source
            srcSet={generateSrcSet(sources.avif, 'avif')}
            sizes={sizes}
            type="image/avif"
          />
          
          {/* WebP format for most browsers */}
          <source
            srcSet={generateSrcSet(sources.webp, 'webp')}
            sizes={sizes}
            type="image/webp"
          />
          
          {/* Fallback JPEG/PNG */}
          <img
            src={currentSrc}
            alt={alt}
            className={cn(
              "transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0",
              className
            )}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            width={width}
            height={height}
            sizes={sizes}
          />
        </picture>
      )}
    </div>
  );
};

export default AdvancedImageOptimizer;