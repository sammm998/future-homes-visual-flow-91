import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false',
  'Vary': 'Origin, Access-Control-Request-Method, Access-Control-Request-Headers',
  'Access-Control-Expose-Headers': 'Content-Length, Content-Type'
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
      .select('id, ref_no, updated_at, status, location, title')
      .eq('status', 'available');

    // Fetch all blog posts
    const { data: blogPosts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, title')
      .eq('published', true);

    // Fetch property categories for additional SEO structure
    const { data: categories } = await supabase
      .from('properties')
      .select('property_type, location')
      .eq('status', 'available');

    const currentDate = new Date().toISOString().split('T')[0];
    const baseUrl = 'https://futurehomesturkey.com';

    // All supported languages
    const languages = [
      { code: 'en', priority: '1.0' },
      { code: 'sv', priority: '0.9' },
      { code: 'tr', priority: '0.9' },
      { code: 'ar', priority: '0.8' },
      { code: 'no', priority: '0.8' },
      { code: 'da', priority: '0.8' },
      { code: 'ru', priority: '0.7' },
      { code: 'fa', priority: '0.7' },
      { code: 'ur', priority: '0.7' }
    ];

    // Static pages - Core pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/properties', priority: '0.9', changefreq: 'daily' },
      { url: '/property-wizard', priority: '0.8', changefreq: 'weekly' },
      { url: '/ai-property-search', priority: '0.8', changefreq: 'weekly' },
      
      // Location pages
      { url: '/antalya', priority: '0.8', changefreq: 'weekly' },
      { url: '/dubai', priority: '0.8', changefreq: 'weekly' },
      { url: '/cyprus', priority: '0.8', changefreq: 'weekly' },
      { url: '/mersin', priority: '0.8', changefreq: 'weekly' },
      
      // Location-specific property pages
      { url: '/antalya/properties', priority: '0.7', changefreq: 'daily' },
      { url: '/dubai/properties', priority: '0.7', changefreq: 'daily' },
      { url: '/cyprus/properties', priority: '0.7', changefreq: 'daily' },
      { url: '/mersin/properties', priority: '0.7', changefreq: 'daily' },
      
      // Information and company pages
      { url: '/about-us', priority: '0.7', changefreq: 'monthly' },
      { url: '/contact-us', priority: '0.7', changefreq: 'monthly' },
      { url: '/testimonials', priority: '0.6', changefreq: 'weekly' },
      { url: '/information', priority: '0.6', changefreq: 'weekly' },
      { url: '/articles', priority: '0.6', changefreq: 'weekly' },
      
      // Additional service pages
      { url: '/investment-opportunities', priority: '0.6', changefreq: 'weekly' },
      { url: '/citizenship-programs', priority: '0.6', changefreq: 'weekly' },
      { url: '/legal-services', priority: '0.5', changefreq: 'monthly' },
      { url: '/property-management', priority: '0.5', changefreq: 'monthly' }
    ];

    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

    // Function to generate hreflang alternates
    const generateAlternates = (url: string) => {
      return languages.map(lang => {
        const langUrl = lang.code === 'en' 
          ? `${baseUrl}${url}`
          : `${baseUrl}${url}${url.includes('?') ? '&' : '?'}lang=${lang.code}`;
        return `    <xhtml:link rel="alternate" hreflang="${lang.code}" href="${langUrl}" />`;
      }).join('\n');
    };

    // Add static pages with all language variants
    staticPages.forEach(page => {
      languages.forEach(lang => {
        const langUrl = lang.code === 'en' 
          ? `${baseUrl}${page.url}`
          : `${baseUrl}${page.url}${page.url.includes('?') ? '&' : '?'}lang=${lang.code}`;
        
        const priority = parseFloat(page.priority) * parseFloat(lang.priority);
        
        sitemapXml += `
  <url>
    <loc>${langUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
${generateAlternates(page.url)}
  </url>`;
      });
    });

    // Add property pages with enhanced metadata and language variants
    if (properties && properties.length > 0) {
      properties.forEach(property => {
        const lastmod = property.updated_at 
          ? new Date(property.updated_at).toISOString().split('T')[0]
          : currentDate;
        
        // Main property page for each language
        languages.forEach(lang => {
          const propertyUrl = `/property/${property.id}`;
          const langUrl = lang.code === 'en' 
            ? `${baseUrl}${propertyUrl}`
            : `${baseUrl}${propertyUrl}?lang=${lang.code}`;
          
          const priority = 0.8 * parseFloat(lang.priority);
          
          sitemapXml += `
  <url>
    <loc>${langUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority.toFixed(1)}</priority>
${generateAlternates(propertyUrl)}
  </url>`;
        });
        
        // Alternative property URL with ref_no if available
        if (property.ref_no) {
          languages.forEach(lang => {
            const refUrl = `/property/${property.ref_no}`;
            const langUrl = lang.code === 'en' 
              ? `${baseUrl}${refUrl}`
              : `${baseUrl}${refUrl}?lang=${lang.code}`;
            
            const priority = 0.7 * parseFloat(lang.priority);
            
            sitemapXml += `
  <url>
    <loc>${langUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority.toFixed(1)}</priority>
${generateAlternates(refUrl)}
  </url>`;
          });
        }
      });
    }

    // Add property category and location-based filtered pages
    if (categories && categories.length > 0) {
      const uniqueTypes = [...new Set(categories.map(c => c.property_type).filter(Boolean))];
      const uniqueLocations = [...new Set(categories.map(c => c.location).filter(Boolean))];
      
      // Add property type filter pages for each language
      uniqueTypes.forEach(type => {
        if (type) {
          const typeSlug = type.toLowerCase().replace(/\s+/g, '-');
          languages.forEach(lang => {
            const filterUrl = `/properties?type=${encodeURIComponent(typeSlug)}`;
            const langUrl = lang.code === 'en' 
              ? `${baseUrl}${filterUrl}`
              : `${baseUrl}${filterUrl}&lang=${lang.code}`;
            
            const priority = 0.6 * parseFloat(lang.priority);
            
            sitemapXml += `
  <url>
    <loc>${langUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority.toFixed(1)}</priority>
${generateAlternates(filterUrl)}
  </url>`;
          });
        }
      });
      
      // Add location-specific property filter pages for each language
      uniqueLocations.forEach(location => {
        if (location) {
          const locationSlug = location.toLowerCase().replace(/\s+/g, '-');
          languages.forEach(lang => {
            const filterUrl = `/properties?location=${encodeURIComponent(locationSlug)}`;
            const langUrl = lang.code === 'en' 
              ? `${baseUrl}${filterUrl}`
              : `${baseUrl}${filterUrl}&lang=${lang.code}`;
            
            const priority = 0.6 * parseFloat(lang.priority);
            
            sitemapXml += `
  <url>
    <loc>${langUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority.toFixed(1)}</priority>
${generateAlternates(filterUrl)}
  </url>`;
          });
        }
      });
    }

    // Add blog articles for each language
    if (blogPosts && blogPosts.length > 0) {
      blogPosts.forEach(post => {
        const lastmod = post.updated_at 
          ? new Date(post.updated_at).toISOString().split('T')[0]
          : currentDate;
        
        languages.forEach(lang => {
          const articleUrl = `/articles/${post.slug}`;
          const langUrl = lang.code === 'en' 
            ? `${baseUrl}${articleUrl}`
            : `${baseUrl}${articleUrl}?lang=${lang.code}`;
          
          const priority = 0.6 * parseFloat(lang.priority);
          
          sitemapXml += `
  <url>
    <loc>${langUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority.toFixed(1)}</priority>
${generateAlternates(articleUrl)}
  </url>`;
        });
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