import { useQuery } from '@tanstack/react-query';

const BASE_URL = 'https://kiogiyemoqbnuvclneoe.functions.supabase.co/functions/v1/property-feed';

export interface ApartmentType {
  type: string;
  size: string | number;
  price: string | number;
}

export interface PropertyFeedItem {
  id: string;
  ref_no: string;
  title: string;
  location?: string;
  price?: string;
  slug?: string;
  apartment_types?: ApartmentType[];
  updated_at?: string;
}

async function fetchJSON(url: string) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export const usePropertyPricingByRef = (refNo?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['property-feed', 'ref', refNo],
    queryFn: async () => {
      if (!refNo) return null;
      const json = await fetchJSON(`${BASE_URL}?ref=${encodeURIComponent(refNo)}`);
      if (!json?.success) return null;
      return json.property as PropertyFeedItem;
    },
    enabled: !!refNo,
    staleTime: 30_000,
  });

  return {
    property: data as PropertyFeedItem | null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
};

export const usePropertyFeedList = (limit?: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['property-feed', 'list', limit ?? 'all'],
    queryFn: async () => {
      const url = typeof limit === 'number' ? `${BASE_URL}?limit=${limit}` : BASE_URL;
      const json = await fetchJSON(url);
      // Try common shapes: {properties: []} or {items: []} or []
      const list = json?.properties ?? json?.items ?? json?.data ?? json;
      if (!Array.isArray(list)) return [] as PropertyFeedItem[];
      return list as PropertyFeedItem[];
    },
    staleTime: 30_000,
  });

  return {
    properties: (data ?? []) as PropertyFeedItem[],
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
};
