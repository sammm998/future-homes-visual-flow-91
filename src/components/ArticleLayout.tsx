import React from 'react';
import { ArrowLeft, Calendar, Clock, Share2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import ElevenLabsWidget from './ElevenLabsWidget';
import { motion } from 'framer-motion';

interface ArticleLayoutProps {
  title: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  publishedDate?: string;
  readingTime?: string;
  tags?: string[];
  author?: string;
  backLink?: string;
  backText?: string;
  showShare?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const ArticleLayout: React.FC<ArticleLayoutProps> = ({
  title,
  excerpt,
  content,
  featuredImage,
  publishedDate,
  readingTime,
  tags = [],
  author,
  backLink = '/information',
  backText = 'Back to Articles',
  showShare = true,
  className,
  children
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently published';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadingTime = (htmlContent: string) => {
    if (readingTime) return readingTime;
    const wordsPerMinute = 200;
    const textContent = htmlContent.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    const time = Math.ceil(wordCount / wordsPerMinute);
    return `${time} min read`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: excerpt || title,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/10">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button 
              variant="ghost" 
              onClick={() => navigate(backLink)}
              className="gap-2 hover:bg-muted/50 transition-colors"
            >
              <ArrowLeft size={18} />
              {backText}
            </Button>
          </motion.div>

          {/* Article Container */}
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            {featuredImage && (
              <motion.div 
                className="relative h-64 md:h-96 w-full overflow-hidden rounded-2xl mb-8 shadow-elegant"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <img 
                  src={featuredImage} 
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Floating Title on Image */}
                <div className="absolute bottom-6 left-6 right-6">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-2xl">
                    {title}
                  </h1>
                </div>
              </motion.div>
            )}

            {/* Article Header (without image) */}
            {!featuredImage && (
              <motion.div 
                className="mb-8 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                  {title}
                </h1>
              </motion.div>
            )}

            {/* Article Meta */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {excerpt && (
                <p className="text-xl md:text-2xl text-muted-foreground mb-6 leading-relaxed font-light">
                  {excerpt}
                </p>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                {author && (
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>By {author}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{formatDate(publishedDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{calculateReadingTime(content)}</span>
                </div>
                {showShare && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="gap-2 px-3 hover:bg-muted/50"
                  >
                    <Share2 size={16} />
                    Share
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Article Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-8 md:p-12 shadow-elegant bg-background/80 backdrop-blur-sm">
                <div className={`prose prose-lg prose-slate max-w-none ${className || ''}`}>
                  {children || (
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: content 
                      }}
                    />
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Related Articles CTA */}
            <motion.div 
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-gradient-subtle p-8 shadow-elegant">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Explore More Articles
                </h3>
                <p className="text-muted-foreground mb-6 text-lg">
                  Discover more insights about property investment, legal requirements, and living abroad.
                </p>
                <Button 
                  onClick={() => navigate('/information')} 
                  size="lg"
                  className="px-8 py-3"
                >
                  View All Articles
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* ElevenLabs Widget */}
      <ElevenLabsWidget />
    </div>
  );
};

export default ArticleLayout;