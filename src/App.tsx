import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

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



// Minimal loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const App = () => (
  <BrowserRouter>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<><Index /><Newsletter /></>} />
        
        <Route path="/property-wizard" element={<PropertyWizard />} />
        <Route path="/ai-property-search" element={<AIPropertySearch />} />
        <Route path="/antalya" element={<AntalyaPropertySearch />} />
        <Route path="/dubai" element={<DubaiPropertySearch />} />
        <Route path="/cyprus" element={<CyprusPropertySearch />} />
        <Route path="/mersin" element={<MersinPropertySearch />} />
        <Route path="/france" element={<FrancePropertySearch />} />
        
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/information" element={<Information />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/article/:id" element={<Article />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route path="/sitemap.xml" element={<SitemapXML />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;