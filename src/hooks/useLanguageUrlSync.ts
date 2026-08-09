import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from '@/lib/router-compat';
import { PATH_TRANSLATIONS, buildPropertyUrl } from '@/utils/slugHelpers';
import {
  getLocaleFromPathname,
  localizePath,
  stripLocale,
  stripLangParam,
  isSupportedLocale,
} from '@/utils/localeRouting';
import { supabase } from '@/integrations/supabase/client';

const PROPERTY_PATH_SEGMENTS = new Set(Object.values(PATH_TRANSLATIONS));
const NON_LOCALIZED_PREFIXES = ['/admin', '/admin-login', '/admin-dashboard', '/sitemap.xml'];

/**
 * Global hook that:
 * 1. Migrates legacy ?lang=xx links to path-based locale URLs (/sv/..., /tr/...)
 * 2. Applies the saved language preference to unprefixed URLs
 * 3. Keeps property detail URLs in the active language (path segment + locale)
 */
export const useLanguageUrlSync = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const processingRef = useRef(false);

  useEffect(() => {
    if (processingRef.current) return;
    if (NON_LOCALIZED_PREFIXES.some((p) => location.pathname.startsWith(p))) return;

    const searchParams = new URLSearchParams(location.search);
    const langFromUrl = searchParams.get('lang');
    const langFromPath = getLocaleFromPathname(location.pathname);

    // 1. Legacy ?lang= links -> path-based URL
    if (langFromUrl && isSupportedLocale(langFromUrl)) {
      processingRef.current = true;
      if (langFromUrl === 'en') {
        localStorage.removeItem('preferred_language');
      } else {
        localStorage.setItem('preferred_language', langFromUrl);
      }
      const target = `${localizePath(location.pathname, langFromUrl)}${stripLangParam(location.search)}`;
      navigate(target, { replace: true });
      setTimeout(() => { processingRef.current = false; }, 100);
      return;
    }

    if (langFromPath) {
      localStorage.setItem('preferred_language', langFromPath);
    }

    const savedLang = localStorage.getItem('preferred_language');
    const effectiveLang = langFromPath || (savedLang && savedLang !== 'en' ? savedLang : null);

    // 2. Saved preference but no prefix in the URL -> add the prefix
    if (effectiveLang && !langFromPath) {
      processingRef.current = true;
      navigate(`${localizePath(location.pathname, effectiveLang)}${location.search}`, { replace: true });
      setTimeout(() => { processingRef.current = false; }, 100);
      return;
    }

    if (!effectiveLang) return;

    // 3. Property detail pages: keep the localized path segment in sync
    const parts = stripLocale(location.pathname).split('/').filter(Boolean);
    if (parts.length < 2) return;
    if (!PROPERTY_PATH_SEGMENTS.has(parts[0])) return;

    const currentSlug = parts[1];

    const syncPropertyUrl = async () => {
      const refFromUrl = searchParams.get('ref');
      let query = supabase.from('properties').select('*').eq('is_active', true);

      if (refFromUrl) {
        query = query.eq('ref_no', refFromUrl);
      } else if (/^\d+$/.test(currentSlug)) {
        query = query.eq('ref_no', currentSlug);
      } else {
        const slugFilter = `slug.eq.${currentSlug},slug_sv.eq.${currentSlug},slug_tr.eq.${currentSlug},slug_ar.eq.${currentSlug},slug_ru.eq.${currentSlug},slug_no.eq.${currentSlug},slug_da.eq.${currentSlug},slug_fa.eq.${currentSlug},slug_ur.eq.${currentSlug},slug_es.eq.${currentSlug},slug_de.eq.${currentSlug},slug_fr.eq.${currentSlug},slug_id.eq.${currentSlug}`;
        query = query.or(slugFilter).order('ref_no', { ascending: false });
      }

      const { data: matches } = await query.limit(1);
      const data = matches && matches.length > 0 ? matches[0] : null;
      if (!data) return;

      const newUrl = buildPropertyUrl(data, effectiveLang);
      if (newUrl !== location.pathname) {
        processingRef.current = true;
        navigate(newUrl, { replace: true });
        setTimeout(() => { processingRef.current = false; }, 100);
      }
    };

    syncPropertyUrl();
  }, [location.pathname, location.search, navigate]);
};
