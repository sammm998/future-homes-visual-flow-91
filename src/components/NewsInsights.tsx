import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileText, Heart, CreditCard, MapPin, Home, Scale, DollarSign, Users, Briefcase, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBlogPosts } from "@/hooks/useBlogPosts";



const NewsInsights = () => {
  const navigate = useNavigate();
  const { blogPosts, loading } = useBlogPosts();

  const handleArticleClick = (slug: string) => {
    navigate(`/articles/${slug}`);
  };

  const handleViewAllClick = () => {
    navigate('/information');
  };

  // Icon mapping for different categories
  const getCategoryIcon = (title: string) => {
    if (title.toLowerCase().includes('citizenship') || title.toLowerCase().includes('legal')) {
      return <FileText className="w-5 h-5" />;
    }
    if (title.toLowerCase().includes('property') || title.toLowerCase().includes('purchase')) {
      return <Home className="w-5 h-5" />;
    }
    if (title.toLowerCase().includes('investment') || title.toLowerCase().includes('business')) {
      return <Briefcase className="w-5 h-5" />;
    }
    if (title.toLowerCase().includes('dubai') || title.toLowerCase().includes('building')) {
      return <Building className="w-5 h-5" />;
    }
    if (title.toLowerCase().includes('tax') || title.toLowerCase().includes('legal')) {
      return <Scale className="w-5 h-5" />;
    }
    if (title.toLowerCase().includes('cost') || title.toLowerCase().includes('finance')) {
      return <DollarSign className="w-5 h-5" />;
    }
    if (title.toLowerCase().includes('living') || title.toLowerCase().includes('culture')) {
      return <Users className="w-5 h-5" />;
    }
    return <FileText className="w-5 h-5" />;
  };

  const getCategoryColor = (index: number) => {
    const colors = ['text-blue-600', 'text-green-600', 'text-purple-600', 'text-orange-600', 'text-teal-600'];
    return colors[index % colors.length];
  };

  const getCategoryType = (title: string) => {
    if (title.toLowerCase().includes('citizenship') || title.toLowerCase().includes('legal')) return 'Legal Guide';
    if (title.toLowerCase().includes('investment') || title.toLowerCase().includes('business')) return 'Investment';
    if (title.toLowerCase().includes('property') || title.toLowerCase().includes('purchase')) return 'Property Guide';
    if (title.toLowerCase().includes('living') || title.toLowerCase().includes('culture')) return 'Lifestyle';
    if (title.toLowerCase().includes('dubai')) return 'Dubai Guide';
    if (title.toLowerCase().includes('france')) return 'France Guide';
    return 'Information';
  };

  // Get first 3 articles for the insights section
  const insights = blogPosts.slice(0, 3).map((post, index) => ({
    id: post.id,
    title: post.title,
    description: post.excerpt,
    type: getCategoryType(post.title),
    icon: getCategoryIcon(post.title),
    color: getCategoryColor(index),
    slug: post.slug
  }));

  if (loading) {
    return (
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">News & Insights</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Loading...
            </h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">News & Insights</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Stay Informed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Keep up to date with the latest property trends and market insights
            </p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {insights.map((item, index) => (
            <Card key={index} className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {item.type}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {item.description}
                </p>
                 <Button 
                  variant="ghost" 
                  className="group/button p-0 h-auto font-semibold"
                  onClick={() => handleArticleClick(item.slug)}
                >
                  Read More
                  <ArrowRight size={16} className="ml-2 transition-transform group-hover/button:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary-glow"
            onClick={handleViewAllClick}
          >
            View All Articles
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsInsights;