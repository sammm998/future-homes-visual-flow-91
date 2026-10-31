import type { QueryClient } from '@tanstack/react-query';
import { enhancedSupabase, fallbackPropertyData } from '@/lib/supabase-enhanced';
import { readCloudTranslations, pickPropertyTranslation } from '@/lib/cloudPropertyTranslations';

const SEARCH_FIELDS = 'id,ref_no,title,description,location,price,bedrooms,bathrooms,sizes_m2,status,is_active,created_at,property_image,property_images,property_facilities,apartment_types,property_prices_by_room,price_currency,property_district,property_type,buyer_fee_percent,slug,slug_sv,slug_tr,slug_ar,slug_ru,slug_no,slug_da,slug_fa,slug_ur,slug_es,slug_de,slug_fr,slug_id';

export const propertySearchOptions = (queryClient: QueryClient, lang: string, city?: string, isOnline = true) => ({
    queryKey: ['properties', lang, city ?? 'all'],
    queryFn: async (): Promise<any[]> => {
      try {
        const data = await (async () => {
          // Reuse the original listing rows across languages and fetch translations
          // concurrently, rather than making visitors wait for two serial requests.
          const [baseRows, translated, cloudRows] = await Promise.all([
            queryClient.ensureQueryData<any[]>({
              queryKey: ['property-search-source', city ?? 'all'],
              staleTime: 5 * 60 * 1000,
              queryFn: async () => {
                const all = queryClient.getQueryData<any[]>(['property-search-source', 'all']);
                const cachedAt = queryClient.getQueryState(['property-search-source', 'all'])?.dataUpdatedAt ?? 0;
                if (city && all && Date.now() - cachedAt < 5 * 60 * 1000) return all.filter(row => {
                  const location = row.location?.toLowerCase().trim() ?? '';
                  const prefix = city.toLowerCase();
                  return location === prefix || location.startsWith(prefix + ',') || location.startsWith(prefix + ' ');
                });
                let query = enhancedSupabase.from('properties').select(city ? SEARCH_FIELDS : '*')
                  .eq('is_active', true).or('status.is.null,status.not.ilike.%sold%')
                  .order('created_at', { ascending: false });
                if (city) query = query.ilike('location', `${city}%`);
                const { data, error } = await query;
                if (error) throw error;
                return data ?? [];
              },
            }),
            lang && lang !== 'en'
              ? queryClient.ensureQueryData({
                  queryKey: ['search-translations', lang], staleTime: 5 * 60 * 1000,
                  queryFn: async () => {
                    const result = await enhancedSupabase.from('property_translations')
                      .select('property_id, title, description, location').eq('language_code', lang);
                    if (result.error) throw result.error;
                    return result;
                  },
                })
              : Promise.resolve({ data: [] }),
            lang && lang !== 'en' ? queryClient.ensureQueryData({
              queryKey: ['search-cloud-translations', lang], staleTime: 5 * 60 * 1000,
              queryFn: () => readCloudTranslations(lang),
            }) : Promise.resolve(new Map()),
          ]);
          if ('error' in translated && translated.error) throw translated.error;
          let rows = baseRows;

          // Apply translations for current language (skip English)
          if (lang && lang !== 'en' && rows.length > 0) {
            const translations = translated.data;

            const map = new Map((translations ?? []).map((t: any) => [t.property_id, t]));
            rows = rows.map((r: any) => {
              const t: any = pickPropertyTranslation(map.get(r.id), cloudRows.get(r.id), r);
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
    networkMode: 'offlineFirst' as const,
  });
