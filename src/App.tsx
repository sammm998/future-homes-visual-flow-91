import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Suspense, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import { PerformanceOptimizer } from "@/components/PerformanceOptimizer";
import { initPerformanceMonitoring } from "@/utils/performanceBudget";

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

const VideoShowcase = lazy(() => import("./pages/VideoShowcase"));


// Enhanced query client for global accessibility
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.message?.includes('400') || error?.message?.includes('404')) {
          return false;
        }
        // Retry up to 3 times for network errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff with 30s max
      networkMode: 'offlineFirst', // Better handling for poor connections
    },
    mutations: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.message?.includes('400') || error?.message?.includes('404')) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
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
  // Initialize performance monitoring
  React.useEffect(() => {
    initPerformanceMonitoring();
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <CurrencyProvider>
            <TooltipProvider>
              <BrowserRouter>
                <PerformanceMonitor logLevel="basic" />
                <PerformanceOptimizer 
                  preloadImages={[
                    '/lovable-uploads/9b08d909-a9da-4946-942a-c24106cd57f7.png',
                    '/placeholder.svg'
                  ]}
                  prefetchRoutes={['/antalya', '/dubai', '/cyprus', '/property-gallery']}
                />
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
  return (
    <>
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