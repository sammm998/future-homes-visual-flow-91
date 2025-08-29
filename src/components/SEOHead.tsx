import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string; // Keep for backward compatibility
  canonicalUrl?: string;
  type?: string;
  structuredData?: any;
  hreflang?: Array<{code: string, url: string}>;
  noindex?: boolean;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Future Homes - International Real Estate Investment",
  description = "Premium properties in Turkey, Dubai, Cyprus & France. Expert guidance, citizenship programs & luxury homes. Your investment future starts here.",
  keywords = "real estate Turkey, property investment Dubai, Cyprus properties, European real estate, Turkish citizenship, luxury homes, investment properties",
  image = "https://futurehomesturkey.com/og-image.jpg",
  url, // Backward compatibility
  canonicalUrl,
  type = "website",
  structuredData,
  hreflang = [],
  noindex = false
}) => {
  // Use canonicalUrl if provided, otherwise fall back to url for backward compatibility
  const finalCanonicalUrl = canonicalUrl || url || "https://futurehomesturkey.com";
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Future Homes" />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"} />
      <meta name="googlebot" content={noindex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"} />
      
      {/* Canonical URL - Self-referencing */}
      <link rel="canonical" href={finalCanonicalUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={finalCanonicalUrl} />
      <meta property="og:site_name" content="Future Homes" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@futurehomesturkey" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#0066CC" />
      <meta name="msapplication-TileColor" content="#0066CC" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Language alternatives */}
      {hreflang.map(({ code, url }) => (
        <link key={code} rel="alternate" hrefLang={code} href={url} />
      ))}
      
      {/* Performance and Security */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Critical performance hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//images.unsplash.com" />
    </Helmet>
  );
};

export default SEOHead;