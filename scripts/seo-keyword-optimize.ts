// Regenerates src/utils/seoMetaTranslations.ts with keyword-optimized
// titles/descriptions per language, grounded in Semrush keyword research.
import { SEO_META_EN } from '../src/utils/seoMetaSource';
import { SEO_META } from '../src/utils/seoMetaTranslations';

const API_KEY = process.env.LOVABLE_API_KEY!;
const MODEL = 'google/gemini-2.5-flash';

// Semrush-researched primary/secondary keywords per language (monthly volume).
const BRIEFS: Record<string, string> = {
  sv: 'köpa lägenhet i turkiet (110), lägenhet dubai (110), lägenhet alanya (90), köpa hus i turkiet (50), lägenhet antalya (30), lägenhet till salu turkiet (30), villa bali (30), hus till salu turkiet (20), köpa bostad dubai (20), villa turkiet (20)',
  no: 'villa bali (140), leilighet alanya (30), leilighet til salgs tyrkia (20), bolig i tyrkia (20), kjøpe hus i tyrkia (20), kjøpe leilighet i tyrkia (10)',
  da: 'villa bali (140), lejlighed alanya (50), bolig i tyrkiet (20), lejlighed til salg tyrkiet (20), køb bolig i tyrkiet (20), bolig dubai (20)',
  de: 'immobilien zypern (1600), wohnung dubai kaufen (1000), immobilien dubai kaufen (720), wohnung kaufen türkei (590), haus kaufen türkei (590), immobilien türkei (480), wohnung antalya kaufen (320), villa bali kaufen (320), immobilien alanya (170), immobilien antalya (140), immobilien istanbul (110)',
  fr: 'immobilier dubai (1600), acheter appartement dubai (320), villa bali a vendre (260), immobilier chypre (140), immobilier turquie (70), immobilier istanbul (70), acheter maison turquie (40), immobilier antalya (20), immobilier alanya (20)',
  es: 'comprar piso en dubai (260), comprar casa en turquia (20), villa en bali comprar (20), inmuebles en venta turquía, propiedades en chipre, ciudadanía turca por inversión',
  tr: 'antalya satılık daire (22200), istanbul satılık daire (12100), mersin satılık daire (12100), satılık daire antalya (3600), kıbrıs satılık daire (3600), dubai satılık daire (880), satılık villa antalya (390), projeden satılık daire (320), satılık ev antalya (1000), denize sıfır satılık daire (70), lüks villa satılık (30)',
  ru: 'недвижимость в турции (2400), купить квартиру в турции (2400), недвижимость на кипре (880), купить квартиру в дубае (720), купить квартиру в анталии (720), недвижимость в дубае (590), квартира в алании (320), недвижимость в стамбуле (260), недвижимость в анталии (210), вилла на бали купить (110)',
  ar: 'شقق للبيع في دبي (1600), عقارات دبي (720), شقق للبيع في تركيا (30), فلل للبيع في تركيا (30), عقارات للبيع في تركيا (20), عقارات اسطنبول (20), الجنسية التركية عن طريق الاستثمار (20), عقارات انطاليا, عقارات قبرص, فلل للبيع في بالي',
  id: 'villa dijual bali (170), rumah dijual bali (140), investasi properti bali (30), villa canggu dijual (20), villa seminyak dijual (20), properti dijual dubai, apartemen dijual turki, properti turki',
  fa: 'خرید ملک در ترکیه، خرید آپارتمان در آنتالیا، خرید ملک در دبی، ویلا در بالی، شهروندی ترکیه از طریق سرمایه گذاری',
  ur: 'ترکی میں پراپرٹی برائے فروخت، انطالیہ میں اپارٹمنٹ، دبئی میں پراپرٹی، بالی میں ولا، سرمایہ کاری کے ذریعے ترک شہریت',
};

const LANG_NAME: Record<string, string> = {
  sv: 'Swedish', no: 'Norwegian', da: 'Danish', de: 'German', fr: 'French',
  es: 'Spanish', tr: 'Turkish', ru: 'Russian', ar: 'Arabic', id: 'Indonesian',
  fa: 'Persian', ur: 'Urdu',
};

async function call(messages: any[]) {
  for (let i = 0; i < 4; i++) {
    const r = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, messages, temperature: 0.4 }),
    });
    if (r.status === 429 || r.status >= 500) { await new Promise((s) => setTimeout(s, 4000 * (i + 1))); continue; }
    if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
    const j = await r.json();
    return j.choices[0].message.content as string;
  }
  throw new Error('gateway retries exhausted');
}

function parseJson(txt: string) {
  const m = txt.match(/\{[\s\S]*\}/);
  if (!m) throw new Error('no json: ' + txt.slice(0, 200));
  return JSON.parse(m[0]);
}

const pages = Object.keys(SEO_META_EN);

async function run() {
  const out: Record<string, Record<string, { title: string; description: string }>> = {
    en: SEO_META_EN as any,
  };
  for (const lang of Object.keys(LANG_NAME)) {
    const chunks: string[][] = [];
    for (let i = 0; i < pages.length; i += 7) chunks.push(pages.slice(i, i + 7));
    out[lang] = {};
    for (const chunk of chunks) {
      const payload = chunk.map((p) => ({
        path: p,
        en_title: SEO_META_EN[p].title,
        en_description: SEO_META_EN[p].description,
        current: SEO_META[lang]?.[p] ?? null,
      }));
      const content = await call([
        {
          role: 'system',
          content: `You are an international real-estate SEO specialist. Rewrite page titles and meta descriptions in ${LANG_NAME[lang]} for a property portal (Future Homes International) selling property in Turkey, Dubai, Cyprus and Bali.

Rules:
- Use the natural search phrasing real users type in ${LANG_NAME[lang]}, taken from this keyword research (volume/month): ${BRIEFS[lang]}
- Put the single most relevant PRIMARY keyword for that page at the very start of the title, exactly as people search it.
- Add 1-2 SECONDARY keywords (locations, property types, citizenship/visa/yield angles) later in the title or in the description.
- Title: max 60 characters, no clickbait, brand "Future Homes" only if it still fits.
- Description: 140-158 characters, includes the primary keyword plus a concrete benefit (prices, districts, citizenship, yields) and an implicit call to action.
- Never keep English words unless they are proper nouns (Antalya, Dubai, Bali, Future Homes).
- Do not invent facts beyond the English source.
Return ONLY JSON: {"/path": {"title": "...", "description": "..."}}`,
        },
        { role: 'user', content: JSON.stringify(payload) },
      ]);
      const obj = parseJson(content);
      for (const p of chunk) {
        out[lang][p] = obj[p] ?? SEO_META[lang]?.[p] ?? SEO_META_EN[p];
      }
      console.log(lang, chunk.length, 'done');
    }
  }
  const body = `// AUTO-GENERATED localized SEO titles/descriptions (13 languages).
// Keyword-optimized from Semrush research per market (see scripts/seo-keyword-optimize.ts).
// Source of truth for English: seoMetaSource.ts
import type { PageMeta } from './seoMetaSource';

export const SEO_META: Record<string, Record<string, PageMeta>> = ${JSON.stringify(out, null, 2)};
`;
  await Bun.write('src/utils/seoMetaTranslations.ts', body);
  console.log('written');
}

run();
