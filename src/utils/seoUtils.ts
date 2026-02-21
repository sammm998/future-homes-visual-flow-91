// SEO utility functions for handling language-specific URLs and hreflang

interface LanguageConfig {
  code: string;
  name: string;
  baseUrl: string;
  hreflang: string; // Standard hreflang format
}

export const supportedLanguages: LanguageConfig[] = [
  { code: 'en', name: 'English', baseUrl: 'https://futurehomesinternational.com', hreflang: 'en' },
  { code: 'sv', name: 'Svenska', baseUrl: 'https://futurehomesinternational.com', hreflang: 'sv' },
  { code: 'no', name: 'Norsk', baseUrl: 'https://futurehomesinternational.com', hreflang: 'no' },
  { code: 'da', name: 'Dansk', baseUrl: 'https://futurehomesinternational.com', hreflang: 'da' },
  { code: 'tr', name: 'Türkçe', baseUrl: 'https://futurehomesinternational.com', hreflang: 'tr' },
  { code: 'ar', name: 'العربية', baseUrl: 'https://futurehomesinternational.com', hreflang: 'ar' },
  { code: 'ru', name: 'Русский', baseUrl: 'https://futurehomesinternational.com', hreflang: 'ru' },
  { code: 'fa', name: 'فارسی', baseUrl: 'https://futurehomesinternational.com', hreflang: 'fa' },
  { code: 'ur', name: 'اردو', baseUrl: 'https://futurehomesinternational.com', hreflang: 'ur' },
];

/**
 * Get the current language from URL parameters, falling back to localStorage
 */
export const getCurrentLanguage = (): string => {
  if (typeof window === 'undefined') return 'en';
  
  const urlParams = new URLSearchParams(window.location.search);
  const langFromUrl = urlParams.get('lang');
  
  if (langFromUrl && supportedLanguages.some(l => l.code === langFromUrl)) {
    if (langFromUrl === 'en') {
      localStorage.removeItem('preferred_language');
    } else {
      localStorage.setItem('preferred_language', langFromUrl);
    }
    return langFromUrl;
  }
  
  // Fall back to localStorage
  const savedLang = localStorage.getItem('preferred_language');
  if (savedLang && supportedLanguages.some(l => l.code === savedLang)) {
    return savedLang;
  }
  
  return 'en';
};

/**
 * Get canonical URL for current page with language parameter (self-referencing)
 */
export const getCanonicalUrl = (path: string = '', lang?: string): string => {
  const currentLang = lang || getCurrentLanguage();
  const baseUrl = 'https://futurehomesinternational.com';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // For English, return clean URL without lang parameter
  if (currentLang === 'en') {
    return `${baseUrl}${cleanPath}`;
  }
  
  // For other languages, always include the lang parameter for self-referencing canonical
  const separator = cleanPath.includes('?') ? '&' : '?';
  return `${baseUrl}${cleanPath}${separator}lang=${currentLang}`;
};

/**
 * Generate hreflang alternate URLs for all supported languages
 */
export const getHreflangUrls = (path: string = ''): Array<{code: string, url: string, hreflang: string}> => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return supportedLanguages.map(lang => {
    let url = `${lang.baseUrl}${cleanPath}`;
    
    if (lang.code !== 'en') {
      const separator = cleanPath.includes('?') ? '&' : '?';
      url = `${url}${separator}lang=${lang.code}`;
    }
    
    return {
      code: lang.code,
      url: url,
      hreflang: lang.hreflang
    };
  });
};

/**
 * Get the current page path without language parameters
 */
export const getCurrentPath = (): string => {
  if (typeof window === 'undefined') return '/';
  
  const path = window.location.pathname;
  const search = new URLSearchParams(window.location.search);
  search.delete('lang'); // Remove lang parameter
  
  const searchString = search.toString();
  return searchString ? `${path}?${searchString}` : path;
};

/**
 * Generate BreadcrumbList structured data
 */
export const generateBreadcrumbSchema = (items: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

/**
 * Generate RealEstateListing structured data for property pages
 */
export const generatePropertySchema = (property: {
  title: string;
  description: string;
  price: string;
  location: string;
  bedrooms?: string;
  bathrooms?: string;
  area?: string;
  images?: string[];
  url: string;
  refNo?: string;
}) => {
  const baseUrl = 'https://futurehomesinternational.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": property.url,
    "datePosted": new Date().toISOString(),
    "offers": {
      "@type": "Offer",
      "price": property.price?.replace(/[^0-9]/g, '') || "0",
      "priceCurrency": property.price?.includes('€') ? 'EUR' : 
                       property.price?.includes('$') ? 'USD' : 
                       property.price?.includes('£') ? 'GBP' : 'EUR',
      "availability": "https://schema.org/InStock"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.location,
      "addressCountry": property.location?.toLowerCase().includes('dubai') ? 'AE' :
                        property.location?.toLowerCase().includes('cyprus') ? 'CY' :
                        property.location?.toLowerCase().includes('bali') ? 'ID' : 'TR'
    },
    ...(property.images && property.images.length > 0 && {
      "image": property.images.slice(0, 5)
    }),
    ...(property.bedrooms && {
      "numberOfRooms": property.bedrooms
    }),
    ...(property.area && {
      "floorSize": {
        "@type": "QuantitativeValue",
        "value": property.area.replace(/[^0-9]/g, ''),
        "unitCode": "MTK"
      }
    }),
    "identifier": property.refNo,
    "seller": {
      "@type": "RealEstateAgent",
      "name": "Future Homes International",
      "url": baseUrl,
      "telephone": "+90 552 303 27 50",
      "email": "info@futurehomesinternational.com"
    }
  };
};

/**
 * Generate ItemList structured data for property listing pages
 */
export const generatePropertyListSchema = (properties: Array<{
  title: string;
  price: string;
  url: string;
  image?: string;
}>, listName: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": listName,
    "numberOfItems": properties.length,
    "itemListElement": properties.slice(0, 10).map((property, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "RealEstateListing",
        "name": property.title,
        "url": property.url,
        ...(property.image && { "image": property.image })
      }
    }))
  };
};

/**
 * Generate LocalBusiness structured data for location pages
 */
export const generateLocationSchema = (location: string, description: string) => {
  const locationData: Record<string, {country: string, geo: {lat: number, lng: number}}> = {
    'antalya': { country: 'TR', geo: { lat: 36.8969, lng: 30.7133 } },
    'istanbul': { country: 'TR', geo: { lat: 41.0082, lng: 28.9784 } },
    'mersin': { country: 'TR', geo: { lat: 36.8121, lng: 34.6415 } },
    'dubai': { country: 'AE', geo: { lat: 25.2048, lng: 55.2708 } },
    'cyprus': { country: 'CY', geo: { lat: 35.1264, lng: 33.4299 } },
    'bali': { country: 'ID', geo: { lat: -8.3405, lng: 115.0920 } }
  };
  
  const data = locationData[location.toLowerCase()] || locationData['antalya'];
  
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": `Future Homes International - ${location}`,
    "description": description,
    "url": `https://futurehomesinternational.com/${location.toLowerCase()}`,
    "telephone": "+90 552 303 27 50",
    "email": "info@futurehomesinternational.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location,
      "addressCountry": data.country
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": data.geo.lat,
      "longitude": data.geo.lng
    },
    "areaServed": {
      "@type": "Place",
      "name": location
    },
    "priceRange": "€€€"
  };
};