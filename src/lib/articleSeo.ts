// Per-article <head> data read during SSR so Google sees each article's own title and description.
import { CLOUD_URL, cloudRestHeaders } from "@/integrations/legacy/publicCloudConfig";
import { hreflangMap, normalizeSeoPath } from "@/lib/seoTags";

export type ArticleSeo = { title: string; description: string; image: string | null; lang: string } | null;

const clip = (s: string, n: number) => {
  const t = s.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (t.length <= n) return t;
  const cut = t.slice(0, n - 1);
  return cut.slice(0, Math.max(cut.lastIndexOf(" "), 60)).replace(/[\s,.;:-]+$/, "") + "…";
};

export async function fetchArticleSeo(slug: string, lang: string): Promise<ArticleSeo> {
  const cols = "title,meta_title,meta_description,excerpt,featured_image,language_code";
  // Translations are stored as `${slug}-${lang}` child rows; try those first.
  const tries: [string, string][] = lang === "en" ? [[slug, "en"]] : [[`${slug}-${lang}`, lang], [slug, lang], [slug, "en"]];
  for (const [s, l] of tries) {
    try {
      const res = await fetch(`${CLOUD_URL}/rest/v1/blog_posts?select=${cols}&published=eq.true&slug=eq.${encodeURIComponent(s)}&language_code=eq.${l}&limit=1`, { headers: cloudRestHeaders });
      if (!res.ok) continue;
      const [row] = (await res.json()) as any[];
      if (!row) continue;
      const title = clip(String(row.meta_title || row.title || ""), 60);
      const description = clip(String(row.meta_description || row.excerpt || row.title || ""), 158);
      return { title: `${title.length <= 45 ? `${title} | Future Homes` : title}`, description, image: row.featured_image || null, lang: row.language_code || l };
    } catch {
      /* fall through */
    }
  }
  return null;
}

export function articleHead(seo: ArticleSeo, path: string) {
  if (!seo) return { meta: [{ title: "Article | Future Homes International" }] };
  const url = `https://futurehomesinternational.com${path}`;
  const localeFree = normalizeSeoPath(path);
  const alternates = Object.entries(hreflangMap(localeFree)).map(([hreflang, href]) => ({ rel: "alternate", hrefLang: hreflang, href }));
  const image = seo.image && /^https:\/\//.test(seo.image) ? seo.image : null;
  return {
    meta: [
      { title: seo.title },
      { name: "description", content: seo.description },
      { property: "og:title", content: seo.title },
      { property: "og:description", content: seo.description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
      ...(image ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
    ],
    links: [
      { rel: "canonical", href: url },
      ...alternates,
      { rel: "alternate", hrefLang: "x-default", href: `https://futurehomesinternational.com${localeFree}` },
    ],
  };
}
