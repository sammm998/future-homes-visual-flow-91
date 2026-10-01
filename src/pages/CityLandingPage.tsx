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
import { EditorialCta, EditorialSectionHeader, PublicPageHero } from '@/components/PublicEditorial';
import antalyaImage from '@/assets/destinations/antalya-cinematic.jpg';
import istanbulImage from '@/assets/destinations/istanbul-cinematic.jpg';
import dubaiImage from '@/assets/destinations/dubai-cinematic.jpg';
import mersinImage from '@/assets/destinations/mersin-cinematic.jpg';
import cyprusImage from '@/assets/destinations/cyprus-cinematic.jpg';
import baliImage from '@/assets/destinations/bali-cinematic.jpg';

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

  const destinationImages: Record<string, string> = {
    antalya: antalyaImage,
    istanbul: istanbulImage,
    dubai: dubaiImage,
    mersin: mersinImage,
    cyprus: cyprusImage,
    bali: baliImage,
  };
  const heroImage = Object.entries(destinationImages).find(([key]) => config.slug.toLowerCase().includes(key))?.[1] ?? antalyaImage;

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

      <main>
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8"><BreadcrumbNavigation
          items={[
            { name: config.country, url: localizePath('/property-for-sale-in-turkey', lang) },
            { name: config.h1, url: localizePath(`/${config.slug}`, lang) },
          ]}
        /></div>

        <PublicPageHero eyebrow={`${config.country} · Property collection`} title={config.h1} description={config.intro} image={heroImage} imageAlt={config.h1} primaryLabel="View available homes" primaryTo="#listings" secondaryLabel="Request a private shortlist" secondaryTo={localizePath('/contact-us', lang)} compact />

        <section aria-labelledby="listings" className="mx-auto w-full max-w-[1840px] px-4 py-14 sm:px-6 lg:px-8 lg:py-24 2xl:px-10">
          <EditorialSectionHeader eyebrow="Curated portfolio" title="Available listings" />
          <p className="text-muted-foreground mb-6">
            {loading
              ? 'Loading current listings…'
              : matches.length > 0
              ? `${matches.length} ${matches.length === 1 ? 'property' : 'properties'} currently listed.`
              : 'No listings are published for this area right now — contact us and we will send matching options.'}
          </p>

          {matches.length > 0 && (
            <div className="grid gap-6 gap-y-10 md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
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

        <section aria-labelledby="highlights" className="bg-ivory py-14 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <EditorialSectionHeader eyebrow="Local intelligence" title="What to know before buying" />
          <div className="grid gap-6 md:grid-cols-3">
            {config.highlights.map((h) => (
              <Card key={h.heading} className="rounded-lg border-navy/10 bg-background transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-luxe)]">
                <CardHeader>
                  <CardTitle className="text-lg">{h.heading}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">{h.body}</CardContent>
              </Card>
            ))}
          </div>
          </div>
        </section>

        <section aria-labelledby="faq" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-24">
          <EditorialSectionHeader eyebrow="Buyer guidance" title="Frequently asked questions" />
          <div className="grid gap-8 md:grid-cols-2">
            {config.faq.map((item) => (
              <div key={item.question} className="border-t border-gold/50 pt-5">
                <h3 className="mb-2 font-semibold">{item.question}</h3>
                <p className="text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="related" className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
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
        <EditorialCta eyebrow="Private property search" title="Receive a shortlist built around you" description="Our local advisors can match your lifestyle, budget and investment goals with current opportunities." primaryLabel="Start Easy Find" primaryTo={localizePath('/ai-property-search', lang)} secondaryLabel="Contact an advisor" secondaryTo={localizePath('/contact-us', lang)} />
      </main>
    </div>
  );
};

export default CityLandingPage;
