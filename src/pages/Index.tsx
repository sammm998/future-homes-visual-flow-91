import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import { motion } from "framer-motion";
import TeamSection from "@/components/TeamSection";
import { LazyComponent, LazyShuffleGrid, LazyFeaturedProperties, LazyNewsInsights } from "@/components/LazyComponent";
import ModernPropertyShowcase from "@/components/ModernPropertyShowcase";
import Newsletter from "@/components/Newsletter";
import { FeatureDemo } from "@/components/ui/feature-demo";
import InteractiveSelector from "@/components/ui/interactive-selector";
import PropertyImageGalleryPreview from "@/components/PropertyImageGalleryPreview";
import ElevenLabsWidget from "@/components/ElevenLabsWidget";
import TestimonialsMasonryGrid from "@/components/TestimonialsMasonryGrid";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import FounderSection from "@/components/FounderSection";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { useTestimonials } from "@/hooks/useTestimonials";
import SEOHead from "@/components/SEOHead";
import { PerformanceOptimizer } from "@/components/PerformanceOptimizer";
import { useSEO } from "@/hooks/useSEO";
import { useSEOLanguage } from "@/hooks/useSEOLanguage";
import OrganizationSchema from "@/components/OrganizationSchema";
import { useMemo, useEffect, useState } from "react";
// Removed useSyncAllData - database-only approach
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCanonicalUrl } from "@/hooks/useCanonicalUrl";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { ContentSection } from "@/components/ContentSection";
import AIPropertyAssistant from "@/components/AIPropertyAssistant";
import aliKaranImage from "@/assets/ali-karan-founder.png";

