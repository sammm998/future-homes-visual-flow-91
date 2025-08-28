import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import { LazyComponent, LazyTestimonials, LazyShuffleGrid, LazyPropertyShowcase, LazyNewsInsights } from "@/components/LazyComponent";
import Newsletter from "@/components/Newsletter";
import { FeatureDemo } from "@/components/ui/feature-demo";
import InteractiveSelector from "@/components/ui/interactive-selector";
import ElevenLabsWidget from "@/components/ElevenLabsWidget";
import SEOHead from "@/components/SEOHead";
import OrganizationSchema from "@/components/OrganizationSchema";
import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ErrorBoundary from "@/components/ErrorBoundary";

const Index = () => {
  console.log('Index component rendering - SIMPLIFIED');
  
  // Simple state management
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  // Simple popup timer - run once only
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 45000);
    return () => clearTimeout(timer);
  }, []);

  // Static testimonials to avoid hook complexity
  const staticTestimonials = useMemo(() => [
    {
      text: "Outstanding service and beautiful properties. The team helped us find our dream home in Turkey.",
      name: "Sarah Johnson",
      role: "Property Owner",
      image: "/placeholder.svg"
    },
    {
      text: "Professional guidance throughout the entire process. Highly recommend Future Homes.",
      name: "Michael Chen",
      role: "Investor",
      image: "/placeholder.svg"
    },
    {
      text: "Excellent investment opportunities and transparent communication. Very satisfied with the service.",
      name: "Emma Thompson",
      role: "International Buyer",
      image: "/placeholder.svg"
    },
    {
      text: "Found the perfect apartment in Dubai through Future Homes. Great team and wonderful experience.",
      name: "Ahmed Al-Rahman",
      role: "Dubai Resident",
      image: "/placeholder.svg"
    },
    {
      text: "Turkish citizenship process was smooth and professional. Thank you for all the support.",
      name: "Lisa Martinez",
      role: "New Turkish Citizen",
      image: "/placeholder.svg"
    },
    {
      text: "Beautiful villa in Cyprus with stunning sea views. The investment has been fantastic.",
      name: "Robert Wilson",
      role: "Cyprus Property Owner",
      image: "/placeholder.svg"
    }
  ], []);

  const circularTestimonials = useMemo(() => 
    staticTestimonials.map(testimonial => ({
      quote: testimonial.text,
      name: testimonial.name,
      designation: testimonial.role,
      src: testimonial.image
    })), [staticTestimonials]);

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
          canonicalUrl="https://futurehomesturkey.com"
          structuredData={homePageStructuredData}
        />
        
        {/* Essential components only */}
        <OrganizationSchema />
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
        
        {/* Static Testimonials Grid */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
                {staticTestimonials.slice(0, 6).map((testimonial, index) => (
                  <div 
                    key={index}
                    className="p-6 rounded-3xl border shadow-lg shadow-primary/10 bg-card text-card-foreground"
                  >
                    <div className="text-sm leading-relaxed mb-4">{testimonial.text}</div>
                    <div className="flex flex-col">
                      <div className="font-semibold tracking-tight leading-5 text-sm">{testimonial.name}</div>
                      <div className="leading-5 text-muted-foreground tracking-tight text-xs">{testimonial.role}</div>
                    </div>
                  </div>
                ))}
              </div>
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

        {/* Simple popup without complex dependencies */}
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
};

export default Index;