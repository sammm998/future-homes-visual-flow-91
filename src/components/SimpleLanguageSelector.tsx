import React, { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentLanguage } from '@/utils/seoUtils';


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

interface SimpleLanguageSelectorProps {
  className?: string;
}

const SimpleLanguageSelector: React.FC<SimpleLanguageSelectorProps> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  
  // Get current language from URL or default to English
  const currentLanguageCode = getCurrentLanguage();
  
  const currentLanguage = useMemo(() => {
    return languages.find(lang => lang.code === currentLanguageCode) || languages[0];
  }, [currentLanguageCode]);

  const handleLanguageChange = (selectedLanguage: typeof languages[0]) => {
    const currentUrl = new URL(window.location.href);
    const currentPath = location.pathname;
    
    if (selectedLanguage.code === 'en') {
      // For English, remove lang parameter
      currentUrl.searchParams.delete('lang');
    } else {
      // For other languages, set lang parameter
      currentUrl.searchParams.set('lang', selectedLanguage.code);
    }
    
    // Navigate to the new URL
    const newUrl = currentPath + (currentUrl.search || '');
    navigate(newUrl, { replace: true });
    
    // Keep currency unchanged when switching languages
    // updateCurrencyFromLanguage(selectedLanguage.code);
    
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="text-xs">{currentLanguage.code.toUpperCase()}</span>
        <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 min-w-[120px]">
          <div className="py-1 max-h-60 overflow-y-auto">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 transition-colors text-left ${
                  currentLanguage.code === language.code ? 'bg-gray-100' : ''
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="flex-1">{language.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
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