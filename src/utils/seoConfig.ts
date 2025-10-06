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
  },
  'about-us': {
    en: {
      title: 'About Future Homes International | Your Trusted Real Estate Partner',
      description: 'Learn about Future Homes International - leading real estate agency specializing in Turkey, Dubai, Cyprus properties. 15+ years experience, multilingual team, full-service support.',
      keywords: ['About Future Homes', 'Real estate agency Turkey', 'International property experts', 'Property investment consultants', 'Real estate services'],
      h1: 'About Future Homes International',
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Future Homes International",
        "description": "Leading international real estate agency specializing in luxury properties in Turkey, Dubai, and Cyprus",
        "url": "https://futurehomesturkey.com/about-us",
        "foundingDate": "2008",
        "numberOfEmployees": "50+",
        "areaServed": ["Turkey", "UAE", "Cyprus", "International"],
        "serviceType": ["Real Estate Sales", "Property Investment", "Citizenship Programs", "Property Management"]
      }
    }
  },
  'contact-us': {
    en: {
      title: 'Contact Future Homes | Get Expert Property Consultation',
      description: 'Contact Future Homes for expert property consultation. Multilingual team available 24/7. Free property valuation, investment advice, and personalized service.',
      keywords: ['Contact Future Homes', 'Property consultation', 'Real estate advice', 'Property investment consultation', 'International real estate contact'],
      h1: 'Contact Future Homes International',
      structuredData: {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact Future Homes International",
        "description": "Get in touch with our expert real estate team for personalized property consultation",
        "url": "https://futurehomesturkey.com/contact-us"
      }
    }
  },
  'testimonials': {
    en: {
      title: 'Client Testimonials | Success Stories & Reviews',
      description: 'Read testimonials from satisfied Future Homes clients. Real success stories from property investors who found their dream homes in Turkey, Dubai, and Cyprus.',
      keywords: ['Future Homes testimonials', 'Property investment success stories', 'Client reviews', 'Real estate testimonials', 'Customer experiences'],
      h1: 'Client Testimonials & Success Stories',
      structuredData: {
        "@context": "https://schema.org",
        "@type": "ReviewPage",
        "name": "Future Homes Client Testimonials",
        "description": "Authentic reviews and testimonials from satisfied property investors"
      }
    }
  },
  'information': {
    en: {
      title: 'Property Investment Guide | Expert Real Estate Information',
      description: 'Comprehensive property investment guides, market insights, legal advice, and buying guides for Turkey, Dubai, Cyprus real estate. Expert information hub.',
      keywords: ['Property investment guide', 'Real estate information', 'Property buying guide', 'Investment advice', 'Real estate market insights'],
      h1: 'Property Investment Information Hub',
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Comprehensive Property Investment Information",
        "description": "Expert guides and information for international property investment"
      }
    }
  },
  'expenses-buying-property-turkey': {
    en: {
      title: 'Complete Guide: Property Buying Costs in Turkey 2024',
      description: 'Comprehensive breakdown of all costs when buying property in Turkey - taxes, fees, legal costs, and hidden expenses. Updated 2024 guide with current rates.',
      keywords: ['Property buying costs in Turkey', 'Turkey property taxes', 'Real estate fees Turkey', 'Property purchase expenses', 'Turkey property investment costs'],
      h1: 'Complete Guide to Property Buying Costs in Turkey',
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Complete Guide to Property Buying Costs in Turkey",
        "description": "Detailed breakdown of all expenses involved in purchasing property in Turkey",
        "datePublished": "2024-01-01",
        "dateModified": "2024-09-22"
      }
    }
  }
};

