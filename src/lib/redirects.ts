// Central redirect rules so that old/incorrect URLs from Google, ads and
// external links always land on a real page instead of a 404.
import { SUPPORTED_LOCALES, PREFIXED_LOCALES } from "@/utils/localeRouting";
import { PATH_TO_LANG, PATH_TRANSLATIONS } from "@/utils/slugHelpers";

const LOCALES = SUPPORTED_LOCALES as readonly string[];
const PREFIXED = PREFIXED_LOCALES as readonly string[];

/** Paths that must never be rewritten. */
const SKIP_PREFIXES = ["/api", "/admin", "/assets", "/sitemap", "/_", "/lovable-uploads", "/favicon"];

/** Old or common alternative paths -> current locale-free path. */
const LEGACY_PATHS: Record<string, string> = {
  "/blog": "/articles",
  "/news": "/articles",
  "/insights": "/articles",
  "/information-articles": "/articles",
  "/properties": "/property-for-sale-in-turkey",
  "/property": "/property-for-sale-in-turkey",
  "/listings": "/property-for-sale-in-turkey",
  "/for-sale": "/property-for-sale-in-turkey",
  "/search": "/ai-property-search",
  "/property-search": "/ai-property-search",
  "/turkey": "/property-for-sale-in-turkey",
  "/turkey-property": "/property-for-sale-in-turkey",
  "/apartments": "/apartments-for-sale-in-turkey",
  "/villas": "/luxury-villas-in-turkey",
  "/off-plan": "/off-plan-property-turkey",
  "/citizenship": "/turkish-citizenship-by-investment",
  "/turkish-citizenship": "/turkish-citizenship-by-investment",
  "/about": "/about-us",
  "/contact": "/contact-us",
  "/team": "/about-us",
  "/gallery": "/property-gallery",
  "/map": "/map-search",
  "/reviews": "/testimonials",
  "/faq": "/information",
  "/alanya": "/alanya-property-for-sale",
  "/belek": "/belek-property-for-sale",
  "/kalkan": "/kalkan-property-for-sale",
  "/dubai-off-plan": "/dubai-off-plan-property",
  "/bali-villas": "/bali-villas-for-sale",
};

/** Old first segments that pointed at a single listing. */
const LEGACY_PROPERTY_SEGMENTS = new Set([
  "property-details",
  "propertydetails",
  "listing",
  "listings",
  "apartment",
  "estate",
  "properties",
  "property-detail",
  "real-estate",
]);

/** Old city segments that should open the city search page. */
const CITY_SEGMENTS = new Set(["antalya", "istanbul", "dubai", "cyprus", "mersin", "bali"]);

const localize = (path: string, locale: string) =>
  locale === "en" ? path : `/${locale}${path}`;

/**
 * Returns an absolute URL to redirect to, or null when the request is fine.
 */
export function resolveRedirect(rawUrl: string): string | null {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  const original = url.pathname;
  if (SKIP_PREFIXES.some((p) => original.toLowerCase().startsWith(p))) return null;
  if (/\.[a-z0-9]{2,5}$/i.test(original)) return null;

  let path = original;
  let changed = false;

  // 1. Normalise casing (Google often has mixed-case legacy URLs).
  if (/[A-Z]/.test(path) && /^[A-Za-z0-9/_-]+$/.test(path)) {
    path = path.toLowerCase();
    changed = true;
  }

  // 2. Drop trailing slash.
  if (path.length > 1 && path.endsWith("/")) {
    path = path.replace(/\/+$/, "");
    changed = true;
  }

  // 3. Locale handling: /en/... has no prefix, ?lang=xx becomes a path prefix.
  let segments = path.split("/").filter(Boolean);
  let locale = "en";

  if (segments[0] === "en") {
    segments = segments.slice(1);
    changed = true;
  } else if (segments[0] && PREFIXED.includes(segments[0])) {
    locale = segments[0];
    segments = segments.slice(1);
  }

  const langParam = url.searchParams.get("lang");
  if (langParam) {
    url.searchParams.delete("lang");
    changed = true;
    if (LOCALES.includes(langParam) && locale === "en") {
      locale = langParam;
    }
  }

  let rest = `/${segments.join("/")}`;
  if (rest === "/") rest = "/";

  // 4a. Old filtered listing URLs -> the dedicated page for that filter (query dropped).
  if (rest === "/properties" || rest === "/property-for-sale-in-turkey") {
    const q = url.searchParams;
    const type = (q.get("type") || "").toLowerCase();
    const status = (q.get("status") || "").toLowerCase();
    const target =
      q.has("citizenship-eligible") ? "/turkish-citizenship-by-investment"
      : /villa/.test(type) ? "/luxury-villas-in-turkey"
      : /apartment|flat/.test(type) ? "/apartments-for-sale-in-turkey"
      : /off-?plan|construction/.test(status) ? "/off-plan-property-turkey"
      : null;
    if (target || rest === "/properties") {
      for (const k of ["type", "status", "citizenship-eligible"]) url.searchParams.delete(k);
      rest = target || "/property-for-sale-in-turkey";
      changed = true;
    }
  }

  // 4. Legacy single-page mappings.
  if (LEGACY_PATHS[rest]) {
    rest = LEGACY_PATHS[rest];
    changed = true;
  }

  // 5. Legacy listing URLs -> translated property segment for the locale.
  if (segments.length >= 2) {
    const [first, ...tail] = segments;
    const propertySegment = PATH_TRANSLATIONS[locale] || "property";

    if (LEGACY_PROPERTY_SEGMENTS.has(first)) {
      rest = `/${propertySegment}/${tail[tail.length - 1]}`;
      changed = true;
    } else if (first in PATH_TO_LANG && first !== propertySegment) {
      // Property segment in another language than the URL locale.
      rest = `/${propertySegment}/${tail[tail.length - 1]}`;
      changed = true;
    } else if ((first === "blog" || first === "news") && tail.length) {
      rest = `/articles/${tail[tail.length - 1]}`;
      changed = true;
    } else if (CITY_SEGMENTS.has(first) && tail.length) {
      // e.g. /antalya/apartments -> /antalya
      rest = `/${first}`;
      changed = true;
    }
  }

  if (!changed) return null;

  const target = localize(rest === "" ? "/" : rest, locale);
  const search = url.searchParams.toString();
  const finalUrl = `${url.origin}${target}${search ? `?${search}` : ""}`;
  if (finalUrl === `${url.origin}${original}${url.search}`) return null;
  return finalUrl;
}
