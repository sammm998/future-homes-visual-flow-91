import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { getCurrentLanguage } from '@/utils/seoUtils';

interface LocalSEOManagerProps {
  country?: string;
  city?: string;
  propertyType?: string;
}

export const LocalSEOManager: React.FC<LocalSEOManagerProps> = ({
  country,
  city,
  propertyType = 'lägenhet'
}) => {
  const location = useLocation();
  const currentLang = getCurrentLanguage();
  
  // Determine location from URL if not provided
  const getLocationFromPath = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes('antalya') || path.includes('turkey')) return { country: 'Turkey', city: 'Antalya' };
    if (path.includes('dubai')) return { country: 'UAE', city: 'Dubai' };
    if (path.includes('cyprus')) return { country: 'Cyprus', city: 'Kyrenia' };
    
    return { country: 'Turkey', city: 'Antalya' };
  };

  const locationData = country && city ? { country, city } : getLocationFromPath();
  
  // Swedish keyword translations for different locations
  const getLocalizedKeywords = () => {
    const baseKeywords = {
      Turkey: {
        primary: [`köp ${propertyType} Turkiet`, `${propertyType} till salu Turkiet`, 'fastighetsinvestering Turkiet'],
        secondary: ['turkiskt medborgarskap fastighet', 'Antalya lägenheter', 'investering Turkiet'],
        long: [`bästa ${propertyType} Turkiet`, `${propertyType} Antalya svenska`, 'turkisk fastighet investering']
      },
      UAE: {
        primary: [`köp ${propertyType} Dubai`, `${propertyType} till salu Dubai`, 'fastighetsinvestering Dubai'],
        secondary: ['Dubai fastigheter svenska', 'Dubai Islands lägenheter', 'investering Dubai'],
        long: [`bästa ${propertyType} Dubai`, `${propertyType} Dubai svenska`, 'Dubai fastighet investering']
      },
      Cyprus: {
        primary: [`köp ${propertyType} Cypern`, `${propertyType} till salu Cypern`, 'fastighetsinvestering Cypern'],
        secondary: ['Cypern fastigheter svenska', 'nordcypern lägenheter', 'investering Cypern'],
        long: [`bästa ${propertyType} Cypern`, `${propertyType} Cypern svenska`, 'cypriotisk fastighet investering']
      },
      France: {
        primary: [`köp ${propertyType} Frankrike`, `${propertyType} till salu Frankrike`, 'fastighetsinvestering Frankrike'],
        secondary: ['fransk fastighet investering', 'Côte d\'Azur lägenheter', 'investering Frankrike'],
        long: [`bästa ${propertyType} Frankrike`, `${propertyType} Frankrike svenska`, 'fransk fastighet investering']
      }
    };

    return baseKeywords[locationData.country as keyof typeof baseKeywords] || baseKeywords.Turkey;
  };

  const keywords = getLocalizedKeywords();
  const allKeywords = [...keywords.primary, ...keywords.secondary, ...keywords.long].join(', ');

  // Generate localized meta data
  const getLocalizedMeta = () => {
    const templates = {
      Turkey: {
        title: `Köp ${propertyType} i ${locationData.city}, Turkiet - Starting price €190,000`,
        description: `Köp ${propertyType} i ${locationData.city}, Turkiet från €190,000. Få turkiskt medborgarskap genom fastighetsinvestering. Professionell service på svenska.`,
      },
      UAE: {
        title: `Köp ${propertyType} i ${locationData.city}, Dubai - Premium fastigheter`,
        description: `Köp ${propertyType} i ${locationData.city}, Dubai. Lyxiga fastigheter med hög avkastning. Professionell service på svenska.`,
      },
      Cyprus: {
        title: `Köp ${propertyType} i ${locationData.city}, Cypern - Starting price €190,000`,
        description: `Köp ${propertyType} i ${locationData.city}, Cypern från €190,000. EU-medborgarskap genom fastighetsinvestering. Service på svenska.`,
      },
      France: {
        title: `Köp ${propertyType} i ${locationData.city}, Frankrike - Lyxfastigheter`,
        description: `Köp ${propertyType} i ${locationData.city}, Frankrike. Exklusiva fastigheter på Côte d'Azur. Professionell service på svenska.`,
      }
    };

    return templates[locationData.country as keyof typeof templates] || templates.Turkey;
  };

  const metaData = getLocalizedMeta();

  // Generate hreflang for this specific location
  const generateLocationHreflang = () => {
    const currentPath = location.pathname;
    const baseUrl = 'https://futurehomesturkey.com';
    
    return [
      { lang: 'sv-SE', url: `${baseUrl}${currentPath}?lang=sv` },
      { lang: 'en', url: `${baseUrl}${currentPath}` },
      { lang: 'tr-TR', url: `${baseUrl}${currentPath}?lang=tr` },
      { lang: 'ar-SA', url: `${baseUrl}${currentPath}?lang=ar` },
      { lang: 'x-default', url: `${baseUrl}${currentPath}` }
    ];
  };

  const hreflangUrls = generateLocationHreflang();

  return (
    <Helmet>
      {/* Localized meta tags */}
      <title>{metaData.title}</title>
      <meta name="description" content={metaData.description} />
      <meta name="keywords" content={allKeywords} />
      
      {/* Hreflang for this location */}
      {hreflangUrls.map(({ lang, url }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      
      {/* Open Graph localization */}
      <meta property="og:title" content={metaData.title} />
      <meta property="og:description" content={metaData.description} />
      <meta property="og:locale" content={currentLang === 'sv' ? 'sv_SE' : 'en_US'} />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:locale:alternate" content="sv_SE" />
      <meta property="og:locale:alternate" content="tr_TR" />
      
      {/* Location-specific meta */}
      <meta name="geo.region" content={locationData.country === 'Turkey' ? 'TR' : locationData.country === 'UAE' ? 'AE' : 'CY'} />
      <meta name="geo.placename" content={locationData.city} />
      <meta name="geo.position" content={
        locationData.country === 'Turkey' ? '36.8969;30.7133' :
        locationData.country === 'UAE' ? '25.2048;55.2708' :
        '35.3413;33.3192'
      } />
      
      {/* Property-specific meta */}
      <meta name="property:type" content={propertyType} />
      <meta name="property:location" content={`${locationData.city}, ${locationData.country}`} />
      <meta name="investment:minimum" content="190000" />
      <meta name="investment:currency" content="EUR" />
      
      {/* Language meta */}
      <meta httpEquiv="content-language" content={currentLang} />
      <html lang={currentLang} />
    </Helmet>
  );
};

export default LocalSEOManager;