const Index = () => {
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
    testimonials
  } = useTestimonials();
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
    "name": "Future Homes Turkey",
    "alternateName": "Future Homes Turkey Real Estate",
    "url": "https://futurehomesturkey.com",
    "logo": "https://futurehomesturkey.com/logo.png",
    "description": "Premier international real estate agency specializing in luxury properties in Turkey, UAE, Cyprus, and Bali. Expert guidance for property investment, citizenship programs, and overseas real estate.",
    "sameAs": ["https://www.facebook.com/futurehomesturkey", "https://www.instagram.com/futurehomesturkey", "https://www.linkedin.com/company/futurehomesturkey", "https://twitter.com/futurehomestr"],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+90-242-000-0000",
      "contactType": "customer service",
      "email": "info@futurehomesturkey.com",
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
  return <div className="min-h-screen overflow-x-hidden">
      <PerformanceOptimizer 
        preloadImages={[
          '/lovable-uploads/5506feef-2c81-4501-9f9d-5711a9dd3cce.png'
        ]}
        prefetchRoutes={['/antalya', '/dubai', '/cyprus']}
      />
      <SEOHead title={pageTitle || "Future Homes Turkey - Premium International Real Estate Investment"} description={metaDescription || "Discover premium real estate investment opportunities in Turkey, Dubai, Cyprus, and Bali. Expert guidance for property investment, Turkish citizenship programs, and luxury overseas homes. Your international investment future starts here."} keywords="real estate Turkey, property investment Dubai, Cyprus properties, Turkish citizenship, Antalya real estate, luxury homes Turkey, overseas property investment, international real estate, property for sale Turkey, investment opportunities" canonicalUrl={currentCanonicalUrl} structuredData={[homePageStructuredData, faqStructuredData]} />
      <OrganizationSchema />
      <Navigation />

      {/* Dynamic Content Sections from CMS */}
      {!contentLoading && contentSections.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          {contentSections.map((section, index) => (
            <ContentSection key={index} section={section} />
          ))}
        </div>
      )}
      
      {/* Hero Section - Database content with fallback */}
      <div className="w-full">
        <Hero backgroundImage="/lovable-uploads/5506feef-2c81-4501-9f9d-5711a9dd3cce.png" title={heroTitle || "Future Homes"} subtitle="Your Future Real Estate Partner" />
      </div>
      
      {/* Before & After Feature */}
      <div className="w-full">
        <FeatureDemo />
      </div>
      
      {/* Interactive City Selector */}
      <div className="w-full">
        <InteractiveSelector />
      </div>
      
      {/* AI Property Assistant */}
      <AIPropertyAssistant />
      
      {/* Featured Properties - Shuffle Grid */}
      <LazyComponent fallback={<div className="w-full h-96 bg-muted animate-pulse rounded-lg" />}>
        <LazyShuffleGrid />
      </LazyComponent>
      
      
      
      {/* Rolling Testimonials */}
      <section className="py-20 bg-secondary/30 overflow-hidden">
        <div className="container mx-auto px-4 mb-16">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Customer Reviews
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our satisfied customers say about their experience
            </p>
          </div>
        </div>
        
        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={testimonials.slice(0, 3)} className="w-80" duration={15} />
          <TestimonialsColumn testimonials={testimonials.slice(3, 6)} className="w-80 hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={testimonials.slice(6, 9)} className="w-80 hidden lg:block" duration={17} />
        </div>
      </section>

      {/* Testimonials Masonry Grid */}
      <TestimonialsMasonryGrid />

      {/* Founder Section */}
      <FounderSection />

      {/* Team Section */}
      <TeamSection />

      {/* Property Image Gallery Preview */}
      <PropertyImageGalleryPreview />

      {/* Immersive Property Gallery Zoom Parallax */}
      

      {/* News & Insights */}
      <LazyComponent fallback={<div className="w-full h-64 bg-muted animate-pulse rounded-lg" />}>
        <LazyNewsInsights />
      </LazyComponent>
      
      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get answers to the most common questions about buying property internationally
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Can foreigners buy property internationally?</h3>
              <p className="text-muted-foreground">Yes, most countries welcome foreign property investors with varying restrictions. Popular destinations like Turkey, UAE, Cyprus, and Portugal offer excellent opportunities for international buyers with proper legal frameworks.</p>
            </div>
            
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">What are typical costs when buying property abroad?</h3>
              <p className="text-muted-foreground">International property purchase costs vary by country but typically range from 4-10% of property value, including taxes, legal fees, translation costs, and administrative expenses. Dubai charges 4% registration fee, while European countries may charge 6-10% total costs.</p>
            </div>
            
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Which countries offer citizenship through property investment?</h3>
              <p className="text-muted-foreground">Several countries offer citizenship or residency through property investment: Turkey ($400k minimum), Cyprus (€2M), Portugal (€280k for Golden Visa), Caribbean nations ($200k+), and various other programs with different investment thresholds.</p>
            </div>
            
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Do I need a lawyer when buying property internationally?</h3>
              <p className="text-muted-foreground">While not always legally required, hiring a local lawyer is highly recommended for international property purchases. They ensure compliance with local laws, handle documentation, and protect your interests throughout the transaction process.</p>
            </div>
            
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">What ongoing costs should I expect with international property?</h3>
              <p className="text-muted-foreground">Annual costs vary by location but typically include property taxes (0.1-1.5%), insurance, maintenance fees for complexes, utilities, and property management fees if renting out. Some countries like UAE have no income tax, while others have rental income taxes.</p>
            </div>
            
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">How do payment plans work for international property purchases?</h3>
              <p className="text-muted-foreground">Many international developers offer flexible payment plans, especially for off-plan properties. Typical plans involve 20-30% down payment, installments during construction (12-36 months), and final payment upon completion. Some offer interest-free terms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ElevenLabs Widget */}
      <ElevenLabsWidget />

      {/* 30-second popup */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="max-w-lg mx-4 text-center">
          <DialogHeader className="space-y-4">
            {/* Ali's Image */}
            <div className="flex justify-center mb-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20">
                <img 
                  src={aliKaranImage} 
                  alt="Ali Karan - Property Expert" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <DialogTitle className="text-2xl font-bold text-foreground">
              Find Your Perfect Property
            </DialogTitle>
            <p className="text-muted-foreground text-lg">
              Let us help you discover the ideal investment opportunity
            </p>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <button onClick={() => {
            setShowPopup(false);
            window.location.href = '/property-wizard';
          }} className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-primary-foreground py-4 px-6 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105">
              Start Your Property Journey
            </button>
            <p className="text-sm text-muted-foreground">
              Discover properties in Turkey • Dubai • Europe
            </p>
            <button onClick={() => setShowPopup(false)} className="text-muted-foreground hover:text-foreground text-sm underline">
              Maybe later
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};
export default Index;