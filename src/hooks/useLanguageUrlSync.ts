import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATH_TRANSLATIONS, buildPropertyUrl, getTranslatedPropertyPath, getLanguageSlug } from '@/utils/slugHelpers';
import { supabase } from '@/integrations/supabase/client';

const PROPERTY_PATH_SEGMENTS = new Set(Object.values(PATH_TRANSLATIONS));

/**
 * Global hook that:
 * 1. Persists language selection to localStorage
 * 2. Auto-injects ?lang= on all pages when a language is saved
 * 3. Redirects property pages to fully translated URLs (path + slug)
 */
export const useLanguageUrlSync = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const processingRef = useRef(false);

  useEffect(() => {
    if (processingRef.current) return;

    const searchParams = new URLSearchParams(location.search);
    const langFromUrl = searchParams.get('lang');

    // If URL explicitly has lang param, persist it (including 'en' to reset)
    if (langFromUrl) {
      if (langFromUrl === 'en') {
        localStorage.removeItem('preferred_language');
      } else {
        localStorage.setItem('preferred_language', langFromUrl);
      }
    }

    // Determine effective language
    const savedLang = localStorage.getItem('preferred_language');
    const effectiveLang = langFromUrl || (savedLang && savedLang !== 'en' ? savedLang : null);

    // If we have a saved non-English language but URL doesn't have ?lang=, inject it
    if (effectiveLang && !langFromUrl) {
      processingRef.current = true;
      const newSearch = new URLSearchParams(location.search);
      newSearch.set('lang', effectiveLang);
      const newUrl = `${location.pathname}?${newSearch.toString()}`;
      navigate(newUrl, { replace: true });
      setTimeout(() => { processingRef.current = false; }, 100);
      return;
    }

    // If English is selected (langFromUrl is absent and savedLang is 'en' or null), 
    // no need to do anything for non-property pages
    if (!effectiveLang) return;

    // Check if we're on a property page — if so, translate path + slug
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return;

    const pathSegment = parts[0];
    if (!PROPERTY_PATH_SEGMENTS.has(pathSegment)) return;

    const currentSlug = parts[1];
    const expectedPathSegment = getTranslatedPropertyPath(effectiveLang);

    // Quick check: if path segment already matches, slug might still need updating
    const syncPropertyUrl = async () => {
      const refFromUrl = searchParams.get('ref');
      let query = supabase.from('properties').select('*').eq('is_active', true);

      if (refFromUrl) {
        query = query.eq('ref_no', refFromUrl);
      } else {
        const slugFilter = `slug.eq.${currentSlug},slug_sv.eq.${currentSlug},slug_tr.eq.${currentSlug},slug_ar.eq.${currentSlug},slug_ru.eq.${currentSlug},slug_no.eq.${currentSlug},slug_da.eq.${currentSlug},slug_fa.eq.${currentSlug},slug_ur.eq.${currentSlug},slug_es.eq.${currentSlug},slug_de.eq.${currentSlug},slug_fr.eq.${currentSlug},slug_id.eq.${currentSlug}`;
        query = query.or(slugFilter).order('ref_no', { ascending: false });
      }

      const { data: matches } = await query.limit(1);

      const data = matches && matches.length > 0 ? matches[0] : null;
      if (!data) return;

      const newUrl = buildPropertyUrl(data, effectiveLang);

      if (newUrl !== `${location.pathname}${location.search}`) {
        processingRef.current = true;
        navigate(newUrl, { replace: true });
        setTimeout(() => { processingRef.current = false; }, 100);
      }
    };

    syncPropertyUrl();
  }, [location.pathname, location.search, navigate]);

  // Listen for external URL changes
  useEffect(() => {
    const handlePopState = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const lang = searchParams.get('lang');
      if (lang) {
        localStorage.setItem('preferred_language', lang);
      }
      navigate(window.location.pathname + window.location.search, { replace: true });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);
};
