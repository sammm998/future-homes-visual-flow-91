import { resolveUrlLocale } from '@/utils/localeRouting';
import { t } from '@/utils/translations';
import { useLocation } from '@/lib/router-compat';
import { useMemo, useEffect } from 'react';

const RTL_LANGUAGES = ['ar', 'fa', 'ur'];

export const useTranslation = () => {
  const location = useLocation();
  
  const lang = useMemo(() => resolveUrlLocale(location.pathname, location.search), [location.pathname, location.search]);
  
  const isRTL = RTL_LANGUAGES.includes(lang);

  // Update document direction (browser only — this hook also runs during SSR)
  useEffect(() => {
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
