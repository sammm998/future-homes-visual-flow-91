import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type PropertyRow = {
  id: string;
  ref_no: string | null;
  updated_at: string | null;
  is_active: boolean;
  status: string | null;
};

type BlogRow = {
  slug: string;
  updated_at: string | null;
  published: boolean;
  language_code: string | null;
};

const isoDate = (value: string | null | undefined) => {
  if (!value) return new Date().toISOString().slice(0, 10);
  try {
    return new Date(value).toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
};

const xmlEscape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const baseUrl = "https://futurehomesinternational.com";
    const currentDate = new Date().toISOString().slice(0, 10);

    // Public routes (from App.tsx + SEO pages)
    const staticUrls: Array<{ path: string; changefreq: string; priority: string }> = [
      { path: "/", changefreq: "daily", priority: "1.0" },
      { path: "/property-wizard", changefreq: "weekly", priority: "0.9" },
      { path: "/ai-property-search", changefreq: "weekly", priority: "0.9" },
      { path: "/map-search", changefreq: "weekly", priority: "0.8" },

      { path: "/antalya", changefreq: "daily", priority: "0.9" },
      { path: "/istanbul", changefreq: "daily", priority: "0.9" },
      { path: "/dubai", changefreq: "daily", priority: "0.9" },
      { path: "/cyprus", changefreq: "daily", priority: "0.9" },
      { path: "/mersin", changefreq: "daily", priority: "0.8" },
      { path: "/bali", changefreq: "daily", priority: "0.8" },

      { path: "/about-us", changefreq: "monthly", priority: "0.8" },
      { path: "/contact-us", changefreq: "monthly", priority: "0.8" },
      { path: "/testimonials", changefreq: "weekly", priority: "0.7" },
      { path: "/information", changefreq: "weekly", priority: "0.7" },
      { path: "/property-gallery", changefreq: "weekly", priority: "0.6" },
      { path: "/ali-karan", changefreq: "monthly", priority: "0.6" },

      { path: "/property-for-sale-in-turkey", changefreq: "weekly", priority: "0.8" },
      { path: "/apartments-for-sale-in-turkey", changefreq: "weekly", priority: "0.8" },
      { path: "/luxury-villas-in-turkey", changefreq: "weekly", priority: "0.8" },
      { path: "/off-plan-property-turkey", changefreq: "weekly", priority: "0.7" },
      { path: "/turkish-citizenship-by-investment", changefreq: "weekly", priority: "0.8" },

      { path: "/articles/expenses-buying-property-turkey", changefreq: "monthly", priority: "0.7" },
    ];

    const { data: properties, error: propErr } = await supabase
      .from("properties")
      .select("id, ref_no, updated_at, is_active, status")
      .eq("is_active", true)
      .or("status.is.null,status.not.ilike.%sold%")
      .returns<PropertyRow[]>();

    if (propErr) console.error("Error fetching properties:", propErr);

    const { data: posts, error: postErr } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, published, language_code")
      .eq("published", true)
      .or("language_code.is.null,language_code.eq.en")
      .returns<BlogRow[]>();

    if (postErr) console.error("Error fetching blog posts:", postErr);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    for (const page of staticUrls) {
      xml += `\n  <url><loc>${xmlEscape(baseUrl + page.path)}</loc><lastmod>${currentDate}</lastmod><changefreq>${page.changefreq}</changefreq><priority>${page.priority}</priority></url>`;
    }

    const propertyRows = properties ?? [];
    console.log(`Sitemap: adding ${propertyRows.length} properties`);
    for (const p of propertyRows) {
      const identifier = p.ref_no?.trim() ? p.ref_no.trim() : p.id;
      xml += `\n  <url><loc>${xmlEscape(`${baseUrl}/property/${identifier}`)}</loc><lastmod>${isoDate(p.updated_at)}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
    }

    const postRows = posts ?? [];
    console.log(`Sitemap: adding ${postRows.length} articles`);
    for (const post of postRows) {
      xml += `\n  <url><loc>${xmlEscape(`${baseUrl}/articles/${post.slug}`)}</loc><lastmod>${isoDate(post.updated_at)}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`;
    }

    xml += `\n</urlset>\n`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response(`Error generating sitemap: ${error.message}`, {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
    });
  }
});
