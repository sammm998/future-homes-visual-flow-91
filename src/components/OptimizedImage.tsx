import React, { useState, useRef, useEffect } from 'react';
import futureHomesLogo from '@/assets/future-homes-logo.png';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
  'data-index'?: number;
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
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

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

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setIsLoaded(true); // Still set loaded to remove skeleton
  };

  return (
    <div
      ref={imgRef}
      className={`relative ${className}`}
      style={style}
      onClick={onClick}
      {...props}
    >
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse rounded-inherit"
          style={{ width, height }}
        />
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          style={style}
          onLoad={handleLoad}
          onError={handleError}
          loading="eager"
          decoding="async"
          width={width}
          height={height}
          {...props}
        />
      )}
      
      {/* Logo stamp overlay - only show for property images */}
      {isLoaded && alt.toLowerCase().includes('property') && (
        <div className="absolute bottom-2 right-2 opacity-90">
          <img 
            src={futureHomesLogo} 
            alt="Future Homes" 
            className="w-10 h-auto drop-shadow-lg bg-white/80 backdrop-blur-sm rounded p-1"
          />
        </div>
      )}
    </div>
  );
};