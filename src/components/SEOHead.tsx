import React from 'react';
import { supportedLanguages } from '@/utils/seoUtils';
import { localizePath } from '@/utils/localeRouting';
import { getPageMeta } from '@/utils/pageMeta';
import { useLocation } from '@/lib/router-compat';
import { resolveUrlLocale } from '@/utils/localeRouting';
import {
  DEFAULT_OG_IMAGE, OG_LOCALES, ROBOTS_INDEX, ROBOTS_NOINDEX, SITE_NAME, SITE_URL,
  fitTitle, normalizeSeoPath, toAbsoluteUrl,
} from '@/lib/seoTags';

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
  title: titleProp,
  description: descriptionProp,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  structuredData,
  hreflangUrls = {},
  article,
  noindex = false,
  breadcrumbs
}) => {
  const location = useLocation();
  const currentLocaleFreePath = normalizeSeoPath(location.pathname);
  const siteName = SITE_NAME;
  const currentLanguage = resolveUrlLocale(location.pathname, location.search);
  const baseUrl = SITE_URL;
  const image = toAbsoluteUrl(ogImage) || DEFAULT_OG_IMAGE;

  // Self-referencing, locale-aware canonical
  const canonicalPath = (() => {
    if (!canonicalUrl) return currentLocaleFreePath;
    try {
      return normalizeSeoPath(new URL(canonicalUrl, baseUrl).pathname);
    } catch {
      return currentLocaleFreePath;
    }
  })();
  // When explicit hreflang URLs are supplied (property/blog detail pages have
  // language-specific path segments), the canonical must be that exact URL.
  const currentUrl =
    hreflangUrls[currentLanguage] ||
    (Object.keys(hreflangUrls).length > 0 && canonicalUrl
      ? canonicalUrl
      : `${baseUrl}${localizePath(canonicalPath, currentLanguage)}`);

  // Localized title/description for known pages, so every language gets
  // unique, translated metadata instead of the English fallback.
  const localized = getPageMeta(canonicalPath, currentLanguage);
  const title = fitTitle(localized?.title || titleProp);
  const description = localized?.description || descriptionProp;

  // Generate hreflang URLs if not provided
  const generateHreflangUrls = () => {
    if (Object.keys(hreflangUrls).length > 0) return hreflangUrls;
    
    const result: { [key: string]: string } = {};

    supportedLanguages.forEach(lang => {
      result[lang.code] = `${baseUrl}${localizePath(canonicalPath, lang.code)}`;
    });
    
    return result;
  };

  const finalHreflangUrls = generateHreflangUrls();

  // Organization structured data (always included)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${baseUrl}/#organization`,
    "name": "Future Homes International",
    "url": baseUrl,
    "logo": `${baseUrl}/future-homes-logo-new.jpg`,
    "image": DEFAULT_OG_IMAGE,
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
    "@id": `${baseUrl}/#website`,
    "name": siteName,
    "alternateName": "Future Homes",
    "url": baseUrl,
    "inLanguage": currentLanguage,
    "publisher": { "@id": `${baseUrl}/#organization` }
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

  return (
    <>
      {/* React 19 hoists these into <head>, SSR included. Sitewide tags
          (charset, viewport, icons, theme colour) live in the root route. */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && currentLanguage === 'en' && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noindex ? ROBOTS_NOINDEX : ROBOTS_INDEX} />

      {!noindex && <link rel="canonical" href={currentUrl} />}
      {!noindex && Object.entries(finalHreflangUrls).map(([lang, url]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      {!noindex && <link rel="alternate" hrefLang="x-default" href={finalHreflangUrls['en'] || currentUrl} />}

      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {image === DEFAULT_OG_IMAGE && <meta property="og:image:width" content="1200" />}
      {image === DEFAULT_OG_IMAGE && <meta property="og:image:height" content="630" />}
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content={OG_LOCALES[currentLanguage] || 'en_US'} />
      {!noindex && supportedLanguages.filter(l => l.code !== currentLanguage).map(lang => (
        <meta key={lang.code} property="og:locale:alternate" content={OG_LOCALES[lang.code] || 'en_US'} />
      ))}

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

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      {breadcrumbSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      )}
      {structuredData && (Array.isArray(structuredData) ? structuredData : [structuredData]).map((data, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      ))}
    </>
  );
};

export default SEOHead;
