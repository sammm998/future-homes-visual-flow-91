// Public share endpoint that returns real HTML with Open Graph tags for
// link-preview bots (WhatsApp, Facebook, LinkedIn, iMessage, Slack, X)
// and redirects real browsers to the normal React property page.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SITE = "https://futurehomesinternational.com";

const LANG_FIELDS: Record<string, { title: string; desc: string; slug: string }> = {
  en: { title: "title", desc: "description", slug: "slug" },
  sv: { title: "title_sv", desc: "description_sv", slug: "slug_sv" },
  tr: { title: "title_tr", desc: "description_tr", slug: "slug_tr" },
  ar: { title: "title_ar", desc: "description_ar", slug: "slug_ar" },
  ru: { title: "title_ru", desc: "description_ru", slug: "slug_ru" },
  no: { title: "title_no", desc: "description_no", slug: "slug_no" },
  da: { title: "title_da", desc: "description_da", slug: "slug_da" },
  fa: { title: "title_fa", desc: "description_fa", slug: "slug_fa" },
  ur: { title: "title_ur", desc: "description_ur", slug: "slug_ur" },
  es: { title: "title_es", desc: "description_es", slug: "slug_es" },
  de: { title: "title_de", desc: "description_de", slug: "slug_de" },
  fr: { title: "title_fr", desc: "description_fr", slug: "slug_fr" },
  id: { title: "title_id", desc: "description_id", slug: "slug_id" },
};

const PATH_FOR_LANG: Record<string, string> = {
  en: "property", sv: "fastighet", tr: "mulk", ar: "aqar", ru: "nedvizhimost",
  no: "eiendom", da: "ejendom", fa: "melk", ur: "jaidad", es: "propiedad",
  de: "immobilie", fr: "propriete", id: "properti",
};

const escapeHtml = (s: string) =>
  (s || "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const truncate = (s: string, n: number) => {
  const t = (s || "").trim().replace(/\s+/g, " ");
  return t.length <= n ? t : t.slice(0, n - 1).replace(/[\s.,;:-]+$/, "") + "…";
};

const isBot = (ua: string) =>
  /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Slackbot|WhatsApp|TelegramBot|Discordbot|SkypeUriPreview|Pinterest|redditbot|Applebot|Googlebot|bingbot|DuckDuckBot|YandexBot|Baiduspider|ia_archiver|Embedly|vkShare|W3C_Validator|quora|MetaInspector|SocialFlow|SEMrushBot|AhrefsBot|Iframely/i
    .test(ua);

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const ref = url.searchParams.get("ref");
    const lang = (url.searchParams.get("lang") || "en").toLowerCase();
    const langMeta = LANG_FIELDS[lang] || LANG_FIELDS.en;

    if (!ref) {
      return new Response("Missing ?ref=", { status: 400, headers: { "content-type": "text/plain" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: property } = await supabase
      .from("properties")
      .select("*")
      .eq("ref_no", ref)
      .eq("is_active", true)
      .maybeSingle();

    if (!property) {
      return new Response("Property not found", { status: 404, headers: { "content-type": "text/plain" } });
    }

    const title =
      (property as any)[langMeta.title] || property.title || `Property ${ref}`;
    const description =
      (property as any)[langMeta.desc] || property.description ||
      `${property.title || ""}${property.location ? " – " + property.location : ""}`;
    const slug =
      (property as any)[langMeta.slug] || property.slug || property.ref_no;

    const pathSeg = PATH_FOR_LANG[lang] || "property";
    const langQuery = lang && lang !== "en" ? `?lang=${lang}&ref=${property.ref_no}` : "";
    const destination = `${SITE}/${pathSeg}/${encodeURIComponent(slug)}${langQuery}`;

    const image =
      (Array.isArray(property.property_image) && property.property_image[0]) ||
      property.image ||
      `${SITE}/favicon.png`;

    const brandedTitle = truncate(
      property.location ? `${title} – ${property.location}` : title,
      64
    ) + " | Future Homes";
    const shortDesc = truncate(description, 200);

    const ua = req.headers.get("user-agent") || "";
    const wantsHtml = req.headers.get("accept")?.includes("text/html");

    // Real humans: redirect to the actual React property page.
    if (!isBot(ua) && wantsHtml) {
      return new Response(null, {
        status: 302,
        headers: { location: destination, "cache-control": "no-store" },
      });
    }

    const html = `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(brandedTitle)}</title>
  <meta name="description" content="${escapeHtml(shortDesc)}" />
  <link rel="canonical" href="${destination}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Future Homes International" />
  <meta property="og:url" content="${destination}" />
  <meta property="og:title" content="${escapeHtml(brandedTitle)}" />
  <meta property="og:description" content="${escapeHtml(shortDesc)}" />
  <meta property="og:image" content="${escapeHtml(image)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(brandedTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(shortDesc)}" />
  <meta name="twitter:image" content="${escapeHtml(image)}" />
  <meta http-equiv="refresh" content="0; url=${destination}" />
  <script>window.location.replace(${JSON.stringify(destination)});</script>
</head>
<body>
  <p><a href="${destination}">${escapeHtml(brandedTitle)}</a></p>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=300",
        "access-control-allow-origin": "*",
      },
    });
  } catch (e) {
    return new Response(`Error: ${(e as Error).message}`, {
      status: 500,
      headers: { "content-type": "text/plain" },
    });
  }
});
