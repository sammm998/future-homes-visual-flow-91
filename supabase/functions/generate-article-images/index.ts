// Generates AI cover images for English blog posts using Google's
// Gemini 2.5 Flash Image (Nano Banana), uploads them to the blog-images
// Supabase storage bucket, and updates featured_image on each English post
// and all its translations. Idempotent: skips posts that already have an
// AI-generated cover (featured_image path starts with `ai-covers/`).
//
// Call repeatedly with ?batch=5 until `remaining` is 0.
// Pass ?force=1 to regenerate even if an AI cover already exists.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const BUCKET = "blog-images";
const AI_PREFIX = "ai-covers/";

function stripHtml(html: string, max = 600): string {
  return (html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function buildPrompt(title: string, excerpt: string | null, content: string): string {
  const summary = excerpt || stripHtml(content, 500);
  return (
    `Editorial 16:9 cover image for a luxury international real-estate article. ` +
    `Article title: "${title}". Context: ${summary}. ` +
    `Photorealistic, cinematic lighting, premium architectural photography style, ` +
    `warm sophisticated palette, soft natural light, no text, no watermarks, no logos, ` +
    `no people facing camera. Composition leaves negative space at top for overlay text.`
  );
}

async function generateImage(prompt: string): Promise<Uint8Array> {
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ["IMAGE"] },
      }),
    }
  );
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Gemini image ${resp.status}: ${txt}`);
  }
  const data = await resp.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const imgPart = parts.find((p: any) => p?.inlineData?.data);
  if (!imgPart) throw new Error(`No image returned: ${JSON.stringify(data).slice(0, 300)}`);
  const b64 = imgPart.inlineData.data as string;
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY missing");
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const url = new URL(req.url);
    const batch = parseInt(url.searchParams.get("batch") || "5", 10);
    const force = url.searchParams.get("force") === "1";

    const { data: posts, error: pErr } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, content, featured_image")
      .eq("language_code", "en")
      .is("parent_post_id", null)
      .order("created_at", { ascending: false });
    if (pErr) throw pErr;

    const queue = (posts || []).filter((p: any) => {
      if (force) return true;
      const fi: string = p.featured_image || "";
      return !fi.includes(AI_PREFIX);
    });
    const totalRemaining = queue.length;
    const work = queue.slice(0, batch);

    const results: any[] = [];
    for (const post of work) {
      try {
        const prompt = buildPrompt(post.title, post.excerpt, post.content);
        const bytes = await generateImage(prompt);
        const path = `${AI_PREFIX}${post.id}.png`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, bytes, { contentType: "image/png", upsert: true });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
        const publicUrl = pub.publicUrl;

        // Update parent + all translations
        const { error: u1 } = await supabase
          .from("blog_posts")
          .update({ featured_image: publicUrl })
          .eq("id", post.id);
        if (u1) throw u1;
        await supabase
          .from("blog_posts")
          .update({ featured_image: publicUrl })
          .eq("parent_post_id", post.id);

        results.push({ postId: post.id, ok: true, url: publicUrl });
      } catch (e: any) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`Image gen failed [${post.id}]:`, msg);
        results.push({ postId: post.id, ok: false, error: msg });
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
    console.error("generate-article-images error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
