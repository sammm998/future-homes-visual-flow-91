import React from 'react';
import { Helmet } from 'react-helmet-async';


interface SEOHreflangProps {
  path: string;
}

export const SEOHreflang: React.FC<SEOHreflangProps> = ({ path }) => {
  
  
  // Available languages for hreflang
  const languages = [
    { code: 'en', country: 'us' },
    { code: 'sv', country: 'se' },
    { code: 'no', country: 'no' },
    { code: 'da', country: 'dk' },
    { code: 'tr', country: 'tr' },
    { code: 'ar', country: 'sa' },
    { code: 'ru', country: 'ru' },
    { code: 'fa', country: 'ir' },
    { code: 'ur', country: 'pk' }
  ];

  const baseUrl = 'https://your-domain.com'; // Replace with actual domain
  
  return (
    <Helmet>
      {/* Canonical URL */}
      <link rel="canonical" href={`${baseUrl}${path}`} />
      
      {/* Hreflang tags for each language */}
      {languages.map(({ code, country }) => (
        <link
          key={code}
          rel="alternate"
          hrefLang={`${code}-${country}`}
          href={`${baseUrl}/${code}${path}`}
        />
      ))}
      
      {/* Default language fallback */}
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${path}`} />
      
      {/* Current page language */}
      <html lang="en" />
    </Helmet>
  );
};