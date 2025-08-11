import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { getCurrentLanguage, getCanonicalUrl, getHreflangUrls, getCurrentPath } from '@/utils/seoUtils';

/**
 * Hook for managing SEO language settings
 */
export const useSEOLanguage = () => {
  const location = useLocation();
  
  const seoData = useMemo(() => {
    const currentPath = getCurrentPath();
    const currentLang = getCurrentLanguage();
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