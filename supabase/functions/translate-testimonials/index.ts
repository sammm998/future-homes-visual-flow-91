import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TARGET_LANGUAGES: Record<string, string> = {
  sv: "Swedish",
  tr: "Turkish",
  ar: "Arabic",
  ru: "Russian",
  fa: "Persian (Farsi)",
  ur: "Urdu",
  da: "Danish",
  no: "Norwegian",
  de: "German",
  fr: "French",
  es: "Spanish",
  nl: "Dutch",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function translateText(text: string, languageName: string): Promise<string> {
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content:
            "You are a professional translator. Translate the user's customer review into the target language. Preserve names, brands, and place names. Keep the tone natural. Return ONLY the translated text, no quotes, no explanations.",
        },
        { role: "user", content: `Translate to ${languageName}:\n\n${text}` },
      ],
    }),
  });
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`AI ${resp.status}: ${t}`);
  }
  const data = await resp.json();
  return (data.choices?.[0]?.message?.content || "").trim();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const batchSize: number = body.batchSize ?? 10;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch all testimonials and existing translations
    const { data: testimonials, error: tErr } = await supabase
      .from("testimonials")
      .select("id, review_text, designation");
    if (tErr) throw tErr;

    const { data: existing, error: eErr } = await supabase
      .from("testimonial_translations")
      .select("testimonial_id, language_code");
    if (eErr) throw eErr;

    const existingSet = new Set(
      (existing || []).map((r: any) => `${r.testimonial_id}:${r.language_code}`)
    );

    // Build pending list
    const pending: Array<{ testimonial: any; lang: string; languageName: string }> = [];
    for (const t of testimonials || []) {
      for (const [lang, languageName] of Object.entries(TARGET_LANGUAGES)) {
        if (!existingSet.has(`${t.id}:${lang}`)) {
          pending.push({ testimonial: t, lang, languageName });
        }
      }
    }

    const totalRemaining = pending.length;
    const toProcess = pending.slice(0, batchSize);

    let succeeded = 0;
    let failed = 0;
    const errors: any[] = [];

    for (const item of toProcess) {
      try {
        const translatedReview = await translateText(item.testimonial.review_text, item.languageName);
        let translatedDesignation: string | null = null;
        if (item.testimonial.designation && item.testimonial.designation.trim()) {
          translatedDesignation = await translateText(item.testimonial.designation, item.languageName);
        }
        const { error: insErr } = await supabase.from("testimonial_translations").insert({
          testimonial_id: item.testimonial.id,
          language_code: item.lang,
          review_text: translatedReview,
          designation: translatedDesignation,
        });
        if (insErr) throw insErr;
        succeeded++;
      } catch (err: any) {
        failed++;
        errors.push({ id: item.testimonial.id, lang: item.lang, error: String(err?.message || err) });
      }
    }

    return new Response(
      JSON.stringify({
        succeeded,
        failed,
        processed: toProcess.length,
        remaining: totalRemaining - succeeded,
        totalPending: totalRemaining,
        errors: errors.slice(0, 5),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: String(err?.message || err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
