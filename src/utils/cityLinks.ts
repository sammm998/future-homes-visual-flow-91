// Maps a city name to an existing route. Several pages used to build links as
// `/${city.toLowerCase()}`, which produced 404s for cities without a dedicated
// route (e.g. /alanya, /kalkan, /bodrum).

const CITY_ROUTES: Record<string, string> = {
  antalya: '/antalya',
  istanbul: '/istanbul',
  mersin: '/mersin',
  dubai: '/dubai',
  bali: '/bali',
  cyprus: '/cyprus',
  // Cities without a dedicated route fall back to the Turkey hub page.
  alanya: '/property-for-sale-in-turkey',
  kalkan: '/property-for-sale-in-turkey',
  belek: '/property-for-sale-in-turkey',
};

/** Returns a valid internal route for a city, falling back to the Turkey hub. */
export const getCityPath = (city: string): string =>
  CITY_ROUTES[city.trim().toLowerCase()] ?? '/property-for-sale-in-turkey';
