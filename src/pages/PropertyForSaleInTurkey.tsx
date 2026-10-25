import { OfficialSources, CITIZENSHIP_SOURCES } from '@/components/OfficialSources';
import React from 'react';
import Navigation from '@/components/Navigation';
import { EnhancedSEOHead } from '@/components/EnhancedSEOHead';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';
import FAQSchema from '@/components/FAQSchema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, MapPin, Home, TrendingUp, Shield, Star, Users } from 'lucide-react';
import { Link } from '@/lib/router-compat';
import NordicRelatedLinks from '@/components/NordicRelatedLinks';
import { EditorialCta, EditorialSectionHeader, PublicPageHero } from '@/components/PublicEditorial';
import turkeyHero from '@/assets/destinations/antalya-cinematic.webp';
import istanbulImage from '@/assets/destinations/istanbul-cinematic.webp';
import mersinImage from '@/assets/destinations/mersin-cinematic.webp';

const PropertyForSaleInTurkey = () => {
  const faqItems = [
    {
      question: "Can foreigners buy property in Turkey?",
      answer: "Yes, foreigners can buy freehold property in Turkey under current laws. There are some restrictions on certain border areas and military zones, but most residential and commercial properties are available for foreign ownership."
    },
    {
      question: "What are the property purchase taxes in Turkey?",
      answer: "Property purchase taxes in Turkey include approximately 4% title deed tax, plus notary fees, valuation costs, and legal fees. The total additional costs typically range from 5-7% of the property value."
    },
    {
      question: "Is Turkish citizenship available through property investment?",
      answer: "Yes, Turkey offers citizenship through property investment. You need to purchase property worth at least $400,000 and hold it for a minimum of 3 years. The process typically takes 3-6 months."
    },
    {
      question: "What are the best areas to buy property in Turkey?",
      answer: "Popular areas include Antalya (beaches and tourism), Istanbul (business hub), Alanya (retirement and investment), Bodrum (luxury and lifestyle), and Mersin (emerging market with good value)."
    },
    {
      question: "What is the average ROI for rental properties in Turkey?",
      answer: "Rental yields in Turkey typically range from 5-8% annually, depending on location and property type. Tourist areas like Antalya and Alanya often provide higher yields during peak seasons."
    }
  ];

  const propertyTypes = [
    {
      title: "Luxury Apartments",
      description: "Modern apartments with sea views and premium amenities",
      icon: Home,
      link: "/apartments-for-sale-in-turkey",
      priceRange: "€85,000 - €500,000"
    },
    {
      title: "Premium Villas",
      description: "Private villas with pools and gardens",
      icon: Star,
      link: "/luxury-villas-in-turkey",
      priceRange: "€200,000 - €2,000,000"
    },
    {
      title: "Investment Properties",
      description: "High-yield rental properties and off-plan developments",
      icon: TrendingUp,
      link: "/off-plan-property-turkey",
      priceRange: "€65,000 - €300,000"
    }
  ];

  const locations = [
    {
      name: "Antalya",
      description: "Turkey's tourism capital with beautiful beaches",
      properties: "500+ properties",
      link: "/antalya"
    },
    {
      name: "Alanya",
      description: "Popular expat destination with great weather",
      properties: "300+ properties",
      link: "/alanya-property-for-sale"
    },
    {
      name: "Mersin",
      description: "Emerging market with excellent value",
      properties: "200+ properties",
      link: "/mersin"
    }
  ];

  const locationImages: Record<string, string> = {
    Antalya: turkeyHero,
    Alanya: istanbulImage,
    Mersin: mersinImage,
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Property for Sale in Turkey",
    "description": "Discover premium properties for sale in Turkey. Luxury villas, apartments & investment opportunities in Antalya, Alanya, Mersin. Expert guidance included.",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://futurehomesturkey.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Property for Sale in Turkey"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEOHead
        title="Property for Sale in Turkey | Houses, Villas & Apartments — Future Homes"
        description="Property for sale in Turkey from leading agents. Houses, villas and apartments in Antalya, Istanbul, Alanya & Mersin with citizenship by investment options."
        keywords={['property for sale in turkey', 'turkey property', 'turkish property for sale', 'houses for sale in turkey', 'property in turkey', 'real estate turkey', 'buy property in turkey']}
        canonical="https://futurehomesinternational.com/property-for-sale-in-turkey"
        structuredData={structuredData}
      />
      
      <Navigation />
      
      <main>
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8"><BreadcrumbNavigation 
          items={[
            { name: 'Property for Sale in Turkey', url: '/property-for-sale-in-turkey' }
          ]}
        /></div>

        <PublicPageHero eyebrow="Future Homes Turkey collection" title="Property for Sale in Turkey" description="Discover premium properties in Turkey's most desirable locations, from beachfront residences to modern city apartments, with private guidance from our local team." image={turkeyHero} imageAlt="Luxury coastal property in Turkey" primaryLabel="View all properties" primaryTo="/property-gallery" secondaryLabel="Get expert advice" secondaryTo="/contact-us" compact />

        {/* Key Benefits */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <EditorialSectionHeader eyebrow="A confident purchase" title="Why Buy Property in Turkey?" description="Clear ownership, international demand and multiple lifestyle markets make Turkey a compelling long-term choice." />
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="rounded-lg border-navy/10 bg-background transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-luxe)]">
              <CardHeader>
                <Shield className="mb-4 h-10 w-10 text-gold-foreground" />
                <CardTitle>Secure Investment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Turkey offers stable property laws for foreign investors with clear ownership rights and legal protection.
                </p>
              </CardContent>
            </Card>
            
            <Card className="rounded-lg border-navy/10 bg-background transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-luxe)]">
              <CardHeader>
                <TrendingUp className="mb-4 h-10 w-10 text-gold-foreground" />
                <CardTitle>High ROI Potential</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Average rental yields of 5-8% annually with strong capital appreciation in prime tourist areas.
                </p>
              </CardContent>
            </Card>
            
            <Card className="rounded-lg border-navy/10 bg-background transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-luxe)]">
              <CardHeader>
                <Users className="mb-4 h-10 w-10 text-gold-foreground" />
                <CardTitle>Citizenship Path</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Qualify for Turkish citizenship with property investment of $400,000+ held for 3 years.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Property Types */}
        <section className="bg-ivory py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <EditorialSectionHeader eyebrow="Curated collections" title="Property Types Available" />
          <div className="grid md:grid-cols-3 gap-8">
            {propertyTypes.map((type, index) => (
              <Card key={index} className="rounded-lg border-navy/10 bg-background transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-luxe)]">
                <CardHeader>
                  <type.icon className="mb-4 h-10 w-10 text-gold-foreground" />
                  <CardTitle>{type.title}</CardTitle>
                  <p className="text-sm text-primary font-medium">{type.priceRange}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{type.description}</p>
                  <Button asChild className="w-full">
                    <Link to={type.link}>Explore {type.title}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div></div>
        </section>

        {/* Popular Locations */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <EditorialSectionHeader eyebrow="Destination portfolio" title="Popular Locations" />
          <div className="grid md:grid-cols-3 gap-8">
            {locations.map((location, index) => (
              <Link key={index} to={location.link} className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-navy shadow-sm">
                <img src={locationImages[location.name]} alt={location.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-navy-foreground">
                  <div><p className="mb-2 text-xs uppercase text-gold">{location.properties}</p><h3 className="text-2xl font-semibold">{location.name}</h3><p className="mt-2 text-sm text-navy-foreground/70">{location.description}</p></div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy-foreground text-navy transition-colors group-hover:bg-gold"><ArrowRight className="h-4 w-4" /></span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Buying Process */}
        <section className="bg-ivory py-16 lg:py-24">
          <div className="max-w-4xl mx-auto">
            <EditorialSectionHeader eyebrow="From search to ownership" title="Property Buying Process for Foreigners" align="center" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy font-semibold text-navy-foreground">1</div>
                  <div>
                    <h3 className="font-semibold mb-2">Property Selection</h3>
                    <p className="text-muted-foreground">Browse our portfolio and select properties that match your criteria and budget.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy font-semibold text-navy-foreground">2</div>
                  <div>
                    <h3 className="font-semibold mb-2">Legal Documentation</h3>
                    <p className="text-muted-foreground">We handle all legal paperwork including title deed checks and contract preparation.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy font-semibold text-navy-foreground">3</div>
                  <div>
                    <h3 className="font-semibold mb-2">Payment & Transfer</h3>
                    <p className="text-muted-foreground">Secure payment processing and official property transfer at the land registry office.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="rounded-lg border border-navy/10 bg-background p-7 shadow-sm">
                  <h3 className="font-semibold mb-4">What's Included:</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    {['Free property consultation','Legal due diligence','Translation services','Bank account opening assistance','Property management services','After-sales support'].map((item) => <li key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-gold-foreground" />{item}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-4xl mx-auto">
            <EditorialSectionHeader eyebrow="Buyer guidance" title="Frequently Asked Questions" align="center" />
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <Card key={index} className="rounded-lg border-navy/10 shadow-none">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <OfficialSources />
          </div>
        </section>

        <EditorialCta eyebrow="Private property search" title="Ready to find your dream property?" description="Get expert guidance from our experienced team and discover the right investment opportunity in Turkey." primaryLabel="Start Easy Find" primaryTo="/ai-property-search" secondaryLabel="Contact an expert" secondaryTo="/contact-us" />
      </main>

      <FAQSchema faqItems={faqItems} />
    <NordicRelatedLinks className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8" />
      </div>
  );
};

export default PropertyForSaleInTurkey;