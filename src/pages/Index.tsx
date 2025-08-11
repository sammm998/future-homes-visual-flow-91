
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCanonicalUrl } from "@/hooks/useCanonicalUrl";


const Index = () => {
  const { canonicalUrl, hreflangUrls } = useSEOLanguage();
  const { structuredData } = useSEO();
  const currentCanonicalUrl = useCanonicalUrl();
  const [showPopup, setShowPopup] = useState(false);

  // 30-second popup timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, []);
  
  
  const testimonials = useMemo(() => [
    {
      text: "Thank you for great cooperation. It has been a pleasure getting to know you at Future Homes. Tolga and Ali have been very service-oriented with good communication. Highly recommend!",
      image: "/lovable-uploads/0f630d60-d26c-479d-9ec8-6e38a40bdd2b.png",
      name: "Cahide Celepli",
      role: "Customer - Sweden",
    },
    {
      text: "I bought an apartment through Future Homes with the help of the best Ali. I received wonderful service. Thank you Ali for excellent service and patience.",
      image: "/lovable-uploads/f1300762-7ea4-4f88-924d-47e4e250acd4.png",
      name: "Hanan Aldalawi",
      role: "Customer - Dubai",
    },
    {
      text: "I wanted to buy a property in Konyaalti when I accidentally came to Future homes and was delighted with their professionalism.",
      image: "/lovable-uploads/c2f3e289-428a-49e8-b76e-6d99ba20bed7.png",
      name: "Milan Mitic",
      role: "Local Guide - Serbia",
    },
    {
      text: "Bought our first apartment in Turkey with Future Homes. Very quick responses to any type of question that we had, everything is explained clearly and thoroughly.",
      image: "/lovable-uploads/0f630d60-d26c-479d-9ec8-6e38a40bdd2b.png",
      name: "Olga",
      role: "Local Guide - Sweden",
    },
    {
      text: "I am very happy with Ali Karan and Future Homes of the sales I did in Antalya. Definitely recommend this company.",
      image: "/lovable-uploads/f1300762-7ea4-4f88-924d-47e4e250acd4.png",
      name: "Maher Mare",
      role: "Customer - International",
    },
    {
      text: "Very professional approach. A young company with great ambitions that works hard to ensure the customer goes through a safe real estate transaction.",
      image: "/lovable-uploads/c2f3e289-428a-49e8-b76e-6d99ba20bed7.png",
      name: "Pro Fast",
      role: "Customer - Sweden",
    },
    {
      text: "My husband and I have bought 3 apartments from Ali Karan and Future Homes. I am very satisfied with their professional service and the help I got even after the sale was done.",
      image: "/lovable-uploads/0f630d60-d26c-479d-9ec8-6e38a40bdd2b.png",
      name: "Elham Ahmadi Farsangi",
      role: "Customer - International",
    },
    {
      text: "The best Ali also helped after I bought an apartment from Future homes. I got help with contact with sellers of appliances, furniture, etc.",
      image: "/lovable-uploads/f1300762-7ea4-4f88-924d-47e4e250acd4.png",
      name: "Ib Awn",
      role: "Customer - Sweden",
    },
    {
      text: "Ali Karan is a man of his words! The energy he has for work and the dedication he gives to his clients is amazing. We are always amazed by his efforts!",
      image: "/lovable-uploads/c2f3e289-428a-49e8-b76e-6d99ba20bed7.png",
      name: "Muhammad Umar",
      role: "Customer - International",
    },
    {
      text: "My brother had purchased a property with this company, and due to his experience and service that he had received, he recommended that I should also purchase.",
      image: "/lovable-uploads/0f630d60-d26c-479d-9ec8-6e38a40bdd2b.png",
      name: "Sushil Ran",
      role: "Customer - International",
    },
    {
      text: "We bought an apartment through Future Homes. Wonderful service. Big thanks to everyone in the team, very satisfied! Warmly recommend.",
      image: "/lovable-uploads/f1300762-7ea4-4f88-924d-47e4e250acd4.png",
      name: "Olga Aldabbagh",
      role: "Customer - Sweden",
    },
    {
      text: "I bought an apartment in Avsallar through Ali. A really nice and helpful guy who obviously can fix everything! Highly recommended.",
      image: "/lovable-uploads/c2f3e289-428a-49e8-b76e-6d99ba20bed7.png",
      name: "Zaid Mohanad",
      role: "Customer - Sweden",
    },
    {
      text: "Tolga was a very professional person who took good care of every single thing to do for this matter and myself. I recommend them strongly.",
      image: "/lovable-uploads/0f630d60-d26c-479d-9ec8-6e38a40bdd2b.png",
      name: "Dollyz Martinez",
      role: "Customer - International",
    },
    {
      text: "Very skilled and kind real estate agent, bought apartment through them. If you want to buy an apartment, contact Ali Karan at Future Homes.",
      image: "/lovable-uploads/f1300762-7ea4-4f88-924d-47e4e250acd4.png",
      name: "Amir Salman",
      role: "Customer - Sweden",
    },
    {
      text: "I want to thank Future Homes for their incredible help. I would also like to thank the owner (Ali Bey) and his team, Tolga and Bariş, for always being there for me.",
      image: "/lovable-uploads/c2f3e289-428a-49e8-b76e-6d99ba20bed7.png",
      name: "Cuneyt",
      role: "Customer - London",
    },
    {
      text: "I definitely recommend it. I consider myself very lucky that I found this company. I was looking for an apartment in Antalya near the airport.",
      image: "/lovable-uploads/0f630d60-d26c-479d-9ec8-6e38a40bdd2b.png",
      name: "Lena",
      role: "Local Guide - Russia",
    },
    {
      text: "I felt really good, professional from the beginning and the process was perfect. Buying real estate is a matter of trust, and I found that trust here.",
      image: "/lovable-uploads/f1300762-7ea4-4f88-924d-47e4e250acd4.png",
      name: "Jens Zierke",
      role: "Customer - Germany",
    },
    {
      text: "Future Homes is an agency that I highly recommend! The advisors are very competent! I particularly want to thank Selen who accompanied us throughout our project.",
      image: "/lovable-uploads/c2f3e289-428a-49e8-b76e-6d99ba20bed7.png",
      name: "Florence Manga",
      role: "Customer - France",
    },
  ], []);

  const { firstColumn, secondColumn, thirdColumn } = useMemo(() => ({
    firstColumn: testimonials.slice(0, 6),
    secondColumn: testimonials.slice(6, 12),
    thirdColumn: testimonials.slice(12, 18),
  }), [testimonials]);
  
  
  // Memoized circular testimonials data
  const circularTestimonials = useMemo(() => [
    {
      quote: "Thank you for great cooperation. It has been a pleasure getting to know you at Future Homes. Tolga and Ali have been very service-oriented with good communication. Highly recommend!",
      name: "Cahide Celepli",
      designation: "Customer - Sweden",
      src: "/lovable-uploads/0f630d60-d26c-479d-9ec8-6e38a40bdd2b.png"
    },
    {
      quote: "I bought an apartment through Future Homes with the help of the best Ali. I received wonderful service. Thank you Ali for excellent service and patience. I can warmly recommend buying from Future Homes through Ali.",
      name: "Hanan Aldalawi",
      designation: "Customer - Dubai",
      src: "/lovable-uploads/f1300762-7ea4-4f88-924d-47e4e250acd4.png"  
    },
    {
      quote: "I wanted to buy a property in Konyaalti when I accidentally came to Future homes and was delighted with their professionalism. I think this property is just the beginning of a long-term cooperation with Future homes.",
      name: "Milan Mitic",
      designation: "Local Guide - Serbia",
      src: "/lovable-uploads/c2f3e289-428a-49e8-b76e-6d99ba20bed7.png"
    },
    {
      quote: "Bought our first apartment in Turkey with Future Homes. Very quick responses to any type of question that we had, everything is explained clearly and thoroughly. Advisor Elena is super knowledgeable, friendly and listened to every need we had.",
      name: "Olga",
      designation: "Local Guide - Sweden",
      src: "/lovable-uploads/0f630d60-d26c-479d-9ec8-6e38a40bdd2b.png"
    },
    {
      quote: "I am very happy with Ali Karan and Future Homes of the sales I did in Antalya. Definitely recommend this company.",
      name: "Maher Mare",
      designation: "Customer - International",
      src: "/lovable-uploads/f1300762-7ea4-4f88-924d-47e4e250acd4.png"
    },
    {
      quote: "I have a confession to make! I'm the one who gave those guys the hardest time in their career so far. I asked all kinds of questions, made all sorts of changes to the sale contract, and disturbed them even on weekends and holidays. But they handled everything professionally.",
      name: "Amro",
      designation: "Customer - International",
      src: "/lovable-uploads/c2f3e289-428a-49e8-b76e-6d99ba20bed7.png"
    },
    {
      quote: "Very professional approach. A young company with great ambitions that works hard to ensure the customer goes through a safe real estate transaction. They focus on long-term relationships and care about the relationship.",
      name: "Pro Fast",
      designation: "Customer - Sweden",
      src: "/lovable-uploads/0f630d60-d26c-479d-9ec8-6e38a40bdd2b.png"
    },
    {
      quote: "My husband and I have bought 3 apartments from Ali Karan and Future Homes. I am very satisfied with their professional service and the help I got even after the sale was done. I have received my 3 title deeds and I am a happy customer.",
      name: "Elham Ahmadi Farsangi",
      designation: "Customer - International",
      src: "/lovable-uploads/f1300762-7ea4-4f88-924d-47e4e250acd4.png"
    }
  ], []);

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
            <TestimonialsColumn testimonials={firstColumn} duration={15} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
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
          </div>
        </div>
      </section>
      
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
