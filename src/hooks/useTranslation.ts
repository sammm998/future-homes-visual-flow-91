import { getCurrentLanguage } from '@/utils/seoUtils';
import { t } from '@/utils/translations';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

const RTL_LANGUAGES = ['ar', 'fa', 'ur'];

export const useTranslation = () => {
  const location = useLocation();
  
  const lang = useMemo(() => getCurrentLanguage(), [location.search]);
  
  const isRTL = RTL_LANGUAGES.includes(lang);

  // Update document direction
  useMemo(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [lang, isRTL]);

  return {
    t: (key: string) => t(key, lang),
    lang,
    isRTL
  };
};
