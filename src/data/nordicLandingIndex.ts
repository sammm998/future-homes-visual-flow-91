/**
 * Lightweight index of the Nordic keyword landing pages (locale, slug, meta,
 * destination). Internal-link blocks and hreflang use this instead of the full
 * page copy in nordicLandingPages.ts, which would otherwise ship ~50 kB of
 * text to every page. tests/nordicLandingIndex.test.ts keeps both in sync.
 */
export interface NordicLandingIndexEntry {
  locale: "sv" | "no" | "da";
  slug: string;
  title: string;
  description: string;
  /** Locale-free listing page of the destination (same value = same topic). */
  listingsPath: string;
}

export const NORDIC_LANDING_INDEX: NordicLandingIndexEntry[] = [
  { locale: "sv", slug: "kopa-lagenhet-turkiet", title: "Köpa Lägenhet i Turkiet 2026 | Priser & Guide", description: "Köpa lägenhet i Turkiet från 75 000 €. Svensktalande mäklare, trygg process, uppehållstillstånd och hyresavkastning på 6–8 % i Alanya och Antalya.", listingsPath: "/property-for-sale-in-turkey" },
  { locale: "sv", slug: "lagenhet-alanya", title: "Lägenhet Alanya Till Salu | Priser från 75 000 €", description: "Lägenhet i Alanya till salu från 75 000 €. Nybyggt vid stranden i Mahmutlar, Oba och Cleopatra – svensk rådgivning, TAPU på 2–6 veckor.", listingsPath: "/antalya" },
  { locale: "sv", slug: "lagenhet-dubai", title: "Lägenhet Dubai Till Salu | Köpa Bostad Skattefritt", description: "Köp lägenhet i Dubai från 190 000 €. 0 % fastighetsskatt, 6–9 % hyresavkastning, betalplaner och golden visa – svensk rådgivning på plats.", listingsPath: "/dubai" },
  { locale: "sv", slug: "villa-bali", title: "Villa Bali Till Salu | Köpa Villa med Pool på Bali", description: "Villa på Bali till salu från 180 000 €. Poolvillor i Canggu, Ubud och Uluwatu med 10–15 % avkastning och full uthyrningsförvaltning.", listingsPath: "/bali" },
  { locale: "no", slug: "kjope-leilighet-tyrkia", title: "Kjøpe Leilighet i Tyrkia 2026 | Priser & Guide", description: "Kjøpe leilighet i Tyrkia fra 75 000 €. Norsktalende rådgivning, trygg TAPU-prosess, oppholdstillatelse og 6–8 % leieavkastning i Alanya og Antalya.", listingsPath: "/property-for-sale-in-turkey" },
  { locale: "no", slug: "leilighet-alanya", title: "Leilighet Alanya Til Salgs | Priser fra 75 000 €", description: "Leilighet i Alanya til salgs fra 75 000 €. Nybygg ved stranden i Mahmutlar, Oba og Cleopatra – skandinavisk rådgivning og TAPU på 2–6 uker.", listingsPath: "/antalya" },
  { locale: "no", slug: "villa-bali", title: "Villa Bali Til Salgs | Kjøpe Villa med Basseng", description: "Villa på Bali til salgs fra 180 000 €. Bassengvillaer i Canggu, Ubud og Uluwatu med 10–15 % avkastning og full utleieforvaltning.", listingsPath: "/bali" },
  { locale: "no", slug: "leilighet-dubai", title: "Leilighet Dubai Til Salgs | Kjøpe Bolig Skattefritt", description: "Kjøp leilighet i Dubai fra 190 000 €. 0 % eiendomsskatt, 6–9 % leieavkastning, betalingsplan og golden visa – skandinavisk rådgivning.", listingsPath: "/dubai" },
  { locale: "da", slug: "kobe-lejlighed-tyrkiet", title: "Købe Lejlighed i Tyrkiet 2026 | Priser & Guide", description: "Køb lejlighed i Tyrkiet fra 75.000 €. Skandinavisk rådgivning, tryg TAPU-proces, opholdstilladelse og 6–8 % lejeafkast i Alanya og Antalya.", listingsPath: "/property-for-sale-in-turkey" },
  { locale: "da", slug: "lejlighed-alanya", title: "Lejlighed Alanya Til Salg | Priser fra 75.000 €", description: "Lejlighed i Alanya til salg fra 75.000 €. Nybyggeri ved stranden i Mahmutlar, Oba og Cleopatra – skandinavisk rådgivning og TAPU på 2–6 uger.", listingsPath: "/antalya" },
  { locale: "da", slug: "villa-bali", title: "Villa Bali Til Salg | Køb Villa med Pool på Bali", description: "Villa på Bali til salg fra 180.000 €. Poolvillaer i Canggu, Ubud og Uluwatu med 10–15 % afkast og fuld udlejningsadministration.", listingsPath: "/bali" },
  { locale: "da", slug: "lejlighed-dubai", title: "Lejlighed Dubai Til Salg | Køb Bolig Skattefrit", description: "Køb lejlighed i Dubai fra 190.000 €. 0 % ejendomsskat, 6–9 % lejeafkast, betalingsplan og golden visa – skandinavisk rådgivning på stedet.", listingsPath: "/dubai" },
];

/**
 * Absolute URLs of the same topic in every Nordic language, used for
 * reciprocal hreflang on the landing pages and in the sitemap.
 */
export const nordicAlternates = (page: { listingsPath: string }): Record<string, string> =>
  Object.fromEntries(
    NORDIC_LANDING_INDEX.filter((p) => p.listingsPath === page.listingsPath).map((p) => [
      p.locale,
      `https://futurehomesinternational.com/${p.locale}/${p.slug}`,
    ]),
  );

export const getNordicIndexEntry = (locale: string, slug: string) =>
  NORDIC_LANDING_INDEX.find((p) => p.locale === locale && p.slug === slug);

const OG_LOCALE = { sv: "sv_SE", no: "nb_NO", da: "da_DK" } as const;

/** head() payload for a Nordic landing route; reciprocal hreflang across sv/no/da. */
export function nordicRouteHead(locale: string, slug: string) {
  const page = getNordicIndexEntry(locale, slug);
  if (!page) return {};
  const url = `https://futurehomesinternational.com/${page.locale}/${page.slug}`;
  return {
    meta: [
      { title: page.title },
      { name: "description", content: page.description },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:title", content: page.title },
      { property: "og:description", content: page.description },
      { property: "og:image", content: "https://futurehomesinternational.com/og-image.jpg" },
      { property: "og:locale", content: OG_LOCALE[page.locale] },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: url },
      ...Object.entries(nordicAlternates(page)).map(([hreflang, href]) => ({ rel: "alternate", hrefLang: hreflang, href })),
    ],
  };
}
