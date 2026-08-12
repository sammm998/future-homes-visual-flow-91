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
        title: 'Future Homes International | Premium Properties Worldwide',
        description: 'Discover luxury properties for sale worldwide. Expert real estate services in Dubai, Cyprus & Bali. Citizenship programs, investment opportunities. Your dream home awaits.',
        keywords: 'luxury real estate, property investment, international properties, Dubai real estate, Cyprus properties, international real estate, citizenship programs',
        structuredData: {
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          "name": "Future Homes International",
          "description": "Leading international real estate agency specializing in luxury properties",
          "url": baseUrl,
          "telephone": "+90-242-322-2222",
          "email": "info@futurehomesinternational.com",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "TR",
            "addressLocality": "Antalya"
          }
        }
      },
      '/antalya': {
        title: 'Properties for Sale in Antalya | Mediterranean Luxury Real Estate',
        description: 'Premium properties for sale in Antalya. Luxury apartments, villas & investment opportunities in Konyaaltı, Lara & city center. Mediterranean lifestyle awaits.',
        keywords: 'Antalya real estate, properties for sale Antalya, luxury apartments Antalya, villas for sale Antalya, Mediterranean properties'
      },
      '/dubai': {
        title: 'Properties for Sale in Dubai | Luxury UAE Real Estate Investment',
        description: 'Exclusive properties for sale in Dubai, UAE. Luxury apartments, penthouses & villas in Downtown, Marina, Palm Jumeirah. High-end investment opportunities with guaranteed ROI.',
        keywords: 'Dubai real estate, properties for sale Dubai, luxury apartments Dubai, Dubai Marina properties, UAE investment properties'
      },
      '/cyprus': {
        title: 'Properties for Sale in Cyprus | EU Residency & Investment',
        description: 'Premium properties for sale in Cyprus. Luxury villas, apartments & investment opportunities. EU residency benefits, tax advantages & Mediterranean lifestyle.',
        keywords: 'Cyprus real estate, properties for sale Cyprus, EU residency Cyprus, Cyprus investment properties, luxury villas Cyprus'
      },
      '/mersin': {
        title: 'Properties for Sale in Mersin | Emerging Coastal Market',
        description: 'Find premium properties for sale in Mersin. Modern apartments, luxury homes & investment opportunities along the Mediterranean coast. High growth potential.',
        keywords: 'Mersin real estate, properties for sale Mersin, coastal properties, investment opportunities Mersin'
      },
      '/bali': {
        title: 'Properties for Sale in Bali | Tropical Paradise Investment',
        description: 'Exclusive properties for sale in Bali, Indonesia. Luxury villas, beachfront properties & investment opportunities in Seminyak, Canggu, Ubud. Tropical living paradise.',
        keywords: 'Bali real estate, properties for sale Bali, luxury villas Bali, tropical properties Indonesia, Bali investment'
      },
      '/property-wizard': {
        title: 'Property Finder Wizard | Find Your Perfect Dream Home',
        description: 'Use our intelligent property wizard to find your perfect home. Filter by location, budget, preferences to discover ideal luxury properties worldwide.',
        keywords: 'property finder, property search, home finder, real estate wizard, property matching'
      },
      '/ai-property-search': {
        title: 'AI Property Search | Smart Real Estate Discovery Technology',
        description: 'Advanced AI-powered property search. Describe your ideal home and let our AI find perfect matches from our premium international property portfolio.',
        keywords: 'AI property search, smart property finder, artificial intelligence real estate, property matching technology'
      },
      '/about-us': {
        title: 'About Future Homes International | Your Trusted Real Estate Partner',
        description: 'Learn about Future Homes International - leading real estate agency with 15+ years experience. Multilingual team, full-service support, offices worldwide.',
        keywords: 'about Future Homes, real estate company, property experts, international real estate, multilingual real estate team'
      },
      '/contact-us': {
        title: 'Contact Future Homes | Get Expert Property Consultation',
        description: 'Contact Future Homes for expert property consultation. Multilingual team available 24/7. Free property valuation, investment advice, and personalized service worldwide.',
        keywords: 'contact Future Homes, real estate consultation, property advice, international property experts, property consultation'
      },
      '/testimonials': {
        title: 'Client Testimonials | Real Estate Success Stories & Reviews',
        description: 'Read authentic testimonials from satisfied Future Homes clients. Real success stories from property investors who found their dream homes worldwide.',
        keywords: 'Future Homes testimonials, property investment success stories, client reviews, real estate testimonials, customer experiences'
      },
      '/information': {
        title: 'Property Investment Guide | Expert Real Estate Information',
        description: 'Comprehensive property investment guides, market insights, legal advice, and buying guides for international real estate. Expert information hub.',
        keywords: 'property investment guide, real estate information, property buying guide, investment advice, real estate market insights'
      },
      '/articles/expenses-buying-property-turkey': {
        title: 'Complete Guide: Property Buying Costs 2024 | Future Homes International',
        description: 'Comprehensive breakdown of all costs when buying international property - taxes, fees, legal costs, and hidden expenses. Updated 2024 guide with current rates.',
        keywords: 'property buying costs, property taxes, real estate fees, property purchase expenses, investment costs'
      }
    };

    const route = routeData[path] || {};
    
    return {
      title: route.title || 'Future Homes International - Premium Real Estate Worldwide',
      description: route.description || 'Discover premium properties worldwide with Future Homes. Expert real estate services in Dubai, Cyprus, Bali, Antalya, Mersin with citizenship programs.',
      keywords: route.keywords || 'real estate, property investment, international properties, luxury homes, citizenship programs',
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
    const priceText = price ? `€${parseInt(price).toLocaleString('en-US')}` : '';
    
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
          "addressCountry": location === 'Dubai' ? 'UAE' : location === 'Cyprus' ? 'Cyprus' : location === 'France' ? 'France' : location === 'Bali' ? 'Indonesia' : 'International'
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