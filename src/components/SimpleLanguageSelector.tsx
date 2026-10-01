import React, { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocation } from '@/lib/router-compat';
import { PATH_TRANSLATIONS, buildPropertyUrl } from '@/utils/slugHelpers';
import { localizePath, stripLocale, stripLangParam, getLocaleFromPathname } from '@/utils/localeRouting';
import { supabase } from '@/integrations/supabase/client';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
];

const PROPERTY_PATH_SEGMENTS = new Set(Object.values(PATH_TRANSLATIONS));

interface SimpleLanguageSelectorProps {
  className?: string;
  dark?: boolean;
}

const SimpleLanguageSelector: React.FC<SimpleLanguageSelectorProps> = ({ className = "", dark = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Derive the language from the router location so SSR and the first client
  // render agree (window/localStorage lookups caused hydration mismatches).
  const currentLanguageCode = getLocaleFromPathname(location.pathname) || 'en';
  const currentLanguage = useMemo(() => {
    return languages.find(lang => lang.code === currentLanguageCode) || languages[0];
  }, [currentLanguageCode]);

  const propertySlug = useMemo(() => {
    const parts = stripLocale(location.pathname).split('/').filter(Boolean);
    if (parts.length >= 2 && PROPERTY_PATH_SEGMENTS.has(parts[0])) return parts[1];
    return null;
  }, [location.pathname]);

  const handleLanguageChange = async (selectedLanguage: typeof languages[0]) => {
    const langCode = selectedLanguage.code === 'en' ? null : selectedLanguage.code;
    setIsOpen(false);
    document.documentElement.lang = selectedLanguage.code;
    document.documentElement.dir = ['ar', 'fa', 'ur'].includes(selectedLanguage.code) ? 'rtl' : 'ltr';

    // Store an explicit 'en' (instead of removing the key) so the URL-sync
    // hook never falls back to the previous language.
    localStorage.setItem('preferred_language', selectedLanguage.code);

    if (propertySlug) {
      const currentSearch = new URLSearchParams(location.search);
      const refFromUrl = currentSearch.get('ref');
      let query = supabase.from('properties').select('*').eq('is_active', true);

      if (refFromUrl) {
        query = query.eq('ref_no', refFromUrl);
      } else {
        const slugFilter = `slug.eq.${propertySlug},slug_sv.eq.${propertySlug},slug_tr.eq.${propertySlug},slug_ar.eq.${propertySlug},slug_ru.eq.${propertySlug},slug_no.eq.${propertySlug},slug_da.eq.${propertySlug},slug_fa.eq.${propertySlug},slug_ur.eq.${propertySlug},slug_es.eq.${propertySlug},slug_de.eq.${propertySlug},slug_fr.eq.${propertySlug},slug_id.eq.${propertySlug}`;
        query = query.or(slugFilter).order('ref_no', { ascending: false });
      }

      const { data: matches } = await query.limit(1);
      const data = matches && matches.length > 0 ? matches[0] : null;

      if (data) {
        // Full navigation: the new locale's translation dictionary is loaded
        // on document load, so a client-side navigate would keep the old texts.
        window.location.assign(buildPropertyUrl(data, langCode));
        return;
      }
    }

    const target = `${localizePath(location.pathname, selectedLanguage.code)}${stripLangParam(location.search)}`;
    // Always do a real navigation so the target locale's dictionary and
    // server-rendered content load together.
    window.location.assign(target);

  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        aria-label={`Language: ${currentLanguage.name}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex min-h-11 items-center gap-1 rounded-sm border px-2 text-sm transition-colors ${dark ? 'border-navy-foreground/20 bg-navy text-navy-foreground hover:border-gold hover:text-gold' : 'border-border bg-background text-foreground hover:bg-muted'}`}
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="text-xs">{currentLanguage.code.toUpperCase()}</span>
        <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute z-50 min-w-[160px] rounded-sm border border-border bg-background text-foreground shadow-lg ${dark ? 'bottom-0 left-full ml-2' : 'right-0 top-full mt-1'}`}>
          <div className="py-1 max-h-60 overflow-y-auto">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left ${
                  currentLanguage.code === language.code ? 'bg-muted text-foreground' : ''
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="flex-1">{language.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default SimpleLanguageSelector;
