// Translated path segments for /property/
export const PATH_TRANSLATIONS: Record<string, string> = {
  en: 'property',
  sv: 'fastighet',
  tr: 'mulk',
  ar: 'aqar',      // عقار
  ru: 'nedvizhimost', // недвижимость
  no: 'eiendom',
  da: 'ejendom',
  fa: 'melk',      // ملک
  ur: 'jaidad',    // جائیداد
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
  };
  
  // Return language-specific slug or fall back to English slug
  return slugMap[lang] || property.slug || property.refNo || property.ref_no || property.id;
};

// Get current language from URL search params
export const getCurrentLanguage = (search: string): string | null => {
  const searchParams = new URLSearchParams(search);
  return searchParams.get('lang');
};

// Build language parameter string
export const buildLangParam = (lang: string | null): string => {
  return lang ? `?lang=${lang}` : '';
};

// Build full translated property URL
export const buildPropertyUrl = (property: any, lang: string | null): string => {
  const path = getTranslatedPropertyPath(lang);
  const slug = getLanguageSlug(property, lang);
  const langParam = buildLangParam(lang);
  return `/${path}/${slug}${langParam}`;
};

// Extract language from URL path (for translated paths like /fastighet/)
export const getLanguageFromPath = (pathname: string): string | null => {
  const pathParts = pathname.split('/').filter(Boolean);
  if (pathParts.length > 0) {
    const pathSegment = pathParts[0].toLowerCase();
    return PATH_TO_LANG[pathSegment] || null;
  }
  return null;
};
