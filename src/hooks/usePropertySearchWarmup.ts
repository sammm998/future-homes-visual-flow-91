import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from '@tanstack/react-router';
import { localizePath } from '@/utils/localeRouting';

/** Warm public listings, not images, without competing with the first paint. */
export function usePropertySearchWarmup(enabled = true, immediate = false) {
  const client = useQueryClient();
  const router = useRouter();
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
        if (cancelled) return;
        return client.fetchQuery(propertySearchOptions(client, lang)).then(rows => {
          for (const city of ['Antalya', 'Istanbul', 'Mersin', 'Dubai', 'Cyprus', 'Bali']) {
            const prefix = city.toLowerCase();
            const cityRows = rows.filter(row => {
              const location = row.location?.toLowerCase().trim() ?? '';
              return location === prefix || location.startsWith(prefix + ',') || location.startsWith(prefix + ' ');
            });
            client.setQueryData(['properties', lang, city], cityRows);
          }
        });
      }).catch(() => {});
      // Opening the menu is explicit browsing intent: also warm page code so
      // clicking a destination does not wait for a new route chunk.
      if (immediate) for (const city of ['antalya', 'istanbul', 'mersin', 'dubai', 'cyprus', 'bali']) {
        void router.preloadRoute({ to: localizePath('/' + city, lang) as never }).catch(() => {});
      }
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
  }, [client, router, lang, enabled, immediate]);
}