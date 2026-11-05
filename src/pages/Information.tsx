import { useState, useEffect } from "react";
import React from "react";

import { useNavigate, useSearchParams, Link } from "@/lib/router-compat";
import DOMPurify from 'dompurify';
import Navigation from "@/components/Navigation";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContentSection } from "@/components/ContentSection";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { articles as staticArticles } from '@/data/articlesData';

import { Badge } from "@/components/ui/badge";
import CategoryCardCover from "@/components/CategoryCardCover";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Heart, 
  CreditCard, 
  MapPin, 
  Home, 
  Gavel, 
  Users, 
  Plane, 
  Building, 
  Shield, 
  Calculator, 
  BookOpen, 
  Globe, 
  Briefcase, 
  GraduationCap, 
  Car, 
  Stethoscope, 
  Phone, 
  Newspaper, 
  Filter, 
  DollarSign, 
  Scale, 
  Banknote, 
  Wifi, 
  TreePine, 
  Coffee, 
  Camera, 
  ShoppingCart, 
  Utensils, 
  Gamepad2, 
  Music, 
  PlaneTakeoff, 
  Laptop, 
  Sun, 
  Waves, 
  Mountain, 
  Palette, 
  Clock, 
  Zap, 
  Activity, 
  Award, 
  BookmarkCheck, 
  Coins 
} from "lucide-react";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useTranslation } from "@/hooks/useTranslation";

// Import new generated images
import propertyInspectionChecklist from "@/assets/property-inspection-checklist.jpg";
import luxuryPropertyInvestment from "@/assets/luxury-property-investment.jpg";
import commercialRealEstateInvestment from "@/assets/commercial-real-estate-investment.jpg";
import sustainablePropertyDevelopment from "@/assets/sustainable-property-development.jpg";
import realEstateDevelopmentManagement from "@/assets/real-estate-development-management.jpg";
import internationalPropertyOwnership from "@/assets/international-property-ownership-structures.jpg";
import crossBorderPropertyLegal from "@/assets/cross-border-property-legal.jpg";
import propertyInvestmentCompliance from "@/assets/property-investment-compliance.jpg";
import internationalInheritanceSuccession from "@/assets/international-inheritance-succession.jpg";
import propertyLegalRiskManagement from "@/assets/property-legal-risk-management.jpg";
import expatriateCommunityIntegration from "@/assets/expatriate-community-integration.jpg";
import internationalLifestyleCostComparison from "@/assets/international-lifestyle-cost-comparison.jpg";
import climateGeographicLifestyleFactors from "@/assets/climate-geographic-lifestyle-factors.jpg";
import workLifeBalanceInternational from "@/assets/work-life-balance-international.jpg";
import internationalFamilyLiving from "@/assets/international-family-living.jpg";
import realEstatePrivateEquity from "@/assets/real-estate-private-equity.jpg";
import crossBorderInvestmentTaxation from "@/assets/cross-border-investment-taxation.jpg";
import realEstateFundPerformanceAnalysis from "@/assets/real-estate-fund-performance-analysis.jpg";
import distressedRealEstateInvestment from "@/assets/distressed-real-estate-investment.jpg";
import realEstateTechnologyTransformation from "@/assets/real-estate-technology-transformation.jpg";
import informationHero from "@/assets/luxury-property-investment.jpg";
import { EditorialSectionHeader, PublicPageHero } from "@/components/PublicEditorial";

const STORAGE_KEY = 'fh:lastInfoFilter';

