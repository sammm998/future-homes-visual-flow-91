import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogImage: string;
  structuredData?: any;
}

export const useSEO = (customData?: Partial<SEOData>): SEOData => {
  const location = useLocation();
  const baseUrl = 'https://futurehomesturkey.com';
  
  const defaultData = useMemo(() => {
    const path = location.pathname;
    const currentUrl = `${baseUrl}${path}`;
    
    // Route-specific SEO data
    const routeData: Record<string, Partial<SEOData>> = {
      '/': {
        title: 'Future Homes - Premium Real Estate in Turkey, Dubai & Europe',
        description: 'Discover luxury properties in Turkey, Dubai, Cyprus and France. Expert real estate services with Turkish citizenship programs. Your future starts here.',
        keywords: 'real estate Turkey, property investment Dubai, Cyprus properties, French real estate, Turkish citizenship by investment, luxury homes',
        structuredData: {
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          "name": "Future Homes",
          "description": "Premium real estate agency specializing in Turkish, Dubai, Cyprus and French properties",
          "url": baseUrl,
          "telephone": "+90 552 303 27 50",
          "email": "info@futurehomesturkey.com"
        }
      },
      '/antalya': {
        title: 'Antalya Properties - Luxury Real Estate & Investment Opportunities',
        description: 'Premium properties in Antalya, Turkey. Beachfront apartments, luxury villas and investment opportunities with Turkish citizenship eligibility.',
        keywords: 'Antalya properties, Antalya real estate, Turkey property investment, Antalya apartments, Turkish citizenship'
      },
      '/dubai': {
        title: 'Dubai Properties - Luxury Real Estate Investment Opportunities',
        description: 'Exclusive Dubai real estate listings. Luxury apartments, penthouses and villas in prime locations. Expert investment guidance and property management.',
        keywords: 'Dubai properties, Dubai real estate, UAE investment, Dubai apartments, luxury properties Dubai'
      },
      '/cyprus': {
        title: 'Cyprus Properties - Mediterranean Real Estate & EU Residency',
        description: 'Premium Cyprus properties with EU residency benefits. Beachfront villas, modern apartments and investment opportunities in Northern Cyprus.',
        keywords: 'Cyprus properties, Cyprus real estate, EU residency, Cyprus investment, Mediterranean properties'
      },
      '/mersin': {
        title: 'Mersin Properties - Coastal Real Estate Investment Turkey',
        description: 'Discover Mersin properties on Turkey\'s Mediterranean coast. Modern apartments and villas with sea views and investment potential.',
        keywords: 'Mersin properties, Mersin real estate, Turkey coastal properties, Mediterranean real estate'
      },
      '/france': {
        title: 'France Properties - Premium European Real Estate Investment',
        description: 'Luxury French properties and investment opportunities. Châteaux, apartments and villas in prime French locations.',
        keywords: 'France properties, French real estate, European property investment, luxury homes France'
      },
      '/property-wizard': {
        title: 'Property Finder Wizard - Find Your Perfect Home',
        description: 'Use our intelligent property wizard to find your perfect home. Filter by location, budget, and preferences to discover ideal properties.',
        keywords: 'property finder, property search, home finder, real estate wizard'
      },
      '/ai-property-search': {
        title: 'AI Property Search - Smart Real Estate Discovery',
        description: 'Advanced AI-powered property search. Describe your ideal home and let our AI find perfect matches from our premium property portfolio.',
        keywords: 'AI property search, smart property finder, artificial intelligence real estate'
      },
      '/about-us': {
        title: 'About Future Homes - Your Trusted Real Estate Partner',
        description: 'Learn about Future Homes, your trusted partner in international real estate. Expert team providing premium property services since 2020.',
        keywords: 'about Future Homes, real estate company, property experts, international real estate'
      },
      '/contact-us': {
        title: 'Contact Future Homes - Get Expert Real Estate Advice',
        description: 'Contact our real estate experts for personalized property consultation. Available 24/7 for all your international property needs.',
        keywords: 'contact Future Homes, real estate consultation, property advice, international property experts'
      }
    };

    const route = routeData[path] || {};
    
    return {
      title: route.title || 'Future Homes - Premium International Real Estate',
      description: route.description || 'Discover premium properties worldwide with Future Homes. Expert real estate services in Turkey, Dubai, Cyprus and France.',
      keywords: route.keywords || 'real estate, property investment, international properties, luxury homes',
      canonicalUrl: currentUrl,
      ogImage: `${baseUrl}/og-image.jpg`,
      structuredData: route.structuredData
    };
  }, [location.pathname, baseUrl]);

  return {
    ...defaultData,
    ...customData,
    canonicalUrl: customData?.canonicalUrl || defaultData.canonicalUrl
  };
};

export const usePropertySEO = (property: any, location: string) => {
  const { pathname } = useLocation();
  const baseUrl = 'https://futurehomesturkey.com';
  
  return useMemo(() => {
    if (!property) {
      return {
        title: `Properties in ${location} - Future Homes`,
        description: `Discover premium properties in ${location}. Luxury real estate with expert guidance and investment opportunities.`,
        keywords: `${location} properties, ${location} real estate, property investment ${location}`,
        canonicalUrl: `${baseUrl}${pathname}`,
        ogImage: `${baseUrl}/og-image.jpg`
      };
    }

    const price = property.price?.replace(/[^\d]/g, '') || '';
    const priceText = price ? `€${parseInt(price).toLocaleString()}` : '';
    
    return {
      title: `${property.title} ${priceText} - ${location} Property | Future Homes`,
      description: `${property.title} in ${location}. ${property.bedrooms || 'Multiple'} bedrooms, ${property.area || ''} m². Premium property with expert guidance. ${priceText}`,
      keywords: `${property.title}, ${location} property, ${property.bedrooms} bedroom apartment ${location}, real estate ${location}`,
      canonicalUrl: `${baseUrl}${pathname}`,
      ogImage: property.image || `${baseUrl}/og-image.jpg`,
      structuredData: {
        "@context": "https://schema.org",
        "@type": "RealEstate",
        "name": property.title,
        "description": property.description || `Premium property in ${location}`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": location,
          "addressCountry": location === 'Dubai' ? 'UAE' : location === 'Cyprus' ? 'Cyprus' : location === 'France' ? 'France' : 'Turkey'
        },
        "image": property.image,
        "offers": {
          "@type": "Offer",
          "price": price,
          "priceCurrency": "EUR"
        }
      }
    };
  }, [property, location, pathname, baseUrl]);
};