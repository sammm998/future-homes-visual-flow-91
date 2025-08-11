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
    
    // Fetch all properties
    const { data: properties } = await supabase
      .from('properties')
      .select('id, updated_at, status')
      .eq('status', 'available');

    // Fetch all blog posts
    const { data: blogPosts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('published', true);

    const currentDate = new Date().toISOString().split('T')[0];
    const baseUrl = 'https://futurehomesturkey.com';

    // Static pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/properties', priority: '0.9', changefreq: 'daily' },
      { url: '/property-wizard', priority: '0.8', changefreq: 'weekly' },
      { url: '/ai-property-search', priority: '0.8', changefreq: 'weekly' },
      { url: '/antalya', priority: '0.8', changefreq: 'weekly' },
      { url: '/dubai', priority: '0.8', changefreq: 'weekly' },
      { url: '/cyprus', priority: '0.8', changefreq: 'weekly' },
      { url: '/mersin', priority: '0.8', changefreq: 'weekly' },
      { url: '/france', priority: '0.8', changefreq: 'weekly' },
      { url: '/about-us', priority: '0.7', changefreq: 'monthly' },
      { url: '/contact-us', priority: '0.7', changefreq: 'monthly' },
      { url: '/testimonials', priority: '0.6', changefreq: 'weekly' },
      { url: '/information', priority: '0.6', changefreq: 'weekly' },
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

    // Add property pages
    if (properties && properties.length > 0) {
      properties.forEach(property => {
        const lastmod = property.updated_at 
          ? new Date(property.updated_at).toISOString().split('T')[0]
          : currentDate;
        
        sitemapXml += `
  <url>
    <loc>${baseUrl}/property/${property.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
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