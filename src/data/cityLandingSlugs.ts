/**
 * Slugs of the English keyword city landing pages (full copy lives in
 * cityLandingPages.ts). Route guards and head() only need to know whether a
 * slug exists, so they use this list and the page copy loads with the page.
 * tests/cityLandingSlugs.test.ts keeps it in sync.
 */
export const CITY_LANDING_SLUGS = [
  "alanya-property-for-sale",
  "belek-property-for-sale",
  "kalkan-property-for-sale",
  "dubai-off-plan-property",
  "bali-villas-for-sale",
] as const;

export const isCityLandingSlug = (slug: string): boolean => (CITY_LANDING_SLUGS as readonly string[]).includes(slug);
