import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import DOMPurify from 'dompurify';
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useBlogPost } from "@/hooks/useBlogPosts";
import ElevenLabsWidget from "@/components/ElevenLabsWidget";

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { blogPost, loading, error } = useBlogPost(slug || '');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/10">
        <Navigation />
         <div className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-foreground">Loading article...</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/10">
        <Navigation />
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
              <p className="text-xl text-muted-foreground mb-8">Article not found</p>
              <Button onClick={() => navigate('/information')}>
                <ArrowLeft size={16} className="mr-2" />
                Back to Articles
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: blogPost.title,
          text: blogPost.excerpt,
          url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.writeText(url);
        } catch (clipboardError) {
          console.log('Clipboard access failed');
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
      } catch (error) {
        console.log('Clipboard access failed');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/10">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/information')}
              className="gap-2"
            >
              <ArrowLeft size={16} />
              Back to Articles
            </Button>
          </div>

          {/* Article Header */}
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            {blogPost.featured_image && (
              <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-xl mb-8">
                <img 
                  src={blogPost.featured_image} 
                  alt={blogPost.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            )}

            {/* Article Meta */}
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                {blogPost.title}
              </h1>
              
              {blogPost.excerpt && (
                <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                  {blogPost.excerpt}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Published {formatDate(blogPost.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{getReadingTime(blogPost.content)}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="gap-2 px-2"
                >
                  <Share2 size={16} />
                  Share
                </Button>
              </div>
            </div>

            {/* Article Content */}
            <Card className="p-8 md:p-12">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(blogPost.content) 
                }}
              />
            </Card>

            {/* Related Articles CTA */}
            <div className="mt-8 text-center">
              <div className="bg-primary/5 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Explore More Articles
                </h3>
                <p className="text-muted-foreground mb-6">
                  Discover more insights about property investment, legal requirements, and living abroad.
                </p>
                <Button onClick={() => navigate('/information')} size="lg">
                  View All Articles
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* ElevenLabs Widget */}
      <ElevenLabsWidget />
    </div>
  );
};

export default ArticlePage;