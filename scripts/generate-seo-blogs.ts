/**
 * One-off SEO content generator.
 *
 * Creates English parent blog posts for a curated set of high-value keywords
 * (city / location intent — the ones that lead to property enquiries) and then
 * translates each of them into the 12 other site languages as child rows.
 *
 * Run:  bun run scripts/generate-seo-blogs.ts [--translate-only]
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env["SUPABASE_URL"]!;
const SERVICE_ROLE = process.env["SUPABASE_SERVICE_ROLE_KEY"]!;
const GEMINI_KEY = process.env["GEMINI_API_KEY"]!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false },
});

const TARGET_LANGS: { code: string; name: string }[] = [
  { code: "sv", name: "Swedish" },
  { code: "tr", name: "Turkish" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" },
  { code: "fa", name: "Persian (Farsi)" },
  { code: "ur", name: "Urdu" },
  { code: "no", name: "Norwegian" },
  { code: "da", name: "Danish" },
  { code: "de", name: "German" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "id", name: "Indonesian" },
];

type Topic = {
  slug: string;
  title: string;
  keywords: string[];
  brief: string;
  category: string;
};

const TOPICS: Topic[] = [
  {
    slug: "cities-of-turkey-guide",
    title: "Cities of Turkey: A Complete Guide for Property Buyers",
    keywords: [
      "cities of Turkey", "turkiets städer", "turkiska städer", "stora städer i turkiet",
      "miljonstad i turkiet", "biggest cities in Turkey",
    ],
    brief:
      "Overview of Turkey's major cities (Istanbul, Ankara, Izmir, Antalya, Bursa, Mersin, Adana, Konya, Gaziantep, Trabzon), " +
      "population size, climate, cost of living, lifestyle and what each city means for a property buyer or investor. " +
      "Include a comparison table of cities with approximate population, region, climate and typical property profile.",
    category: "City Guides",
  },
  {
    slug: "ankara-capital-of-turkey",
    title: "Ankara: The Capital City of Turkey and What It Offers Buyers",
    keywords: [
      "capital of Turkey", "ankara capital of turkey", "turkey capital city", "ankara airport",
    ],
    brief:
      "Explain that Ankara — not Istanbul — is the capital of Turkey, why it became the capital in 1923, its role in government and business, " +
      "Esenboğa Airport connections, districts such as Çankaya and Keçiören, climate, universities, and the residential property market.",
    category: "City Guides",
  },
  {
    slug: "trabzon-guide",
    title: "Trabzon Guide: Black Sea Living, Nature and Property",
    keywords: ["trabzon", "trabzon turkey"],
    brief:
      "Trabzon on the Black Sea coast: green mountains, Uzungöl, Sumela Monastery, climate and rainfall, airport connections, " +
      "popularity with Gulf visitors, food, and what to know before buying an apartment or villa there.",
    category: "City Guides",
  },
  {
    slug: "belek-guide",
    title: "Belek Guide: Golf, Beaches and Resort Property in Antalya",
    keywords: ["belek", "belek antalya", "belek turkey"],
    brief:
      "Belek as Turkey's golf capital: golf courses, five-star resorts, Blue Flag beaches, distance from Antalya Airport, " +
      "Kadriye and Bogazkent, rental potential and the type of property buyers choose there.",
    category: "Location Guides",
  },
  {
    slug: "konyaalti-beach-antalya",
    title: "Konyaaltı Beach, Antalya: Living by the Mediterranean",
    keywords: ["konyaalti beach", "konyaaltı", "antalya beach"],
    brief:
      "Konyaaltı Beach and the Konyaaltı district of Antalya: the pebble beach and Blue Flag status, Beach Park, Liman, Hurma and Sarısu areas, " +
      "the Taurus mountain backdrop, schools and tram links, and why Konyaaltı is one of Antalya's most requested residential areas.",
    category: "Location Guides",
  },
  {
    slug: "side-turkey-guide",
    title: "Side, Turkey: Ancient Town, Beaches and Holiday Homes",
    keywords: ["side turkey", "side antalya"],
    brief:
      "Side in Manavgat, Antalya: the Temple of Apollo and Roman theatre, old town, Kumköy and Sorgun beaches, Manavgat waterfall, " +
      "the holiday-rental market and practical buying advice.",
    category: "Location Guides",
  },
  {
    slug: "didim-guide",
    title: "Didim Guide: Altınkum Beach and Affordable Aegean Property",
    keywords: ["didim", "didim turkey", "altinkum"],
    brief:
      "Didim on the Aegean coast: Altınkum's three beaches, the Temple of Apollo at Didyma, the marina, the long-established British and " +
      "Nordic communities, low property prices compared with Antalya, and running costs.",
    category: "Location Guides",
  },
  {
    slug: "datca-turkey-guide",
    title: "Datça, Turkey: The Quiet Peninsula Between Two Seas",
    keywords: ["datca turkey", "datça", "datca peninsula"],
    brief:
      "The Datça peninsula in Muğla: where the Aegean meets the Mediterranean, almond groves, Old Datça, Knidos, boat life and sailing, " +
      "building restrictions that protect the landscape, seasonality, and the stone-house and boutique-villa market.",
    category: "Location Guides",
  },
  {
    slug: "izmir-turkey-guide",
    title: "Izmir, Turkey: Aegean City Life and Property Market Guide",
    keywords: ["izmir turkey", "izmir", "izmir property"],
    brief:
      "Izmir as Turkey's third-largest city: Kordon and Alsancak, Karşıyaka, Çeşme and Urla, climate, transport and Adnan Menderes Airport, " +
      "universities and lifestyle, plus a look at prices across the popular districts.",
    category: "City Guides",
  },
  {
    slug: "fatih-eminonu-istanbul-guide",
    title: "Fatih and Eminönü: The Historic Heart of Istanbul",
    keywords: ["fatih", "eminönü", "fatih istanbul", "blue mosque turkey"],
    brief:
      "Fatih district and the Eminönü quarter of Istanbul: the Blue Mosque, Hagia Sophia, Grand Bazaar and Spice Bazaar, Süleymaniye, " +
      "ferry connections across the Golden Horn, restoration property, rental demand from tourism, and buying rules in a protected area.",
    category: "City Guides",
  },
  {
    slug: "tekirdag-guide",
    title: "Tekirdağ Guide: Sea of Marmara Living Close to Istanbul",
    keywords: ["tekirdag", "tekirdağ"],
    brief:
      "Tekirdağ on the Sea of Marmara: the coastal road, Şarköy vineyards, commuting distance to Istanbul, the new Çanakkale bridge, " +
      "industry and jobs, and why buyers priced out of Istanbul look here.",
    category: "City Guides",
  },
  {
    slug: "turkish-food-guide",
    title: "Turkish Food: A Complete Guide to Traditional Turkish Cuisine",
    keywords: [
      "turkey food", "turkish foods", "traditional turkish food", "turkish cuisine",
      "turkisk mat", "turkiet mat",
    ],
    brief:
      "An in-depth guide to Turkish cuisine: regional differences (Aegean, Black Sea, Southeast), kebabs and mezes, olive-oil dishes, " +
      "soups, pide and lahmacun, seafood on the coasts, tea and coffee culture, and what everyday food life looks like for someone " +
      "living in Turkey. Include a table of must-try dishes with region and description. Mention how food culture is part of daily " +
      "life for residents and a natural draw for people considering buying a home in Turkey.",
    category: "Lifestyle",
  },
  {
    slug: "turkish-desserts-guide",
    title: "Turkish Desserts: Baklava, Künefe and the Sweets of Turkey",
    keywords: [
      "turkish dessert", "turkish desserts", "baklava", "turkisk dessert", "turkiska desserter",
    ],
    brief:
      "A guide to Turkish desserts: baklava and its Gaziantep origins, künefe, lokum (Turkish delight), sütlaç, kazandibi, aşure, " +
      "helva, tulumba and şekerpare. Explain when each is eaten (Ramadan, bayram, weddings), where to find the best versions, " +
      "and how dessert culture fits into Turkish hospitality. Include a table of desserts with main ingredients and region.",
    category: "Lifestyle",
  },
  {
    slug: "turkish-breakfast-guide",
    title: "The Turkish Breakfast (Kahvaltı): What It Is and Where to Try It",
    keywords: ["turkish breakfast", "kahvalti", "turkisk frukost"],
    brief:
      "Explain the Turkish breakfast tradition: the full serpme kahvaltı spread with cheeses, olives, tomatoes, honey and kaymak, " +
      "menemen, börek, simit and endless tea; regional variations such as Van breakfast; typical prices; and famous breakfast " +
      "districts in Istanbul, Izmir and the coastal resorts. Connect to lifestyle for people living or holidaying in Turkey.",
    category: "Lifestyle",
  },
  {
    slug: "istanbul-street-food-guide",
    title: "Istanbul Street Food: What to Eat and Where to Find It",
    keywords: [
      "istanbul street food", "street food istanbul", "turkish street food", "eminönü food",
    ],
    brief:
      "A street-food tour of Istanbul: balık ekmek in Eminönü, simit, döner, kokoreç, midye dolma, kumpir in Ortaköy, wet burgers, " +
      "roasted chestnuts and corn, boza in winter and şalgam. Cover neighbourhoods (Eminönü, Karaköy, Kadıköy, Beşiktaş), typical " +
      "prices, hygiene tips and seasonal specialities.",
    category: "Lifestyle",
  },
];

async function gemini(prompt: string, schema: object, system: string) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json", responseSchema: schema },
        }),
      },
    );
    if (res.ok) {
      const json: any = await res.json();
      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        try {
          return JSON.parse(text);
        } catch {
          /* retry */
        }
      }
    }
    await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
  }
  return null;
}

