import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProperties = () => {
  const queryClient = useQueryClient();

  const { data: properties = [], isLoading: loading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      console.log('🔍 useProperties: Making API call to fetch properties');
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ useProperties: Database error:', error);
        throw error;
      }
      
      console.log('✅ useProperties: Successfully fetched', data?.length || 0, 'properties');
      console.log('📊 useProperties: First few properties:', data?.slice(0, 3));
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 1,
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