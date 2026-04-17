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

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
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
    `Translate the user's article into ${opts.targetLangName}. ` +
    `Preserve all HTML tags, structure, brand names, place names (e.g. Antalya, Dubai, Mersin, Cyprus, Bali), ` +
    `and numbers. Translate naturally and idiomatically — do not transliterate place names. ` +
    `Return ONLY a JSON object via the provided tool. No commentary.`;

  const user = JSON.stringify({
    title: opts.title,
    excerpt: opts.excerpt ?? "",
    content: opts.content,
  });

  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "return_translation",
            description: "Return the translated article fields.",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string" },
                excerpt: { type: "string" },
                content: { type: "string" },
              },
              required: ["title", "excerpt", "content"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "return_translation" } },
    }),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`AI gateway ${resp.status}: ${txt}`);
  }
  const data = await resp.json();
  const args =
    data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) throw new Error("No tool call returned by AI");
  const parsed = JSON.parse(args);
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

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
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

    // Fetch existing translations
    const { data: existing } = await supabase
      .from("blog_posts")
      .select("parent_post_id, language_code")
      .not("parent_post_id", "is", null);
    const existingSet = new Set(
      (existing || []).map((r: any) => `${r.parent_post_id}::${r.language_code}`)
    );

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
        const childSlug = `${slugify(t.title)}-${item.lang.code}`.slice(0, 100);
        const { error: insErr } = await supabase.from("blog_posts").insert({
          title: t.title,
          slug: childSlug,
          excerpt: t.excerpt,
          content: t.content,
          featured_image: item.post.featured_image,
          published: true,
          language_code: item.lang.code,
          parent_post_id: item.post.id,
        });
        if (insErr) throw insErr;
        results.push({ postId: item.post.id, lang: item.lang.code, ok: true });
      } catch (e) {
        results.push({
          postId: item.post.id,
          lang: item.lang.code,
          ok: false,
          error: e instanceof Error ? e.message : String(e),
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
