import React, { useMemo } from 'react';
import Navigation from '@/components/Navigation';
import FAQSchema from '@/components/FAQSchema';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@/lib/router-compat';
import { useProperties } from '@/hooks/useProperties';
import { localizePath } from '@/utils/localeRouting';
import { NORDIC_LANDING_PAGES, type NordicLandingPage as NordicPage } from '@/data/nordicLandingPages';
import { EditorialCta, EditorialSectionHeader, PublicPageHero } from '@/components/PublicEditorial';
import antalyaImage from '@/assets/destinations/antalya-cinematic.webp';
import dubaiImage from '@/assets/destinations/dubai-cinematic.webp';
import baliImage from '@/assets/destinations/bali-cinematic.webp';

interface Props {
  page: NordicPage;
}

const NordicLandingPage: React.FC<Props> = ({ page }) => {
  const { properties, loading } = useProperties();
  const canonicalPath = `/${page.locale}/${page.slug}`;

  const featured = useMemo(() => {
    const needle = page.locationFilter.toLowerCase();
    const matches = (properties as any[]).filter((p) => {
      const loc = `${p.location || ''} ${p.district || ''} ${p.country || ''}`.toLowerCase();
      if (needle === 'turkey') {
        return /turkey|türkiye|antalya|alanya|mersin|istanbul/.test(loc);
      }
      return loc.includes(needle);
    });

    const unique = matches.reduce((acc: Record<string, any>, p: any) => {
      acc[p.ref_no || p.id] = p;
      return acc;
    }, {});

    return (Object.values(unique) as any[])
      .sort((a, b) => parseInt(b.ref_no || '0') - parseInt(a.ref_no || '0'))
      .slice(0, 6)
      .map((p: any) => ({
        id: p.id,
        refNo: p.ref_no,
        ref_no: p.ref_no,
        slug: p.slug,
        slug_sv: p.slug_sv,
        slug_no: p.slug_no,
        slug_da: p.slug_da,
        title: p.title,
        location: p.location,
        price: p.price,
        buyer_fee_percent: p.buyer_fee_percent,
        bedrooms: p.bedrooms || '',
        bathrooms: p.bathrooms || '',
        area: p.sizes_m2 || '',
        status: p.status || 'available',
        image: p.property_image || (p.property_images && p.property_images[0]) || '',
        property_images: p.property_images || [],
      }));
  }, [properties, page.locationFilter]);

  const siblings = NORDIC_LANDING_PAGES.filter(
    (p) => p.locale === page.locale && p.slug !== page.slug,
  );

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    inLanguage: page.locale,
    url: `https://futurehomesinternational.com${canonicalPath}`,
    about: page.keywords,
    provider: {
      '@type': 'RealEstateAgent',
      name: 'Future Homes International',
      url: 'https://futurehomesinternational.com',
    },
  };
  const heroImage = page.locationFilter.toLowerCase().includes('dubai')
    ? dubaiImage
    : page.locationFilter.toLowerCase().includes('bali')
      ? baliImage
      : antalyaImage;

  return (
    <div className="min-h-screen bg-background">
      {/* Title, description and canonical come from the route head() */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <FAQSchema faqItems={page.faq} />
      <Navigation />

      <main>
        <PublicPageHero eyebrow="Future Homes International" title={page.h1} description={page.heroSubtitle} image={heroImage} imageAlt={page.h1} primaryLabel={page.listingsCta} primaryTo={localizePath(page.listingsPath, page.locale)} secondaryLabel={page.ctaButton} secondaryTo={localizePath('/contact-us', page.locale)} compact />

        {/* Intro */}
        <section className="container mx-auto px-4 py-14 max-w-4xl">
          <div className="space-y-5">
            {page.intro.map((paragraph, i) => (
              <p key={i} className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Highlights */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <EditorialSectionHeader eyebrow="Local intelligence" title={page.sections[0]?.heading || page.h1} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {page.highlights.map((item) => (
              <Card key={item.title} className="h-full rounded-lg border-navy/10 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-luxe)]">
                <CardContent className="p-5">
                  <p className="text-lg font-semibold text-foreground mb-1">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Content sections */}
        <section className="container mx-auto px-4 pb-14 max-w-4xl">
          <div className="space-y-10">
            {page.sections.map((section) => (
              <article key={section.heading}>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  {section.heading}
                </h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {section.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Listings */}
        <section className="border-y border-border bg-ivory">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <EditorialSectionHeader eyebrow="Curated portfolio" title={page.listingsTitle} />
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-72 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((property, index) => (
                  <PropertyCard key={property.id} property={property} priority={index < 3} />
                ))}
              </div>
            )}
            <div className="mt-8">
              <Button asChild variant="outline">
                <Link to={localizePath(page.listingsPath, page.locale)}>{page.listingsCta}</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 py-14 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">FAQ</h2>
          <div className="space-y-6">
            {page.faq.map((item) => (
              <div key={item.question}>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <EditorialCta eyebrow="Private advisory" title={page.ctaTitle} description={page.ctaText} primaryLabel={page.ctaButton} primaryTo={localizePath('/contact-us', page.locale)} secondaryLabel={page.listingsCta} secondaryTo={localizePath(page.listingsPath, page.locale)} />

        {/* Internal links */}
        {siblings.length > 0 && (
          <section className="container mx-auto px-4 py-12 max-w-5xl">
            <h2 className="text-xl font-semibold text-foreground mb-4">{page.relatedLabel}</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {siblings.map((sibling) => (
                <li key={sibling.slug}>
                  <Link
                    to={`/${sibling.locale}/${sibling.slug}`}
                    className="text-primary hover:underline"
                  >
                    {sibling.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
};

export default NordicLandingPage;
