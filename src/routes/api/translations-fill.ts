import { createFileRoute } from "@tanstack/react-router";

/**
 * Internal maintenance endpoint (NOT under /api/public, so published-site auth applies):
 * fills in missing property translations, a batch at a time.
 * POST body: { limit?: number, languages?: string[] }
 */

const TARGET_LANGUAGES: Record<string, string> = {
  sv: "Swedish",
  tr: "Turkish",
  ar: "Arabic",
  ru: "Russian",
  no: "Norwegian",
  da: "Danish",
  fa: "Persian (Farsi)",
  ur: "Urdu",
  de: "German",
  fr: "French",
  es: "Spanish",
  id: "Indonesian",
};

async function translateWithAI(
  payload: { title: string; description: string; location: string },
  languageName: string,
): Promise<{ title: string; description: string; location: string } | null> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const geminiKey = process.env["GEMINI_API_KEY"];

  const prompt =
    `Translate this real-estate listing into ${languageName}. ` +
    `Keep the meaning, tone and every detail. Do not shorten. Do not add commentary. ` +
    `Return ONLY strict JSON with keys "title", "description", "location".\n\n` +
    JSON.stringify(payload);

  const parse = (text: string) => {
    const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    try {
      const obj = JSON.parse(cleaned.slice(start, end + 1));
      if (!obj?.title || !obj?.description) return null;
      return {
        title: String(obj.title),
        description: String(obj.description),
        location: String(obj.location ?? payload.location),
      };
    } catch {
      return null;
    }
  };

  if (lovableKey) {
    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const out = parse(data?.choices?.[0]?.message?.content ?? "");
        if (out) return out;
      } else {
        console.error("Lovable AI error", res.status, await res.text());
      }
    } catch (e) {
      console.error("Lovable AI threw", e);
    }
  }

  if (geminiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        },
      );
      if (res.ok) {
        const data = await res.json();
        const out = parse(data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "");
        if (out) return out;
      } else {
        console.error("Gemini error", res.status, await res.text());
      }
    } catch (e) {
      console.error("Gemini threw", e);
    }
  }

  return null;
}

export const Route = createFileRoute("/api/translations-fill")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let limit = 8;
        let languages = Object.keys(TARGET_LANGUAGES);
        try {
          const body = (await request.json()) as { limit?: number; languages?: string[] };
          if (typeof body?.limit === "number") limit = Math.min(Math.max(body.limit, 1), 40);
          if (Array.isArray(body?.languages) && body.languages.length) {
            languages = body.languages.filter((l) => l in TARGET_LANGUAGES);
          }
        } catch {
          /* defaults */
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: properties, error: propError } = await supabaseAdmin
          .from("properties")
          .select("id, title, description, location")
          .eq("is_active", true);
        if (propError) {
          return Response.json({ error: propError.message }, { status: 500 });
        }

        const { data: existing } = await supabaseAdmin
          .from("property_translations")
          .select("property_id, language_code");

        const have = new Map<string, Set<string>>();
        for (const row of existing ?? []) {
          const set = have.get(row.property_id) ?? new Set<string>();
          set.add(row.language_code);
          have.set(row.property_id, set);
        }

        const jobs: Array<{ property: NonNullable<typeof properties>[number]; lang: string }> = [];
        for (const property of properties ?? []) {
          const done = have.get(property.id) ?? new Set<string>();
          for (const lang of languages) {
            if (!done.has(lang)) jobs.push({ property, lang });
          }
        }

        const totalMissing = jobs.length;
        const batch = jobs.slice(0, limit);

        const results = await Promise.all(
          batch.map(async ({ property, lang }) => {
            const translated = await translateWithAI(
              {
                title: property.title ?? "",
                description: property.description ?? "",
                location: property.location ?? "",
              },
              TARGET_LANGUAGES[lang]!,
            );
            if (!translated) return { ok: false, id: property.id, lang };

            const { error } = await supabaseAdmin.from("property_translations").upsert(
              {
                property_id: property.id,
                language_code: lang,
                title: translated.title,
                description: translated.description,
                location: translated.location,
              },
              { onConflict: "property_id,language_code" },
            );
            if (error) return { ok: false, id: property.id, lang, error: error.message };
            return { ok: true, id: property.id, lang };
          }),
        );

        const saved = results.filter((r) => r.ok).length;
        return Response.json({
          total_missing: totalMissing,
          attempted: batch.length,
          saved,
          failures: results.filter((r) => !r.ok).slice(0, 5),
          remaining: totalMissing - saved,
        });
      },
    },
  },
});
