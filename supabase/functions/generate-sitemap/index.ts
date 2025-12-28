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
    
    // Fetch ALL active properties (exclude sold ones for sitemap)
    // Use pagination to get ALL properties (Supabase has 1000 row limit)
    let allProperties: any[] = [];
    let offset = 0;
    const limit = 1000;
    
    while (true) {
      const { data: propertiesBatch, error: propertiesError } = await supabase
        .from('properties')
        .select('id, ref_no, slug, updated_at, status, location, title, property_type, price, property_district')
        .eq('is_active', true)
        .or('status.is.null,status.not.ilike.%sold%')
        .range(offset, offset + limit - 1);
      
      if (propertiesError) {
        console.error('Error fetching properties:', propertiesError);
        break;
      }
      
      if (!propertiesBatch || propertiesBatch.length === 0) break;
      
      allProperties = [...allProperties, ...propertiesBatch];
      if (propertiesBatch.length < limit) break;
      offset += limit;
    }
    
    const properties = allProperties;
    console.log(`Fetched ${properties.length} properties`);

    // Fetch ALL published blog posts with pagination
    let allBlogPosts: any[] = [];
    offset = 0;
    
    while (true) {
      const { data: blogBatch, error: blogError } = await supabase
        .from('blog_posts')
        .select('slug, updated_at, title, language_code, parent_post_id')
        .eq('published', true)
        .range(offset, offset + limit - 1);
      
      if (blogError) {
        console.error('Error fetching blog posts:', blogError);
        break;
      }
      
      if (!blogBatch || blogBatch.length === 0) break;
      
      allBlogPosts = [...allBlogPosts, ...blogBatch];
      if (blogBatch.length < limit) break;
      offset += limit;
    }
    
    const blogPosts = allBlogPosts;

    // Fetch distinct locations for location pages
    const { data: locationData, error: locationError } = await supabase
      .from('properties')
      .select('location, property_district')
      .eq('is_active', true)
      .not('status', 'ilike', '%sold%');

    if (locationError) {
      console.error('Error fetching locations:', locationError);
    }

    // Extract unique main locations (first part before comma)
    const uniqueLocations = new Set<string>();
    const uniqueDistricts = new Set<string>();
    
    if (locationData) {
      locationData.forEach(item => {
        if (item.location) {
          const mainLocation = item.location.split(',')[0].trim().toLowerCase();
          if (mainLocation) {
            uniqueLocations.add(mainLocation);
          }
        }
        if (item.property_district) {
          uniqueDistricts.add(item.property_district.toLowerCase());
        }
      });
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const baseUrl = 'https://futurehomesinternational.com';
    
    // Supported languages for multi-language sitemap
    const languages = ['en', 'sv', 'tr', 'ar'];

    // Static pages - Core pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/property-wizard', priority: '0.9', changefreq: 'weekly' },
      { url: '/ai-property-search', priority: '0.9', changefreq: 'weekly' },
      
      // Company and information pages
      { url: '/about-us', priority: '0.8', changefreq: 'monthly' },
      { url: '/contact-us', priority: '0.8', changefreq: 'monthly' },
      { url: '/testimonials', priority: '0.7', changefreq: 'weekly' },
      { url: '/information', priority: '0.7', changefreq: 'weekly' },
      
      // Media and showcase pages
      { url: '/property-gallery', priority: '0.6', changefreq: 'weekly' },
      { url: '/articles', priority: '0.7', changefreq: 'daily' },
      
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

    // Add dynamic location pages from database
    const locationPages: Array<{ url: string; priority: string; changefreq: string }> = [];
    uniqueLocations.forEach(location => {
      // Only add if we have a matching route
      const validLocations = ['antalya', 'istanbul', 'dubai', 'cyprus', 'mersin', 'bali'];
      if (validLocations.includes(location)) {
        locationPages.push({ url: `/${location}`, priority: '0.9', changefreq: 'daily' });
      }
    });

    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    // Add static pages with language alternates
    const allStaticPages = [...staticPages, ...locationPages];
    allStaticPages.forEach(page => {
      sitemapXml += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>`;
      
      // Add xhtml:link alternates for each language
      languages.forEach(lang => {
        const langUrl = lang === 'en' ? `${baseUrl}${page.url}` : `${baseUrl}${page.url}${page.url.includes('?') ? '&' : '?'}lang=${lang}`;
        sitemapXml += `
    <xhtml:link rel="alternate" hreflang="${lang}" href="${langUrl}" />`;
      });
      sitemapXml += `
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${page.url}" />`;
      
      sitemapXml += `
  </url>`;
    });

    // Add ALL property pages - prioritize ID for unique URLs
    console.log(`Adding ${properties?.length || 0} properties to sitemap`);
    if (properties && properties.length > 0) {
      properties.forEach(property => {
        const lastmod = property.updated_at 
          ? new Date(property.updated_at).toISOString().split('T')[0]
          : currentDate;
        
        // Always use ID for consistent, unique URLs
        const propertyId = property.id;
        
        if (propertyId) {
          sitemapXml += `
  <url>
    <loc>${baseUrl}/property/${propertyId}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>`;
          
          // Add hreflang alternates
          languages.forEach(lang => {
            const langUrl = lang === 'en' 
              ? `${baseUrl}/property/${propertyId}` 
              : `${baseUrl}/property/${propertyId}?lang=${lang}`;
            sitemapXml += `
    <xhtml:link rel="alternate" hreflang="${lang}" href="${langUrl}" />`;
          });
          sitemapXml += `
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/property/${propertyId}" />`;
          
          sitemapXml += `
  </url>`;
        }
      });
    }

    // Add ALL blog articles - only parent posts (English or no language code, and no parent_post_id)
    console.log(`Adding ${blogPosts?.length || 0} blog posts to sitemap`);
    if (blogPosts && blogPosts.length > 0) {
      // Filter to only include parent posts (no parent_post_id means it's a parent)
      const parentPosts = blogPosts.filter(post => 
        !post.parent_post_id && (!post.language_code || post.language_code === 'en')
      );
      
      console.log(`Filtered to ${parentPosts.length} parent blog posts`);
      
      parentPosts.forEach(post => {
        const lastmod = post.updated_at 
          ? new Date(post.updated_at).toISOString().split('T')[0]
          : currentDate;
        
        sitemapXml += `
  <url>
    <loc>${baseUrl}/articles/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>`;
        
        // Add hreflang alternates
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

    console.log(`Generated sitemap with ${allStaticPages.length} static pages, ${properties?.length || 0} properties, ${blogPosts?.length || 0} blog posts`);

    return new Response(sitemapXml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
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
