import React from 'react';

const OrganizationSchema: React.FC = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Future Homes",
    "description": "Premium real estate investment opportunities in Turkey, Dubai, Cyprus, and Europe with expert guidance for property investment and Turkish citizenship.",
    "url": "https://futurehomesturkey.com",
    "logo": "https://futurehomesturkey.com/lovable-uploads/9b08d909-a9da-4946-942a-c24106cd57f7.png",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Turkey",
      "addressCountry": "TR"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+90-XXX-XXX-XXXX",
      "contactType": "Customer Service",
      "availableLanguage": ["English", "Turkish", "Arabic", "French", "German", "Russian"]
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "Turkey"
      },
      {
        "@type": "Country", 
        "name": "United Arab Emirates"
      },
      {
        "@type": "Country",
        "name": "Cyprus"
      },
      {
        "@type": "Country",
        "name": "Cyprus"
      }
    ],
    "serviceType": [
      "Real Estate Investment",
      "Property Management",
      "Turkish Citizenship Consultation",
      "Luxury Property Sales",
      "International Real Estate"
    ],
    "sameAs": [
      "https://www.facebook.com/futurehomesturkey",
      "https://www.instagram.com/futurehomesturkey",
      "https://www.linkedin.com/company/future-homes-turkey"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
};

export default OrganizationSchema;