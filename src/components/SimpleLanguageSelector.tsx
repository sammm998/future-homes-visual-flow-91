import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentLanguage } from '@/utils/seoUtils';
import { PATH_TRANSLATIONS, getTranslatedPropertyPath, getLanguageSlug } from '@/utils/slugHelpers';
import { supabase } from '@/integrations/supabase/client';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

// All property path segments
const PROPERTY_PATH_SEGMENTS = new Set(Object.values(PATH_TRANSLATIONS));

interface SimpleLanguageSelectorProps {
  className?: string;
}

const SimpleLanguageSelector: React.FC<SimpleLanguageSelectorProps> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [propertyData, setPropertyData] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const currentLanguageCode = getCurrentLanguage();

  const currentLanguage = useMemo(() => {
    return languages.find(lang => lang.code === currentLanguageCode) || languages[0];
  }, [currentLanguageCode]);

  // Detect property page and get the slug from the URL
  const propertySlug = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length >= 2 && PROPERTY_PATH_SEGMENTS.has(parts[0])) {
      return parts[1];
    }
    return null;
  }, [location.pathname]);

  // Fetch property slug data when on a property page
  useEffect(() => {
    if (!propertySlug) {
      setPropertyData(null);
      return;
    }

    const fetchProperty = async () => {
      const slugFilter = `slug.eq.${propertySlug},slug_sv.eq.${propertySlug},slug_tr.eq.${propertySlug},slug_ar.eq.${propertySlug},slug_ru.eq.${propertySlug},slug_no.eq.${propertySlug},slug_da.eq.${propertySlug},slug_fa.eq.${propertySlug},slug_ur.eq.${propertySlug}`;

      const { data } = await supabase
        .from('properties')
        .select('slug, slug_sv, slug_tr, slug_ar, slug_ru, slug_no, slug_da, slug_fa, slug_ur')
        .or(slugFilter)
        .eq('is_active', true)
        .maybeSingle();

      if (data) {
        setPropertyData(data);
      }
    };

    fetchProperty();
  }, [propertySlug]);

  const handleLanguageChange = (selectedLanguage: typeof languages[0]) => {
    const langCode = selectedLanguage.code === 'en' ? null : selectedLanguage.code;

    // If on a property page with data, build fully localized URL
    if (propertySlug && propertyData) {
      const newPath = getTranslatedPropertyPath(langCode);
      const newSlug = getLanguageSlug(propertyData, langCode);
      const langParam = langCode ? `?lang=${langCode}` : '';
      navigate(`/${newPath}/${newSlug}${langParam}`, { replace: true });
      document.documentElement.lang = selectedLanguage.code;
      setIsOpen(false);
      return;
    }

    // Default: just update ?lang= param
    const currentSearch = new URLSearchParams(location.search);
    if (selectedLanguage.code === 'en') {
      currentSearch.delete('lang');
    } else {
      currentSearch.set('lang', selectedLanguage.code);
    }

    const searchString = currentSearch.toString();
    const newUrl = searchString ? `${location.pathname}?${searchString}` : location.pathname;
    navigate(newUrl, { replace: true });
    document.documentElement.lang = selectedLanguage.code;
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 text-sm bg-background border border-border rounded hover:bg-muted transition-colors"
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="text-xs">{currentLanguage.code.toUpperCase()}</span>
        <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-background border border-border rounded shadow-lg z-50 min-w-[120px]">
          <div className="py-1 max-h-60 overflow-y-auto">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left ${
                  currentLanguage.code === language.code ? 'bg-muted' : ''
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
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SimpleLanguageSelector;
