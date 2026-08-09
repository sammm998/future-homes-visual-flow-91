import { getCurrentLanguage } from '@/utils/seoUtils';
import { t } from '@/utils/translations';
import { useLocation } from '@/lib/router-compat';
import { useMemo } from 'react';

const RTL_LANGUAGES = ['ar', 'fa', 'ur'];

export const useTranslation = () => {
  const location = useLocation();
  
  const lang = useMemo(() => getCurrentLanguage(), [location.search]);
  
  const isRTL = RTL_LANGUAGES.includes(lang);

  // Update document direction (browser only — this hook also runs during SSR)
  useMemo(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [lang, isRTL]);

  return {
    t: (key: string) => t(key, lang),
    lang,
    isRTL
  };
};
