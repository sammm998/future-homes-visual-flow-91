import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const LANGS: Record<string, string> = {
  sv: "Swedish", tr: "Turkish", ar: "Arabic", ru: "Russian", no: "Norwegian", da: "Danish",
  fa: "Persian (Farsi)", ur: "Urdu", de: "German", fr: "French", es: "Spanish", id: "Indonesian",
};

type Input = { title: string; description: string; location: string; language: string };

/** Admin-only: translate one listing into one language with Lovable AI. The
 * browser saves the result with the admin's own session. */
export const translatePropertyText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: Input) => {
    if (!input?.title || !input?.description || !LANGS[input.language]) throw new Error("Invalid input");
    return input;
  })
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("is_admin");
    if (!isAdmin) throw new Error("Only administrators can translate properties.");
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Translation service is not configured.");

    const prompt =
      `Translate this real-estate listing from English into ${LANGS[data.language]}. ` +
      `Translate every paragraph completely, keep line breaks, never shorten or summarize, no commentary. ` +
      `Return only json with keys "title", "description", "location".\n\n` +
      JSON.stringify({ title: data.title, description: data.description, location: data.location });

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`Translation failed [${res.status}]: ${body}`);
      if (res.status === 402) throw new Error("AI credits are used up. Add credits and try again.");
      if (res.status === 429) throw new Error("Too many requests right now. Wait a minute and retry.");
      throw new Error(`Translation service error (${res.status}).`);
    }
    const json = await res.json();
    const text: string = json?.choices?.[0]?.message?.content ?? "";
    const obj = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
    if (!obj?.title || !obj?.description) throw new Error("Translation came back empty.");
    return {
      title: String(obj.title),
      description: String(obj.description),
      location: String(obj.location || data.location || ""),
    };
  });
