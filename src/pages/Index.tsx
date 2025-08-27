import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { motion } from "motion/react";
import { LazyComponent, LazyTestimonials, LazyShuffleGrid, LazyPropertyShowcase, LazyFeaturedProperties, LazyNewsInsights } from "@/components/LazyComponent";
import Newsletter from "@/components/Newsletter";
import { FeatureDemo } from "@/components/ui/feature-demo";
import InteractiveSelector from "@/components/ui/interactive-selector";
import ElevenLabsWidget from "@/components/ElevenLabsWidget";
import SEOHead from "@/components/SEOHead";
import { PerformanceOptimizer } from "@/components/PerformanceOptimizer";
import { useSEO } from "@/hooks/useSEO";
import { useSEOLanguage } from "@/hooks/useSEOLanguage";
import OrganizationSchema from "@/components/OrganizationSchema";
import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOptimizedSync } from "@/hooks/useOptimizedSync";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCanonicalUrl } from "@/hooks/useCanonicalUrl";
import { useTestimonials } from "@/hooks/useTestimonials";
import { CriticalResourceLoader } from "@/components/CriticalResourceLoader";
import { PerformanceTracker } from "@/components/PerformanceTracker";
import { LocalSEOManager } from "@/components/LocalSEOManager";
import { SEOSchemaGenerator } from "@/components/SEOSchemaGenerator";
import { FAQSchema } from "@/components/FAQSchema";
import { ResourcePreloader } from "@/components/performance/ResourcePreloader";
import { BundleOptimizer } from "@/components/performance/BundleOptimizer";


const Index = () => {
  const { canonicalUrl, hreflangUrls } = useSEOLanguage();
  const { structuredData } = useSEO();
  const currentCanonicalUrl = useCanonicalUrl();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const { testimonials: dynamicTestimonials, loading: testimonialsLoading } = useTestimonials();
  const { backgroundSync, isBackgroundSyncing } = useOptimizedSync();

  // Background sync that doesn't block page load
  useEffect(() => {
    // Delay background sync to not interfere with initial page load
    const timer = setTimeout(() => {
      backgroundSync();
    }, 3000); // 3 second delay after page load

    return () => clearTimeout(timer);
  }, [backgroundSync]);

  // Delay popup to improve perceived performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 45000); // Delayed to 45 seconds to reduce initial load impact

    return () => clearTimeout(timer);
  }, []);
  
  // Memoize testimonials with better dependency
  const testimonials = useMemo(() => 
    testimonialsLoading ? [] : dynamicTestimonials, 
    [dynamicTestimonials, testimonialsLoading]
  );

  const { firstColumn, secondColumn, thirdColumn } = useMemo(() => ({
    firstColumn: testimonials.slice(0, 6),
    secondColumn: testimonials.slice(6, 12),
    thirdColumn: testimonials.slice(12, 18),
  }), [testimonials]);
  
  // Transform dynamic testimonials for circular component
  const circularTestimonials = useMemo(() => 
    dynamicTestimonials.map(testimonial => ({
      quote: testimonial.text,
      name: testimonial.name,
      designation: testimonial.role,
      src: testimonial.image
    })), [dynamicTestimonials]);

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
        title="Future Homes - Premium Real Estate in Turkey, Dubai & Europe"
        description="Future Homes offers premium real estate investment opportunities in Turkey, Dubai, Cyprus, and Europe. Expert guidance for property investment and Turkish citizenship."
        keywords="real estate Turkey, property investment Dubai, Cyprus properties, European real estate, Turkish citizenship, luxury homes, investment properties"
        canonicalUrl={currentCanonicalUrl}
        hreflang={hreflangUrls}
        structuredData={structuredData}
      />
      
      {/* Performance optimization components */}
      <ResourcePreloader 
        criticalImages={['/placeholder.svg']}
        criticalFonts={['/fonts/inter.woff2']}
        prefetchRoutes={['/property-wizard', '/antalya', '/dubai', '/cyprus']}
        enableServiceWorker={true}
      />
      <BundleOptimizer 
        enableCodeSplitting={true}
        deferNonCriticalJS={true}
        prefetchChunks={['/assets/property-wizard.js', '/assets/search.js']}
      />
      
      <OrganizationSchema />
      <CriticalResourceLoader />
      <PerformanceTracker enableWebVitals={true} />
      <LocalSEOManager />
      <SEOSchemaGenerator type="organization" />
      <FAQSchema />
      <Navigation />
      
      {/* Hero Section */}
      <div className="w-full">
        <Hero 
          backgroundImage="/lovable-uploads/5506feef-2c81-4501-9f9d-5711a9dd3cce.png"
          title="Future Homes"
          subtitle="Your Future in Real Estate"
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
      
      {/* Property Showcase - 6 Properties */}
      <LazyComponent fallback={<div className="w-full h-96 bg-muted animate-pulse rounded-lg" />}>
        <LazyPropertyShowcase />
      </LazyComponent>
      
      {/* Testimonials Columns */}
      <section className="bg-background my-20 relative">
        <div className="container z-10 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
          >
            <div className="flex justify-center">
              <div className="border py-1 px-4 rounded-lg">Testimonials</div>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5">
              What Our Clients Say
            </h2>
            <p className="text-center mt-5 opacity-75">
              Hear from satisfied property owners worldwide
            </p>
          </motion.div>

          <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
            {testimonialsLoading ? (
              <div className="flex justify-center items-center w-full h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <TestimonialsColumn testimonials={firstColumn} duration={15} />
                <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
                <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
              </>
            )}
          </div>
        </div>
      </section>
      
      {/* Circular Testimonials */}
      <section className="py-12 sm:py-16 md:py-24 bg-muted/30 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
                Real Client Experiences
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                Discover how we've helped clients achieve their property investment goals
              </p>
            </div>
          <div className="flex justify-center">
            {testimonialsLoading ? (
              <div className="flex justify-center items-center w-full h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
              </div>
            ) : (
              <LazyTestimonials 
                testimonials={circularTestimonials}
                autoplay={false}
                colors={{
                  name: "hsl(var(--foreground))",
                  designation: "hsl(var(--muted-foreground))",
                  testimony: "hsl(var(--foreground))",
                  arrowBackground: "hsl(var(--primary))",
                  arrowForeground: "hsl(var(--primary-foreground))",
                  arrowHoverBackground: "hsl(var(--primary-glow))"
                }}
              />
            )}
          </div>
        </div>
      </section>
      
      {/* News & Insights */}
      <LazyComponent fallback={<div className="w-full h-64 bg-muted animate-pulse rounded-lg" />}>
        <LazyNewsInsights />
      </LazyComponent>
      
      {/* Newsletter Section */}
      <Newsletter />

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
                navigate('/property-wizard');
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