// Amenity / small UI label translations. The browser reads them from the active
// language's dictionary (scripts/build-i18n.ts copies them there), so the
// 13-language table in amenityTranslations.ts stays on the server.
import { AMENITY_KEY } from './pageMetaKeys';
import { translations } from './translations';

let serverLookup: ((label: string, language: string) => string) | null = null;
if (import.meta.env.SSR) {
  serverLookup = (await import('./amenityTranslations')).translateAmenityFromTable;
}

export function translateAmenity(label: string, language: string = 'en'): string {
  if (!label) return label;
  if (serverLookup) return serverLookup(label, language);
  const dict = translations[language];
  if (!dict) return label;
  const exact = dict[AMENITY_KEY(label)];
  if (exact) return exact;
  const wanted = AMENITY_KEY(label.trim()).toLowerCase();
  const key = Object.keys(dict).find((k) => k.startsWith('__amenity:') && k.toLowerCase() === wanted);
  return key ? dict[key] : label;
}
