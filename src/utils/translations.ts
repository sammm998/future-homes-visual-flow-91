// Translation runtime.
//
// The browser only downloads the dictionary for the active language (plus the
// English fallback) instead of all 13 languages — the full set was ~500 kB of
// JavaScript in the initial bundle. Dictionaries are generated from
// translationsSource.ts by scripts/build-i18n.ts (runs before `vite build`).
//
// On the server every language must be available, because one worker instance
// serves requests for all locales.
import { loaders } from './i18n';
import enDict from './i18n/dict.en';

export const translations: Record<string, Record<string, string>> = { en: enDict };

const detectLanguage = (): string => {
  if (typeof window === 'undefined') return 'en';
  const fromPath = window.location.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
  if (fromPath && fromPath in loaders) return fromPath;
  const fromParam = new URLSearchParams(window.location.search).get('lang');
  if (fromParam && fromParam in loaders) return fromParam;
  return 'en';
};

const loaded = new Set<string>(['en']);

/** Loads a dictionary on demand (used when the user switches language client-side). */
export const ensureLanguage = async (language: string): Promise<void> => {
  if (loaded.has(language) || !(language in loaders)) return;
  loaded.add(language);
  try {
    translations[language] = (await loaders[language]()).default;
  } catch {
    loaded.delete(language);
  }
};

if (import.meta.env.SSR) {
  // Server: load every language up front so any locale can be rendered.
  const all = await import('./translationsSource');
  for (const [lang, dict] of Object.entries(all.translations)) {
    translations[lang] = dict;
    loaded.add(lang);
  }
} else {
  await ensureLanguage(detectLanguage());
}

// Translation function with English fallback
export const t = (key: string, language: string = 'en'): string => {
  const langTranslations = translations[language];
  if (langTranslations?.[key]) return langTranslations[key];

  // Fallback to English
  if (translations.en?.[key]) return translations.en[key];

  return key;
};
