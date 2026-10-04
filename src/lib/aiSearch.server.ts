// Server-only helpers for the AI property search.
const SUPABASE_URL = "https://kiogiyemoqbnuvclneoe.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpb2dpeWVtb3FibnV2Y2xuZW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDg4NzIsImV4cCI6MjA2ODI4NDg3Mn0.wZFKwwrvtrps2gCFc15rHN-3eg5T_kEDioBGZV_IctI"; // public publishable key (same as browser client)
const GATEWAY = "https://ai.gateway.lovable.dev";

export type CatalogItem = { id: string; ref: string; line: string };

export async function loadCatalog(): Promise<{ items: CatalogItem[]; rows: any[] }> {
  const cols = "id,ref_no,title,location,property_district,property_type,bedrooms,bathrooms,sizes_m2,price,status,distance_to_beach_km,distance_to_airport_km,property_facilities,citizenship_eligible,property_image,property_images,slug";
  const res = await fetch(`${SUPABASE_URL}/rest/v1/properties?select=${cols}&is_active=eq.true&language_code=eq.en&limit=600`, {
    headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
  });
  if (!res.ok) throw new Error(`Could not load properties (${res.status})`);
  const rows = ((await res.json()) as any[]).filter((r) => String(r.status || "").toLowerCase() !== "sold");
  const items = rows.map((r) => {
    let fac = r.property_facilities;
    if (typeof fac === "string") fac = fac.replace(/[\[\]']/g, "");
    if (Array.isArray(fac)) fac = fac.join(", ");
    fac = String(fac || "").slice(0, 160);
    return {
      id: r.id,
      ref: String(r.ref_no),
      line: [`REF ${r.ref_no}`, r.title, [r.property_district, r.location].filter(Boolean).join(", "), r.property_type, `beds ${r.bedrooms ?? "?"}`, `${r.sizes_m2 ?? "?"} m2`, r.price, r.status, r.distance_to_beach_km && `beach ${r.distance_to_beach_km}`, r.citizenship_eligible ? "citizenship eligible" : "", fac].filter(Boolean).join(" | "),
    };
  });
  return { items, rows };
}

/** Streams a Responses call and returns the final text. */
export async function askModel(apiKey: string, instructions: string, input: string, signal?: AbortSignal): Promise<string> {
  const res = await fetch(`${GATEWAY}/v1/responses`, {
    method: "POST",
    signal,
    headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "fetch" },
    body: JSON.stringify({
      model: "openai/gpt-6-astra",
      instructions,
      input,
      stream: true,
      store: false,
      reasoning: { effort: "low", summary: "auto" },
      include: ["reasoning.encrypted_content"],
      text: { format: { type: "json_object" } },
    }),
  });
  if (!res.ok || !res.body) {
    const body = await res.text().catch(() => "");
    const err: any = new Error(body || `AI request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  let text = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf("\n\n")) >= 0) {
      const frame = buf.slice(0, i);
      buf = buf.slice(i + 2);
      for (const line of frame.split("\n")) {
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (!data || data === "[DONE]") continue;
        try {
          const ev = JSON.parse(data);
          if (ev.type === "response.output_text.delta") text += ev.delta;
          else if (ev.type === "response.refusal.delta" || ev.type === "error" || ev.type === "response.failed") {
            const e: any = new Error(ev.error?.message || "The AI could not complete this search.");
            e.status = 422;
            throw e;
          }
        } catch (e: any) {
          if (e?.status) throw e;
        }
      }
    }
  }
  return text;
}

export async function transcribeAudio(apiKey: string, file: File): Promise<string> {
  const form = new FormData();
  form.append("model", "google/gemini-3.5-transcribe");
  form.append("file", file, file.name || "voice.webm");
  form.append("response_format", "json");
  const res = await fetch(`${GATEWAY}/v1/audio/transcriptions`, { method: "POST", headers: { Authorization: `Bearer ${apiKey}` }, body: form });
  const body = await res.text();
  if (!res.ok) {
    const err: any = new Error(body || `Transcription failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  try { return JSON.parse(body).text || ""; } catch { return body; }
}

export type Criteria = {
  locations: string[]; types: string[]; minPrice: number | null; maxPrice: number | null;
  minBeds: number | null; maxBeds: number | null; minSize: number | null; maxSize: number | null;
  readyToMove: boolean | null; citizenship: boolean | null;
};

const nums = (v: unknown): number[] =>
  String(v ?? "").replace(/studio/gi, "0").split("<>").map((p) => Number(p.replace(/[^\d.]/g, ""))).filter((n) => Number.isFinite(n) && String(n) !== "");
const priceOf = (v: unknown) => { const n = String(v ?? "").replace(/[^\d]/g, ""); return n ? Number(n) : null; };

/** Applies the buyer's hard requirements in code so ranking never sees non-matching homes. */
export function applyCriteria(rows: any[], c: Criteria, relax = 0): any[] {
  const lc = (s: unknown) => String(s ?? "").toLowerCase();
  return rows.filter((r) => {
    if (c.locations.length && !c.locations.some((l) => [r.location, r.property_district, r.title].some((f) => lc(f).includes(lc(l))))) return false;
    if (relax < 2 && c.types.length && !c.types.some((t) => lc(r.property_type).includes(lc(t).replace(/s$/, "")))) return false;
    const p = priceOf(r.price);
    const slack = relax ? 1.15 : 1.03;
    if (c.maxPrice && p && p > c.maxPrice * slack) return false;
    if (c.minPrice && p && p < c.minPrice / slack) return false;
    const b = nums(r.bedrooms);
    if (relax < 2 && c.minBeds != null && b.length && Math.max(...b) < c.minBeds) return false;
    if (relax < 2 && c.maxBeds != null && b.length && Math.min(...b) > c.maxBeds) return false;
    const s = nums(r.sizes_m2);
    if (relax < 1 && c.minSize && s.length && Math.max(...s) < c.minSize) return false;
    if (relax < 1 && c.maxSize && s.length && Math.min(...s) > c.maxSize) return false;
    if (relax < 1 && c.readyToMove === true && !lc(r.status).includes("ready")) return false;
    if (relax < 1 && c.citizenship === true && !r.citizenship_eligible) return false;
    return true;
  });
}

export const CRITERIA_INSTRUCTIONS = `Extract the buyer's HARD requirements from their request (any language, may be a voice transcript).
Reply ONLY with JSON: {"language": string (English name of the language the request is written in, e.g. "Swedish"), "locations": string[], "types": string[], "minPrice": number|null, "maxPrice": number|null, "minBeds": number|null, "maxBeds": number|null, "minSize": number|null, "maxSize": number|null, "readyToMove": boolean|null, "citizenship": boolean|null}.
- locations: English names matching these cities/areas: Antalya, Alanya, Istanbul, Mersin, Dubai, Cyprus, Bali, France, or district names (e.g. "Konyaalti", "Kargicak", "Canggu"). "Turkey" => ["Antalya","Istanbul","Mersin","Alanya"]. Empty if not stated.
- types: from "Apartment","Villa","Penthouse","Duplex","Townhouse","Land","Commercial". Empty if not stated.
- Prices in EUR as plain numbers (convert "500k", "2 miljoner kr" roughly to EUR). "under/max" => maxPrice, "from/minst" => minPrice.
- "3 bedrooms" means minBeds 3. "3+1" Turkish notation means 3 bedrooms. Studio = 0.
- Use null for anything not clearly stated. Never invent requirements.`;
