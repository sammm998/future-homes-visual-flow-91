// Shared data + URL helpers for the language-specific sitemaps.
// Uses the publishable (anon) key: only public, already-indexable data.
import { createPublicCloudClient } from "@/integrations/legacy/publicCloud";
import { SUPPORTED_LOCALES, localizePath } from "@/utils/localeRouting";
import { PATH_TRANSLATIONS } from "@/utils/slugHelpers";
import { NORDIC_LANDING_PAGES } from "@/data/nordicLandingPages";

export const SITEMAP_BASE_URL = "https://futurehomesinternational.com";

export const SITEMAP_LOCALES = SUPPORTED_LOCALES;

const client = () => createPublicCloudClient() as any;

export interface SitemapEntry {
  /** Locale-free path, e.g. "/about-us" */
  path: string;
  changefreq: string;
  priority: string;
  lastmod?: string;
  /** Property ref number — URL uses the translated segment per locale */
  propertyRef?: string;
  /** Page exists in one locale only; `path` already contains the locale prefix */
  onlyLocale?: string;
  /** Absolute image URLs shown for this page in Google results */
  images?: string[];
}


export const STATIC_PAGES: SitemapEntry[] = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/property-wizard", priority: "0.9", changefreq: "weekly" },
  { path: "/ai-property-search", priority: "0.9", changefreq: "weekly" },
  { path: "/about-us", priority: "0.8", changefreq: "monthly" },
  { path: "/contact-us", priority: "0.8", changefreq: "monthly" },
  { path: "/our-story", priority: "0.6", changefreq: "monthly" },
  { path: "/testimonials", priority: "0.7", changefreq: "weekly" },
  { path: "/information", priority: "0.7", changefreq: "weekly" },
  { path: "/property-gallery", priority: "0.6", changefreq: "weekly" },
  { path: "/map-search", priority: "0.6", changefreq: "weekly" },
  { path: "/design-your-home", priority: "0.6", changefreq: "monthly" },
  { path: "/articles", priority: "0.7", changefreq: "daily" },
  { path: "/courses", priority: "0.5", changefreq: "monthly" },
  { path: "/ali-karan", priority: "0.6", changefreq: "monthly" },
  { path: "/antalya", priority: "0.9", changefreq: "daily" },
  { path: "/istanbul", priority: "0.9", changefreq: "daily" },
  { path: "/dubai", priority: "0.9", changefreq: "daily" },
  { path: "/cyprus", priority: "0.9", changefreq: "daily" },
  { path: "/mersin", priority: "0.9", changefreq: "daily" },
  { path: "/bali", priority: "0.9", changefreq: "daily" },
  { path: "/property-for-sale-in-turkey", priority: "0.8", changefreq: "weekly" },
  { path: "/turkish-citizenship-by-investment", priority: "0.8", changefreq: "weekly" },
  { path: "/apartments-for-sale-in-turkey", priority: "0.8", changefreq: "weekly" },
  { path: "/luxury-villas-in-turkey", priority: "0.8", changefreq: "weekly" },
  { path: "/off-plan-property-turkey", priority: "0.7", changefreq: "weekly" },
  { path: "/articles/expenses-buying-property-turkey", priority: "0.7", changefreq: "monthly" },
];

async function fetchAll<T>(
  table: string,
  select: string,
  apply: (q: any) => any,
): Promise<T[]> {
  const supabase = client();
  const rows: T[] = [];
  const limit = 1000;
  let offset = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, error } = await apply(
      supabase.from(table).select(select).range(offset, offset + limit - 1),
    );
    if (error || !data || data.length === 0) break;
    rows.push(...(data as T[]));
    if (data.length < limit) break;
    offset += limit;
  }
  return rows;
}

