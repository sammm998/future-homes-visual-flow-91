import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import PerformanceMonitor from "@/components/PerformanceMonitor";

import { ScrollToTop } from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./utils/cleanConsole";

// Lazy load all page components for better performance
const Index = lazy(() => import("./pages/Index"));
const PropertyWizard = lazy(() => import("./pages/PropertyWizard"));
const AIPropertySearch = lazy(() => import("./pages/AIPropertySearch"));
const AntalyaPropertySearch = lazy(() => import("./pages/AntalyaPropertySearch"));
const DubaiPropertySearch = lazy(() => import("./pages/DubaiPropertySearch"));
const CyprusPropertySearch = lazy(() => import("./pages/CyprusPropertySearch"));
const MersinPropertySearch = lazy(() => import("./pages/MersinPropertySearch"));
const FrancePropertySearch = lazy(() => import("./pages/FrancePropertySearch"));

const PropertyDetail = lazy(() => import("./pages/PropertyDetail"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Information = lazy(() => import("./pages/Information"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Article = lazy(() => import("./pages/Article"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SitemapXML = lazy(() => import("./pages/SitemapXML"));
const Newsletter = lazy(() => import("./components/Newsletter"));


// Optimized query client with aggressive caching for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes - increased for better caching
      gcTime: 30 * 60 * 1000, // 30 minutes - keep data longer in cache
      refetchOnWindowFocus: false,
      refetchOnReconnect: false, // Reduce unnecessary refetches
      retry: 1,
      networkMode: 'offlineFirst', // Use cache first
    },
  },
});

// Enhanced loading component with retry for chunk loading errors
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Wrapper for lazy components with chunk loading error handling
const withChunkErrorHandling = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => {
  return React.forwardRef<any, any>((props, ref) => {
    const [retryCount, setRetryCount] = React.useState(0);
    
    return (
      <React.Suspense
        fallback={<PageLoader />}
      >
        <ErrorBoundary
          fallback={({ error, resetError }) => {
            if (error?.message?.includes('Loading chunk') && retryCount < 3) {
              // Automatically retry chunk loading errors
              setTimeout(() => {
                setRetryCount(count => count + 1);
                resetError();
              }, 1000);
              
              return <PageLoader />;
            }
            
            return (
              <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Loading Error</h2>
                  <p className="text-muted-foreground mb-6">
                    Failed to load page content. This may be due to a network issue.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Reload Page
                  </button>
                </div>
              </div>
            );
          }}
        >
          <Component {...props} ref={ref} />
        </ErrorBoundary>
      </React.Suspense>
    );
  });
};

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <CurrencyProvider>
          <TooltipProvider>
            <BrowserRouter>
              <PerformanceMonitor logLevel="basic" />
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

const AppContent = () => {
  // Log router context for debugging
  React.useEffect(() => {
    console.info('Router context initialized:', {
      location: window.location.href,
      pathname: window.location.pathname,
      userAgent: navigator.userAgent
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={
        <>
          {React.createElement(withChunkErrorHandling(Index))}
          <Newsletter />
        </>
      } />
      
      <Route path="/property-wizard" element={React.createElement(withChunkErrorHandling(PropertyWizard))} />
      <Route path="/ai-property-search" element={React.createElement(withChunkErrorHandling(AIPropertySearch))} />
      <Route path="/antalya" element={React.createElement(withChunkErrorHandling(AntalyaPropertySearch))} />
      <Route path="/dubai" element={React.createElement(withChunkErrorHandling(DubaiPropertySearch))} />
      <Route path="/cyprus" element={React.createElement(withChunkErrorHandling(CyprusPropertySearch))} />
      <Route path="/mersin" element={React.createElement(withChunkErrorHandling(MersinPropertySearch))} />
      <Route path="/france" element={React.createElement(withChunkErrorHandling(FrancePropertySearch))} />
      
      <Route path="/property/:id" element={React.createElement(withChunkErrorHandling(PropertyDetail))} />
      <Route path="/testimonials" element={React.createElement(withChunkErrorHandling(Testimonials))} />
      <Route path="/information" element={React.createElement(withChunkErrorHandling(Information))} />
      <Route path="/about-us" element={React.createElement(withChunkErrorHandling(AboutUs))} />
      <Route path="/contact-us" element={React.createElement(withChunkErrorHandling(ContactUs))} />
      <Route path="/article/:id" element={React.createElement(withChunkErrorHandling(Article))} />
      <Route path="/articles/:slug" element={React.createElement(withChunkErrorHandling(ArticlePage))} />
      <Route path="/sitemap.xml" element={React.createElement(withChunkErrorHandling(SitemapXML))} />
      <Route path="*" element={React.createElement(withChunkErrorHandling(NotFound))} />
    </Routes>
  );
};

export default App;