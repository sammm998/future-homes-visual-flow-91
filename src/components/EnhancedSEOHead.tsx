import React from 'react';
import SEOHead from '@/components/SEOHead';

interface EnhancedSEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  structuredData?: object | object[];
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

/**
 * Legacy prop shape kept for existing pages. Rendering goes through SEOHead so
 * canonical, hreflang and localized titles come from the router location and
 * are correct in the server HTML for every language (window is unavailable
 * during SSR, which previously sent every locale's canonical to English).
 */
export const EnhancedSEOHead: React.FC<EnhancedSEOHeadProps> = ({
  title,
  description,
  keywords = [],
  canonical,
  ogImage,
  structuredData,
  hreflangAlternates,
  noindex = false,
  articleData,
}) => (
  <SEOHead
    title={title}
    description={description}
    keywords={keywords.length ? keywords.join(', ') : undefined}
    canonicalUrl={canonical}
    ogImage={ogImage}
    ogType={articleData ? 'article' : 'website'}
    structuredData={structuredData}
    hreflangUrls={hreflangAlternates}
    noindex={noindex}
    article={articleData}
  />
);

export default EnhancedSEOHead;
