import React, { useMemo } from 'react';
import Navigation from '@/components/Navigation';
import { EnhancedSEOHead } from '@/components/EnhancedSEOHead';
import FAQSchema from '@/components/FAQSchema';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@/lib/router-compat';
import { useProperties } from '@/hooks/useProperties';
import { localizePath } from '@/utils/localeRouting';
import { NORDIC_LANDING_PAGES, type NordicLandingPage as NordicPage } from '@/data/nordicLandingPages';

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

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEOHead
        title={page.title}
        description={page.description}
        keywords={page.keywords}
        canonical={canonicalPath}
        structuredData={structuredData}
      />
      <FAQSchema faqItems={page.faq} />
      <Navigation />

      <main>
        {/* Hero */}
        <section className="bg-primary/5 border-b border-border">
          <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
            <p className="text-sm font-medium uppercase tracking-widest text-primary mb-4">
              Future Homes International
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-5">
              {page.h1}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">{page.heroSubtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to={localizePath('/contact-us', page.locale)}>{page.ctaButton}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to={localizePath(page.listingsPath, page.locale)}>{page.listingsCta}</Link>
              </Button>
            </div>
          </div>
        </section>

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
        <section className="container mx-auto px-4 pb-14 max-w-5xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {page.highlights.map((item) => (
              <Card key={item.title} className="h-full">
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
        <section className="bg-muted/40 border-y border-border">
          <div className="container mx-auto px-4 py-14 max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              {page.listingsTitle}
            </h2>
            {loading ? (
              <div className="grid gap-8 sm:grid-cols-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-72 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2">
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

        {/* CTA */}
        <section className="bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 py-14 max-w-4xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{page.ctaTitle}</h2>
            <p className="text-primary-foreground/80 mb-6">{page.ctaText}</p>
            <Button asChild size="lg" variant="secondary">
              <Link to={localizePath('/contact-us', page.locale)}>{page.ctaButton}</Link>
            </Button>
          </div>
        </section>

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
