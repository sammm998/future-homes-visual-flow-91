// Runs before `vite dev` and `vite build`; writes public/sitemap.xml.
// Pulls dynamic property + article entries from Supabase and emits
// hreflang alternates for every supported language.

import { writeFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://futurehomesinternational.com";
const SUPABASE_URL = "https://kiogiyemoqbnuvclneoe.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpb2dpeWVtb3FibnV2Y2xuZW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDg4NzIsImV4cCI6MjA2ODI4NDg3Mn0.wZFKwwrvtrps2gCFc15rHN-3eg5T_kEDioBGZV_IctI";

// Keep in sync with src/utils/seoUtils.ts and src/utils/slugHelpers.ts
const LANGS = ["en", "sv", "no", "da", "de", "fr", "es", "tr", "ru", "ar", "fa", "ur", "id"];

const PROPERTY_PATHS: Record<string, string> = {
  en: "property",
  sv: "fastighet",
  tr: "mulk",
  ar: "aqar",
  ru: "nedvizhimost",
  no: "eiendom",
  da: "ejendom",
  fa: "melk",
  ur: "jaidad",
  es: "propiedad",
  de: "immobilie",
  fr: "propriete",
  id: "properti",
};

interface Entry {
  /** URL for each language code. */
  urls: Record<string, string>;
  changefreq?: string;
  priority?: string;
}

const xmlEscape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Same path for all languages, differing only by the ?lang= parameter. */
function localized(path: string, changefreq: string, priority: string): Entry {
  const urls: Record<string, string> = {};
  for (const lang of LANGS) {
    urls[lang] = lang === "en" ? `${BASE_URL}${path}` : `${BASE_URL}${path}?lang=${lang}`;
  }
  return { urls, changefreq, priority };
}

const staticEntries: Entry[] = [
  localized("/", "daily", "1.0"),
  localized("/property-wizard", "weekly", "0.9"),
  localized("/ai-property-search", "weekly", "0.9"),
  localized("/map-search", "weekly", "0.8"),
  localized("/antalya", "daily", "0.9"),
  localized("/istanbul", "daily", "0.9"),
  localized("/dubai", "daily", "0.9"),
  localized("/cyprus", "daily", "0.9"),
  localized("/mersin", "daily", "0.8"),
  localized("/bali", "daily", "0.8"),
  localized("/property-for-sale-in-turkey", "daily", "0.9"),
  localized("/apartments-for-sale-in-turkey", "daily", "0.9"),
  localized("/luxury-villas-in-turkey", "daily", "0.9"),
  localized("/off-plan-property-turkey", "weekly", "0.8"),
  localized("/turkish-citizenship-by-investment", "weekly", "0.9"),
  localized("/about-us", "monthly", "0.8"),
  localized("/our-story", "monthly", "0.6"),
  localized("/contact-us", "monthly", "0.8"),
  localized("/testimonials", "weekly", "0.7"),
  localized("/information", "weekly", "0.7"),
  localized("/courses", "monthly", "0.6"),
  localized("/ali-karan", "monthly", "0.6"),
];

async function fetchDynamic(): Promise<Entry[]> {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const [{ data: properties }, { data: posts }] = await Promise.all([
      supabase.from("properties").select("ref_no").eq("is_active", true).limit(2000),
      supabase.from("blog_posts").select("slug").eq("language_code", "en").limit(500),
    ]);

    const propEntries: Entry[] = (properties ?? [])
      .filter((p: any) => p.ref_no)
      .map((p: any) => {
        const urls: Record<string, string> = {};
        for (const lang of LANGS) {
          const seg = PROPERTY_PATHS[lang];
          urls[lang] =
            lang === "en"
              ? `${BASE_URL}/${seg}/${p.ref_no}`
              : `${BASE_URL}/${seg}/${p.ref_no}?lang=${lang}`;
        }
        return { urls, changefreq: "weekly", priority: "0.6" };
      });

    const articleEntries: Entry[] = (posts ?? []).map((b: any) =>
      localized(`/articles/${b.slug}`, "monthly", "0.5")
    );

    return [...propEntries, ...articleEntries];
  } catch (e) {
    console.warn("sitemap: failed to fetch dynamic entries, continuing with static only", e);
    return [];
  }
}

function renderSitemap(entries: Entry[]) {
  const urls = entries
    .map((e) => {
      const alternates = LANGS.map(
        (lang) =>
          `      <xhtml:link rel="alternate" hreflang="${lang}" href="${xmlEscape(e.urls[lang])}" />`
      ).concat(
        `      <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(e.urls.en)}" />`
      );

      return [
        "  <url>",
        `    <loc>${xmlEscape(e.urls.en)}</loc>`,
        e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
        e.priority ? `    <priority>${e.priority}</priority>` : null,
        ...alternates,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}

async function main() {
  const dynamic = await fetchDynamic();
  const entries = [...staticEntries, ...dynamic];
  writeFileSync(resolve("public/sitemap.xml"), renderSitemap(entries));
  console.log(`sitemap.xml written (${entries.length} entries)`);
}

main();
