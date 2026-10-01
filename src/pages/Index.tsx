import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import { useTranslation } from "@/hooks/useTranslation";
import SEOInternalLinks from "@/components/SEOInternalLinks";
import DeferredSection from "@/components/DeferredSection";
import SEOHead from "@/components/SEOHead";
import { useSEO } from "@/hooks/useSEO";
import { useSEOLanguage } from "@/hooks/useSEOLanguage";
import OrganizationSchema from "@/components/OrganizationSchema";
import { lazy, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCanonicalUrl } from "@/hooks/useCanonicalUrl";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { ContentSection } from "@/components/ContentSection";
import aliKaranImage from "@/assets/ali-karan-founder.webp";
import ConversionBand from "@/components/ConversionBand";

// Below-the-fold sections: downloaded only when the user scrolls near them.
const FeatureDemo = lazy(() => import("@/components/ui/feature-demo").then(m => ({ default: m.FeatureDemo })));
const InteractiveSelector = lazy(() => import("@/components/ui/interactive-selector"));
const ShuffleGrid = lazy(() => import("@/components/ShuffleGrid"));
const RollingTestimonialsSection = lazy(() => import("@/components/RollingTestimonialsSection"));
const FounderSection = lazy(() => import("@/components/FounderSection"));
const TeamSection = lazy(() => import("@/components/TeamSection"));
const NewsInsights = lazy(() => import("@/components/NewsInsights"));
const PropertyListingSection = lazy(() => import("@/components/PropertyListingSection"));

