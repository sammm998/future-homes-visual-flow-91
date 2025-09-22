import { useQuery, useQueryClient } from '@tanstack/react-query';
import { enhancedSupabase, resilientQuery, fallbackPropertyData } from '@/lib/supabase-enhanced';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';

export const useProperties = () => {
  const queryClient = useQueryClient();
  const { isOnline } = useConnectionStatus();

  const { data: properties = [], isLoading: loading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      console.log('🔍 useProperties: Making resilient API call to fetch properties');
      
      try {
        const data = await resilientQuery(async () => {
          const { data, error } = await enhancedSupabase
            .from('properties')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (error) {
            console.error('❌ useProperties: Database error:', error);
            throw error;
          }
          
          return data || [];
        }, 5, 2000); // 5 retries with 2s base delay
        
        console.log('✅ useProperties: Successfully fetched', data?.length || 0, 'properties');
        return data;
      } catch (err: any) {
        console.error('❌ useProperties: All retries failed:', err);
        
        // Return fallback data if offline or blocked
        if (!isOnline || err.message?.includes('network') || err.message?.includes('timeout')) {
          console.log('🔄 useProperties: Returning fallback data due to connectivity issues');
          return fallbackPropertyData;
        }
        
        throw err;
      }
    },
    staleTime: 15 * 60 * 1000, // Increased to 15 minutes for UAE users
    gcTime: 30 * 60 * 1000, // Increased to 30 minutes
    refetchOnWindowFocus: false,
    retry: 2, // Reduced since resilientQuery handles retries
    retryDelay: 5000,
    networkMode: 'offlineFirst',
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
    
    const { error } = await enhancedSupabase
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