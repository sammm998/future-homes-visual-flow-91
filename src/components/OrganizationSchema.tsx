import React from 'react';

interface OrganizationSchemaProps {
  location?: string;
}

const OrganizationSchema: React.FC<OrganizationSchemaProps> = ({ location }) => {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": ["Organization", "RealEstateAgent"],
    "name": "Future Homes International",
    "alternateName": "Future Homes",
    "url": "https://futurehomesinternational.com",
    "logo": "https://futurehomesinternational.com/favicon-512x512.png",
    "description": "Leading international real estate agency specializing in premium properties across Turkey, UAE, Cyprus, and Bali. Expert guidance for property investment and citizenship programs.",
    "foundingDate": "2020",
    "legalName": "Future Homes International Real Estate",
    "telephone": "+90-242-000-0000",
    "email": "info@futurehomesinternational.com",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+90-242-000-0000",
        "contactType": "customer service",
        "email": "info@futurehomesinternational.com",
        "availableLanguage": ["English", "Turkish", "Arabic", "Russian", "German"],
        "areaServed": ["TR", "AE", "CY", "ID", "GB", "DE", "RU"]
      },
      {
        "@type": "ContactPoint",
        "telephone": "+971-4-000-0000",
        "contactType": "sales",
        "email": "dubai@futurehomesinternational.com",
        "availableLanguage": ["English", "Arabic"],
        "areaServed": ["AE", "SA", "QA", "KW"]
      }
    ],
    "address": [
      {
        "@type": "PostalAddress",
        "streetAddress": "Future Homes Office",
        "addressLocality": "Antalya",
        "addressRegion": "Antalya",
        "postalCode": "07000",
        "addressCountry": "TR"
      },
      {
        "@type": "PostalAddress",
        "streetAddress": "Business Bay Office",
        "addressLocality": "Dubai",
        "addressRegion": "Dubai",
        "postalCode": "00000",
        "addressCountry": "AE"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/futurehomesturkey",
      "https://www.instagram.com/futurehomesturkey",
      "https://www.linkedin.com/company/futurehomesturkey",
      "https://twitter.com/futurehomestr",
      "https://www.youtube.com/futurehomesturkey"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "International Real Estate Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Luxury Property Sales",
            "description": "Premium apartments, villas, and penthouses in Turkey, UAE, Cyprus, and Bali"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Property Investment Consulting",
            "description": "Expert guidance on international real estate investment opportunities and market analysis"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Citizenship by Investment Programs",
            "description": "Turkish and Cyprus citizenship through strategic property investments"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Golden Visa Programs",
            "description": "UAE Golden Visa and residence permit assistance through property investment"
          }
        }
      ]
    },
    "areaServed": [
      { "@type": "Country", "name": "Turkey" },
      { "@type": "Country", "name": "United Arab Emirates" },
      { "@type": "Country", "name": "Cyprus" },
      { "@type": "Country", "name": "Indonesia" },
      { "@type": "Country", "name": "United Kingdom" },
      { "@type": "Country", "name": "Germany" },
      { "@type": "Country", "name": "Russia" },
      { "@type": "Country", "name": "Saudi Arabia" }
    ],
    "serviceType": [
      "International Real Estate Sales",
      "Property Investment Consulting", 
      "Citizenship by Investment",
      "Golden Visa Programs",
      "Luxury Real Estate",
      "Property Management",
      "Legal Services Support"
    ],
    "knowsAbout": [
      "Turkey Real Estate Market",
      "Dubai Property Investment",
      "Cyprus EU Citizenship",
      "Bali Property Investment",
      "Turkish Citizenship by Investment",
      "UAE Golden Visa",
      "International Property Law",
      "Luxury Real Estate"
    ],
    "priceRange": "€100,000 - €5,000,000+",
    "currenciesAccepted": ["EUR", "USD", "GBP", "TRY", "AED"]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
    />
  );
};

export default OrganizationSchema;