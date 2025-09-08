import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import { motion } from "framer-motion";
import { LazyComponent, LazyShuffleGrid, LazyFeaturedProperties, LazyNewsInsights } from "@/components/LazyComponent";
import ModernPropertyShowcase from "@/components/ModernPropertyShowcase";
import Newsletter from "@/components/Newsletter";
import { FeatureDemo } from "@/components/ui/feature-demo";
import InteractiveSelector from "@/components/ui/interactive-selector";
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
import { useSyncAllData } from "@/hooks/useSyncAllData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCanonicalUrl } from "@/hooks/useCanonicalUrl";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { ContentSection } from "@/components/ContentSection";


const Index = () => {
  const { canonicalUrl, hreflangUrls } = useSEOLanguage();
  const { structuredData } = useSEO();
  const currentCanonicalUrl = useCanonicalUrl();
  const [showPopup, setShowPopup] = useState(false);
  const { syncAllProperties } = useSyncAllData();
  const { testimonials } = useTestimonials();
  const { pageTitle, metaDescription, contentSections, heroTitle, heroSubtitle, isLoading: contentLoading } = useWebsiteContent();

  // Auto-sync properties only when needed, not on every load
  useEffect(() => {
    const hasAutoSynced = localStorage.getItem('allPropertiesAutoSynced');
    const lastSyncDate = localStorage.getItem('lastPropertiesSync');
    const daysSinceLastSync = lastSyncDate ? 
      (Date.now() - parseInt(lastSyncDate)) / (1000 * 60 * 60 * 24) : 30;
    
    if (!hasAutoSynced || daysSinceLastSync > 7) {
      // Use setTimeout to delay sync and not block initial render
      setTimeout(() => {
        syncAllProperties();
        localStorage.setItem('allPropertiesAutoSynced', 'true');
        localStorage.setItem('lastPropertiesSync', Date.now().toString());
      }, 2000);
    }
  }, [syncAllProperties]);

  // Delay popup to improve perceived performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 45000); // Delayed to 45 seconds to reduce initial load impact

    return () => clearTimeout(timer);
  }, []);
  

  const homePageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Future Homes",
    "url": "https://futurehomesturkey.com",
    "description": "Premium real estate investment opportunities in Turkey, Dubai, Cyprus, and Europe",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://futurehomesturkey.com/ai-property-search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEOHead
        title={pageTitle || "Future Homes - Premium Real Estate in Turkey, Dubai & Europe"}
        description={metaDescription || "Future Homes offers premium real estate investment opportunities in Turkey, Dubai, Cyprus, and Europe. Expert guidance for property investment and Turkish citizenship."}
        keywords="real estate Turkey, property investment Dubai, Cyprus properties, European real estate, Turkish citizenship, luxury homes, investment properties"
        canonicalUrl={currentCanonicalUrl}
        hreflang={hreflangUrls}
        structuredData={structuredData}
      />
      <OrganizationSchema />
      <Navigation />

      {/* Dynamic Content Sections */}
      {!contentLoading && contentSections.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          {contentSections.map((section, index) => (
            <ContentSection key={index} section={section} />
          ))}
        </div>
      )}
      
      {/* Hero Section - Database content with fallback */}
      <div className="w-full">
        <Hero 
          backgroundImage="/lovable-uploads/5506feef-2c81-4501-9f9d-5711a9dd3cce.png"
          title={heroTitle || "Future Homes"}
          subtitle={heroSubtitle || "Your Future in Real Estate"}
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
      
      {/* Modern Property Showcase */}
      <ModernPropertyShowcase />
      
      
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