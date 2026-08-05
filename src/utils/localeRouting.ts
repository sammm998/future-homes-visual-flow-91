// Central helpers for path-based locale URLs (e.g. /sv/antalya, /tr/mulk/1370).
// English is served without a prefix.

export const SUPPORTED_LOCALES = [
  'en', 'sv', 'no', 'da', 'de', 'fr', 'es', 'tr', 'ru', 'ar', 'fa', 'ur', 'id',
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

/** Locales that get a URL prefix (everything except the default, English). */
export const PREFIXED_LOCALES = SUPPORTED_LOCALES.filter((l) => l !== 'en');

export const isSupportedLocale = (value?: string | null): value is Locale =>
  !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);

/** Returns the locale encoded in the pathname, or null when there is none. */
export const getLocaleFromPathname = (pathname: string): Locale | null => {
  const first = pathname.split('/').filter(Boolean)[0]?.toLowerCase();
  if (first && first !== 'en' && isSupportedLocale(first)) return first;
  return null;
};

/** Removes a leading locale segment: /sv/antalya -> /antalya */
export const stripLocale = (pathname: string): string => {
  const locale = getLocaleFromPathname(pathname);
  if (!locale) return pathname || '/';
  const rest = pathname.slice(locale.length + 1);
  return rest.startsWith('/') ? rest : `/${rest}`;
};

/** Prefixes a (locale-free) path with the locale. English stays unprefixed. */
export const localizePath = (pathname: string, locale?: string | null): string => {
  const clean = stripLocale(pathname.startsWith('/') ? pathname : `/${pathname}`);
  if (!locale || locale === 'en' || !isSupportedLocale(locale)) {
    return clean === '' ? '/' : clean;
  }
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`;
};

/** Removes the legacy ?lang= parameter from a search string. */
export const stripLangParam = (search: string): string => {
  const params = new URLSearchParams(search);
  params.delete('lang');
  const s = params.toString();
  return s ? `?${s}` : '';
};
