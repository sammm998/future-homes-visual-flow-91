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
