import { useQuery, useQueryClient } from '@tanstack/react-query';
import { enhancedSupabase, resilientQuery, fallbackPropertyData } from '@/lib/supabase-enhanced';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';

export const useProperties = () => {
  const queryClient = useQueryClient();
  const { isOnline } = useConnectionStatus();

  const { data: properties = [], isLoading: loading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      try {
        const data = await resilientQuery(async () => {
          const { data, error } = await enhancedSupabase
            .from('properties')
            .select('*, slug_sv, slug_tr, slug_ar, slug_ru, slug_no, slug_da, slug_fa, slug_ur')
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          
          return data || [];
        }, 3, 1500);
        
        return data;
      } catch (err: any) {
        // Return fallback data if offline or blocked
        if (!isOnline || err.message?.includes('network') || err.message?.includes('timeout')) {
          return fallbackPropertyData;
        }
        
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // Reduced to 5 minutes for faster updates
    gcTime: 15 * 60 * 1000, // Reduced to 15 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 3000,
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