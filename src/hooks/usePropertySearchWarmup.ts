import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';

/** Warm public listings, not images, without competing with the first paint. */
export function usePropertySearchWarmup(enabled = true, immediate = false) {
  const client = useQueryClient();
  const { lang } = useTranslation();
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    if (!immediate && (connection?.saveData || ['slow-2g', '2g'].includes(connection?.effectiveType ?? ''))) return;
    const warm = () => {
      void import('@/lib/propertySearchQuery').then(({ propertySearchOptions }) => {
        if (!cancelled) return client.prefetchQuery(propertySearchOptions(client, lang));
      }).catch(() => {});
    };
    const schedule = () => { timer = setTimeout(warm, 1000); };
    if (immediate) warm();
    else if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    return () => {
      cancelled = true;
      clearTimeout(timer);
      window.removeEventListener('load', schedule);
    };
  }, [client, lang, enabled, immediate]);
}