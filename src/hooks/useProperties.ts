import { useQuery, useQueryClient } from '@tanstack/react-query';
import { enhancedSupabase, fallbackPropertyData } from '@/lib/supabase-enhanced';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';

import { useTranslation } from '@/hooks/useTranslation';
import { propertySearchOptions } from '@/lib/propertySearchQuery';

export const useProperties = (city?: string) => {
  const queryClient = useQueryClient();
  const { isOnline } = useConnectionStatus();
  const { lang } = useTranslation();

  const { data: properties = [], isLoading: loading, error } = useQuery<any[], Error>(
    propertySearchOptions(queryClient, lang, city, isOnline),
  );

  // NOTE: We intentionally do NOT preload property images here.
  // The raw Supabase originals are multi-megabyte files; cards render
  // CDN-resized variants via <img srcset> with native lazy loading,
  // so any eager preload only wastes bandwidth and delays LCP.

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
    queryClient.invalidateQueries({ queryKey: ['property-search-source'] });
  };

  const refreshProperties = () => {
    queryClient.invalidateQueries({ queryKey: ['properties'] });
    queryClient.invalidateQueries({ queryKey: ['property-search-source'] });
  };

  return {
    properties,
    loading,
    error: error?.message,
    deleteProperty,
    refreshProperties
  };
};