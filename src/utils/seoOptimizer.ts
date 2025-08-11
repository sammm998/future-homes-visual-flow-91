// Advanced SEO optimization utilities
import { getCurrentLanguage } from './seoUtils';

export interface AdvancedSEOData {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
  ogType: string;
  structuredData?: Record<string, any>;
  hreflang?: Array<{ code: string; url: string }>;
  breadcrumbs?: Array<{ name: string; url: string }>;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

/**
 * Generate comprehensive structured data for real estate
 */
export const generateRealEstateStructuredData = (property: any, location: string) => {
  const baseUrl = 'https://futurehomesturkey.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": `${baseUrl}/property/${property.id}`,
    "image": property.images?.map((img: string) => img) || [],
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": property.currency || "USD",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Future Homes Turkey",
        "url": baseUrl
      }
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location,
      "addressCountry": property.country || "Turkey"
    },
    "geo": property.coordinates ? {
      "@type": "GeoCoordinates",
      "latitude": property.coordinates.lat,
      "longitude": property.coordinates.lng
    } : undefined,
    "numberOfRooms": property.bedrooms,
    "numberOfBathroomsTotal": property.bathrooms,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.size,
      "unitCode": "SQM"
    },
    "yearBuilt": property.yearBuilt,
    "propertyType": property.type
  };
};

/**
 * Generate organization structured data
 */
export const generateOrganizationStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Future Homes Turkey",
    "url": "https://futurehomesturkey.com",
    "logo": "https://futurehomesturkey.com/logo.png",
    "description": "Premium international real estate investment company specializing in Turkey, Dubai, Cyprus & France properties.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Antalya",
      "addressCountry": "Turkey"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+90-xxx-xxx-xxxx",
      "contactType": "customer service",
      "availableLanguage": ["English", "Swedish", "Turkish", "Arabic"]
    },
    "sameAs": [
      "https://facebook.com/futurehomesturkey",
      "https://instagram.com/futurehomesturkey",
      "https://linkedin.com/company/futurehomesturkey"
    ]
  };
};

/**
 * Generate breadcrumb structured data
 */
export const generateBreadcrumbStructuredData = (breadcrumbs: Array<{ name: string; url: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};

/**
 * Generate FAQ structured data
 */
export const generateFAQStructuredData = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

/**
 * Generate website structured data
 */
export const generateWebsiteStructuredData = () => {
  const currentLang = getCurrentLanguage();
  
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Future Homes Turkey",
    "url": "https://futurehomesturkey.com",
    "description": "Premium international real estate investment platform",
    "inLanguage": currentLang,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://futurehomesturkey.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
};

/**
 * Generate article structured data
 */
export const generateArticleStructuredData = (article: {
  title: string;
  description: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  imageUrl?: string;
  url: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Future Homes Turkey",
      "logo": {
        "@type": "ImageObject",
        "url": "https://futurehomesturkey.com/logo.png"
      }
    },
    "datePublished": article.publishedDate,
    "dateModified": article.modifiedDate || article.publishedDate,
    "image": article.imageUrl,
    "url": article.url
  };
};

/**
 * Optimize meta description for search engines
 */
export const optimizeMetaDescription = (description: string, maxLength = 155): string => {
  if (description.length <= maxLength) return description;
  
  const truncated = description.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
};

/**
 * Generate optimal title for SEO
 */
export const generateSEOTitle = (title: string, siteName = 'Future Homes Turkey', maxLength = 60): string => {
  const separator = ' | ';
  const fullTitle = `${title}${separator}${siteName}`;
  
  if (fullTitle.length <= maxLength) return fullTitle;
  
  const availableLength = maxLength - separator.length - siteName.length;
  const truncatedTitle = title.substring(0, availableLength - 3) + '...';
  
  return `${truncatedTitle}${separator}${siteName}`;
};

/**
 * Extract keywords from content
 */
export const extractKeywords = (content: string, maxKeywords = 10): string[] => {
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were'];
  
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.includes(word));
  
  const wordCount = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
};