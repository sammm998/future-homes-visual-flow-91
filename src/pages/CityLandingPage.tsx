import React, { useMemo } from 'react';
import { Link, useLocation } from '@/lib/router-compat';
import Navigation from '@/components/Navigation';
import { EnhancedSEOHead } from '@/components/EnhancedSEOHead';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';
import FAQSchema from '@/components/FAQSchema';
import PropertyCard from '@/components/PropertyCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProperties } from '@/hooks/useProperties';
import { getCanonicalUrl, getHreflangUrls, getCurrentLanguage } from '@/utils/seoUtils';
import { stripLocale, localizePath } from '@/utils/localeRouting';
import type { CityLandingConfig } from '@/data/cityLandingPages';

interface CityLandingPageProps {
  config: CityLandingConfig;
}

const CityLandingPage: React.FC<CityLandingPageProps> = ({ config }) => {
  const location = useLocation();
  const lang = getCurrentLanguage();
  const { properties = [], loading } = useProperties() as any;

  const path = stripLocale(location.pathname);
  const canonical = getCanonicalUrl(path, lang);
  const hreflangAlternates = useMemo(
    () =>
      getHreflangUrls(path).reduce<Record<string, string>>((acc, item) => {
        acc[item.hreflang] = item.url;
        return acc;
      }, {}),
    [path]
  );

  const matches = useMemo(() => {
    const needles = config.locationMatch.map((m) => m.toLowerCase());
    return (properties as any[]).filter((p) => {
      const loc = `${p.location ?? ''} ${p.district ?? ''} ${p.city ?? ''}`.toLowerCase();
      return needles.some((n) => loc.includes(n));
    });
  }, [properties, config.locationMatch]);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: config.title,
    description: config.metaDescription,
    url: canonical,
    about: { '@type': 'Place', name: config.h1.replace(/^.*in /, '') },
    ...(matches.length > 0 && {
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: matches.length,
        itemListElement: matches.slice(0, 10).map((p: any, i: number) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: p.title,
        })),
      },
    }),
  };

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEOHead
        title={config.title}
        description={config.metaDescription}
        keywords={config.keywords}
        canonical={canonical}
        hreflangAlternates={hreflangAlternates}
        structuredData={structuredData}
      />
      <FAQSchema faqItems={config.faq} />
      <Navigation />

      <main className="container mx-auto px-4 py-10">
        <BreadcrumbNavigation
          items={[
            { name: config.country, url: localizePath('/property-for-sale-in-turkey', lang) },
            { name: config.h1, url: localizePath(`/${config.slug}`, lang) },
          ]}
        />

        <header className="max-w-3xl mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{config.h1}</h1>
          <p className="text-muted-foreground leading-relaxed">{config.intro}</p>
        </header>

        <section aria-labelledby="listings" className="mb-14">
          <h2 id="listings" className="text-2xl font-semibold mb-2">
            Available listings
          </h2>
          <p className="text-muted-foreground mb-6">
            {loading
              ? 'Loading current listings…'
              : matches.length > 0
              ? `${matches.length} ${matches.length === 1 ? 'property' : 'properties'} currently listed.`
              : 'No listings are published for this area right now — contact us and we will send matching options.'}
          </p>

          {matches.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {matches.slice(0, 12).map((property: any) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {!loading && matches.length === 0 && (
            <Button asChild>
              <Link to={localizePath('/contact-us', lang)}>Request matching properties</Link>
            </Button>
          )}
        </section>

        <section aria-labelledby="highlights" className="mb-14">
          <h2 id="highlights" className="text-2xl font-semibold mb-6">
            What to know before buying
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {config.highlights.map((h) => (
              <Card key={h.heading}>
                <CardHeader>
                  <CardTitle className="text-lg">{h.heading}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">{h.body}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="faq" className="mb-14">
          <h2 id="faq" className="text-2xl font-semibold mb-6">
            Frequently asked questions
          </h2>
          <div className="space-y-6 max-w-3xl">
            {config.faq.map((item) => (
              <div key={item.question}>
                <h3 className="font-semibold mb-1">{item.question}</h3>
                <p className="text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="related">
          <h2 id="related" className="text-2xl font-semibold mb-4">
            Related pages
          </h2>
          <ul className="flex flex-wrap gap-3">
            {config.related.map((r) => (
              <li key={r.to}>
                <Link
                  to={localizePath(r.to, lang)}
                  className="inline-block rounded-full border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default CityLandingPage;