export const locationSEO: Record<string, Record<string, SEOConfig>> = {
  antalya: {
    en: {
      title: 'Properties for Sale in Antalya | Luxury Mediterranean Real Estate',
      description: 'Premium properties for sale in Antalya, Turkey. Luxury apartments, villas & investment opportunities in Konyaaltı, Lara & city center. Beachfront & mountain view options.',
      keywords: ['Apartments for sale in Antalya', 'Villas for sale in Antalya', 'Luxury homes in Antalya', 'Antalya real estate agency', 'Beachfront properties Antalya', 'Investment properties Antalya'],
      h1: 'Premium Properties for Sale in Antalya',
      structuredData: {
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        "name": "Future Homes Antalya Properties",
        "description": "Luxury real estate properties in Antalya, Turkey",
        "areaServed": "Antalya, Turkey"
      }
    }
  },
  alanya: {
    en: {
      title: 'Properties for Sale in Alanya | Beachfront Mediterranean Living',
      description: 'Discover premium properties for sale in Alanya, Turkey. Beachfront apartments, luxury villas & investment properties in Mahmutlar, Kestel, Tosmur. Mediterranean lifestyle awaits.',
      keywords: ['Apartments for sale in Alanya', 'Villas for sale in Alanya', 'Alanya beachfront apartments', 'Alanya property investment', 'Luxury homes Alanya', 'Mediterranean properties'],
      h1: 'Premium Properties for Sale in Alanya',
      structuredData: {
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        "name": "Future Homes Alanya Properties",
        "description": "Beachfront and luxury properties in Alanya, Turkey",
        "areaServed": "Alanya, Turkey"
      }
    }
  },
  mersin: {
    en: {
      title: 'Properties for Sale in Mersin | Coastal Investment Opportunities',
      description: 'Find premium properties for sale in Mersin, Turkey. Modern apartments, luxury homes & investment opportunities along the Mediterranean coast. Emerging market with high potential.',
      keywords: ['Property for sale in Mersin', 'Apartments for sale in Mersin', 'Villas for sale in Mersin', 'Mersin real estate', 'Investment opportunities Mersin', 'Coastal properties Turkey'],
      h1: 'Premium Properties for Sale in Mersin',
      structuredData: {
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        "name": "Future Homes Mersin Properties",
        "description": "Coastal real estate properties in Mersin, Turkey",
        "areaServed": "Mersin, Turkey"
      }
    }
  },
  dubai: {
    en: {
      title: 'Properties for Sale in Dubai | Luxury UAE Real Estate',
      description: 'Exclusive properties for sale in Dubai, UAE. Luxury apartments, penthouses & villas in Downtown, Marina, Palm Jumeirah. High-end investment opportunities with guaranteed ROI.',
      keywords: ['Properties for sale in Dubai', 'Dubai luxury apartments', 'Dubai real estate investment', 'Villas for sale Dubai', 'Dubai Marina properties', 'Downtown Dubai apartments'],
      h1: 'Luxury Properties for Sale in Dubai',
      structuredData: {
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        "name": "Future Homes Dubai Properties",
        "description": "Luxury real estate properties in Dubai, UAE",
        "areaServed": "Dubai, UAE"
      }
    }
  },
  cyprus: {
    en: {
      title: 'Properties for Sale in Cyprus | Island Paradise Real Estate',
      description: 'Premium properties for sale in Cyprus. Luxury villas, apartments & investment opportunities in Limassol, Paphos, Nicosia. EU residency benefits & tax advantages.',
      keywords: ['Properties for sale in Cyprus', 'Cyprus real estate', 'Villas for sale Cyprus', 'Cyprus investment properties', 'EU residency Cyprus', 'Cyprus luxury homes'],
      h1: 'Premium Properties for Sale in Cyprus',
      structuredData: {
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        "name": "Future Homes Cyprus Properties",
        "description": "Luxury real estate properties in Cyprus",
        "areaServed": "Cyprus"
      }
    }
  },
  bali: {
    en: {
      title: 'Properties for Sale in Bali | Tropical Paradise Real Estate',
      description: 'Exclusive properties for sale in Bali, Indonesia. Luxury villas, beachfront properties & investment opportunities in Seminyak, Canggu, Ubud. Tropical living paradise.',
      keywords: ['Properties for sale in Bali', 'Bali luxury villas', 'Bali real estate investment', 'Beachfront properties Bali', 'Tropical villas Indonesia', 'Bali property market'],
      h1: 'Luxury Properties for Sale in Bali',
      structuredData: {
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        "name": "Future Homes Bali Properties",
        "description": "Luxury tropical real estate properties in Bali, Indonesia",
        "areaServed": "Bali, Indonesia"
      }
    }
  }
};