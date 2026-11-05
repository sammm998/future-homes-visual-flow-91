// Localized page title/description lookup.
//
// The browser reads them from the per-language dictionary that is already
// loaded for the active language (scripts/build-i18n.ts copies them there), so
// the full 13-language SEO tables never ship to the client. The server keeps
// the complete tables, because one worker renders every locale.
import type { PageMeta } from './seoMetaSource';
import { PAGE_META_KEY, normalizeMetaPath } from './pageMetaKeys';
import { translations } from './translations';

let serverLookup: ((path: string, language: string) => PageMeta | null) | null = null;
if (import.meta.env.SSR) {
  serverLookup = (await import('./seoMetaTranslations')).getLocalizedPageMeta;
}

const fromDictionary = (path: string, language: string): PageMeta | null => {
  const dict = translations[language];
  const title = dict?.[PAGE_META_KEY(path, 'title')];
  const description = dict?.[PAGE_META_KEY(path, 'description')];
  return title && description ? { title, description } : null;
};

/** Localized metadata for a known locale-free path, English fallback, else null. */
export function getPageMeta(path: string, language: string): PageMeta | null {
  const normalized = normalizeMetaPath(path);
  if (serverLookup) return serverLookup(normalized, language);
  return fromDictionary(normalized, language) || fromDictionary(normalized, 'en');
}
