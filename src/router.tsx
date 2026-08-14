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

  // Plain-string search serialization. TanStack's default JSON-based
  // stringifier wraps numeric-looking strings in quotes (referenceNo="1389"),
  // which then round-trips back into inputs as literal quote characters.
  const parseSearch = (searchStr: string): Record<string, string> => {
    const out: Record<string, string> = {};
    new URLSearchParams(searchStr.replace(/^\?/, "")).forEach((v, k) => {
      out[k] = v.replace(/^"(.*)"$/s, "$1");
    });
    return out;
  };

  const stringifySearch = (search: Record<string, unknown>): string => {
    const params = new URLSearchParams();
    Object.entries(search ?? {}).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") return;
      params.set(k, typeof v === "object" ? JSON.stringify(v) : String(v));
    });
    const str = params.toString();
    return str ? `?${str}` : "";
  };

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    parseSearch: parseSearch as never,
    stringifySearch: stringifySearch as never,
  });


  return router;
};
