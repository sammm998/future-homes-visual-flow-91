/**
 * Generates AI cover images for English blog posts that don't have one yet,
 * uploads them to the `blog-images` bucket and sets featured_image on the
 * English post and all its translations.
 *
 * Run: bun run scripts/generate-blog-images.ts [--force] [--limit=5]
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env["SUPABASE_URL"]!;
const SERVICE_ROLE = process.env["SUPABASE_SERVICE_ROLE_KEY"]!;
const LOVABLE_API_KEY = process.env["LOVABLE_API_KEY"]!;
const BUCKET = "blog-images";
const AI_PREFIX = "ai-covers/";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false },
});

function stripHtml(html: string, max = 500): string {
  return (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

function buildPrompt(title: string, excerpt: string | null, content: string): string {
  const summary = excerpt || stripHtml(content);
  return (
    `Editorial 16:9 cover image for a luxury international real-estate article. ` +
    `Article title: "${title}". Context: ${summary}. ` +
    `Photorealistic, cinematic lighting, premium architectural / travel photography style, ` +
    `warm sophisticated palette, soft natural light, no text, no watermarks, no logos, ` +
    `no people facing camera. Composition leaves negative space at top for overlay text.`
  );
}

async function generateViaGemini(prompt: string): Promise<Uint8Array> {
  const key = process.env["GEMINI_API_KEY"];
  if (!key) throw new Error("GEMINI_API_KEY missing");
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ["IMAGE"] },
      }),
    },
  );
  if (!resp.ok) throw new Error(`gemini ${resp.status}: ${(await resp.text()).slice(0, 300)}`);
  const data = (await resp.json()) as any;
  const b64 = (data?.candidates?.[0]?.content?.parts || []).find((p: any) => p?.inlineData?.data)
    ?.inlineData?.data as string | undefined;
  if (!b64) throw new Error("gemini returned no image");
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

async function generateImage(prompt: string): Promise<Uint8Array> {
  try {
    const resp = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image",
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
      }),
    });
    if (!resp.ok) throw new Error(`gateway ${resp.status}: ${(await resp.text()).slice(0, 200)}`);
    const json = (await resp.json()) as { data?: { b64_json?: string }[] };
    const b64 = json.data?.[0]?.b64_json;
    if (!b64) throw new Error("no image in gateway response");
    return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  } catch (e) {
    console.warn("gateway failed, falling back to Gemini:", e instanceof Error ? e.message : e);
    return generateViaGemini(prompt);
  }
}


const force = process.argv.includes("--force");
const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const limit = limitArg ? parseInt(limitArg.split("=")[1]!, 10) : 100;

const { data: posts, error } = await supabase
  .from("blog_posts")
  .select("id, title, slug, excerpt, content, featured_image")
  .eq("language_code", "en")
  .is("parent_post_id", null)
  .order("created_at", { ascending: false });
if (error) throw error;

const queue = (posts || [])
  .filter((p) => force || !(p.featured_image || "").includes(AI_PREFIX))
  .slice(0, limit);

console.log(`posts needing covers: ${queue.length}`);

for (const post of queue) {
  try {
    const bytes = await generateImage(buildPrompt(post.title, post.excerpt, post.content));
    const path = `${AI_PREFIX}${post.id}.png`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: "image/png", upsert: true });
    if (upErr) throw upErr;
    const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    await supabase.from("blog_posts").update({ featured_image: publicUrl }).eq("id", post.id);
    await supabase.from("blog_posts").update({ featured_image: publicUrl }).eq("parent_post_id", post.id);
    console.log("ok", post.slug, publicUrl);
  } catch (e) {
    console.warn("FAILED", post.slug, e instanceof Error ? e.message : String(e));
  }
}
console.log("done");
