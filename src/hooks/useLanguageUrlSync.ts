import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATH_TRANSLATIONS, PATH_TO_LANG, getTranslatedPropertyPath, getLanguageSlug } from '@/utils/slugHelpers';
import { supabase } from '@/integrations/supabase/client';

const PROPERTY_PATH_SEGMENTS = new Set(Object.values(PATH_TRANSLATIONS));

/**
 * Global hook that detects when ?lang= changes (e.g. from ElevenLabs widget)
 * and redirects to a fully translated URL if on a property page.
 * This ensures both the path segment (/property/ → /fastighet/) and the slug are translated.
 */
export const useLanguageUrlSync = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const lastLangRef = useRef<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const lang = searchParams.get('lang');

    // Skip if language hasn't changed
    if (lang === lastLangRef.current) return;
    lastLangRef.current = lang;

    // Check if we're on a property page
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return;

    const pathSegment = parts[0];
    if (!PROPERTY_PATH_SEGMENTS.has(pathSegment)) return;

    const currentSlug = parts[1];
    const expectedPathSegment = getTranslatedPropertyPath(lang);

    // If the path segment already matches, we might still need to update the slug
    // Fetch the property to get all translated slugs
    const syncUrl = async () => {
      const slugFilter = `slug.eq.${currentSlug},slug_sv.eq.${currentSlug},slug_tr.eq.${currentSlug},slug_ar.eq.${currentSlug},slug_ru.eq.${currentSlug},slug_no.eq.${currentSlug},slug_da.eq.${currentSlug},slug_fa.eq.${currentSlug},slug_ur.eq.${currentSlug}`;

      const { data } = await supabase
        .from('properties')
        .select('slug, slug_sv, slug_tr, slug_ar, slug_ru, slug_no, slug_da, slug_fa, slug_ur')
        .or(slugFilter)
        .eq('is_active', true)
        .maybeSingle();

      if (!data) return;

      const newSlug = getLanguageSlug(data, lang);
      const langParam = lang ? `?lang=${lang}` : '';
      const newUrl = `/${expectedPathSegment}/${newSlug}${langParam}`;

      // Only navigate if the URL actually changed
      if (newUrl !== `${location.pathname}${location.search}`) {
        navigate(newUrl, { replace: true });
      }
    };

    syncUrl();
  }, [location.pathname, location.search, navigate]);

  // Also listen for external URL changes (e.g. from ElevenLabs widget modifying window.location)
  useEffect(() => {
    const handlePopState = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const lang = searchParams.get('lang');
      
      if (lang !== lastLangRef.current) {
        // Force React Router to pick up the change by navigating
        navigate(window.location.pathname + window.location.search, { replace: true });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);
};