/** Every URL of the site, locale-free, freshly read from the database. */
export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const [properties, posts] = await Promise.all([
    fetchAll<{
      ref_no: string | null;
      updated_at: string | null;
      property_image: string | null;
      property_images: string[] | null;
    }>(
      "properties",
      "ref_no, updated_at, property_image, property_images",
      (q) => q.eq("is_active", true),
    ),
    fetchAll<{
      slug: string | null;
      updated_at: string | null;
      language_code: string | null;
      parent_post_id: string | null;
      featured_image: string | null;
    }>(
      "blog_posts",
      "slug, updated_at, language_code, parent_post_id, featured_image",
      (q) => q.eq("published", true),
    ),
  ]);

  const entries: SitemapEntry[] = [...STATIC_PAGES];

  // Locale-specific Nordic keyword landing pages (sv/no/da only)
  for (const page of NORDIC_LANDING_PAGES) {
    entries.push({
      path: `/${page.locale}/${page.slug}`,
      onlyLocale: page.locale,
      changefreq: "weekly",
      priority: "0.8",
    });
  }

  for (const p of properties) {
    if (!p.ref_no) continue;
    const images = [p.property_image, ...(p.property_images ?? [])]
      .filter((src): src is string => typeof src === "string" && src.startsWith("http"))
      .filter((src, i, arr) => arr.indexOf(src) === i)
      .slice(0, 5);
    entries.push({
      path: `/property/${p.ref_no}`,
      propertyRef: String(p.ref_no),
      changefreq: "weekly",
      priority: "0.8",
      ...(images.length ? { images } : {}),
      ...(p.updated_at ? { lastmod: new Date(p.updated_at).toISOString().split("T")[0] } : {}),
    });
  }

  for (const post of posts) {
    if (!post.slug) continue;
    if (post.parent_post_id) continue;
    if (post.language_code && post.language_code !== "en") continue;
    entries.push({
      path: `/articles/${post.slug}`,
      changefreq: "monthly",
      priority: "0.6",
      ...(post.featured_image && post.featured_image.startsWith("http")
        ? { images: [post.featured_image] }
        : {}),
      ...(post.updated_at
        ? { lastmod: new Date(post.updated_at).toISOString().split("T")[0] }
        : {}),
    });
  }

  return entries;
}

/** Absolute URL for an entry in a given locale (translated property segment). */
export function entryUrl(entry: SitemapEntry, locale: string): string {
  if (entry.onlyLocale) {
    return `${SITEMAP_BASE_URL}${entry.path}`;
  }
  if (entry.propertyRef) {
    const segment = PATH_TRANSLATIONS[locale] || "property";
    const path = locale === "en" ? `/${segment}/${entry.propertyRef}` : `/${locale}/${segment}/${entry.propertyRef}`;
    return `${SITEMAP_BASE_URL}${path}`;
  }
  return `${SITEMAP_BASE_URL}${localizePath(entry.path, locale)}`;
}

const xmlEscape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Renders one locale's <urlset>, with hreflang alternates for every language. */
export function renderLocaleSitemap(entries: SitemapEntry[], locale: string): string {
  const urls = entries
    .filter((entry) => !entry.onlyLocale || entry.onlyLocale === locale)
    .map((entry) => {
      if (entry.onlyLocale) {
        return [
          "  <url>",
          `    <loc>${xmlEscape(entryUrl(entry, locale))}</loc>`,
          `    <changefreq>${entry.changefreq}</changefreq>`,
          `    <priority>${entry.priority}</priority>`,
          "  </url>",
        ].join("\n");
      }
      const alternates = SITEMAP_LOCALES.map(
        (alt) =>
          `    <xhtml:link rel="alternate" hreflang="${alt}" href="${xmlEscape(entryUrl(entry, alt))}" />`,
      ).join("\n");
      const images = (entry.images ?? [])
        .map((src) => `    <image:image>\n      <image:loc>${xmlEscape(src)}</image:loc>\n    </image:image>`)
        .join("\n");
      return [
        "  <url>",
        `    <loc>${xmlEscape(entryUrl(entry, locale))}</loc>`,
        entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : null,
        `    <changefreq>${entry.changefreq}</changefreq>`,
        `    <priority>${entry.priority}</priority>`,
        images || null,
        alternates,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(entryUrl(entry, "en"))}" />`,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    urls,
    "</urlset>",
  ].join("\n");
}

export const xmlResponse = (xml: string) =>
  new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
