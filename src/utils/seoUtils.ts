// SEO utility functions for handling language-specific URLs and hreflang

interface LanguageConfig {
  code: string;
  name: string;
  baseUrl: string;
}

export const supportedLanguages: LanguageConfig[] = [
  { code: 'en', name: 'English', baseUrl: 'https://futurehomesinternational.com' },
  { code: 'sv', name: 'Svenska', baseUrl: 'https://futurehomesinternational.com' },
  { code: 'tr', name: 'Türkçe', baseUrl: 'https://futurehomesinternational.com' },
  { code: 'ar', name: 'العربية', baseUrl: 'https://futurehomesinternational.com' },
];

/**
 * Get the current language from URL parameters
 */
export const getCurrentLanguage = (): string => {
  if (typeof window === 'undefined') return 'en';
  
  const urlParams = new URLSearchParams(window.location.search);
  const lang = urlParams.get('lang');
  return lang && supportedLanguages.some(l => l.code === lang) ? lang : 'en';
};

/**
 * Get canonical URL for current page with language parameter (self-referencing)
 */
export const getCanonicalUrl = (path: string = '', lang?: string): string => {
  const currentLang = lang || getCurrentLanguage();
  const baseUrl = 'https://futurehomesinternational.com';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // For English, return clean URL without lang parameter
  if (currentLang === 'en') {
    return `${baseUrl}${cleanPath}`;
  }
  
  // For other languages, always include the lang parameter for self-referencing canonical
  const separator = cleanPath.includes('?') ? '&' : '?';
  return `${baseUrl}${cleanPath}${separator}lang=${currentLang}`;
};

/**
 * Generate hreflang alternate URLs for all supported languages
 */
export const getHreflangUrls = (path: string = ''): Array<{code: string, url: string}> => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return supportedLanguages.map(lang => {
    let url = `${lang.baseUrl}${cleanPath}`;
    
    if (lang.code !== 'en') {
      const separator = cleanPath.includes('?') ? '&' : '?';
      url = `${url}${separator}lang=${lang.code}`;
    }
    
    return {
      code: lang.code,
      url: url
    };
  });
};

/**
 * Get the current page path without language parameters
 */
export const getCurrentPath = (): string => {
  if (typeof window === 'undefined') return '/';
  
  const path = window.location.pathname;
  const search = new URLSearchParams(window.location.search);
  search.delete('lang'); // Remove lang parameter
  
  const searchString = search.toString();
  return searchString ? `${path}?${searchString}` : path;
};