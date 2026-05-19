// Translates English blog posts into 12 target languages and stores them as
// child rows in blog_posts (parent_post_id + language_code). Idempotent: skips
// translations that already exist. Designed to be called repeatedly until done.
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TARGET_LANGS: { code: string; name: string }[] = [
  { code: "sv", name: "Swedish" },
  { code: "tr", name: "Turkish" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" },
  { code: "fa", name: "Persian (Farsi)" },
  { code: "ur", name: "Urdu" },
  { code: "no", name: "Norwegian" },
  { code: "da", name: "Danish" },
  { code: "de", name: "German" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "id", name: "Indonesian" },
];

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function translateOne(opts: {
  title: string;
  excerpt: string | null;
  content: string;
  targetLangName: string;
}): Promise<{ title: string; excerpt: string; content: string }> {
  const sys =
    `You are a professional translator for a luxury international real-estate company. ` +
    `Translate the article into ${opts.targetLangName}. ` +
    `Preserve all HTML tags, structure, brand names, place names (Antalya, Dubai, Mersin, Cyprus, Bali), and numbers. ` +
    `Translate naturally and idiomatically. Return ONLY valid JSON matching the schema, no markdown fences, no commentary.`;

  const user = JSON.stringify({
    title: opts.title,
    excerpt: opts.excerpt ?? "",
    content: opts.content,
  });

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: sys }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING" },
              excerpt: { type: "STRING" },
              content: { type: "STRING" },
            },
            required: ["title", "excerpt", "content"],
          },
          temperature: 0.3,
        },
      }),
    }
  );

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Gemini ${resp.status}: ${txt}`);
  }
  const data = await resp.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty Gemini response");
  const parsed = JSON.parse(text);
  return {
    title: String(parsed.title || opts.title),
    excerpt: String(parsed.excerpt || opts.excerpt || ""),
    content: String(parsed.content || opts.content),
  };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function buildChildSlug(opts: {
  translatedTitle: string;
  sourceSlug: string | null;
  postId: string;
  langCode: string;
}): string {
  const base =
    slugify(opts.sourceSlug || "") ||
    slugify(opts.translatedTitle) ||
    opts.postId.slice(0, 8);
  const suffix = opts.postId.slice(0, 6);
  return `${base}-${opts.langCode}-${suffix}`.slice(0, 110);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY missing");
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const url = new URL(req.url);
    const batch = parseInt(url.searchParams.get("batch") || "5", 10);
    const langFilter = url.searchParams.get("lang");

    // Fetch English source posts
    const { data: sourcePosts, error: srcErr } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, content, featured_image, language_code, parent_post_id")
      .eq("language_code", "en")
      .is("parent_post_id", null);
    if (srcErr) throw srcErr;
    if (!sourcePosts) throw new Error("No source posts");

    // Fetch existing translations (paginated to avoid 1000-row limit)
    const existingSet = new Set<string>();
    let from = 0;
    const pageSize = 1000;
    while (true) {
      const { data: page, error: exErr } = await supabase
        .from("blog_posts")
        .select("parent_post_id, language_code")
        .not("parent_post_id", "is", null)
        .range(from, from + pageSize - 1);
      if (exErr) throw exErr;
      if (!page || page.length === 0) break;
      for (const r of page as any[]) {
        existingSet.add(`${r.parent_post_id}::${r.language_code}`);
      }
      if (page.length < pageSize) break;
      from += pageSize;
    }


    const targets = langFilter
      ? TARGET_LANGS.filter((l) => l.code === langFilter)
      : TARGET_LANGS;

    // Build work queue: (post, lang) pairs that don't exist yet
    const queue: { post: any; lang: { code: string; name: string } }[] = [];
    for (const post of sourcePosts) {
      for (const lang of targets) {
        if (!existingSet.has(`${post.id}::${lang.code}`)) {
          queue.push({ post, lang });
        }
      }
    }

    const totalRemaining = queue.length;
    const work = queue.slice(0, batch);

    const results: any[] = [];
    for (const item of work) {
      try {
        const t = await translateOne({
          title: item.post.title,
          excerpt: item.post.excerpt,
          content: item.post.content,
          targetLangName: item.lang.name,
        });
        const childSlug = buildChildSlug({
          translatedTitle: t.title,
          sourceSlug: item.post.slug,
          postId: item.post.id,
          langCode: item.lang.code,
        });
        const { error: insErr } = await supabase.from("blog_posts").upsert({
          title: t.title,
          slug: childSlug,
          excerpt: t.excerpt,
          content: t.content,
          featured_image: item.post.featured_image,
          published: true,
          language_code: item.lang.code,
          parent_post_id: item.post.id,
        }, {
          onConflict: "slug",
        });
        if (insErr) throw insErr;
        results.push({ postId: item.post.id, lang: item.lang.code, ok: true });
      } catch (e: any) {
        const msg = e instanceof Error
          ? e.message
          : (typeof e === "object" ? JSON.stringify(e) : String(e));
        console.error(`Translation failed [${item.lang.code} / ${item.post.id}]:`, msg);
        results.push({
          postId: item.post.id,
          lang: item.lang.code,
          ok: false,
          error: msg,
        });
      }
    }

    return new Response(
      JSON.stringify({
        processed: work.length,
        succeeded: results.filter((r) => r.ok).length,
        failed: results.filter((r) => !r.ok).length,
        remaining: totalRemaining - work.length,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("translate-blog-posts error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
