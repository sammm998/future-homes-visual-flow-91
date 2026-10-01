import { createFileRoute } from "@tanstack/react-router";
import { askModel, loadCatalog } from "@/lib/aiSearch.server";

const errorResponse = (e: any) => {
  const status = typeof e?.status === "number" ? e.status : 500;
  let message = "The AI search is unavailable right now. Please try again.";
  if (status === 429) message = "Many searches right now — please try again in a moment.";
  if (status === 402) message = "AI search is temporarily paused. Please contact us on WhatsApp.";
  if (status === 422) message = e.message;
  console.error("ai-search failed", status, e?.message);
  return Response.json({ error: message }, { status });
};

export const Route = createFileRoute("/api/ai-search")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let query = "";
        let lang = "en";
        try {
          const body = await request.json();
          query = String(body?.query || "").trim().slice(0, 1500);
          lang = String(body?.lang || "en").slice(0, 5);
        } catch {
          /* ignore */
        }
        if (query.length < 3) return Response.json({ error: "Describe what you are looking for." }, { status: 400 });
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return Response.json({ error: "AI search is not configured." }, { status: 500 });

        try {
          const { items, rows } = await loadCatalog();
          const instructions = `You are a senior real-estate advisor for Future Homes International (Turkey, Dubai, Cyprus, Bali, France).
From the catalog, pick the up to 6 listings that best match the buyer's wishes (budget, location, bedrooms, size, sea/beach, facilities, citizenship, investment, lifestyle). Only use listings from the catalog. Prices are EUR.
Reply ONLY with JSON: {"summary": string, "filters": string[], "matches": [{"ref": string, "score": number 0-100, "headline": string, "reason": string}]}.
- "filters": short chips of the criteria you understood (e.g. "Antalya", "Max €200k", "2+ bedrooms", "Near beach").
- "reason": 1-2 sentences why it fits, mentioning concrete facts. "headline": max 6 words.
- Order by score descending. If nothing fits well, return the closest options and say so in summary.
Write summary, filters, headline and reason in the language with code "${lang}".`;
          const text = await askModel(apiKey, instructions, `Buyer request: ${query}\n\nCatalog:\n${items.map((i) => i.line).join("\n")}`, request.signal);
          const parsed = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
          const byRef = new Map(rows.map((r) => [String(r.ref_no), r]));
          const matches = (Array.isArray(parsed.matches) ? parsed.matches : [])
            .filter((m: any) => byRef.has(String(m.ref)))
            .slice(0, 6)
            .map((m: any) => {
              const r = byRef.get(String(m.ref));
              let imgs = r.property_images;
              if (typeof imgs === "string") imgs = imgs.match(/https?:[^'",\]]+/g) || [];
              return {
                ref: String(m.ref),
                score: Math.max(0, Math.min(100, Math.round(Number(m.score) || 0))),
                headline: String(m.headline || "").slice(0, 80),
                reason: String(m.reason || "").slice(0, 400),
                property: {
                  id: r.id, ref_no: r.ref_no, refNo: r.ref_no, slug: r.slug, title: r.title, location: r.location,
                  district: r.property_district, price: r.price, bedrooms: r.bedrooms, sizes_m2: r.sizes_m2,
                  property_type: r.property_type, image: r.property_image || imgs?.[0] || "",
                },
              };
            });
          return Response.json({
            summary: String(parsed.summary || ""),
            filters: (Array.isArray(parsed.filters) ? parsed.filters : []).slice(0, 8).map(String),
            matches,
          });
        } catch (e: any) {
          if (request.signal.aborted) return new Response(null, { status: 499 });
          return errorResponse(e);
        }
      },
    },
  },
});
