import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProperties = () => {
  const queryClient = useQueryClient();

  const { data: properties = [], isLoading: loading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      console.log('🔍 useProperties: Making API call to fetch properties');
      
      try {
        // Add timeout handling and better error handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false })
          .abortSignal(controller.signal);
        
        clearTimeout(timeoutId);
        
        if (error) {
          console.error('❌ useProperties: Database error:', error);
          throw error;
        }
        
        console.log('✅ useProperties: Successfully fetched', data?.length || 0, 'properties');
        console.log('📊 useProperties: First few properties:', data?.slice(0, 3));
        return data || [];
      } catch (fetchError: any) {
        console.error('❌ useProperties: Fetch error:', fetchError);
        
        // Provide more specific error messages
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        } else if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
          throw new Error('Network connection failed. Please check your internet connection and try again.');
        } else if (fetchError.message && fetchError.message.includes('Failed to fetch')) {
          throw new Error('Unable to connect to the server. Please check your connection and try again.');
        }
        
        throw fetchError;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      // Retry up to 3 times for network errors, but not for other errors
      if (failureCount < 3) {
        const errorMessage = error?.message || '';
        if (errorMessage.includes('Network connection failed') || 
            errorMessage.includes('timeout') || 
            errorMessage.includes('Unable to connect')) {
          console.log(`🔄 useProperties: Retrying... (attempt ${failureCount + 1}/3)`);
          return true;
        }
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  const deleteProperty = async (id: string) => {
    if (!id) {
      throw new Error('Property ID is required for deletion');
    }
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('Invalid property ID format');
    }
    
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Refresh the query
    queryClient.invalidateQueries({ queryKey: ['properties'] });
  };

  const refreshProperties = () => {
    queryClient.invalidateQueries({ queryKey: ['properties'] });
  };

  return {
    properties,
    loading,
    error: error?.message,
    deleteProperty,
    refreshProperties
  };
};