const Information = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial filter from URL (?cat=dubai) so deep-links and back-navigation work
  const initialFilter =
    searchParams.get('cat') ||
    (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(STORAGE_KEY) : null) ||
    'all';
  const [activeFilter, setActiveFilter] = useState<string>(initialFilter);

  // Keep URL + sessionStorage in sync when the user switches filter
  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, activeFilter); } catch {}
    const next = new URLSearchParams(searchParams);
    if (activeFilter && activeFilter !== 'all') {
      next.set('cat', activeFilter);
    } else {
      next.delete('cat');
    }
    // Avoid pushing duplicate history entries
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  const { blogPosts, loading } = useBlogPosts();
  const { heroTitle, heroSubtitle, contentSections, isLoading: contentLoading } = useWebsiteContent("information");

  const filterItems = [
    { name: t('info.all'), value: "all", icon: Filter },
    { name: t('info.property'), value: "property", icon: Home },
    { name: t('info.legal'), value: "legal", icon: Scale },
    { name: t('info.finance'), value: "finance", icon: DollarSign },
    { name: t('info.living'), value: "living", icon: Users },
    { name: t('info.investment'), value: "investment", icon: Briefcase },
    { name: t('info.dubai'), value: "dubai", icon: Building },
    { name: t('info.bali'), value: "bali", icon: TreePine },
    { name: t('info.turkey'), value: "turkey", icon: MapPin },
    { name: t('info.cyprus'), value: "cyprus", icon: Globe },
  ];

  const canonicalCategories = new Set(['property', 'legal', 'finance', 'living', 'investment', 'dubai', 'bali', 'turkey', 'cyprus']);
  const containsAny = (text: string, terms: string[]) => terms.some((term) => text.includes(term));

  // Prefer the saved taxonomy. For older posts, classify from concise metadata
  // only; scanning the full article caused incidental words to select the wrong tab.
  const getArticleCategory = (title: string, excerpt = '', savedCategory = '', tags: string[] = []) => {
    const normalizedSaved = savedCategory.trim().toLowerCase();
    if (canonicalCategories.has(normalizedSaved)) return normalizedSaved;

    const taxonomy = `${normalizedSaved} ${tags.join(' ')}`.toLowerCase();
    const titleText = title.toLowerCase();
    const summaryText = `${title} ${excerpt}`.toLowerCase();

    if (containsAny(taxonomy, ['dubai', 'uae']) || containsAny(titleText, ['dubai', 'uae'])) return 'dubai';
    if (taxonomy.includes('bali') || titleText.includes('bali')) return 'bali';
    if (containsAny(taxonomy, ['turkey', 'turkish', 'antalya', 'mersin', 'istanbul']) || containsAny(titleText, ['turkey', 'turkish', 'antalya', 'mersin', 'istanbul'])) return 'turkey';
    if (containsAny(taxonomy, ['cyprus', 'cypriot']) || containsAny(titleText, ['cyprus', 'cypriot'])) return 'cyprus';

    if (containsAny(taxonomy, ['legal', 'law', 'visa', 'residency', 'citizenship', 'inheritance', 'compliance']) || containsAny(summaryText, ['legal', 'law', 'visa', 'residency', 'citizenship', 'inheritance', 'compliance', 'title deed'])) return 'legal';
    if (containsAny(taxonomy, ['living', 'lifestyle', 'culture', 'cuisine', 'dining', 'healthcare', 'education', 'retirement']) || containsAny(summaryText, ['living', 'lifestyle', 'culture', 'cuisine', 'dining', 'healthcare', 'education', 'retirement', 'food'])) return 'living';
    if (containsAny(taxonomy, ['finance', 'tax', 'banking', 'currency', 'mortgage', 'cost']) || containsAny(summaryText, ['finance', 'tax', 'banking', 'currency', 'mortgage', 'exchange rate', 'buying cost'])) return 'finance';
    if (containsAny(taxonomy, ['investment', 'reit', 'portfolio', 'private equity', 'fund']) || containsAny(summaryText, ['investment strategy', 'reit', 'portfolio', 'private equity', 'investment fund', 'market cycle', 'rental yield'])) return 'investment';
    return 'property';
  };

  // Helper function to get appropriate icon component
  const getArticleIconComponent = (title: string) => {
    const text = title.toLowerCase();
    if (text.includes('citizenship') || text.includes('legal')) return Gavel;
    if (text.includes('property') || text.includes('purchase')) return Home;
    if (text.includes('banking') || text.includes('finance')) return CreditCard;
    if (text.includes('healthcare')) return Stethoscope;
    if (text.includes('education')) return GraduationCap;
    if (text.includes('tax')) return Calculator;
    if (text.includes('transport')) return Car;
    if (text.includes('cost') || text.includes('expense')) return DollarSign;
    if (text.includes('business')) return Briefcase;
    if (text.includes('culture')) return Users;
    if (text.includes('insurance')) return Shield;
    if (text.includes('internet') || text.includes('telecommunication')) return Wifi;
    if (text.includes('climate') || text.includes('weather')) return Sun;
    if (text.includes('photography')) return Camera;
    if (text.includes('shopping')) return ShoppingCart;
    if (text.includes('cuisine') || text.includes('dining')) return Utensils;
    if (text.includes('gaming')) return Gamepad2;
    if (text.includes('music') || text.includes('arts')) return Music;
    if (text.includes('travel')) return PlaneTakeoff;
    if (text.includes('technology')) return Laptop;
    if (text.includes('coastal')) return Waves;
    if (text.includes('mountain') || text.includes('rural')) return Mountain;
    if (text.includes('art')) return Palette;
    if (text.includes('energy') || text.includes('utilities')) return Zap;
    if (text.includes('dubai')) return Building;
    if (text.includes('bali')) return TreePine;
    if (text.includes('turkey') || text.includes('antalya') || text.includes('mersin')) return MapPin;
    if (text.includes('cyprus')) return Globe;
    if (text.includes('bitcoin')) return Coins;
    return FileText;
  };

  // Helper function to get category-specific image using generated images for new articles
  const getArticleImage = (title: string, content: string, index: number) => {
    const text = (title + ' ' + content).toLowerCase();
    
    // Map specific new articles to their generated images
    if (title.includes('Property Investment Due Diligence') || title.includes('Property Inspection Guide')) {
      return propertyInspectionChecklist;
    }
    if (title.includes('High-Net-Worth Property') || title.includes('Luxury Property Market')) {
      return luxuryPropertyInvestment;
    }
    if (title.includes('Commercial Real Estate Investment')) {
      return commercialRealEstateInvestment;
    }
    if (title.includes('Sustainable Property Development') || title.includes('Green Building')) {
      return sustainablePropertyDevelopment;
    }
    if (title.includes('Real Estate Development Project')) {
      return realEstateDevelopmentManagement;
    }
    if (title.includes('International Property Ownership Structures')) {
      return internationalPropertyOwnership;
    }
    if (title.includes('Cross-Border Property Transaction') || title.includes('International Property Law')) {
      return crossBorderPropertyLegal;
    }
    if (title.includes('Property Investment Compliance') || title.includes('Anti-Money Laundering')) {
      return propertyInvestmentCompliance;
    }
    if (title.includes('International Inheritance') || title.includes('Estate Planning')) {
      return internationalInheritanceSuccession;
    }
    if (title.includes('Property Investment Legal Risk') || title.includes('Property Dispute Resolution')) {
      return propertyLegalRiskManagement;
    }
    if (title.includes('Expatriate Community Integration') || title.includes('Cultural Integration')) {
      return expatriateCommunityIntegration;
    }
    if (title.includes('International Lifestyle Cost') || title.includes('International Healthcare') || title.includes('Education Options')) {
      return internationalLifestyleCostComparison;
    }
    if (title.includes('Climate and Geographic') || title.includes('Coastal Living') || title.includes('Mountain Living')) {
      return climateGeographicLifestyleFactors;
    }
    if (title.includes('Work-Life Balance') || title.includes('Remote Work Living')) {
      return workLifeBalanceInternational;
    }
    if (title.includes('International Family Living') || title.includes('Retirement Living')) {
      return internationalFamilyLiving;
    }
    if (title.includes('Real Estate Private Equity') || title.includes('Alternative Real Estate Investment')) {
      return realEstatePrivateEquity;
    }
    if (title.includes('Cross-Border Real Estate Investment Taxation') || title.includes('International Tax Planning')) {
      return crossBorderInvestmentTaxation;
    }
    if (title.includes('Real Estate Investment Fund Performance') || title.includes('Market Cycles')) {
      return realEstateFundPerformanceAnalysis;
    }
    if (title.includes('Distressed Real Estate Investment')) {
      return distressedRealEstateInvestment;
    }
    if (title.includes('Real Estate Investment Technology') || title.includes('Impact Investing')) {
      return realEstateTechnologyTransformation;
    }
    
    // Use existing images from the project based on category for older articles
    if (text.includes('dubai')) {
      const dubaiImages = [
        '/lovable-uploads/739b5c8c-7e7d-42ee-a412-963fad0a408d.webp', // Dubai skyline
        '/lovable-uploads/6cefa26f-ebbb-490a-ac8c-3e27243dae92.webp', // Modern city 
        '/lovable-uploads/86a8042b-af76-4da8-8aeb-218ab9c24059.png'  // Dubai property
      ];
      return dubaiImages[index % dubaiImages.length];
    }
    
    if (text.includes('bali')) {
      const baliImages = [
        '/lovable-uploads/956541d2-b461-4acd-a29a-463c5a97983e.webp', // Bali landscape
        '/lovable-uploads/60f987b0-c196-47b5-894d-173d604fa4c8.webp', // Tropical setting
        '/lovable-uploads/0ecd2ba5-fc2d-42db-8052-d51cffc0b438.webp'  // Island paradise
      ];
      return baliImages[index % baliImages.length];
    }
    
    if (text.includes('turkey') || text.includes('antalya') || text.includes('mersin')) {
      const turkeyImages = [
        '/lovable-uploads/956541d2-b461-4acd-a29a-463c5a97983e.webp', // Turkey landscape
        '/lovable-uploads/60f987b0-c196-47b5-894d-173d604fa4c8.webp', // Turkish setting
        '/lovable-uploads/0ecd2ba5-fc2d-42db-8052-d51cffc0b438.webp'  // Turkey scenic
      ];
      return turkeyImages[index % turkeyImages.length];
    }
    
    if (text.includes('cyprus')) {
      const cyprusImages = [
        '/lovable-uploads/227fa1b1-f9c2-4427-a969-9521d121dd51.webp', // Cyprus landscape
        '/lovable-uploads/2adcc5fd-ef6d-4fee-8ed8-cc57be79fccf.webp', // Cyprus coastal
        '/lovable-uploads/4c6b5b9c-7b79-4474-b629-9e61e450f00b.webp'  // Cyprus property
      ];
      return cyprusImages[index % cyprusImages.length];
    }
    
    if (text.includes('legal') || text.includes('citizenship') || text.includes('law') || text.includes('permit') || text.includes('visa')) {
      const legalImages = [
        '/lovable-uploads/24d14ac8-45b8-44c2-8fff-159f96b0fee6.png', // Professional/legal
        '/lovable-uploads/ae81b7b2-74ce-4693-b5bf-43a5e3bb2b97.webp', // Business/legal
        '/lovable-uploads/760abba9-43a1-433b-83fd-d578ecda1828.webp'  // Legal documents
      ];
      return legalImages[index % legalImages.length];
    }
    
    if (text.includes('property') || text.includes('real estate') || text.includes('purchase')) {
      const propertyImages = [
        '/lovable-uploads/4c6b5b9c-7b79-4474-b629-9e61e450f00b.webp', // Luxury property
        '/lovable-uploads/7335e4e2-249c-4b29-b83a-0101453f6878.png', // Modern property
        '/lovable-uploads/aff7bebd-5943-45d9-84d8-a923abf07e24.webp'  // Property exterior
      ];
      return propertyImages[index % propertyImages.length];
    }
    
    if (text.includes('finance') || text.includes('banking') || text.includes('investment') || text.includes('bitcoin') || text.includes('cost')) {
      const financeImages = [
        '/lovable-uploads/57965b04-af07-45ca-8bb7-9dec10da9d29.png', // Finance/investment
        '/lovable-uploads/5daee4c4-d9d3-41c2-99bc-382e40915f52.webp', // Business finance
        '/lovable-uploads/c869b6e7-1d37-47cf-9558-55aa3d03053e.webp'  // Financial charts
      ];
      return financeImages[index % financeImages.length];
    }
    
    if (text.includes('living') || text.includes('lifestyle') || text.includes('culture') || text.includes('social')) {
      const livingImages = [
        '/lovable-uploads/956541d2-b461-4acd-a29a-463c5a97983e.webp', // Antalya lifestyle
        '/lovable-uploads/60f987b0-c196-47b5-894d-173d604fa4c8.webp', // Mersin living
        '/lovable-uploads/0ecd2ba5-fc2d-42db-8052-d51cffc0b438.webp'  // Social lifestyle
      ];
      return livingImages[index % livingImages.length];
    }
    
    if (text.includes('business') || text.includes('opportunity')) {
      const businessImages = [
        '/lovable-uploads/35d77b72-fddb-4174-b101-7f0dd0f3385d.webp', // Business opportunity
        '/lovable-uploads/4d9ff093-d8bd-4855-80db-6c58534a8e44.webp', // Investment opportunity
        '/lovable-uploads/9537b0b1-89b0-4c63-ae02-494c98caab5d.webp'  // Business growth
      ];
      return businessImages[index % businessImages.length];
    }
    
    if (text.includes('music') || text.includes('arts') || text.includes('art')) {
      const artsImages = [
        '/lovable-uploads/000f440d-ddb1-4c1b-9202-eef1ef588a8c.png', // Arts/culture
        '/lovable-uploads/0d7b0c8a-f652-488b-bfca-3a11c1694220.webp', // Cultural activities
        '/lovable-uploads/2209cb13-f5ad-47af-ad83-fac59b9edd3b.webp'  // Music/arts scene
      ];
      return artsImages[index % artsImages.length];
    }
    
    // Default category - use property images
    const defaultImages = [
      '/lovable-uploads/4c6b5b9c-7b79-4474-b629-9e61e450f00b.webp', // Default property 1
      '/lovable-uploads/227fa1b1-f9c2-4427-a969-9521d121dd51.webp', // Default property 2  
      '/lovable-uploads/2adcc5fd-ef6d-4fee-8ed8-cc57be79fccf.webp'  // Default property 3
    ];
    return defaultImages[index % defaultImages.length];
  };

  // Convert ALL blog posts to articles format and combine with static articles
  const databaseArticles = blogPosts.map((post, index) => ({
    id: index + 1000, // Offset to avoid conflicts with static article IDs
    title: post.title,
    description: post.excerpt || `${post.title} - Read more about this topic`,
    icon: getArticleIconComponent(post.source_title || post.title),
    // Use featured_image first, fallback to category-based images if null
    image: post.featured_image || getArticleImage(post.source_title || post.title, post.source_content || post.content, index),
    category: getArticleCategory(
      post.source_title || post.title,
      post.source_excerpt || post.excerpt,
      post.source_category || post.category || '',
      post.source_tags || post.tags || [],
    ),
    content: post.content,
    slug: post.slug, // Use the actual slug from database
    isDatabaseArticle: true, // Mark as database article
    published: post.published
  }));

  console.log(`Loaded ${databaseArticles.length} database articles from Supabase`);

  // Add default images to static articles that might not have them
  const staticArticlesWithImages = staticArticles.map((article, index) => ({
    ...article,
    image: article.image || getArticleImage(article.title, article.content, index),
    slug: article.title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
  }));

  // Combine static articles with database articles - database articles first to prioritize them
  const articles = [...databaseArticles, ...staticArticlesWithImages];

  const filteredArticles = activeFilter === "all" 
    ? articles 
    : articles.filter(article => article.category === activeFilter);

  console.log(`Total articles: ${articles.length}, Filtered: ${filteredArticles.length}`);

  // Article cards render as real <a> links so crawlers (and middle-click /
  // open-in-new-tab) work; the filter is still remembered for the Back button.
  const rememberFilter = () => {
    try { sessionStorage.setItem(STORAGE_KEY, activeFilter); } catch {}
  };

  const getArticlePath = (slug: string) =>
    databaseArticles.some((article) => article.slug === slug)
      ? `/articles/${slug}`
      : `/article/${slug}`;

  const handleArticleClick = (slug: string) => {
    console.log(`Clicking article with slug: ${slug}`);

    // Persist current filter so the article's Back button can return to it
    try { sessionStorage.setItem(STORAGE_KEY, activeFilter); } catch {}

    // Check if it's a database article (has proper slug from Supabase)
    const isDatabaseArticle = databaseArticles.some(article => article.slug === slug);

    console.log(`Is database article: ${isDatabaseArticle}`);

    if (isDatabaseArticle) {
      navigate(`/articles/${slug}`);
    } else {
      // Static article - use old route
      navigate(`/article/${slug}`);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Property Investment Guide | Real Estate Information & Insights"
        description="Expert guides on property investment, Turkish citizenship, buying process, legal requirements, and real estate insights for Turkey, Dubai, Cyprus & more."
        keywords="property investment guide, real estate information, Turkish citizenship, property buying guide, investment tips, real estate news"
        canonicalUrl="https://futurehomesinternational.com/information"
      />
      <Navigation />
      <PublicPageHero eyebrow={t('info.badge')} title={heroTitle || t('info.hero_title')} description={heroSubtitle || t('info.hero_subtitle')} image={informationHero} imageAlt="International property investment guide" primaryLabel={t('info.back_home')} primaryTo="/" compact />
      <div className="pb-16 pt-6 sm:pb-20 sm:pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Dynamic Content Sections */}
          {!contentLoading && contentSections.length > 0 && (
            <div className="mb-16">
              {contentSections.map((section, index) => (
                <ContentSection key={index} section={section} />
              ))}
            </div>
          )}

          <EditorialSectionHeader eyebrow="Knowledge library" title="Explore expert guidance by topic" description="Navigate buying, legal, finance, lifestyle and destination insights in one curated library." />

          {/* Filter Buttons */}
          <div className="-mx-4 mb-10 flex snap-x gap-2 overflow-x-auto border-b border-border px-4 pb-5 [scrollbar-width:none] sm:mx-0 sm:mb-12 sm:flex-wrap sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-8">
            {filterItems.map((filter) => {
              const IconComponent = filter.icon;
              return (
                <Button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  variant={activeFilter === filter.value ? "default" : "outline"}
                  className={activeFilter === filter.value ? "flex shrink-0 snap-start items-center gap-2 bg-navy text-navy-foreground hover:bg-navy/90" : "flex shrink-0 snap-start items-center gap-2 border-navy/15 bg-background hover:border-gold hover:bg-ivory"}
                >
                  <IconComponent className="w-4 h-4" />
                  {filter.name}
                </Button>
              );
            })}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                to={getArticlePath(article.slug)}
                onClick={() => rememberFilter()}
                className="block"
              >
              <Card
                className="group h-full cursor-pointer overflow-hidden rounded-lg border-border/70 transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-luxe)]"
              >
                {/* Article Cover — AI-generated image if available, otherwise branded category design */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy">
                  {article.image && /^(https?:\/\/|\/)/.test(article.image) ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <CategoryCardCover
                      category={article.category as any}
                      title={article.title}
                    />
                  )}
                </div>

                <CardHeader className="pb-4">
                  <p className="mb-3 text-[11px] font-semibold uppercase text-gold-foreground">{article.category}</p>
                  <CardTitle className="line-clamp-2 text-xl leading-snug transition-colors group-hover:text-gold-foreground">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                    {article.description}
                  </p>
                  <span className="group/button inline-flex h-auto items-center p-0 font-semibold text-gold-foreground">
                    {t('info.read_more')}
                    <ArrowRight size={16} className="ml-2 transition-transform group-hover/button:translate-x-1" />
                  </span>
                </CardContent>
              </Card>
              </Link>
            ))}
          </div>

          {/* No Results */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-foreground mb-2">{t('info.no_articles')}</h3>
              <p className="text-muted-foreground">
                {t('info.no_articles_desc')}
              </p>
            </div>
          )}

          {/* Back to Home */}
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              {t('info.back_home')}
            </Button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Information;