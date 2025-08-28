import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCanonicalUrl } from "@/hooks/useCanonicalUrl";
import { useTestimonials } from "@/hooks/useTestimonials";
import { CriticalResourceLoader } from "@/components/CriticalResourceLoader";
import { PerformanceTracker } from "@/components/PerformanceTracker";
import { LocalSEOManager } from "@/components/LocalSEOManager";
import { SEOSchemaGenerator } from "@/components/SEOSchemaGenerator";
import { FAQSchema } from "@/components/FAQSchema";
import { ResourcePreloader } from "@/components/performance/ResourcePreloader";
import { BundleOptimizer } from "@/components/performance/BundleOptimizer";

import ErrorBoundary from "@/components/ErrorBoundary";

const Index = () => {
  console.log('Index component rendering...');
  
  try {
    // Basic hooks first - these are stable
    const navigate = useNavigate();
    const currentCanonicalUrl = useCanonicalUrl();
    const [showPopup, setShowPopup] = useState(false);
    
    // SEO hooks - stable references
    const { canonicalUrl, hreflangUrls } = useSEOLanguage();
    const { structuredData } = useSEO();
    
    // Data hooks with error handling
    let testimonials: any[] = [];
    let testimonialsLoading = false;
    let backgroundSync = () => {};
    let isBackgroundSyncing = false;
    
    try {
      const testimonialsResult = useTestimonials();
      testimonials = testimonialsResult.testimonials || [];
      testimonialsLoading = testimonialsResult.loading;
    } catch (error) {
      console.error('Testimonials hook error:', error);
    }
    
    try {
      const syncResult = useOptimizedSync();
      backgroundSync = syncResult.backgroundSync;
      isBackgroundSyncing = syncResult.isBackgroundSyncing;
    } catch (error) {
      console.error('Sync hook error:', error);
    }

    // Background sync that doesn't block page load - ONE TIME ONLY
    useEffect(() => {
      let mounted = true;
      const timer = setTimeout(() => {
        if (mounted) {
          try {
            backgroundSync();
          } catch (error) {
            console.error('Background sync error:', error);
          }
        }
      }, 3000);
      
      return () => {
        mounted = false;
        clearTimeout(timer);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array - run only once
    
    // Transform testimonials for columns
    const testimonialColumns = useMemo(() => {
      const validTestimonials = Array.isArray(testimonials) ? testimonials : [];
      return {
        firstColumn: validTestimonials.slice(0, 6),
        secondColumn: validTestimonials.slice(6, 12),
        thirdColumn: validTestimonials.slice(12, 18),
      };
    }, [testimonials]);

    // Popup timer - ONE TIME ONLY
    useEffect(() => {
      let mounted = true;
      const timer = setTimeout(() => {
        if (mounted) {
          setShowPopup(true);
        }
      }, 45000);
      
      return () => {
        mounted = false;
        clearTimeout(timer);
      };
    }, []); // Empty dependency array - run only once
    
    // Transform dynamic testimonials for circular component - SAFE
    const circularTestimonials = useMemo(() => {
      const validTestimonials = Array.isArray(testimonials) ? testimonials : [];
      return validTestimonials.map(testimonial => ({
        quote: testimonial?.text || '',
        name: testimonial?.name || 'Anonymous',
        designation: testimonial?.role || 'Customer',
        src: testimonial?.image || '/placeholder.svg'
      }));
    }, [testimonials]);

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
      <ErrorBoundary>
        <div className="min-h-screen overflow-x-hidden">
        <SEOHead
          title="Future Homes - Premium Real Estate in Turkey, Dubai & Europe"
          description="Future Homes offers premium real estate investment opportunities in Turkey, Dubai, Cyprus, and Europe. Expert guidance for property investment and Turkish citizenship."
          keywords="real estate Turkey, property investment Dubai, Cyprus properties, European real estate, Turkish citizenship, luxury homes, investment properties"
          canonicalUrl={currentCanonicalUrl}
          hreflang={hreflangUrls}
          structuredData={structuredData}
        />
        
        {/* Essential components only */}
        <OrganizationSchema />
        <PerformanceTracker enableWebVitals={false} />
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
        <ErrorBoundary fallback={<div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">Featured properties unavailable</div>}>
          <LazyComponent fallback={<div className="w-full h-96 bg-muted animate-pulse rounded-lg" />}>
            <LazyShuffleGrid />
          </LazyComponent>
        </ErrorBoundary>
        
        {/* Property Showcase - 6 Properties */}
        <ErrorBoundary fallback={<div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">Property showcase unavailable</div>}>
          <LazyComponent fallback={<div className="w-full h-96 bg-muted animate-pulse rounded-lg" />}>
            <LazyPropertyShowcase />
          </LazyComponent>
        </ErrorBoundary>
        
        {/* Testimonials Columns */}
        <section className="bg-background my-20 relative">
          <div className="container z-10 mx-auto">
            <div className="flex flex-col items-center justify-center max-w-[540px] mx-auto">
              <div className="flex justify-center">
                <div className="border py-1 px-4 rounded-lg">Testimonials</div>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5">
                What Our Clients Say
              </h2>
              <p className="text-center mt-5 opacity-75">
                Hear from satisfied property owners worldwide
              </p>
            </div>

            <div className="flex justify-center gap-4 sm:gap-6 mt-10">
              {testimonialsLoading ? (
                <div className="flex justify-center items-center w-full h-64">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                </div>
              ) : testimonials.length === 0 ? (
                <div className="flex justify-center items-center w-full h-64 text-muted-foreground">
                  <p>No testimonials available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
                  {testimonials.slice(0, 6).map((testimonial, index) => (
                    <div 
                      key={index}
                      className="p-6 rounded-3xl border shadow-lg shadow-primary/10 bg-card text-card-foreground"
                    >
                      <div className="text-sm leading-relaxed mb-4">{testimonial.text || 'Great service!'}</div>
                      <div className="flex flex-col">
                        <div className="font-semibold tracking-tight leading-5 text-sm">{testimonial.name || 'Anonymous'}</div>
                        <div className="leading-5 text-muted-foreground tracking-tight text-xs">{testimonial.role || 'Customer'}</div>
                      </div>
                    </div>
                  ))}
                </div>
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
              ) : circularTestimonials.length === 0 ? (
                <div className="flex justify-center items-center w-full h-64 text-muted-foreground">
                  <p>No testimonials available</p>
                </div>
              ) : (
                <ErrorBoundary fallback={<div className="text-center text-muted-foreground">Testimonials temporarily unavailable</div>}>
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
                </ErrorBoundary>
              )}
            </div>
          </div>
        </section>
        
        {/* News & Insights */}
        <ErrorBoundary fallback={<div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">News section unavailable</div>}>
          <LazyComponent fallback={<div className="w-full h-64 bg-muted animate-pulse rounded-lg" />}>
            <LazyNewsInsights />
          </LazyComponent>
        </ErrorBoundary>
        
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
              <DialogDescription className="text-muted-foreground text-lg">
                Let us help you discover the ideal investment opportunity
              </DialogDescription>
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
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Critical error in Index component:', error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="text-gray-600">Please refresh the page and try again.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
};

export default Index;