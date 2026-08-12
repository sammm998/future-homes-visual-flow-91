import { createFileRoute } from "@tanstack/react-router";

// Temporary maintenance endpoint: translates specific listings that were left
// English-only. Guarded by a shared secret header.
export const Route = createFileRoute("/api/public/backfill-translations")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["LOVABLE_API_KEY"];
        if (!secret || request.headers.get("x-backfill-key") !== secret) {
          return new Response("Unauthorized", { status: 401 });
        }

        const body = (await request.json()) as {
          refs: string[];
          languages: string[];
        };

        const LANG_NAMES: Record<string, string> = {
          sv: "Swedish", tr: "Turkish", ar: "Arabic", ru: "Russian",
          no: "Norwegian", da: "Danish", fa: "Persian (Farsi)", ur: "Urdu",
          de: "German", fr: "French", es: "Spanish", id: "Indonesian",
        };

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: properties, error } = await supabaseAdmin
          .from("properties")
          .select("id, ref_no, title, description, location")
          .in("ref_no", body.refs);

        if (error) return Response.json({ error: error.message }, { status: 500 });

        const saved: string[] = [];
        const failed: string[] = [];

        for (const property of properties ?? []) {
          for (const lang of body.languages) {
            const name = LANG_NAMES[lang];
            if (!name) continue;

            const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${secret}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "google/gemini-2.5-flash",
                messages: [
                  {
                    role: "system",
                    content: `You are a professional real estate translator. Translate from English to ${name}. Translate the COMPLETE text: never summarize, shorten or omit any sentence, and keep all paragraphs and line breaks. Return ONLY a JSON object with keys title, description, location.`,
                  },
                  {
                    role: "user",
                    content: `Title: ${property.title}\n\nLocation: ${property.location ?? ""}\n\nDescription:\n${property.description ?? ""}`,
                  },
                ],
              }),
            });

            if (!res.ok) {
              failed.push(`${property.ref_no}/${lang}: ai ${res.status}`);
              continue;
            }

            const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
            const raw = json.choices?.[0]?.message?.content ?? "";
            const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

            let parsed: { title?: string; description?: string; location?: string };
            try {
              parsed = JSON.parse(cleaned);
            } catch {
              failed.push(`${property.ref_no}/${lang}: parse`);
              continue;
            }

            if (!parsed.title || !parsed.description) {
              failed.push(`${property.ref_no}/${lang}: empty`);
              continue;
            }

            const { error: upsertError } = await supabaseAdmin
              .from("property_translations")
              .upsert(
                {
                  property_id: property.id,
                  language_code: lang,
                  title: parsed.title,
                  description: parsed.description,
                  location: parsed.location ?? property.location ?? "",
                },
                { onConflict: "property_id,language_code" },
              );

            if (upsertError) failed.push(`${property.ref_no}/${lang}: ${upsertError.message}`);
            else saved.push(`${property.ref_no}/${lang}`);
          }
        }

        return Response.json({ saved, failed });
      },
    },
  },
});
