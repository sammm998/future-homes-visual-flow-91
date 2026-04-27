import React from 'react';
import { Helmet } from 'react-helmet-async';
import { supportedLanguages, getCurrentLanguage } from '@/utils/seoUtils';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object | object[];
  hreflangUrls?: { [key: string]: string };
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  noindex?: boolean;
  breadcrumbs?: Array<{name: string, url: string}>;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords = "real estate Turkey, property investment Dubai, Cyprus properties, Turkish citizenship, luxury homes, overseas investment, international real estate, property for sale, investment opportunities",
  canonicalUrl,
  ogImage = '/og-image.jpg',
  ogType = 'website',
  structuredData,
  hreflangUrls = {},
  article,
  noindex = false,
  breadcrumbs
}) => {
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : 'https://futurehomesinternational.com');
  const siteName = 'Future Homes International';
  const defaultImage = 'https://futurehomesinternational.com/og-image.jpg';
  const currentLanguage = getCurrentLanguage();
  const baseUrl = 'https://futurehomesinternational.com';

  // Generate hreflang URLs if not provided
  const generateHreflangUrls = () => {
    if (Object.keys(hreflangUrls).length > 0) return hreflangUrls;
    
    const path = typeof window !== 'undefined' ? window.location.pathname : '/';
    const result: { [key: string]: string } = {};
    
    supportedLanguages.forEach(lang => {
      if (lang.code === 'en') {
        result[lang.code] = `${baseUrl}${path}`;
      } else {
        const separator = path.includes('?') ? '&' : '?';
        result[lang.code] = `${baseUrl}${path}${separator}lang=${lang.code}`;
      }
    });
    
    return result;
  };

  const finalHreflangUrls = generateHreflangUrls();

  // Organization structured data (always included)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Future Homes International",
    "url": baseUrl,
    "logo": `${baseUrl}/favicon.png`,
    "email": "info@futurehomesinternational.com",
    "telephone": "+90 552 303 27 50",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Antalya",
      "addressCountry": "TR"
    },
    "areaServed": ["TR", "AE", "CY", "ID"],
    "sameAs": [
      "https://www.instagram.com/futurehomesturkey",
      "https://www.facebook.com/futurehomesturkey"
    ],
    "priceRange": "€€€"
  };

  // WebSite structured data with SearchAction
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/ai-property-search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  // Breadcrumb structured data
  const breadcrumbSchema = breadcrumbs ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  } : null;

  // Determine locale for og:locale
  const getOgLocale = () => {
    const localeMap: Record<string, string> = {
      'en': 'en_US',
      'sv': 'sv_SE',
      'tr': 'tr_TR',
      'ar': 'ar_SA'
    };
    return localeMap[currentLanguage] || 'en_US';
  };

  return (
    <Helmet>
      {/* Google Analytics */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-BVKH3BBPG0"></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-BVKH3BBPG0');
        `}
      </script>
      
      {/* Google Search Console Verification */}
      <meta name="google-site-verification" content="tX9miiJWQEEYeB5sWZ8ZeSrcL_RViXlqe_l9fxM7UfQ" />
      
      {/* Primary Meta Tags */}
      <html lang={currentLanguage} />
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <meta name="author" content="Future Homes International" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content={currentLanguage === 'en' ? 'English' : currentLanguage} />
      <meta name="revisit-after" content="7 days" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Hreflang Tags for International SEO */}
      {Object.entries(finalHreflangUrls).map(([lang, url]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={finalHreflangUrls['en'] || currentUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || defaultImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={getOgLocale()} />
      
      {/* Alternate locales for Facebook */}
      {supportedLanguages.filter(l => l.code !== currentLanguage).map(lang => {
        const localeMap: Record<string, string> = {
          'en': 'en_US',
          'sv': 'sv_SE',
          'tr': 'tr_TR',
          'ar': 'ar_SA'
        };
        return <meta key={lang.code} property="og:locale:alternate" content={localeMap[lang.code]} />;
      })}
      
      {/* Article specific Open Graph tags */}
      {article && (
        <>
          {article.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
          {article.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
          {article.author && <meta property="article:author" content={article.author} />}
          {article.section && <meta property="article:section" content={article.section} />}
          {article.tags && article.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || defaultImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@FutureHomesTR" />
      <meta name="twitter:creator" content="@FutureHomesTR" />
      
      {/* Business Contact Information */}
      <meta name="contact" content="info@futurehomesinternational.com" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      
      {/* Geographic Tags */}
      <meta name="geo.region" content="TR" />
      <meta name="geo.placename" content="Turkey" />
      <meta name="geo.position" content="39.925533;32.866287" />
      <meta name="ICBM" content="39.925533, 32.866287" />
      
      {/* Mobile Optimization */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#1a365d" />
      <meta name="msapplication-TileColor" content="#1a365d" />
      
      {/* Favicon - using uploaded favicon only */}
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/favicon.png" />
      
      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//images.unsplash.com" />
      <link rel="dns-prefetch" href="//kiogiyemoqbnuvclneoe.supabase.co" />
      
      {/* Core Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      
      {/* Core Structured Data - WebSite */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      
      {/* Breadcrumb Structured Data */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
      
      {/* Custom Structured Data */}
      {structuredData && (
        Array.isArray(structuredData) 
          ? structuredData.map((data, index) => (
              <script key={index} type="application/ld+json">
                {JSON.stringify(data)}
              </script>
            ))
          : (
              <script type="application/ld+json">
                {JSON.stringify(structuredData)}
              </script>
            )
      )}
      
      {/* Additional Performance and Security Headers */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta httpEquiv="cache-control" content="public, max-age=31536000" />
      <meta name="format-detection" content="telephone=no" />
    </Helmet>
  );
};

export default SEOHead;
