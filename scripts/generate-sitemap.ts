// Runs before `vite dev` and `vite build`; writes public/sitemap.xml.
// Pulls dynamic property + article entries from Supabase.

import { writeFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://futurehomesinternational.com";
const SUPABASE_URL = "https://kiogiyemoqbnuvclneoe.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpb2dpeWVtb3FibnV2Y2xuZW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDg4NzIsImV4cCI6MjA2ODI4NDg3Mn0.wZFKwwrvtrps2gCFc15rHN-3eg5T_kEDioBGZV_IctI";

interface Entry {
  path: string;
  changefreq?: string;
  priority?: string;
  lastmod?: string;
}

const today = new Date().toISOString().slice(0, 10);

const staticEntries: Entry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/property-wizard", changefreq: "weekly", priority: "0.9" },
  { path: "/ai-property-search", changefreq: "weekly", priority: "0.9" },
  { path: "/map-search", changefreq: "weekly", priority: "0.8" },
  { path: "/antalya", changefreq: "daily", priority: "0.9" },
  { path: "/istanbul", changefreq: "daily", priority: "0.9" },
  { path: "/dubai", changefreq: "daily", priority: "0.9" },
  { path: "/cyprus", changefreq: "daily", priority: "0.9" },
  { path: "/mersin", changefreq: "daily", priority: "0.8" },
  { path: "/bali", changefreq: "daily", priority: "0.8" },
  { path: "/property-for-sale-in-turkey", changefreq: "daily", priority: "0.9" },
  { path: "/apartments-for-sale-in-turkey", changefreq: "daily", priority: "0.9" },
  { path: "/luxury-villas-in-turkey", changefreq: "daily", priority: "0.9" },
  { path: "/off-plan-property-turkey", changefreq: "weekly", priority: "0.8" },
  { path: "/turkish-citizenship-by-investment", changefreq: "weekly", priority: "0.9" },
  { path: "/about-us", changefreq: "monthly", priority: "0.8" },
  { path: "/contact-us", changefreq: "monthly", priority: "0.8" },
  { path: "/testimonials", changefreq: "weekly", priority: "0.7" },
  { path: "/information", changefreq: "weekly", priority: "0.7" },
  { path: "/ali-karan", changefreq: "monthly", priority: "0.6" },
];

async function fetchDynamic(): Promise<Entry[]> {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const [{ data: properties }, { data: posts }] = await Promise.all([
      supabase.from("properties").select("id").eq("is_active", true).limit(2000),
      supabase.from("blog_posts").select("slug").eq("language_code", "en").limit(500),
    ]);
    const propEntries: Entry[] =
      (properties ?? []).map((p: any) => ({
        path: `/property/${p.id}`,
        changefreq: "weekly",
        priority: "0.6",
        lastmod: today,
      }));
    const articleEntries: Entry[] =
      (posts ?? []).map((b: any) => ({
        path: `/articles/${b.slug}`,
        changefreq: "monthly",
        priority: "0.5",
        lastmod: today,
      }));
    return [...propEntries, ...articleEntries];
  } catch (e) {
    console.warn("sitemap: failed to fetch dynamic entries, continuing with static only", e);
    return [];
  }
}

function renderSitemap(entries: Entry[]) {
  const urls = entries
    .map((e) =>
      [
        "  <url>",
        `    <loc>${BASE_URL}${e.path}</loc>`,
        e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
        e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
        e.priority ? `    <priority>${e.priority}</priority>` : null,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n")
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

async function main() {
  const dynamic = await fetchDynamic();
  const entries = [
    ...staticEntries.map((e) => ({ ...e, lastmod: today })),
    ...dynamic,
  ];
  const xml = renderSitemap(entries);
  writeFileSync(resolve("public/sitemap.xml"), xml);
  console.log(`sitemap.xml written (${entries.length} entries)`);
}

main();
