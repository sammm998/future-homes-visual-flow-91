import { useQuery, useQueryClient } from '@tanstack/react-query';
import { enhancedSupabase, fallbackPropertyData } from '@/lib/supabase-enhanced';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';

import { useTranslation } from '@/hooks/useTranslation';

export const useProperties = (city?: string) => {
  const queryClient = useQueryClient();
  const { isOnline } = useConnectionStatus();
  const { lang } = useTranslation();

  const { data: properties = [], isLoading: loading, error } = useQuery<any[], Error>({
    queryKey: ['properties', lang, city ?? 'all'],
    queryFn: async (): Promise<any[]> => {
      try {
        const data = await (async () => {
          // Reuse the original listing rows across languages and fetch translations
          // concurrently, rather than making visitors wait for two serial requests.
          const [baseRows, translated] = await Promise.all([
            queryClient.ensureQueryData<any[]>({
              queryKey: ['property-search-source', city ?? 'all'],
              staleTime: 5 * 60 * 1000,
              queryFn: async () => {
                let query = enhancedSupabase.from('properties').select('*')
                  .eq('is_active', true).or('status.is.null,status.not.ilike.%sold%')
                  .order('created_at', { ascending: false });
                if (city) query = query.ilike('location', `${city}%`);
                const { data, error } = await query;
                if (error) throw error;
                return data ?? [];
              },
            }),
            lang && lang !== 'en'
              ? enhancedSupabase.from('property_translations')
                  .select('property_id, title, description, location')
                  .eq('language_code', lang)
              : Promise.resolve({ data: [] }),
          ]);
          if ('error' in translated && translated.error) throw translated.error;
          let rows = baseRows;

          // Apply translations for current language (skip English)
          if (lang && lang !== 'en' && rows.length > 0) {
            const translations = translated.data;

            if (translations && translations.length > 0) {
              const map = new Map(translations.map((t: any) => [t.property_id, t]));
              rows = rows.map((r: any) => {
                const t: any = map.get(r.id);
                if (!t) return r;
                return {
                  ...r,
                  title: t.title || r.title,
                  description: t.description || r.description,
                  // Keep original English location for filter/prefix matching;
                  // expose translated copy separately for display purposes.
                  location: r.location,
                  location_translated: t.location || null,
                };
              });
            }
          }

          return rows;
        })();
        
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