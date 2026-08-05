import { localizePath, getLocaleFromPathname, stripLocale } from './localeRouting';
// Translated path segments for /property/
export const PATH_TRANSLATIONS: Record<string, string> = {
  en: 'property',
  sv: 'fastighet',
  tr: 'mulk',
  ar: 'aqar',          // عقار
  ru: 'nedvizhimost',  // недвижимость
  no: 'eiendom',
  da: 'ejendom',
  fa: 'melk',          // ملک
  ur: 'jaidad',        // جائیداد
  es: 'propiedad',
  de: 'immobilie',
  fr: 'propriete',
  id: 'properti',
};

// Reverse mapping for path lookup
export const PATH_TO_LANG: Record<string, string> = Object.entries(PATH_TRANSLATIONS).reduce(
  (acc, [lang, path]) => ({ ...acc, [path]: lang }),
  {}
);

// Get translated path segment for property
export const getTranslatedPropertyPath = (lang: string | null): string => {
  if (!lang || lang === 'en') return 'property';
  return PATH_TRANSLATIONS[lang] || 'property';
};

// Helper to get language-specific slug from a property
export const getLanguageSlug = (property: any, lang: string | null): string => {
  if (!lang || lang === 'en') {
    return property.slug || property.refNo || property.ref_no || property.id;
  }
  
  const slugMap: Record<string, string | undefined> = {
    sv: property.slug_sv,
    tr: property.slug_tr,
    ar: property.slug_ar,
    ru: property.slug_ru,
    no: property.slug_no,
    da: property.slug_da,
    fa: property.slug_fa,
    ur: property.slug_ur,
    es: property.slug_es,
    de: property.slug_de,
    fr: property.slug_fr,
    id: property.slug_id,
  };
  
  // Return language-specific slug or fall back to English slug
  return slugMap[lang] || property.slug || property.refNo || property.ref_no || property.id;
};

const getPropertyReference = (property: any): string | null => {
  const ref = property?.ref_no || property?.refNo;
  return ref ? String(ref) : null;
};

// Get current language from URL search params, falling back to localStorage
export const getCurrentLanguage = (search: string): string | null => {
  if (typeof window !== 'undefined') {
    const fromPath = getLocaleFromPathname(window.location.pathname);
    if (fromPath) {
      localStorage.setItem('preferred_language', fromPath);
      return fromPath;
    }
  }
  const searchParams = new URLSearchParams(search);
  const langFromUrl = searchParams.get('lang');
  
  if (langFromUrl) {
    if (typeof window !== 'undefined') {
      if (langFromUrl === 'en') {
        localStorage.removeItem('preferred_language');
      } else {
        localStorage.setItem('preferred_language', langFromUrl);
      }
    }
    return langFromUrl;
  }
  
  // Fall back to localStorage
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem('preferred_language');
    if (savedLang && savedLang !== 'en') return savedLang;
  }
  
  return null;
};

// Build language parameter string
export const buildLangParam = (lang: string | null, ref?: string | null): string => {
  const params = new URLSearchParams();
  if (lang) params.set('lang', lang);
  if (ref) params.set('ref', ref);
  const search = params.toString();
  return search ? `?${search}` : '';
};

// Build full translated property URL: /sv/fastighet/1370 (English: /property/1370)
export const buildPropertyUrl = (property: any, lang: string | null): string => {
  const path = getTranslatedPropertyPath(lang);
  const ref = getPropertyReference(property) || property?.id;
  const safeRef = encodeURIComponent(String(ref));
  return localizePath(`/${path}/${safeRef}`, lang);
};

// Extract language from URL path (for translated paths like /fastighet/)
export const getLanguageFromPath = (pathname: string): string | null => {
  const localePrefix = getLocaleFromPathname(pathname);
  if (localePrefix) return localePrefix;
  const pathParts = stripLocale(pathname).split('/').filter(Boolean);
  if (pathParts.length > 0) {
    const pathSegment = pathParts[0].toLowerCase();
    return PATH_TO_LANG[pathSegment] || null;
  }
  return null;
};
