import React, { lazy, Suspense, memo } from 'react';

interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export const LazyComponent: React.FC<LazyComponentProps> = memo(({ 
  children, 
  fallback = <div className="w-full h-32 bg-muted animate-pulse rounded-lg" />,
  className 
}) => {
  return (
    <Suspense fallback={fallback}>
      <div className={className}>
        {children}
      </div>
    </Suspense>
  );
});

LazyComponent.displayName = 'LazyComponent';

// Create lazy-loaded components for heavy sections with preloading hints
export const LazyTestimonials = lazy(() => 
  import('@/components/ui/circular-testimonials').then(module => ({
    default: module.default
  }))
);

export const LazyShuffleGrid = lazy(() => 
  import('@/components/FeaturedPropertiesShowcase').then(module => ({
    default: module.default
  }))
);

export const LazyPropertyShowcase = lazy(() => 
  import('@/components/PropertyShowcase').then(module => ({
    default: module.default
  }))
);

export const LazyFeaturedProperties = lazy(() => 
  import('@/components/FeaturedPropertiesShowcase').then(module => ({
    default: module.default
  }))
);

export const LazyNewsInsights = lazy(() => 
  import('@/components/NewsInsights').then(module => ({
    default: module.default
  }))
);