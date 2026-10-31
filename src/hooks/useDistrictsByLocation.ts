import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/legacy/client';
import { buildDistrictOptions } from '@/utils/propertySearchSelection';

export type DistrictOption = { value: string; label: string };

// Cache so we only hit the DB once per session
let cache: Record<string, DistrictOption[]> | null = null;
let inflight: Promise<Record<string, DistrictOption[]>> | null = null;

async function fetchDistrictsByLocation(): Promise<Record<string, DistrictOption[]>> {
  if (cache) return cache;
  if (inflight) return inflight;

  inflight = (async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('location, property_district')
      .eq('is_active', true)
      .or('language_code.eq.en,language_code.is.null')
      .or('status.is.null,status.not.ilike.%sold%')
      .not('property_district', 'is', null);

    if (error || !data) {
      inflight = null;
      return {};
    }

    const result = buildDistrictOptions(data);
    cache = result;
    inflight = null;
    return result;
  })();

  return inflight;
}

export function useDistrictsByLocation() {
  const [data, setData] = useState<Record<string, DistrictOption[]>>(cache || {});
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) { setData(cache); setLoading(false); return; }
    let mounted = true;
    fetchDistrictsByLocation().then((d) => {
      if (mounted) {
        setData(d);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { districtsByLocation: data, loading };
}
