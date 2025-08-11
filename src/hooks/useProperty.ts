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
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  return {
    property,
    loading,
    error: error?.message
  };
};