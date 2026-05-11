import React from 'react';
import { Helmet } from 'react-helmet-async';
import { supportedLanguages, getLanguageFromUrl } from '@/utils/seoConfig';

interface EnhancedSEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  structuredData?: any;
  hreflangAlternates?: { [key: string]: string };
  noindex?: boolean;
  articleData?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

export const EnhancedSEOHead: React.FC<EnhancedSEOHeadProps> = ({
  title,
  description,
  keywords = [],
  canonical,
  ogImage,
  structuredData,
  hreflangAlternates,
  noindex = false,
  articleData
}) => {
  const currentLanguage = getLanguageFromUrl();
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const baseUrl = 'https://futurehomesinternational.com';
  const defaultImage = `${baseUrl}/images/future-homes-og-image.jpg`;
  
  // Generate hreflang URLs
  const generateHreflangUrls = () => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const cleanPath = currentPath.replace(/^\/[a-z]{2}\//, '/').replace(/^\//, '');
    
    return supportedLanguages.map(lang => {
      let url = `${baseUrl}`;
      if (lang.code !== 'en') {
        url += `/${lang.code}`;
      }
      if (cleanPath) {
        url += `/${cleanPath}`;
      }
      
      return {
        code: lang.code,
        url: url
      };
    });
  };

  const hreflangUrls = hreflangAlternates ? 
    Object.entries(hreflangAlternates).map(([code, url]) => ({ code, url })) :
    generateHreflangUrls();

  // Enhanced structured data with WebSite and SearchAction
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Future Homes International",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Future Homes International",
    "url": baseUrl,
    "logo": `${baseUrl}/images/future-homes-logo.png`,
    "email": "info@futurehomesinternational.com",
    "telephone": "+90 552 303 27 50",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TR",
      "addressLocality": "Antalya"
    },
    "areaServed": ["TR", "AE", "CY", "ID", "EU"],
    "sameAs": [
      "https://www.instagram.com/futurehomesturkey",
      "https://www.facebook.com/futurehomesturkey",
      "https://www.linkedin.com/company/future-homes-turkey"
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      
      {/* Language and Canonical */}
      <html lang={currentLanguage} />
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:type" content={articleData ? "article" : "website"} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImage || defaultImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Future Homes International" />
      <meta property="og:locale" content={currentLanguage === 'en' ? 'en_US' : `${currentLanguage}_${currentLanguage.toUpperCase()}`} />
      
      {/* Article-specific Open Graph */}
      {articleData && (
        <>
          {articleData.publishedTime && <meta property="article:published_time" content={articleData.publishedTime} />}
          {articleData.modifiedTime && <meta property="article:modified_time" content={articleData.modifiedTime} />}
          {articleData.author && <meta property="article:author" content={articleData.author} />}
          {articleData.section && <meta property="article:section" content={articleData.section} />}
          {articleData.tags && articleData.tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || defaultImage} />
      <meta name="twitter:site" content="@futurehomesturkey" />

      {/* Hreflang Tags */}
      {hreflangUrls.map(({ code, url }) => (
        <link key={code} rel="alternate" hrefLang={code} href={url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/`} />

      {/* Favicons and App Icons */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=3" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=3" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=3" />
      <link rel="manifest" href="/site.webmanifest?v=3" />
      <meta name="theme-color" content="#1a202c" />

      {/* Performance */}
      <link rel="dns-prefetch" href="//kiogiyemoqbnuvclneoe.supabase.co" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};