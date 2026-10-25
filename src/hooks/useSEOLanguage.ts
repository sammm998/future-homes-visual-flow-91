import { useMemo } from 'react';
import { useLocation } from '@/lib/router-compat';
import { getCanonicalUrl, getHreflangUrls } from '@/utils/seoUtils';
import { resolveUrlLocale, stripLocale, stripLangParam } from '@/utils/localeRouting';

/**
 * Hook for managing SEO language settings
 */
export const useSEOLanguage = () => {
  const location = useLocation();
  
  const seoData = useMemo(() => {
    const currentPath = stripLocale(location.pathname) + stripLangParam(location.search);
    const currentLang = resolveUrlLocale(location.pathname, location.search);
    const canonicalUrl = getCanonicalUrl(currentPath, currentLang);
    const hreflangUrls = getHreflangUrls(currentPath);
    
    return {
      currentLanguage: currentLang,
      canonicalUrl,
      hreflangUrls,
      currentPath
    };
  }, [location.pathname, location.search]);
  
  return seoData;
};