import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type DistrictOption = { value: string; label: string };

const toSlug = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const titleCase = (s: string) =>
  s
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w[0].toLocaleUpperCase('tr') + w.slice(1) : w))
    .join(' ');

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
      .eq('language_code', 'en')
      .neq('status', 'sold')
      .not('property_district', 'is', null);

    if (error || !data) {
      inflight = null;
      return {};
    }

    // location -> Map<slug, { label, count }>
    const buckets: Record<string, Map<string, { label: string; count: number }>> = {};
    for (const row of data as Array<{ location: string | null; property_district: string | null }>) {
      const loc = (row.location || '').trim();
      const raw = (row.property_district || '').trim();
      if (!loc || !raw) continue;
      const slug = toSlug(raw);
      if (!slug) continue;
      const label = titleCase(raw);
      const map = (buckets[loc] ||= new Map());
      const prev = map.get(slug);
      if (prev) {
        prev.count += 1;
        // Prefer the longer/diacritic label
        if (label.length > prev.label.length) prev.label = label;
      } else {
        map.set(slug, { label, count: 1 });
      }
    }

    const result: Record<string, DistrictOption[]> = {};
    for (const [loc, map] of Object.entries(buckets)) {
      result[loc] = Array.from(map.entries())
        .map(([value, { label }]) => ({ value, label }))
        .sort((a, b) => a.label.localeCompare(b.label));
    }
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
    if (cache) return;
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
