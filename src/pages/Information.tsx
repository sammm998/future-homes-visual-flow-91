import { useState } from "react";
import ElevenLabsWidget from "@/components/ElevenLabsWidget";
import { useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContentSection } from "@/components/ContentSection";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

import { Badge } from "@/components/ui/badge";
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

const Information = () => {
  const navigate = useNavigate();
  
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const { blogPosts, loading } = useBlogPosts();
  const { heroTitle, heroSubtitle, contentSections, isLoading: contentLoading } = useWebsiteContent("information");

  const filterItems = [{
    name: "All",
    value: "all",
    icon: Filter
  }, {
    name: "Property",
    value: "property",
    icon: Home
  }, {
    name: "Legal",
    value: "legal",
    icon: Scale
  }, {
    name: "Finance",
    value: "finance",
    icon: DollarSign
  }, {
    name: "Living",
    value: "living",
    icon: Users
  }, {
    name: "Investment",
    value: "investment",
    icon: Briefcase
  }, {
    name: "Dubai",
    value: "dubai",
    icon: Building
  }, {
    name: "Bali",
    value: "bali",
    icon: TreePine
  }];

  // Helper function to determine category based on title/content
  const getArticleCategory = (title: string, content: string) => {
    const text = (title + ' ' + content).toLowerCase();
    
    // Check for specific country/region categories first
    if (text.includes('dubai')) return 'dubai';
    if (text.includes('bali')) return 'bali';
    
    // Then check for general categories
    if (text.includes('property') || text.includes('purchase') || text.includes('real estate')) return 'property';
    if (text.includes('legal') || text.includes('citizenship') || text.includes('tax') || text.includes('law') || text.includes('permit') || text.includes('visa')) return 'legal';
    if (text.includes('finance') || text.includes('cost') || text.includes('banking') || text.includes('investment') || text.includes('bitcoin') || text.includes('incentive')) return 'finance';
    if (text.includes('living') || text.includes('culture') || text.includes('social') || text.includes('lifestyle') || text.includes('climate') || text.includes('coastal') || text.includes('mountain') || text.includes('rural')) return 'living';
    if (text.includes('investment') || text.includes('business') || text.includes('opportunity')) return 'investment';
    
    return 'property'; // default
  };

  // Helper function to get appropriate icon
  const getArticleIcon = (title: string) => {
    const text = title.toLowerCase();
    if (text.includes('citizenship') || text.includes('legal')) return <Gavel className="w-8 h-8 text-primary" />;
    if (text.includes('property') || text.includes('purchase')) return <Home className="w-8 h-8 text-primary" />;
    if (text.includes('banking') || text.includes('finance')) return <CreditCard className="w-8 h-8 text-primary" />;
    if (text.includes('healthcare')) return <Stethoscope className="w-8 h-8 text-primary" />;
    if (text.includes('education')) return <GraduationCap className="w-8 h-8 text-primary" />;
    if (text.includes('tax')) return <Calculator className="w-8 h-8 text-primary" />;
    if (text.includes('transport')) return <Car className="w-8 h-8 text-primary" />;
    if (text.includes('cost') || text.includes('expense')) return <DollarSign className="w-8 h-8 text-primary" />;
    if (text.includes('business')) return <Briefcase className="w-8 h-8 text-primary" />;
    if (text.includes('culture')) return <Users className="w-8 h-8 text-primary" />;
    if (text.includes('insurance')) return <Shield className="w-8 h-8 text-primary" />;
    if (text.includes('internet') || text.includes('telecommunication')) return <Wifi className="w-8 h-8 text-primary" />;
    if (text.includes('climate') || text.includes('weather')) return <Sun className="w-8 h-8 text-primary" />;
    if (text.includes('photography')) return <Camera className="w-8 h-8 text-primary" />;
    if (text.includes('shopping')) return <ShoppingCart className="w-8 h-8 text-primary" />;
    if (text.includes('cuisine') || text.includes('dining')) return <Utensils className="w-8 h-8 text-primary" />;
    if (text.includes('gaming')) return <Gamepad2 className="w-8 h-8 text-primary" />;
    if (text.includes('music') || text.includes('arts')) return <Music className="w-8 h-8 text-primary" />;
    if (text.includes('travel')) return <PlaneTakeoff className="w-8 h-8 text-primary" />;
    if (text.includes('technology')) return <Laptop className="w-8 h-8 text-primary" />;
    if (text.includes('coastal')) return <Waves className="w-8 h-8 text-primary" />;
    if (text.includes('mountain') || text.includes('rural')) return <Mountain className="w-8 h-8 text-primary" />;
    if (text.includes('art')) return <Palette className="w-8 h-8 text-primary" />;
    if (text.includes('energy') || text.includes('utilities')) return <Zap className="w-8 h-8 text-primary" />;
    if (text.includes('dubai')) return <Building className="w-8 h-8 text-primary" />;
    if (text.includes('bali')) return <TreePine className="w-8 h-8 text-primary" />;
    if (text.includes('bitcoin')) return <Coins className="w-8 h-8 text-primary" />;
    return <FileText className="w-8 h-8 text-primary" />;
  };

  // Helper function to get category-specific image using existing project images
  const getArticleImage = (title: string, content: string, index: number) => {
    const text = (title + ' ' + content).toLowerCase();
    
    // Use existing images from the project based on category
    if (text.includes('dubai')) {
      const dubaiImages = [
        '/lovable-uploads/739b5c8c-7e7d-42ee-a412-963fad0a408d.png', // Dubai skyline
        '/lovable-uploads/6cefa26f-ebbb-490a-ac8c-3e27243dae92.png', // Modern city 
        '/lovable-uploads/86a8042b-af76-4da8-8aeb-218ab9c24059.png'  // Dubai property
      ];
      return dubaiImages[index % dubaiImages.length];
    }
    
    if (text.includes('bali')) {
      const baliImages = [
        '/lovable-uploads/956541d2-b461-4acd-a29a-463c5a97983e.png', // Bali landscape
        '/lovable-uploads/60f987b0-c196-47b5-894d-173d604fa4c8.png', // Tropical setting
        '/lovable-uploads/0ecd2ba5-fc2d-42db-8052-d51cffc0b438.png'  // Island paradise
      ];
      return baliImages[index % baliImages.length];
    }
    
    if (text.includes('legal') || text.includes('citizenship') || text.includes('law') || text.includes('permit') || text.includes('visa')) {
      const legalImages = [
        '/lovable-uploads/24d14ac8-45b8-44c2-8fff-159f96b0fee6.png', // Professional/legal
        '/lovable-uploads/ae81b7b2-74ce-4693-b5bf-43a5e3bb2b97.png', // Business/legal
        '/lovable-uploads/760abba9-43a1-433b-83fd-d578ecda1828.png'  // Legal documents
      ];
      return legalImages[index % legalImages.length];
    }
    
    if (text.includes('property') || text.includes('real estate') || text.includes('purchase')) {
      const propertyImages = [
        '/lovable-uploads/4c6b5b9c-7b79-4474-b629-9e61e450f00b.png', // Luxury property
        '/lovable-uploads/7335e4e2-249c-4b29-b83a-0101453f6878.png', // Modern property
        '/lovable-uploads/aff7bebd-5943-45d9-84d8-a923abf07e24.png'  // Property exterior
      ];
      return propertyImages[index % propertyImages.length];
    }
    
    if (text.includes('finance') || text.includes('banking') || text.includes('investment') || text.includes('bitcoin') || text.includes('cost')) {
      const financeImages = [
        '/lovable-uploads/57965b04-af07-45ca-8bb7-9dec10da9d29.png', // Finance/investment
        '/lovable-uploads/5daee4c4-d9d3-41c2-99bc-382e40915f52.png', // Business finance
        '/lovable-uploads/c869b6e7-1d37-47cf-9558-55aa3d03053e.png'  // Financial charts
      ];
      return financeImages[index % financeImages.length];
    }
    
    if (text.includes('living') || text.includes('lifestyle') || text.includes('culture') || text.includes('social')) {
      const livingImages = [
        '/lovable-uploads/956541d2-b461-4acd-a29a-463c5a97983e.png', // Antalya lifestyle
        '/lovable-uploads/60f987b0-c196-47b5-894d-173d604fa4c8.png', // Mersin living
        '/lovable-uploads/0ecd2ba5-fc2d-42db-8052-d51cffc0b438.png'  // Social lifestyle
      ];
      return livingImages[index % livingImages.length];
    }
    
    if (text.includes('business') || text.includes('opportunity')) {
      const businessImages = [
        '/lovable-uploads/35d77b72-fddb-4174-b101-7f0dd0f3385d.png', // Business opportunity
        '/lovable-uploads/4d9ff093-d8bd-4855-80db-6c58534a8e44.png', // Investment opportunity
        '/lovable-uploads/9537b0b1-89b0-4c63-ae02-494c98caab5d.png'  // Business growth
      ];
      return businessImages[index % businessImages.length];
    }
    
    if (text.includes('music') || text.includes('arts') || text.includes('art')) {
      const artsImages = [
        '/lovable-uploads/000f440d-ddb1-4c1b-9202-eef1ef588a8c.png', // Arts/culture
        '/lovable-uploads/0d7b0c8a-f652-488b-bfca-3a11c1694220.png', // Cultural activities
        '/lovable-uploads/2209cb13-f5ad-47af-ad83-fac59b9edd3b.png'  // Music/arts scene
      ];
      return artsImages[index % artsImages.length];
    }
    
    // Default category - use property images
    const defaultImages = [
      '/lovable-uploads/4c6b5b9c-7b79-4474-b629-9e61e450f00b.png', // Default property 1
      '/lovable-uploads/227fa1b1-f9c2-4427-a969-9521d121dd51.png', // Default property 2  
      '/lovable-uploads/2adcc5fd-ef6d-4fee-8ed8-cc57be79fccf.png'  // Default property 3
    ];
    return defaultImages[index % defaultImages.length];
  };

  // Convert blog posts to articles format
  const articles = blogPosts.map((post, index) => ({
    id: index + 1,
    title: post.title,
    description: post.excerpt,
    icon: getArticleIcon(post.title),
    // Use featured_image first, fallback to category-based images if null
    image: post.featured_image || getArticleImage(post.title, post.content, index),
    category: getArticleCategory(post.title, post.content),
    content: post.content,
    slug: post.slug
  }));

  const filteredArticles = activeFilter === "all" 
    ? articles 
    : articles.filter(article => article.category === activeFilter);

  const handleArticleClick = (slug: string) => {
    navigate(`/articles/${slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/10">
        <Navigation />
        <NavBar items={[]} onFilterChange={() => {}} activeFilter="" />
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">Loading Articles...</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/10">
      <Navigation />
      <NavBar items={[]} onFilterChange={() => {}} activeFilter="" />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          
          {/* Dynamic Content Sections */}
          {!contentLoading && contentSections.length > 0 && (
            <div className="mb-16">
              {contentSections.map((section, index) => (
                <ContentSection key={index} section={section} />
              ))}
            </div>
          )}

          {/* Hero Section - Database content with fallback */}
          {/* <div className="text-center mb-8">
            <Badge className="mb-4">Information Center</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {heroTitle || "Information Center"}
            </h1>
            <div className="max-w-4xl mx-auto">
              <TextGenerateEffect
                words={heroSubtitle || "Comprehensive guides and insights for property investment, legal requirements and living abroad. Everything you need to know about international real estate."}
                className="text-lg text-muted-foreground leading-relaxed mb-8"
                filter={false}
                duration={0.8}
              />
            </div>
          </div> */}

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {filterItems.map((filter) => {
              const IconComponent = filter.icon;
              return (
                <Button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  variant={activeFilter === filter.value ? "default" : "outline"}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="w-4 h-4" />
                  {filter.name}
                </Button>
              );
            })}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <Card 
                key={article.id} 
                className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
                onClick={() => handleArticleClick(article.slug)}
              >
                {/* Article Image */}
                <div className="relative h-48 w-full overflow-hidden">
                   <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Use a more reliable fallback image
                      e.currentTarget.src = `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&crop=center`;
                    }}
                    loading="lazy"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="text-xs capitalize bg-white/90 backdrop-blur-sm">
                      {article.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      {article.icon}
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                    {article.description}
                  </p>
                  <Button 
                    variant="ghost" 
                    className="group/button p-0 h-auto font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArticleClick(article.slug);
                    }}
                  >
                    Read More 
                    <ArrowRight size={16} className="ml-2 transition-transform group-hover/button:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-foreground mb-2">No Articles Found</h3>
              <p className="text-muted-foreground">
                No articles match the selected filter. Try selecting a different category.
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
              Back to Home
            </Button>
          </div>
        </div>
      </div>
      
      {/* ElevenLabs Widget */}
      <ElevenLabsWidget />
    </div>
  );
};

export default Information;