import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import { GlobalPerformanceOptimizer } from "@/components/GlobalPerformanceOptimizer";
import { AnimatePresence } from "framer-motion";
import { PageTransitionLoader } from "@/components/PageTransitionLoader";

import { ScrollToTop } from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import "./utils/cleanConsole";

// Lazy load all page components for better performance
const Index = lazy(() => import("./pages/Index"));
const PropertyWizard = lazy(() => import("./pages/PropertyWizard"));
const AIPropertySearch = lazy(() => import("./pages/AIPropertySearch"));

const AntalyaPropertySearch = lazy(() => import("./pages/AntalyaPropertySearch"));
const DubaiPropertySearch = lazy(() => {
  console.log('🏙️ Loading DubaiPropertySearch component...');
  return import("./pages/DubaiPropertySearch").catch(error => {
    console.error('❌ Failed to load DubaiPropertySearch:', error);
    throw error;
  });
});
const CyprusPropertySearch = lazy(() => import("./pages/CyprusPropertySearch"));
const MersinPropertySearch = lazy(() => import("./pages/MersinPropertySearch"));
const BaliPropertySearch = lazy(() => import("./pages/BaliPropertySearch"));


const PropertyDetail = lazy(() => import("./pages/PropertyDetail"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Information = lazy(() => import("./pages/Information"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const AliKaran = lazy(() => import("./pages/AliKaran"));
const PropertyGallery = lazy(() => import("./pages/PropertyGallery"));
const Article = lazy(() => import("./pages/Article"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SitemapXML = lazy(() => import("./pages/SitemapXML"));
const ExpensesBuyingPropertyTurkey = lazy(() => import("./pages/ExpensesBuyingPropertyTurkey"));
const Newsletter = lazy(() => import("./components/Newsletter"));
const ContactThankYou = lazy(() => import("./pages/ContactThankYou"));
const WizardThankYou = lazy(() => import("./pages/WizardThankYou"));

const VideoShowcase = lazy(() => import("./pages/VideoShowcase"));


// Enhanced query client for global accessibility
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes - increased for better caching
      gcTime: 30 * 60 * 1000, // 30 minutes - increased for better performance
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Prevent unnecessary refetches
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.message?.includes('400') || error?.message?.includes('404')) {
          return false;
        }
        // Retry only once for network errors to improve perceived speed
        return failureCount < 1;
      },
      retryDelay: 1000, // Fixed 1s delay
      networkMode: 'offlineFirst', // Better handling for poor connections
    },
    mutations: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.message?.includes('400') || error?.message?.includes('404')) {
          return false;
        }
        return failureCount < 1; // Reduced retries
      },
      retryDelay: 1000, // Fixed 1s delay  
      networkMode: 'offlineFirst',
    },
  },
});

// Enhanced loading component  
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <CurrencyProvider>
            <TooltipProvider>
              <BrowserRouter>
                <GlobalPerformanceOptimizer 
                  criticalImages={[
                    '/lovable-uploads/5506feef-2c81-4501-9f9d-5711a9dd3cce.png',
                    'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/rl9q4mj1esj.jpg'
                  ]}
                  enableImageOptimization={true}
                  enableResourceHints={true}
                />
                <PerformanceMonitor logLevel="none" />
                <Toaster />
                <Sonner />
                <ScrollToTop />
                <Suspense fallback={<PageLoader />}>
                  <AppContent />
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </CurrencyProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

function AppContent() {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 2000); // 2 seconds as requested

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isTransitioning && <PageTransitionLoader key="page-transition" />}
      </AnimatePresence>
      <ConnectionStatus />
      <Routes>
      <Route path="/" element={
        <>
          <Index />
          <Newsletter />
        </>
      } />
      
      <Route path="/property-wizard" element={<PropertyWizard />} />
      <Route path="/ai-property-search" element={<AIPropertySearch />} />
      
      <Route path="/antalya" element={<AntalyaPropertySearch />} />
      <Route path="/dubai" element={<DubaiPropertySearch />} />
      <Route path="/cyprus" element={<CyprusPropertySearch />} />
      <Route path="/mersin" element={<MersinPropertySearch />} />
      <Route path="/bali" element={<BaliPropertySearch />} />
      
      
      <Route path="/property/:id" element={<PropertyDetail />} />
      <Route path="/testimonials" element={<Testimonials />} />
      <Route path="/information" element={<Information />} />
      <Route path="/about-us" element={<AboutUs />} />
      
      <Route path="/video-showcase" element={<VideoShowcase />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/contact-thank-you" element={<ContactThankYou />} />
      <Route path="/wizard-thank-you" element={<WizardThankYou />} />
      <Route path="/ali-karan" element={<AliKaran />} />
      <Route path="/property-gallery" element={<PropertyGallery />} />
      <Route path="/article/:id" element={<Article />} />
      <Route path="/articles/:slug" element={<ArticlePage />} />
      <Route path="/articles/expenses-buying-property-turkey" element={<ExpensesBuyingPropertyTurkey />} />
      <Route path="/sitemap.xml" element={<SitemapXML />} />
      <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;