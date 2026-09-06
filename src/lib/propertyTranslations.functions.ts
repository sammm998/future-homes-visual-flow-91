import { createServerFn } from "@tanstack/react-start";

/**
 * Self-healing property translations.
 *
 * When a listing is opened in a language that has no stored translation yet,
 * the page asks the server to produce and store one. The next visitor (and
 * Google) gets the translated text straight from the database.
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

type Translation = { title: string; description: string; location: string };

export const ensurePropertyTranslation = createServerFn({ method: "POST" })
  .inputValidator((input: { propertyId: string; language: string }) => {
    if (!input?.propertyId || !input?.language) throw new Error("Missing input");
    return input;
  })
  .handler(async ({ data }): Promise<Translation | null> => {
    const languageName = TARGET_LANGUAGES[data.language];
    if (!languageName) return null;

    let supabaseAdmin;
    try {
      ({ supabaseAdmin } = await import("@/integrations/supabase/client.server"));
    } catch {
      return null; // no privileged access in this environment
    }

    const { data: existing } = await supabaseAdmin
      .from("property_translations")
      .select("title, description, location")
      .eq("property_id", data.propertyId)
      .eq("language_code", data.language)
      .maybeSingle();
    if (existing?.title && existing?.description) {
      return {
        title: existing.title,
        description: existing.description,
        location: existing.location ?? "",
      };
    }

    const { data: property } = await supabaseAdmin
      .from("properties")
      .select("title, description, location")
      .eq("id", data.propertyId)
      .maybeSingle();
    if (!property?.title) return null;

    const payload = {
      title: property.title ?? "",
      description: property.description ?? "",
      location: property.location ?? "",
    };

    const prompt =
      `Translate this real-estate listing into ${languageName}. ` +
      `Keep the meaning, tone and every detail. Do not shorten. Do not add commentary. ` +
      `Return ONLY strict JSON with keys "title", "description", "location".\n\n` +
      JSON.stringify(payload);

    const parse = (text: string): Translation | null => {
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

    let translated: Translation | null = null;

    const lovableKey = process.env["LOVABLE_API_KEY"];
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
          const json = await res.json();
          translated = parse(json?.choices?.[0]?.message?.content ?? "");
        }
      } catch {
        /* fall through to Gemini */
      }
    }

    const geminiKey = process.env["GEMINI_API_KEY"];
    if (!translated && geminiKey) {
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
          const json = await res.json();
          translated = parse(json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "");
        }
      } catch {
        /* give up */
      }
    }

    if (!translated) return null;

    await supabaseAdmin.from("property_translations").upsert(
      {
        property_id: data.propertyId,
        language_code: data.language,
        title: translated.title,
        description: translated.description,
        location: translated.location,
      },
      { onConflict: "property_id,language_code" },
    );

    return translated;
  });
