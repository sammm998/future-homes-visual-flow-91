import React from 'react';
import { Helmet } from 'react-helmet-async';

interface PropertyListing {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  images?: string[];
  features?: string[];
}

interface SEOSchemaGeneratorProps {
  type: 'organization' | 'real-estate' | 'property-listing' | 'local-business' | 'faq';
  data?: any;
  property?: PropertyListing;
  location?: string;
  faqs?: Array<{ question: string; answer: string }>;
}

export const SEOSchemaGenerator: React.FC<SEOSchemaGeneratorProps> = ({
  type,
  data,
  property,
  location = 'Turkey',
  faqs = []
}) => {

  const generateOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Future Homes Turkey",
    "description": "Premium real estate investment opportunities in Turkey, Dubai, Cyprus and France. Citizenship through investment programs.",
    "url": "https://futurehomesturkey.com",
    "logo": "https://futurehomesturkey.com/logo.png",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+90-XXX-XXX-XXXX",
        "contactType": "sales",
        "availableLanguage": ["English", "Swedish", "Turkish", "Arabic"]
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TR",
      "addressLocality": "Antalya"
    },
    "sameAs": [
      "https://facebook.com/futurehomesturkey",
      "https://instagram.com/futurehomesturkey",
      "https://linkedin.com/company/futurehomesturkey"
    ],
    "offers": {
      "@type": "Offer",
      "category": "Real Estate Investment",
      "description": "Luxury apartments and villas with citizenship opportunities"
    }
  });

  const generateRealEstateSchema = () => ({
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Future Homes Turkey",
    "description": `Premium real estate in ${location} with investment opportunities`,
    "url": "https://futurehomesturkey.com",
    "areaServed": ["Turkey", "Dubai", "Cyprus", "France"],
    "serviceType": [
      "Property Sales",
      "Investment Consultation", 
      "Citizenship by Investment",
      "Property Management"
    ],
    "priceRange": "€190,000 - €2,000,000+",
    "currenciesAccepted": ["EUR", "USD", "SEK", "TRY"]
  });

  const generatePropertyListingSchema = () => {
    if (!property) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": property.title,
      "description": property.description,
      "category": "Real Estate",
      "brand": {
        "@type": "Brand",
        "name": "Future Homes Turkey"
      },
      "offers": {
        "@type": "Offer",
        "price": property.price.replace(/[^\d]/g, ''),
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "Future Homes Turkey"
        }
      },
      "additionalProperty": [
        ...(property.bedrooms ? [{
          "@type": "PropertyValue",
          "name": "numberOfRooms",
          "value": property.bedrooms
        }] : []),
        ...(property.area ? [{
          "@type": "PropertyValue", 
          "name": "floorSize",
          "value": property.area
        }] : []),
        {
          "@type": "PropertyValue",
          "name": "propertyType",
          "value": "Apartment"
        }
      ],
      "image": property.images || [],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "127"
      }
    };
  };

  const generateLocalBusinessSchema = () => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Future Homes ${location}`,
    "description": `Real estate services in ${location}`,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": location === "Turkey" ? "TR" : location === "Dubai" ? "AE" : "CY",
      "addressLocality": location === "Turkey" ? "Antalya" : location
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": location === "Turkey" ? "36.8969" : "25.2048",
      "longitude": location === "Turkey" ? "30.7133" : "55.2708"
    },
    "openingHours": "Mo-Fr 09:00-18:00",
    "telephone": "+90-XXX-XXX-XXXX",
    "url": "https://futurehomesturkey.com",
    "priceRange": "€€€"
  });

  const generateFAQSchema = () => {
    if (!faqs.length) return null;

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

  const getSchema = () => {
    switch (type) {
      case 'organization':
        return generateOrganizationSchema();
      case 'real-estate':
        return generateRealEstateSchema();
      case 'property-listing':
        return generatePropertyListingSchema();
      case 'local-business':
        return generateLocalBusinessSchema();
      case 'faq':
        return generateFAQSchema();
      default:
        return null;
    }
  };

  const schema = getSchema();
  if (!schema) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default SEOSchemaGenerator;