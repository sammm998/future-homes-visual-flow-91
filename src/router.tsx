import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  // Ported from the pre-migration src/App.tsx QueryClient config.
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10 * 60 * 1000, // 10 minutes - increased for better caching
        gcTime: 30 * 60 * 1000, // 30 minutes - increased for better performance
        refetchOnWindowFocus: false,
        refetchOnMount: false, // Prevent unnecessary refetches
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors (client errors)
          if (error?.message?.includes("400") || error?.message?.includes("404")) {
            return false;
          }
          // Retry only once for network errors to improve perceived speed
          return failureCount < 1;
        },
        retryDelay: 1000, // Fixed 1s delay
        networkMode: "offlineFirst", // Better handling for poor connections
      },
      mutations: {
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors
          if (error?.message?.includes("400") || error?.message?.includes("404")) {
            return false;
          }
          return failureCount < 1; // Reduced retries
        },
        retryDelay: 1000, // Fixed 1s delay
        networkMode: "offlineFirst",
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
