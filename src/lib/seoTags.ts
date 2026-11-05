// Shared builders for canonical, hreflang and social tags so that every public
// page — whether it renders <SEOHead> or uses a route head() — emits the same,
// locale-correct set in the server HTML.
import { SUPPORTED_LOCALES, isSupportedLocale, localizePath, stripLocale } from "@/utils/localeRouting";
import { getPageMeta } from "@/utils/pageMeta";

export const SITE_URL = "https://futurehomesinternational.com";
export const SITE_NAME = "Future Homes International";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const OG_LOCALES: Record<string, string> = {
  en: "en_US", es: "es_ES", sv: "sv_SE", no: "nb_NO", da: "da_DK", de: "de_DE",
  fr: "fr_FR", tr: "tr_TR", ru: "ru_RU", ar: "ar_AR", fa: "fa_IR", ur: "ur_PK", id: "id_ID",
};

export const ROBOTS_INDEX = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
export const ROBOTS_NOINDEX = "noindex, follow";

/** Locale-free path without query/hash/trailing slash ("/" stays "/"). */
export const normalizeSeoPath = (path: string): string => {
  const clean = stripLocale((path || "/").split("?")[0].split("#")[0]);
  if (clean === "" || clean === "/") return "/";
  return clean.replace(/\/+$/, "") || "/";
};

/** Absolute URL of a locale-free path in the given locale. */
export const localeUrl = (path: string, locale: string): string =>
  `${SITE_URL}${localizePath(normalizeSeoPath(path), locale)}`;

/** One alternate per supported language for a page that exists in every locale. */
export const hreflangMap = (path: string): Record<string, string> =>
  Object.fromEntries(SUPPORTED_LOCALES.map((locale) => [locale, localeUrl(path, locale)]));

export const toAbsoluteUrl = (src?: string | null): string | undefined => {
  if (!src) return undefined;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("//")) return `https:${src}`;
  return `${SITE_URL}${src.startsWith("/") ? "" : "/"}${src}`;
};

/** Keeps a meta title inside Google's display width by dropping a trailing brand. */
export const fitTitle = (title: string, max = 65): string => {
  const t = title.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const parts = t.split(/\s+[|—–]\s+/);
  while (parts.length > 1 && parts.join(" | ").length > max) parts.pop();
  return parts.join(" | ");
};

export interface RouteSeoInput {
  /** Locale from the route params ("en" when the route has no locale prefix). */
  locale?: string;
  /** Locale-free path of the page, e.g. "/viewing-trip". */
  path: string;
  title: string;
  description: string;
  image?: string | null;
  type?: "website" | "article";
  noindex?: boolean;
  /** Page exists only in this exact URL (no language alternates). */
  singleLocale?: boolean;
}

/**
 * head() payload for routes that do not render <SEOHead>. Localized metadata
 * from the shared SEO dictionaries wins over the supplied English fallback.
 */
export function buildRouteSeoHead(input: RouteSeoInput) {
  const locale = isSupportedLocale(input.locale) ? input.locale : "en";
  const path = normalizeSeoPath(input.path);
  const localized = getPageMeta(path, locale);
  const title = fitTitle(localized?.title || input.title);
  const description = localized?.description || input.description;
  const url = localeUrl(path, locale);
  const image = toAbsoluteUrl(input.image) || DEFAULT_OG_IMAGE;
  const alternates = input.singleLocale ? {} : hreflangMap(path);

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: input.noindex ? ROBOTS_NOINDEX : ROBOTS_INDEX },
      { property: "og:type", content: input.type || "website" },
      { property: "og:url", content: url },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: image },
      { property: "og:locale", content: OG_LOCALES[locale] || "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [
      { rel: "canonical", href: url },
      ...Object.entries(alternates).map(([hreflang, href]) => ({ rel: "alternate", hrefLang: hreflang, href })),
      ...(input.singleLocale ? [] : [{ rel: "alternate", hrefLang: "x-default", href: localeUrl(path, "en") }]),
    ],
  };
}
