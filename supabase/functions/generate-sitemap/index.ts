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
      { url: '/france', priority: '0.8', changefreq: 'weekly' },
      
      // Location-specific property pages
      { url: '/antalya/properties', priority: '0.7', changefreq: 'daily' },
      { url: '/dubai/properties', priority: '0.7', changefreq: 'daily' },
      { url: '/cyprus/properties', priority: '0.7', changefreq: 'daily' },
      { url: '/mersin/properties', priority: '0.7', changefreq: 'daily' },
      { url: '/france/properties', priority: '0.7', changefreq: 'daily' },
      
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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add static pages
    staticPages.forEach(page => {
      sitemapXml += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // Add property pages with enhanced metadata
    if (properties && properties.length > 0) {
      properties.forEach(property => {
        const lastmod = property.updated_at 
          ? new Date(property.updated_at).toISOString().split('T')[0]
          : currentDate;
        
        // Main property page
        sitemapXml += `
  <url>
    <loc>${baseUrl}/property/${property.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
        
        // Alternative property URL with ref_no if available
        if (property.ref_no) {
          sitemapXml += `
  <url>
    <loc>${baseUrl}/property/${property.ref_no}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
        }
      });
    }

    // Add property category and location-based filtered pages
    if (categories && categories.length > 0) {
      const uniqueTypes = [...new Set(categories.map(c => c.property_type).filter(Boolean))];
      const uniqueLocations = [...new Set(categories.map(c => c.location).filter(Boolean))];
      
      // Add property type filter pages
      uniqueTypes.forEach(type => {
        if (type) {
          const typeSlug = type.toLowerCase().replace(/\s+/g, '-');
          sitemapXml += `
  <url>
    <loc>${baseUrl}/properties?type=${encodeURIComponent(typeSlug)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
        }
      });
      
      // Add location-specific property filter pages
      uniqueLocations.forEach(location => {
        if (location) {
          const locationSlug = location.toLowerCase().replace(/\s+/g, '-');
          sitemapXml += `
  <url>
    <loc>${baseUrl}/properties?location=${encodeURIComponent(locationSlug)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
        }
      });
    }

    // Add blog articles
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
    <priority>0.6</priority>
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