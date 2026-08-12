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
  alanya: '/alanya-property-for-sale',
  kalkan: '/kalkan-property-for-sale',
  belek: '/belek-property-for-sale',
};

/** Returns a valid internal route for a city, falling back to the Turkey hub. */
export const getCityPath = (city: string): string =>
  CITY_ROUTES[city.trim().toLowerCase()] ?? '/property-for-sale-in-turkey';