const ARTICLE_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    meta_title: { type: "string" },
    meta_description: { type: "string" },
    excerpt: { type: "string" },
    content: { type: "string" },
  },
  required: ["title", "meta_title", "meta_description", "excerpt", "content"],
};

const TRANSLATION_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    meta_title: { type: "string" },
    meta_description: { type: "string" },
    excerpt: { type: "string" },
    content: { type: "string" },
  },
  required: ["title", "meta_title", "meta_description", "excerpt", "content"],
};

async function createParent(topic: Topic) {
  const { data: existing } = await supabase
    .from("blog_posts")
    .select("id")
    .eq("slug", topic.slug)
    .maybeSingle();
  if (existing) return existing.id as string;

  const system =
    "You write for Future Homes International, an international real-estate agency selling property in Turkey, Dubai, North Cyprus and Bali. " +
    "Write accurate, specific, genuinely useful editorial content in British English. No invented statistics, no fake testimonials, no exact prices " +
    "presented as current facts (use ranges and say they are indicative). Return HTML for the content field using only <h2>, <h3>, <p>, <ul>, <li>, " +
    "<table>, <thead>, <tbody>, <tr>, <th>, <td> and <strong>. Do NOT include an <h1> (the page renders the title separately). " +
    "1000-1400 words. Natural keyword usage, no stuffing. Finish with a short section on how Future Homes International can help buyers there.";

  const prompt =
    `Working title: ${topic.title}\n` +
    `Target keywords: ${topic.keywords.join(", ")}\n` +
    `Brief: ${topic.brief}\n\n` +
    `meta_title must be under 60 characters, meta_description under 155 characters, excerpt about 150 characters.`;

  const article = await gemini(prompt, ARTICLE_SCHEMA, system);
  if (!article) {
    console.warn("FAILED to generate", topic.slug);
    return null;
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      title: article.title,
      slug: topic.slug,
      excerpt: article.excerpt,
      content: article.content,
      meta_title: article.meta_title,
      meta_description: article.meta_description,
      category: topic.category,
      tags: topic.keywords,
      language_code: "en",
      published: true,
      published_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (error) {
    console.warn("INSERT failed", topic.slug, error.message);
    return null;
  }
  console.log("created", topic.slug);
  return data.id as string;
}

async function translateParent(parentId: string, slug: string) {
  const { data: parent } = await supabase
    .from("blog_posts")
    .select("title, excerpt, content, meta_title, meta_description, category, tags")
    .eq("id", parentId)
    .single();
  if (!parent) return;

  const { data: existing } = await supabase
    .from("blog_posts")
    .select("language_code")
    .eq("parent_post_id", parentId);
  const done = new Set((existing || []).map((r: any) => r.language_code));

  await Promise.all(TARGET_LANGS.map(async (lang) => {
    if (done.has(lang.code)) return;
    const system =
      `You are a professional translator for a luxury international real-estate company. Translate the article into ${lang.name}. ` +
      `Preserve every HTML tag and the structure exactly. Keep place names, brand names and numbers. Translate naturally and idiomatically, ` +
      `keeping it optimised for search in ${lang.name}. meta_title under 60 characters, meta_description under 155 characters.`;
    const out = await gemini(
      JSON.stringify({
        title: parent.title,
        meta_title: parent.meta_title,
        meta_description: parent.meta_description,
        excerpt: parent.excerpt,
        content: parent.content,
      }),
      TRANSLATION_SCHEMA,
      system,
    );
    if (!out) {
      console.warn("translate failed", slug, lang.code);
      return;
    }
    const { error } = await supabase.from("blog_posts").insert({
      title: out.title,
      slug: `${slug}-${lang.code}`,
      excerpt: out.excerpt,
      content: out.content,
      meta_title: out.meta_title,
      meta_description: out.meta_description,
      category: parent.category,
      tags: parent.tags,
      language_code: lang.code,
      parent_post_id: parentId,
      published: true,
      published_at: new Date().toISOString(),
    });
    if (error) console.warn("insert translation failed", slug, lang.code, error.message);
    else console.log("translated", slug, lang.code);
  }));
}

const only = process.argv.includes("--translate-only");

for (const topic of TOPICS) {
  const id = only
    ? ((await supabase.from("blog_posts").select("id").eq("slug", topic.slug).maybeSingle()).data?.id as string | undefined)
    : await createParent(topic);
  if (!id) continue;
  await translateParent(id, topic.slug);
}
console.log("done");
