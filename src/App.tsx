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

import { ScrollToTop } from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import "./utils/cleanConsole";
import { useLanguageUrlSync } from "@/hooks/useLanguageUrlSync";

// Lazy load all page components for better performance
const Index = lazy(() => import("./pages/Index"));
const PropertyWizard = lazy(() => import("./pages/PropertyWizard"));
const AIPropertySearch = lazy(() => import("./pages/AIPropertySearch"));


const AntalyaPropertySearch = lazy(() => import("./pages/AntalyaPropertySearch"));
const IstanbulPropertySearch = lazy(() => import("./pages/IstanbulPropertySearch"));
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
const Article = lazy(() => import("./pages/Article"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SitemapXML = lazy(() => import("./pages/SitemapXML"));
const ExpensesBuyingPropertyTurkey = lazy(() => import("./pages/ExpensesBuyingPropertyTurkey"));
const Newsletter = lazy(() => import("./components/Newsletter"));
const ContactThankYou = lazy(() => import("./pages/ContactThankYou"));
const WizardThankYou = lazy(() => import("./pages/WizardThankYou"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const MapSearch = lazy(() => import("./pages/MapSearch"));
const CoursesIndex = lazy(() => import("./pages/CoursesIndex"));
const CourseOverview = lazy(() => import("./pages/CourseOverview"));
const CourseLesson = lazy(() => import("./pages/CourseLesson"));
const CourseFinalExam = lazy(() => import("./pages/CourseFinalExam"));
const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const AdminOverview = lazy(() => import("./admin/pages/AdminOverview"));
const AdminPropertiesList = lazy(() => import("./admin/pages/PropertiesList"));
const AdminPropertyEdit = lazy(() => import("./admin/pages/PropertyEdit"));
const AdminPlaceholder = lazy(() => import("./admin/pages/AdminPlaceholder"));
const AdminBlogList = lazy(() => import("./admin/pages/BlogList"));
const AdminBlogEdit = lazy(() => import("./admin/pages/BlogEdit"));
const AdminBlogAI = lazy(() => import("./admin/pages/BlogAI"));
const AdminLeadsList = lazy(() => import("./admin/pages/LeadsList"));
const AdminLeadDetail = lazy(() => import("./admin/pages/LeadDetail"));
const AdminContactsList = lazy(() => import("./admin/pages/ContactsList"));
const AdminTasksList = lazy(() => import("./admin/pages/TasksList"));
const AdminEmailInbox = lazy(() => import("./admin/pages/EmailInbox"));
const AdminCampaignsList = lazy(() => import("./admin/pages/CampaignsList"));
const AdminCampaignEdit = lazy(() => import("./admin/pages/CampaignEdit"));
const AdminSubscribersList = lazy(() => import("./admin/pages/SubscribersList"));
const AdminTemplatesList = lazy(() => import("./admin/pages/TemplatesList"));
const AdminAnalyticsTraffic = lazy(() => import("./admin/pages/AnalyticsTraffic"));
const AdminAnalyticsProperties = lazy(() => import("./admin/pages/AnalyticsProperties"));
const AdminAnalyticsLeads = lazy(() => import("./admin/pages/AnalyticsLeads"));
const AdminAnalyticsEmail = lazy(() => import("./admin/pages/AnalyticsEmail"));
const AdminAnalyticsRealtime = lazy(() => import("./admin/pages/AnalyticsRealtime"));
const AdminSettings = lazy(() => import("./admin/pages/AdminSettings"));
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";


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
  // Sync language URL when ?lang= changes (e.g. from Elfsight widget)
  useLanguageUrlSync();

  return (
    <>
      <ConnectionStatus />
      <main>
      <Routes>
      <Route path="/" element={
        <>
          <Index />
          <Newsletter />
        </>
      } />
      
      <Route path="/property-wizard" element={<PropertyWizard />} />
      <Route path="/ai-property-search" element={<AIPropertySearch />} />
      
      <Route path="/map-search" element={<MapSearch />} />
      
      <Route path="/antalya" element={<AntalyaPropertySearch />} />
      <Route path="/istanbul" element={<IstanbulPropertySearch />} />
      <Route path="/dubai" element={<DubaiPropertySearch />} />
      <Route path="/cyprus" element={<CyprusPropertySearch />} />
      <Route path="/mersin" element={<MersinPropertySearch />} />
      <Route path="/bali" element={<BaliPropertySearch />} />
      
      {/* Property detail routes - all languages */}
      <Route path="/property/:id" element={<PropertyDetail />} />
      <Route path="/fastighet/:id" element={<PropertyDetail />} />
      <Route path="/mulk/:id" element={<PropertyDetail />} />
      <Route path="/aqar/:id" element={<PropertyDetail />} />
      <Route path="/nedvizhimost/:id" element={<PropertyDetail />} />
      <Route path="/eiendom/:id" element={<PropertyDetail />} />
      <Route path="/ejendom/:id" element={<PropertyDetail />} />
      <Route path="/melk/:id" element={<PropertyDetail />} />
      <Route path="/jaidad/:id" element={<PropertyDetail />} />
      
      <Route path="/testimonials" element={<Testimonials />} />
      <Route path="/information" element={<Information />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/contact-thank-you" element={<ContactThankYou />} />
      <Route path="/wizard-thank-you" element={<WizardThankYou />} />
      <Route path="/ali-karan" element={<AliKaran />} />
      <Route path="/article/:id" element={<Article />} />
      <Route path="/articles/:slug" element={<ArticlePage />} />
      <Route path="/articles/expenses-buying-property-turkey" element={<ExpensesBuyingPropertyTurkey />} />
      <Route path="/courses" element={<CoursesIndex />} />
      <Route path="/courses/:country" element={<CourseOverview />} />
      <Route path="/courses/:country/final-exam" element={<CourseFinalExam />} />
      <Route path="/courses/:country/:moduleSlug" element={<CourseLesson />} />
      <Route path="/sitemap.xml" element={<SitemapXML />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
      <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
        <Route index element={<AdminOverview />} />
        <Route path="properties" element={<AdminPropertiesList />} />
        <Route path="properties/new" element={<AdminPropertyEdit />} />
        <Route path="properties/:id" element={<AdminPropertyEdit />} />
        <Route path="blog" element={<AdminBlogList />} />
        <Route path="blog/ai" element={<AdminBlogAI />} />
        <Route path="blog/new" element={<AdminBlogEdit />} />
        <Route path="blog/:id" element={<AdminBlogEdit />} />
        <Route path="crm" element={<AdminPlaceholder title="CRM · Leads" />} />
        <Route path="crm/leads" element={<AdminPlaceholder title="Leads" />} />
        <Route path="crm/tasks" element={<AdminPlaceholder title="Tasks" />} />
        <Route path="email" element={<AdminPlaceholder title="Email campaigns" />} />
        <Route path="email/templates" element={<AdminPlaceholder title="Email templates" />} />
        <Route path="email/subscribers" element={<AdminPlaceholder title="Subscribers" />} />
        <Route path="analytics" element={<AdminPlaceholder title="Analytics" />} />
        <Route path="settings" element={<AdminPlaceholder title="Settings" />} />
      </Route>
      <Route path="*" element={<NotFound />} />
      </Routes>
      </main>
    </>
  );
}

export default App;