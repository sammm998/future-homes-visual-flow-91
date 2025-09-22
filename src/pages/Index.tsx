import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import { motion } from "framer-motion";
import { LazyComponent, LazyShuffleGrid, LazyFeaturedProperties, LazyNewsInsights } from "@/components/LazyComponent";
import ModernPropertyShowcase from "@/components/ModernPropertyShowcase";
import Newsletter from "@/components/Newsletter";
import { FeatureDemo } from "@/components/ui/feature-demo";
import InteractiveSelector from "@/components/ui/interactive-selector";
import PropertyImageGalleryPreview from "@/components/PropertyImageGalleryPreview";
import ElevenLabsWidget from "@/components/ElevenLabsWidget";
import TestimonialsMasonryGrid from "@/components/TestimonialsMasonryGrid";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
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


const Index = () => {
  const { canonicalUrl, hreflangUrls } = useSEOLanguage();
  const { structuredData } = useSEO();
  const currentCanonicalUrl = useCanonicalUrl();
  const [showPopup, setShowPopup] = useState(false);
  // Removed sync import - database-only approach
  const { testimonials } = useTestimonials();
  const { pageTitle, metaDescription, contentSections, heroTitle, heroSubtitle, isLoading: contentLoading } = useWebsiteContent();

  // Auto-sync removed - now using database-only approach

  // Delay popup to improve perceived performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 45000); // Delayed to 45 seconds to reduce initial load impact

    return () => clearTimeout(timer);
  }, []);
  

  
  const homePageStructuredData = {
    "@context": "https://schema.org",
    "@type": ["WebSite", "RealEstateAgent", "Organization"],
    "name": "Future Homes Turkey",
    "alternateName": "Future Homes Turkey Real Estate",
    "url": "https://futurehomesturkey.com",
    "logo": "https://futurehomesturkey.com/logo.png",
    "description": "Premier international real estate agency specializing in luxury properties in Turkey, UAE, Cyprus, and Bali. Expert guidance for property investment, citizenship programs, and overseas real estate.",
    "sameAs": [
      "https://www.facebook.com/futurehomesturkey",
      "https://www.instagram.com/futurehomesturkey",
      "https://www.linkedin.com/company/futurehomesturkey",
      "https://twitter.com/futurehomestr"
    ],
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
    "service": [
      {
        "@type": "Service",
        "name": "International Real Estate Sales",
        "description": "Luxury property sales in Turkey, UAE, Cyprus, and Bali"
      },
      {
        "@type": "Service", 
        "name": "Property Investment Consulting",
        "description": "Expert advice on overseas property investment opportunities"
      },
      {
        "@type": "Service",
        "name": "Citizenship by Investment Programs",
        "description": "Turkish and Cyprus citizenship through real estate investment"
      }
    ],
    "areaServed": [
      {
        "@type": "Country",
        "name": "Turkey"
      },
      {
        "@type": "Country", 
        "name": "United Arab Emirates"
      },
      {
        "@type": "Country",
        "name": "Cyprus"
      },
      {
        "@type": "Country",
        "name": "Indonesia"
      }
    ],
    "priceRange": "€100,000 - €5,000,000+"
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEOHead
        title={pageTitle || "Future Homes Turkey - Premium International Real Estate Investment"}
        description={metaDescription || "Discover premium real estate investment opportunities in Turkey, Dubai, Cyprus, and Bali. Expert guidance for property investment, Turkish citizenship programs, and luxury overseas homes. Your international investment future starts here."}
        keywords="real estate Turkey, property investment Dubai, Cyprus properties, Turkish citizenship, Antalya real estate, luxury homes Turkey, overseas property investment, international real estate, property for sale Turkey, investment opportunities"
        canonicalUrl={currentCanonicalUrl}
        structuredData={homePageStructuredData}
      />
      <OrganizationSchema />
      <Navigation />

      {/* Dynamic Content Sections */}
      {/* {!contentLoading && contentSections.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          {contentSections.map((section, index) => (
            <ContentSection key={index} section={section} />
          ))}
        </div>
      )} */}
      
      {/* Hero Section - Database content with fallback */}
      <div className="w-full">
        <Hero 
          backgroundImage="/lovable-uploads/5506feef-2c81-4501-9f9d-5711a9dd3cce.png"
          title={heroTitle || "Future Homes"}
          subtitle="Your Future Real Estate Partner"
        />
      </div>
      
      {/* Before & After Feature */}
      <div className="w-full">
        <FeatureDemo />
      </div>
      
      {/* Interactive City Selector */}
      <div className="w-full">
        <InteractiveSelector />
      </div>
      
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
          <TestimonialsColumn
            testimonials={testimonials.slice(0, 3)}
            className="w-80"
            duration={15}
          />
          <TestimonialsColumn
            testimonials={testimonials.slice(3, 6)}
            className="w-80 hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={testimonials.slice(6, 9)}
            className="w-80 hidden lg:block"
            duration={17}
          />
        </div>
      </section>

      {/* Testimonials Masonry Grid */}
      <TestimonialsMasonryGrid />

      {/* Property Image Gallery Preview */}
      <PropertyImageGalleryPreview />

      {/* News & Insights */}
      <LazyComponent fallback={<div className="w-full h-64 bg-muted animate-pulse rounded-lg" />}>
        <LazyNewsInsights />
      </LazyComponent>
      

      {/* ElevenLabs Widget */}
      <ElevenLabsWidget />

      {/* 30-second popup */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="max-w-lg mx-4 text-center">
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-2xl font-bold text-foreground">
              Find Your Perfect Property
            </DialogTitle>
            <p className="text-muted-foreground text-lg">
              Let us help you discover the ideal investment opportunity
            </p>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <button 
              onClick={() => {
                setShowPopup(false);
                window.location.href = '/property-wizard';
              }}
              className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-primary-foreground py-4 px-6 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Your Property Journey
            </button>
            <p className="text-sm text-muted-foreground">
              Discover properties in Turkey • Dubai • Europe
            </p>
            <button 
              onClick={() => setShowPopup(false)}
              className="text-muted-foreground hover:text-foreground text-sm underline"
            >
              Maybe later
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;