const Index = () => {
  const { t } = useTranslation();
  const {
    canonicalUrl,
    hreflangUrls
  } = useSEOLanguage();
  const {
    structuredData
  } = useSEO();
  const currentCanonicalUrl = useCanonicalUrl();
  const [showPopup, setShowPopup] = useState(false);
  // Removed sync import - database-only approach
  const {
    pageTitle,
    metaDescription,
    contentSections,
    heroTitle,
    heroSubtitle,
    isLoading: contentLoading
  } = useWebsiteContent();

  // Auto-sync removed - now using database-only approach

  // Delay popup to improve perceived performance - increased to reduce impact
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 60000); // Increased to 60 seconds to minimize initial load impact

    return () => clearTimeout(timer);
  }, []);

  // Property gallery images for zoom parallax effect
  const propertyGalleryImages = [{
    src: 'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/rl9q4mj1esj.jpg',
    alt: 'Luxury apartment interior'
  }, {
    src: 'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/3n142jndva3.jpg',
    alt: 'Modern living room'
  }, {
    src: 'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/bkr7jnjl6tj.jpg',
    alt: 'Apartment bedroom'
  }, {
    src: 'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/wkf3muk8mf.jpg',
    alt: 'Kitchen and dining area'
  }, {
    src: 'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/ssml6o436x.jpg',
    alt: 'Balcony with city view'
  }, {
    src: 'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/tttyz3px5ue.jpeg',
    alt: 'Swimming pool area'
  }, {
    src: 'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/ani9abmbtg.jpg',
    alt: 'Building exterior'
  }];
  const homePageStructuredData = {
    "@context": "https://schema.org",
    "@type": ["WebSite", "RealEstateAgent", "Organization"],
    "name": "Future Homes International",
    "alternateName": "Future Homes International Real Estate",
    "url": "https://futurehomesinternational.com",
    "logo": "https://futurehomesinternational.com/favicon-512x512.png",
    "description": "Leading international real estate agency specializing in premium properties across Turkey, UAE, Cyprus, and Bali. Expert guidance for property investment, citizenship programs, and luxury overseas real estate.",
    "sameAs": ["https://www.facebook.com/futurehomesturkey", "https://www.instagram.com/futurehomesturkey", "https://www.linkedin.com/company/futurehomesturkey", "https://twitter.com/futurehomestr"],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+90-242-000-0000",
      "contactType": "customer service",
      "email": "info@futurehomesinternational.com",
      "availableLanguage": ["English", "Turkish", "Arabic", "Russian"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TR",
      "addressRegion": "Antalya",
      "addressLocality": "Antalya"
    },
    "service": [{
      "@type": "Service",
      "name": "International Real Estate Sales",
      "description": "Luxury property sales in Turkey, UAE, Cyprus, and Bali"
    }, {
      "@type": "Service",
      "name": "Property Investment Consulting",
      "description": "Expert advice on overseas property investment opportunities"
    }, {
      "@type": "Service",
      "name": "Citizenship by Investment Programs",
      "description": "Turkish and Cyprus citizenship through real estate investment"
    }],
    "areaServed": [{
      "@type": "Country",
      "name": "Turkey"
    }, {
      "@type": "Country",
      "name": "United Arab Emirates"
    }, {
      "@type": "Country",
      "name": "Cyprus"
    }, {
      "@type": "Country",
      "name": "Indonesia"
    }],
    "priceRange": "€100,000 - €5,000,000+"
  };
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "Can foreigners buy property internationally?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, most countries welcome foreign property investors with varying restrictions. Popular destinations like Turkey, UAE, Cyprus, and Portugal offer excellent opportunities for international buyers with proper legal frameworks."
      }
    }, {
      "@type": "Question",
      "name": "What are typical costs when buying property abroad?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "International property purchase costs vary by country but typically range from 4-10% of property value, including taxes, legal fees, translation costs, and administrative expenses. Dubai charges 4% registration fee, while European countries may charge 6-10% total costs."
      }
    }, {
      "@type": "Question",
      "name": "Which countries offer citizenship through property investment?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Several countries offer citizenship or residency through property investment: Turkey ($400k minimum), Cyprus (€2M), Portugal (€280k for Golden Visa), Caribbean nations ($200k+), and various other programs with different investment thresholds."
      }
    }, {
      "@type": "Question",
      "name": "Do I need a lawyer when buying property internationally?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "While not always legally required, hiring a local lawyer is highly recommended for international property purchases. They ensure compliance with local laws, handle documentation, and protect your interests throughout the transaction process."
      }
    }, {
      "@type": "Question",
      "name": "What ongoing costs should I expect with international property?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Annual costs vary by location but typically include property taxes (0.1-1.5%), insurance, maintenance fees for complexes, utilities, and property management fees if renting out. Some countries like UAE have no income tax, while others have rental income taxes."
      }
    }, {
      "@type": "Question",
      "name": "How do payment plans work for international property purchases?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Many international developers offer flexible payment plans, especially for off-plan properties. Typical plans involve 20-30% down payment, installments during construction (12-36 months), and final payment upon completion. Some offer interest-free terms."
      }
    }]
  };
  return <div className="min-h-screen overflow-x-clip">
      {/* Preload the LCP hero image (responsive) */}
      <link
        rel="preload"
        as="image"
        href="/lovable-uploads/hero-antalya-1200.webp"
        imageSrcSet="/lovable-uploads/hero-antalya-768.webp 768w, /lovable-uploads/hero-antalya-1200.webp 1200w"
        imageSizes="100vw"
        fetchPriority="high"
      />
      <SEOHead title={pageTitle || "Property for Sale in Turkey, Dubai, Cyprus & Bali | Future Homes International"} description={metaDescription || "Property for sale in Turkey, Dubai, Cyprus & Bali. Apartments, villas & off-plan homes from leading international agents. Turkish citizenship by investment from $400K."} keywords="property for sale in turkey, homes for sale in turkey, turkey real estate, turkey homes for sale, houses for sale in turkey, apartments for sale in turkey, villas for sale in turkey, property for sale in antalya, apartments for sale in antalya, property for sale in istanbul, homes for sale in istanbul turkey, property for sale in dubai, dubai homes for sale, homes to buy dubai, houses for sale in dubai, dubai apartments for sale, property for sale in cyprus, cyprus real estate, houses for sale in cyprus, property for sale in bali, bali villas for sale, turkish citizenship by investment, buy property in turkey, off plan property turkey, real estate turkey" canonicalUrl={currentCanonicalUrl} structuredData={[homePageStructuredData, faqStructuredData]} />
      <OrganizationSchema />
      <Navigation />

      {/* Hero Section - Database content with fallback */}
      <div className="w-full">
        <Hero backgroundImage="/lovable-uploads/5506feef-2c81-4501-9f9d-5711a9dd3cce.webp" title={heroTitle || t('hero.title')} subtitle={t('hero.subtitle')} />
      </div>

      <ConversionBand />

      {/* Dynamic Content Sections from CMS — rendered below the hero so the
          async CMS fetch can never push the hero down (layout shift). */}
      {!contentLoading && contentSections.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          {contentSections.map((section, index) => (
            <ContentSection key={index} section={section} />
          ))}
        </div>
      )}

      
      {/* Property Listing Section with Location Filters */}
      <DeferredSection minHeight={700}>
        <PropertyListingSection />
      </DeferredSection>
      
      {/* Before & After Feature */}
      <DeferredSection className="w-full" minHeight={500}>
        <FeatureDemo />
      </DeferredSection>

      {/* Interactive City Selector */}
      <DeferredSection className="w-full" minHeight={500}>
        <InteractiveSelector />
      </DeferredSection>

      {/* Featured Properties - Shuffle Grid */}
      <DeferredSection minHeight={600}>
        <ShuffleGrid />
      </DeferredSection>

      {/* Customer reviews and testimonials */}
      <DeferredSection minHeight={700}>
        <RollingTestimonialsSection />
      </DeferredSection>

      {/* Founder Section */}
      <DeferredSection minHeight={600}>
        <FounderSection />
      </DeferredSection>

      {/* Team Section */}
      <DeferredSection minHeight={600}>
        <TeamSection />
      </DeferredSection>

      {/* News & Insights */}
      <DeferredSection minHeight={400}>
        <NewsInsights />
      </DeferredSection>
      
      {/* SEO content */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4 max-w-4xl space-y-5 text-muted-foreground leading-relaxed">
          <h2 className="text-3xl font-bold text-foreground">{t('seo.home.h2')}</h2>
          <p>{t('seo.home.p1')}</p>
          <h3 className="text-xl font-semibold text-foreground">{t('seo.home.h3_1')}</h3>
          <p>{t('seo.home.p2')}</p>
          <h3 className="text-xl font-semibold text-foreground">{t('seo.home.h3_2')}</h3>
          <p>{t('seo.home.p3')}</p>
          <h3 className="text-xl font-semibold text-foreground">{t('seo.home.h3_3')}</h3>
          <p>{t('seo.home.p4')}</p>
          <SEOInternalLinks heading={t('seo.home.links_heading')} className="border-t-0" />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {t('home.faq_title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('home.faq_subtitle')}
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">{t(`home.faq${i}_q`)}</h3>
                <p className="text-muted-foreground">{t(`home.faq${i}_a`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 60-second popup */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="max-w-lg mx-4 text-center">
          <DialogHeader className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20">
                <img src={aliKaranImage} alt="Ali Karan - Property Expert" className="w-full h-full object-cover" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {t('home.find_property')}
            </DialogTitle>
            <p className="text-muted-foreground text-lg">
              {t('home.find_property_subtitle')}
            </p>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <button onClick={() => { setShowPopup(false); window.location.href = '/property-wizard'; }} className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-primary-foreground py-4 px-6 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105">
              {t('home.start_journey')}
            </button>
            <p className="text-sm text-muted-foreground">
              {t('home.discover_properties')}
            </p>
            <button onClick={() => setShowPopup(false)} className="text-muted-foreground hover:text-foreground text-sm underline">
              {t('home.maybe_later')}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};
export default Index;