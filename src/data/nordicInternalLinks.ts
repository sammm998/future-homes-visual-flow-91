/**
 * Internal linking map: which Nordic keyword landing page each listing,
 * city and category page should link to, and with what anchor text.
 *
 * Anchor texts are keyword-optimised and varied per source page so the
 * same target does not always receive the identical anchor.
 */
import { NORDIC_LANDING_PAGES } from "./nordicLandingPages";

export interface NordicInternalLink {
  to: string;
  anchor: string;
  title: string;
}

type Locale = "sv" | "no" | "da";

/** slug -> anchor variants per locale (variant 0 = city context, 1 = category context, 2 = generic) */
const ANCHORS: Record<string, Record<Locale, string[]>> = {
  "kopa-lagenhet-turkiet": {
    sv: [
      "Köpa lägenhet i Turkiet – priser och process",
      "Guide: köpa lägenhet i Turkiet",
      "Köpa lägenhet i Turkiet",
    ],
    no: [], da: [],
  },
  "lagenhet-alanya": {
    sv: [
      "Lägenhet i Alanya till salu",
      "Nybyggda lägenheter i Alanya",
      "Lägenhet Alanya – priser per område",
    ],
    no: [], da: [],
  },
  "lagenhet-dubai": {
    sv: [
      "Lägenhet i Dubai till salu",
      "Köpa lägenhet i Dubai skattefritt",
      "Lägenhet Dubai – priser och avkastning",
    ],
    no: [], da: [],
  },
  "kjope-leilighet-tyrkia": {
    no: [
      "Kjøpe leilighet i Tyrkia – priser og prosess",
      "Guide: kjøpe leilighet i Tyrkia",
      "Kjøpe leilighet i Tyrkia",
    ],
    sv: [], da: [],
  },
  "leilighet-alanya": {
    no: [
      "Leilighet i Alanya til salgs",
      "Nybygde leiligheter i Alanya",
      "Leilighet Alanya – priser per område",
    ],
    sv: [], da: [],
  },
  "leilighet-dubai": {
    no: [
      "Leilighet i Dubai til salgs",
      "Kjøpe leilighet i Dubai skattefritt",
      "Leilighet Dubai – priser og avkastning",
    ],
    sv: [], da: [],
  },
  "kobe-lejlighed-tyrkiet": {
    da: [
      "Købe lejlighed i Tyrkiet – priser og proces",
      "Guide: købe lejlighed i Tyrkiet",
      "Købe lejlighed i Tyrkiet",
    ],
    sv: [], no: [],
  },
  "lejlighed-alanya": {
    da: [
      "Lejlighed i Alanya til salg",
      "Nybyggede lejligheder i Alanya",
      "Lejlighed Alanya – priser pr. område",
    ],
    sv: [], no: [],
  },
  "lejlighed-dubai": {
    da: [
      "Lejlighed i Dubai til salg",
      "Køb lejlighed i Dubai skattefrit",
      "Lejlighed Dubai – priser og afkast",
    ],
    sv: [], no: [],
  },
  "villa-bali": {
    sv: [
      "Villa på Bali till salu",
      "Köpa poolvilla på Bali",
      "Villa Bali – priser och avkastning",
    ],
    no: [
      "Villa på Bali til salgs",
      "Kjøpe bassengvilla på Bali",
      "Villa Bali – priser og avkastning",
    ],
    da: [
      "Villa på Bali til salg",
      "Køb poolvilla på Bali",
      "Villa Bali – priser og afkast",
    ],
  },
};

