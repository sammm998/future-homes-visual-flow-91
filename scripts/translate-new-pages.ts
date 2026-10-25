// Translates src/content/newPagesCopy.ts (EN) into every non-English site language via Lovable AI Gateway.
// Run: bun scripts/translate-new-pages.ts [lang ...]
import { writeFileSync, readFileSync, existsSync } from "fs";

const OUT = "src/content/newPagesCopy.i18n.json";
const LANGS: Record<string, string> = { sv: "Swedish", tr: "Turkish", ar: "Arabic", ru: "Russian", no: "Norwegian Bokmål", da: "Danish", fa: "Persian", ur: "Urdu", es: "Spanish", de: "German", fr: "French", id: "Indonesian" };

const src = readFileSync("src/content/newPagesCopy.ts", "utf8");
const enLiteral = src.slice(src.indexOf("export const EN = ") + 18, src.indexOf("};\n\nexport type") + 1);
const EN = new Function(`return (${enLiteral})`)();

const out: Record<string, unknown> = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
const targets = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(LANGS).filter((l) => !out[l]);

function sameShape(a: any, b: any): boolean {
  if (Array.isArray(a)) return Array.isArray(b) && a.length === b.length && a.every((x, i) => sameShape(x, b[i]));
  if (a && typeof a === "object") return b && typeof b === "object" && Object.keys(a).every((k) => sameShape(a[k], b[k]));
  return typeof b === "string" && b.trim().length > 0;
}

await Promise.all(targets.map(async (lang) => {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3.8-flash",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `You translate real-estate website copy from English to ${LANGS[lang]}. Return ONLY JSON with exactly the same keys and array lengths. Keep placeholders like {district} unchanged. Keep proper names, Turkish legal terms in parentheses (tapu, kat irtifakı, şerh, vergi numarası, DASK, DAB, SPK, NVI, TKGM, RERA, Oqood, NOC, e-İkamet), numbers, currencies and "Future Homes" unchanged.` },
          { role: "user", content: JSON.stringify(EN) },
        ],
      }),
    });
    if (!res.ok) { console.error(lang, res.status, await res.text()); continue; }
    const j = await res.json();
    try {
      const parsed = JSON.parse(j.choices[0].message.content.replace(/^```json|```$/g, ""));
      if (!sameShape(EN, parsed)) throw new Error("shape mismatch");
      out[lang] = parsed;
      console.log("ok", lang);
      return;
    } catch (e) { console.error(lang, String(e)); }
  }
  console.error("FAILED", lang);
}));

writeFileSync(OUT, JSON.stringify(out, null, 0));
