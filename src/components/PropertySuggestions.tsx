import { useMemo } from 'react';
import { Link } from '@/lib/router-compat';
import PropertyCard from './PropertyCard';
import { Skeleton } from './ui/skeleton';
import { useProperties } from '@/hooks/useProperties';
import { localizePath } from '@/utils/localeRouting';
import { getCurrentLanguage } from '@/utils/seoUtils';

const CITIES = ['antalya', 'istanbul', 'dubai', 'cyprus', 'mersin', 'bali'] as const;

interface PropertySuggestionsProps {
  /** Prefer listings from this city when we can guess one */
  preferLocation?: string | null;
  heading: string;
  limit?: number;
}

/**
 * Shown whenever a visitor lands on a listing that no longer exists, so they
 * always see available properties instead of a dead end.
 */
const PropertySuggestions = ({ preferLocation, heading, limit = 8 }: PropertySuggestionsProps) => {
  const { properties, loading } = useProperties();
  const lang = getCurrentLanguage() || 'en';

  const suggestions = useMemo(() => {
    if (!properties?.length) return [];
    const target = preferLocation?.toLowerCase().trim();
    const matches = target
      ? properties.filter((p: any) => (p.location || '').toLowerCase().includes(target))
      : [];
    const rest = properties.filter((p: any) => !matches.includes(p));
    return [...matches, ...rest].slice(0, limit);
  }, [properties, preferLocation, limit]);

  return (
    <section className="py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">{heading}</h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {suggestions.map((property: any) => (
            <PropertyCard
              key={property.id}
              property={{ ...property, area: property.sizes_m2 || '', refNo: property.ref_no }}
            />
          ))}
        </div>
      )}

      <nav className="flex flex-wrap justify-center gap-3 mt-10" aria-label="Browse by city">
        {CITIES.map((city) => (
          <Link
            key={city}
            to={localizePath(`/${city}`, lang)}
            className="px-5 py-2 rounded-full border border-border bg-background hover:bg-primary/10 hover:border-primary/50 font-medium capitalize transition-colors"
          >
            {city}
          </Link>
        ))}
      </nav>
    </section>
  );
};

export default PropertySuggestions;
