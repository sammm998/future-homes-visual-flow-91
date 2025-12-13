import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch all properties with more details for better SEO
    const { data: properties } = await supabase
      .from('properties')
      .select('id, ref_no, updated_at, status, location, title, property_type, price')
      .eq('status', 'available')
      .eq('is_active', true);

    // Fetch all blog posts
    const { data: blogPosts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, title, language_code')
      .eq('published', true);

    const currentDate = new Date().toISOString().split('T')[0];
    const baseUrl = 'https://futurehomesinternational.com';
    
    // Supported languages for multi-language sitemap
    const languages = ['en', 'sv', 'tr', 'ar'];

    // Static pages - Core pages with updated structure
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/property-wizard', priority: '0.9', changefreq: 'weekly' },
      { url: '/ai-property-search', priority: '0.9', changefreq: 'weekly' },
      
      // Location-specific property search pages (main destinations)
      { url: '/antalya', priority: '0.9', changefreq: 'daily' },
      { url: '/istanbul', priority: '0.9', changefreq: 'daily' },
      { url: '/dubai', priority: '0.9', changefreq: 'daily' },
      { url: '/cyprus', priority: '0.9', changefreq: 'daily' },
      { url: '/mersin', priority: '0.8', changefreq: 'daily' },
      { url: '/bali', priority: '0.8', changefreq: 'daily' },
      
      // Company and information pages
      { url: '/about-us', priority: '0.8', changefreq: 'monthly' },
      { url: '/contact-us', priority: '0.8', changefreq: 'monthly' },
      { url: '/testimonials', priority: '0.7', changefreq: 'weekly' },
      { url: '/information', priority: '0.7', changefreq: 'weekly' },
      
      // Media and showcase pages
      { url: '/property-gallery', priority: '0.6', changefreq: 'weekly' },
      
      // Team pages
      { url: '/ali-karan', priority: '0.6', changefreq: 'monthly' },
      
      // SEO landing pages for key search terms
      { url: '/property-for-sale-in-turkey', priority: '0.8', changefreq: 'weekly' },
      { url: '/turkish-citizenship-by-investment', priority: '0.8', changefreq: 'weekly' },
      { url: '/apartments-for-sale-in-turkey', priority: '0.8', changefreq: 'weekly' },
      { url: '/luxury-villas-in-turkey', priority: '0.8', changefreq: 'weekly' },
      { url: '/off-plan-property-in-turkey', priority: '0.7', changefreq: 'weekly' },
      { url: '/expenses-buying-property-turkey', priority: '0.7', changefreq: 'monthly' },
    ];

    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    // Add static pages with language alternates
    staticPages.forEach(page => {
      // Default English version with full hreflang alternates
      sitemapXml += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>`;
      
      // Add xhtml:link alternates for each language (including self-referencing)
      languages.forEach(lang => {
        const langUrl = lang === 'en' ? `${baseUrl}${page.url}` : `${baseUrl}${page.url}${page.url.includes('?') ? '&' : '?'}lang=${lang}`;
        sitemapXml += `
    <xhtml:link rel="alternate" hreflang="${lang}" href="${langUrl}" />`;
      });
      sitemapXml += `
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${page.url}" />`;
      
      sitemapXml += `
  </url>`;
      
      // Add alternate language versions as separate URL entries with their own hreflang sets
      languages.forEach(lang => {
        if (lang !== 'en') {
          const langUrl = `${baseUrl}${page.url}${page.url.includes('?') ? '&' : '?'}lang=${lang}`;
          sitemapXml += `
  <url>
    <loc>${langUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${(parseFloat(page.priority) - 0.05).toFixed(2)}</priority>`;
          
          // Add hreflang alternates for this language version too
          languages.forEach(altLang => {
            const altUrl = altLang === 'en' ? `${baseUrl}${page.url}` : `${baseUrl}${page.url}${page.url.includes('?') ? '&' : '?'}lang=${altLang}`;
            sitemapXml += `
    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}" />`;
          });
          sitemapXml += `
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${page.url}" />`;
          
          sitemapXml += `
  </url>`;
        }
      });
    });

    // Add property pages with enhanced metadata and language alternates
    if (properties && properties.length > 0) {
      properties.forEach(property => {
        const lastmod = property.updated_at 
          ? new Date(property.updated_at).toISOString().split('T')[0]
          : currentDate;
        
        // Main property page by ref_no (primary) with language alternates
        if (property.ref_no) {
          sitemapXml += `
  <url>
    <loc>${baseUrl}/property/${property.ref_no}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>`;
          
          // Add hreflang alternates for property pages
          languages.forEach(lang => {
            const langUrl = lang === 'en' 
              ? `${baseUrl}/property/${property.ref_no}` 
              : `${baseUrl}/property/${property.ref_no}?lang=${lang}`;
            sitemapXml += `
    <xhtml:link rel="alternate" hreflang="${lang}" href="${langUrl}" />`;
          });
          sitemapXml += `
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/property/${property.ref_no}" />`;
          
          sitemapXml += `
  </url>`;
          
          // Add language versions for property pages
          languages.forEach(lang => {
            if (lang !== 'en') {
              sitemapXml += `
  <url>
    <loc>${baseUrl}/property/${property.ref_no}?lang=${lang}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>`;
              
              languages.forEach(altLang => {
                const altUrl = altLang === 'en' 
                  ? `${baseUrl}/property/${property.ref_no}` 
                  : `${baseUrl}/property/${property.ref_no}?lang=${altLang}`;
                sitemapXml += `
    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}" />`;
              });
              sitemapXml += `
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/property/${property.ref_no}" />`;
              
              sitemapXml += `
  </url>`;
            }
          });
        }
        
        // Also add by UUID for direct access
        sitemapXml += `
  <url>
    <loc>${baseUrl}/property/${property.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      });
    }

    // Add blog articles with language alternates
    if (blogPosts && blogPosts.length > 0) {
      blogPosts.forEach(post => {
        const lastmod = post.updated_at 
          ? new Date(post.updated_at).toISOString().split('T')[0]
          : currentDate;
        
        sitemapXml += `
  <url>
    <loc>${baseUrl}/articles/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>`;
        
        // Add hreflang alternates for blog posts
        languages.forEach(lang => {
          const langUrl = lang === 'en' 
            ? `${baseUrl}/articles/${post.slug}` 
            : `${baseUrl}/articles/${post.slug}?lang=${lang}`;
          sitemapXml += `
    <xhtml:link rel="alternate" hreflang="${lang}" href="${langUrl}" />`;
        });
        sitemapXml += `
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/articles/${post.slug}" />`;
        
        sitemapXml += `
  </url>`;
      });
    }

    sitemapXml += `
</urlset>`;

    return new Response(sitemapXml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(`Error generating sitemap: ${error.message}`, {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    });
  }
});
