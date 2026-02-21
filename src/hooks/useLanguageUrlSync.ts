import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATH_TRANSLATIONS, getTranslatedPropertyPath, getLanguageSlug } from '@/utils/slugHelpers';
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
      const slugFilter = `slug.eq.${currentSlug},slug_sv.eq.${currentSlug},slug_tr.eq.${currentSlug},slug_ar.eq.${currentSlug},slug_ru.eq.${currentSlug},slug_no.eq.${currentSlug},slug_da.eq.${currentSlug},slug_fa.eq.${currentSlug},slug_ur.eq.${currentSlug}`;

      const { data } = await supabase
        .from('properties')
        .select('slug, slug_sv, slug_tr, slug_ar, slug_ru, slug_no, slug_da, slug_fa, slug_ur')
        .or(slugFilter)
        .eq('is_active', true)
        .maybeSingle();

      if (!data) return;

      const newSlug = getLanguageSlug(data, effectiveLang);
      const langParam = `?lang=${effectiveLang}`;
      const newUrl = `/${expectedPathSegment}/${newSlug}${langParam}`;

      if (newUrl !== `${location.pathname}${location.search}`) {
        processingRef.current = true;
        navigate(newUrl, { replace: true });
        setTimeout(() => { processingRef.current = false; }, 100);
      }
    };

    syncPropertyUrl();
  }, [location.pathname, location.search, navigate]);

  // Listen for external URL changes (e.g. from ElevenLabs widget)
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
