import { QueryClient } from '@tanstack/react-query';

// Optimized React Query configuration for better caching and performance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes by default
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 1 time only
      retry: 1,
      // Refetch on window focus only for important data
      refetchOnWindowFocus: false,
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
      // Use network-only for initial load, then cache
      networkMode: 'online',
    },
    mutations: {
      retry: 1,
    },
  },
});

// Prefetch common queries for faster navigation
export const prefetchCommonQueries = async () => {
  // Add your most common queries here
  // Example:
  // await queryClient.prefetchQuery({
  //   queryKey: ['properties'],
  //   queryFn: fetchProperties,
  // });
};
