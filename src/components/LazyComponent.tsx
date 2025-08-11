import React, { lazy, Suspense } from 'react';

interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export const LazyComponent: React.FC<LazyComponentProps> = ({ 
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
};

// Create lazy-loaded components for heavy sections
export const LazyTestimonials = lazy(() => import('@/components/ui/circular-testimonials'));
export const LazyShuffleGrid = lazy(() => import('@/components/ShuffleGrid'));
export const LazyPropertyShowcase = lazy(() => import('@/components/PropertyShowcase'));
export const LazyFeaturedProperties = lazy(() => import('@/components/FeaturedPropertiesShowcase'));
export const LazyNewsInsights = lazy(() => import('@/components/NewsInsights'));