/** Locale-free source path (or prefix) -> target slugs, ordered by relevance. */
const LINK_MAP: { match: (path: string) => boolean; context: number; targets: Record<Locale, string[]> }[] = [
  {
    // Antalya / Alanya listings
    match: (p) => p === "/antalya" || p.startsWith("/antalya"),
    context: 0,
    targets: {
      sv: ["lagenhet-alanya", "kopa-lagenhet-turkiet"],
      no: ["leilighet-alanya", "kjope-leilighet-tyrkia"],
      da: ["lejlighed-alanya", "kobe-lejlighed-tyrkiet"],
    },
  },
  {
    match: (p) => p === "/istanbul" || p === "/mersin",
    context: 0,
    targets: {
      sv: ["kopa-lagenhet-turkiet", "lagenhet-alanya"],
      no: ["kjope-leilighet-tyrkia", "leilighet-alanya"],
      da: ["kobe-lejlighed-tyrkiet", "lejlighed-alanya"],
    },
  },
  {
    match: (p) => p === "/dubai",
    context: 0,
    targets: { sv: ["lagenhet-dubai"], no: ["leilighet-dubai"], da: ["lejlighed-dubai"] },
  },
  {
    match: (p) => p === "/bali",
    context: 0,
    targets: { sv: ["villa-bali"], no: ["villa-bali"], da: ["villa-bali"] },
  },
  {
    match: (p) => p === "/cyprus",
    context: 2,
    targets: {
      sv: ["kopa-lagenhet-turkiet"],
      no: ["kjope-leilighet-tyrkia"],
      da: ["kobe-lejlighed-tyrkiet"],
    },
  },
  {
    // Category / topic pages about Turkey
    match: (p) =>
      p === "/property-for-sale-in-turkey" ||
      p === "/apartments-for-sale-in-turkey" ||
      p === "/luxury-villas-in-turkey" ||
      p === "/off-plan-property-turkey" ||
      p === "/turkish-citizenship-by-investment",
    context: 1,
    targets: {
      sv: ["kopa-lagenhet-turkiet", "lagenhet-alanya"],
      no: ["kjope-leilighet-tyrkia", "leilighet-alanya"],
      da: ["kobe-lejlighed-tyrkiet", "lejlighed-alanya"],
    },
  },
  {
    // Property detail pages, gallery, map search, AI search -> full set
    match: (p) =>
      p.startsWith("/property/") ||
      /^\/[^/]+\/\d+$/.test(p) ||
      p === "/property-gallery" ||
      p === "/map-search" ||
      p === "/ai-property-search" ||
      p === "/property-wizard",
    context: 2,
    targets: {
      sv: ["kopa-lagenhet-turkiet", "lagenhet-alanya", "lagenhet-dubai", "villa-bali"],
      no: ["kjope-leilighet-tyrkia", "leilighet-alanya", "leilighet-dubai", "villa-bali"],
      da: ["kobe-lejlighed-tyrkiet", "lejlighed-alanya", "lejlighed-dubai", "villa-bali"],
    },
  },
  {
    // Home, contact and everything else that renders the SEO link block
    match: () => true,
    context: 2,
    targets: {
      sv: ["kopa-lagenhet-turkiet", "lagenhet-alanya", "lagenhet-dubai", "villa-bali"],
      no: ["kjope-leilighet-tyrkia", "leilighet-alanya", "leilighet-dubai", "villa-bali"],
      da: ["kobe-lejlighed-tyrkiet", "lejlighed-alanya", "lejlighed-dubai", "villa-bali"],
    },
  },
];

const isNordic = (locale: string): locale is Locale =>
  locale === "sv" || locale === "no" || locale === "da";

/**
 * Returns the Nordic landing pages that should be linked from the given
 * locale-free path, with context-optimised anchor text.
 * Returns [] for every non-Nordic language.
 */
export function getNordicInternalLinks(
  locale: string,
  cleanPath: string,
): NordicInternalLink[] {
  if (!isNordic(locale)) return [];
  const path = cleanPath.replace(/\/+$/, "") || "/";
  const rule = LINK_MAP.find((r) => r.match(path));
  if (!rule) return [];

  return rule.targets[locale]
    .filter((slug) => NORDIC_LANDING_PAGES.some((p) => p.locale === locale && p.slug === slug))
    // don't link a page to itself
    .filter((slug) => path !== `/${slug}` && !cleanPath.endsWith(`/${slug}`))
    .map((slug) => {
      const page = NORDIC_LANDING_PAGES.find((p) => p.locale === locale && p.slug === slug)!;
      const variants = ANCHORS[slug]?.[locale] ?? [];
      const anchor = variants[rule.context] || variants[0] || page.h1;
      return { to: `/${locale}/${slug}`, anchor, title: page.title };
    });
}

export const NORDIC_LINKS_HEADING: Record<Locale, string> = {
  sv: "Populära guider för svenska köpare",
  no: "Populære guider for norske kjøpere",
  da: "Populære guider til danske købere",
};

export const nordicLinksHeading = (locale: string) =>
  isNordic(locale) ? NORDIC_LINKS_HEADING[locale] : "";
