import React, { Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { useRoutePreloader } from '@/hooks/useCriticalImagePreloader';

interface LazyRouteWrapperProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
}

const DefaultFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p className="text-muted-foreground text-sm">Loading...</p>
    </div>
  </div>
);

export const LazyRouteWrapper: React.FC<LazyRouteWrapperProps> = ({
  children,
  fallback: Fallback = DefaultFallback
}) => {
  const location = useLocation();
  
  // Preload next likely routes based on current route
  useRoutePreloader(location.pathname);

  return (
    <Suspense fallback={<Fallback />}>
      {children}
    </Suspense>
  );
};

export default LazyRouteWrapper;