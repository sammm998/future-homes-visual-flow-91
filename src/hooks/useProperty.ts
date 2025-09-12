import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProperty = (id: string) => {
  const { data: property, isLoading: loading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Property ID is required');
      }
      
      // Validate UUID format before making the request
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        // Return null for invalid UUID format instead of throwing error
        return null;
      }
      
      // Create timeout for better connection handling (Dubai users)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 30000); // 30 second timeout
      
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        
        clearTimeout(timeoutId);
        
        if (error) {
          throw error;
        }
        
        return data;
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          throw new Error('Request timeout - please check your internet connection');
        }
        throw err;
      }
    },
    enabled: !!id,
    retry: (failureCount, error) => {
      // Don't retry on timeout or abort errors after 3 attempts
      if (error?.message?.includes('timeout') || error?.message?.includes('AbortError')) {
        return failureCount < 3;
      }
      // Don't retry on 4xx client errors
      if (error?.message?.includes('400') || error?.message?.includes('404')) {
        return false;
      }
      // Retry up to 5 times for network errors (good for Dubai users)
      return failureCount < 5;
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff: 2s, 4s, 8s, 16s, 30s max
      return Math.min(2000 * Math.pow(2, attemptIndex), 30000);
    },
    networkMode: 'offlineFirst',
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    property,
    loading,
    error: error?.message
  };
};