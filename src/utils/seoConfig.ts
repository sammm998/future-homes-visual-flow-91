export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  ogImage?: string;
  canonical?: string;
  structuredData?: any;
}

export const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸', baseUrl: 'https://futurehomesturkey.com' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', baseUrl: 'https://futurehomesturkey.com' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪', baseUrl: 'https://futurehomesturkey.com' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰', baseUrl: 'https://futurehomesturkey.com' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴', baseUrl: 'https://futurehomesturkey.com' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', baseUrl: 'https://futurehomesturkey.com' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰', baseUrl: 'https://futurehomesturkey.com' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', baseUrl: 'https://futurehomesturkey.com' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷', baseUrl: 'https://futurehomesturkey.com' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', baseUrl: 'https://futurehomesturkey.com' },
  { code: 'es', name: 'Español', flag: '🇪🇸', baseUrl: 'https://futurehomesturkey.com' }
];

export const getLanguageFromUrl = (): string => {
  if (typeof window === 'undefined') return 'en';
  
  const pathname = window.location.pathname;
  const langMatch = pathname.match(/^\/([a-z]{2})\//);
  
  if (langMatch && supportedLanguages.some(lang => lang.code === langMatch[1])) {
    return langMatch[1];
  }
  
  // Check URL params as fallback
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  return langParam && supportedLanguages.some(l => l.code === langParam) ? langParam : 'en';
};

export const seoPages: Record<string, Record<string, SEOConfig>> = {
  'property-for-sale-in-turkey': {
    en: {
      title: 'Property for Sale in Turkey | Future Homes Turkey',
      description: 'Discover premium properties for sale in Turkey. Luxury villas, apartments & investment opportunities in Antalya, Alanya, Mersin. Expert guidance included.',
      keywords: ['Property for sale in Turkey', 'Real estate in Turkey', 'Buy property in Turkey', 'Houses for sale in Turkey', 'Investment property in Turkey'],
      h1: 'Property for Sale in Turkey',
      ogImage: '/images/turkey-properties-overview.jpg'
    },
    de: {
      title: 'Immobilien zum Verkauf in der Türkei | Future Homes',
      description: 'Entdecken Sie Premium-Immobilien zum Verkauf in der Türkei. Luxusvillen, Apartments & Investitionsmöglichkeiten in Antalya, Alanya, Mersin.',
      keywords: ['Immobilien Türkei', 'Haus kaufen Türkei', 'Wohnung Türkei', 'Immobilien Investment Türkei'],
      h1: 'Immobilien zum Verkauf in der Türkei'
    },
    sv: {
      title: 'Fastigheter till salu i Turkiet | Future Homes',
      description: 'Upptäck premium fastigheter till salu i Turkiet. Lyxvillor, lägenheter & investeringsmöjligheter i Antalya, Alanya, Mersin.',
      keywords: ['Fastigheter Turkiet', 'Köpa hus Turkiet', 'Lägenhet Turkiet', 'Fastighetsinvestering Turkiet'],
      h1: 'Fastigheter till salu i Turkiet'
    }
  },
  'apartments-for-sale-in-turkey': {
    en: {
      title: 'Apartments for Sale in Turkey | Modern Living Spaces',
      description: 'Find luxury apartments for sale in Turkey. Modern 1-4 bedroom apartments in prime locations. Beachfront, city center & investment options available.',
      keywords: ['Apartments for sale in Turkey', 'Luxury apartments Turkey', 'Beachfront apartments Turkey', 'Modern apartments Turkey'],
      h1: 'Apartments for Sale in Turkey'
    }
  },
  'luxury-villas-in-turkey': {
    en: {
      title: 'Luxury Villas in Turkey | Premium Villa Collection',
      description: 'Exclusive luxury villas for sale in Turkey. Private pools, sea views, modern designs. Prime locations in Antalya, Alanya & coastal regions.',
      keywords: ['Luxury villas in Turkey', 'Villas for sale Turkey', 'Villa with sea view Turkey', 'Private pool villas Turkey'],
      h1: 'Luxury Villas in Turkey'
    }
  }
};

export const locationSEO: Record<string, Record<string, SEOConfig>> = {
  antalya: {
    en: {
      title: 'Properties for Sale in Antalya | Luxury Real Estate',
      description: 'Premium properties for sale in Antalya, Turkey. Luxury apartments, villas & investment opportunities in Konyaaltı, Lara & city center.',
      keywords: ['Apartments for sale in Antalya', 'Villas for sale in Antalya', 'Luxury homes in Antalya', 'Antalya real estate agency'],
      h1: 'Properties for Sale in Antalya'
    }
  },
  alanya: {
    en: {
      title: 'Properties for Sale in Alanya | Beachfront Real Estate',
      description: 'Discover properties for sale in Alanya, Turkey. Beachfront apartments, luxury villas & investment properties in prime locations.',
      keywords: ['Apartments for sale in Alanya', 'Villas for sale in Alanya', 'Alanya beachfront apartments', 'Alanya property investment'],
      h1: 'Properties for Sale in Alanya'
    }
  },
  mersin: {
    en: {
      title: 'Properties for Sale in Mersin | Coastal Real Estate',
      description: 'Find properties for sale in Mersin, Turkey. Modern apartments, luxury homes & investment opportunities along the Mediterranean coast.',
      keywords: ['Property for sale in Mersin', 'Apartments for sale in Mersin', 'Villas for sale in Mersin', 'Mersin real estate'],
      h1: 'Properties for Sale in Mersin'
    }
  }
};