import React from 'react';
import { useParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import ArticleLayout from '@/components/ArticleLayout';
import ArticleContent from '@/components/ArticleContent';
import { useBlogPost } from "@/hooks/useBlogPosts";
import { Loader2 } from 'lucide-react';

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blogPost, loading, error } = useBlogPost(slug || '');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-semibold text-foreground">Loading article...</h1>
          <p className="text-muted-foreground mt-2">Please wait while we fetch the content</p>
        </div>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/10 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
          <h2 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h2>
          <p className="text-muted-foreground mb-8">
            Sorry, the article you're looking for doesn't exist or has been moved.
          </p>
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

  // Extract tags from content or create default ones
  const extractTags = (content: string, title: string) => {
    const defaultTags = [];
    
    // Add tags based on content analysis
    if (title.toLowerCase().includes('property')) defaultTags.push('Property');
    if (title.toLowerCase().includes('investment')) defaultTags.push('Investment');
    if (title.toLowerCase().includes('turkey')) defaultTags.push('Turkey');
    if (title.toLowerCase().includes('dubai')) defaultTags.push('Dubai');
    if (title.toLowerCase().includes('bali')) defaultTags.push('Bali');
    if (title.toLowerCase().includes('cyprus')) defaultTags.push('Cyprus');
    if (content.toLowerCase().includes('citizenship')) defaultTags.push('Citizenship');
    if (content.toLowerCase().includes('legal')) defaultTags.push('Legal');
    
    return defaultTags.length > 0 ? defaultTags : ['Real Estate'];
  };

  const tags = extractTags(blogPost.content, blogPost.title);

  return (
    <>
      <Helmet>
        <title>{blogPost.title} - Future Homes</title>
        <meta name="description" content={blogPost.excerpt || `${blogPost.title} - Read more on Future Homes blog`} />
        <meta name="keywords" content={tags.join(', ')} />
        <link rel="canonical" href={`${window.location.origin}/articles/${blogPost.slug}`} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={blogPost.title} />
        <meta property="og:description" content={blogPost.excerpt || blogPost.title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${window.location.origin}/articles/${blogPost.slug}`} />
        <meta property="og:image" content={blogPost.featured_image || '/lovable-uploads/24d14ac8-45b8-44c2-8fff-159f96b0fee6.png'} />
        <meta property="article:published_time" content={blogPost.created_at} />
        {blogPost.updated_at && (
          <meta property="article:modified_time" content={blogPost.updated_at} />
        )}
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blogPost.title} />
        <meta name="twitter:description" content={blogPost.excerpt || blogPost.title} />
        <meta name="twitter:image" content={blogPost.featured_image || '/lovable-uploads/24d14ac8-45b8-44c2-8fff-159f96b0fee6.png'} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": blogPost.title,
            "description": blogPost.excerpt || blogPost.title,
            "image": blogPost.featured_image || '/lovable-uploads/24d14ac8-45b8-44c2-8fff-159f96b0fee6.png',
            "datePublished": blogPost.created_at,
            "dateModified": blogPost.updated_at || blogPost.created_at,
            "author": {
              "@type": "Organization",
              "name": "Future Homes"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Future Homes",
              "logo": {
                "@type": "ImageObject",
                "url": "/lovable-uploads/24d14ac8-45b8-44c2-8fff-159f96b0fee6.png"
              }
            },
            "url": `${window.location.origin}/articles/${blogPost.slug}`,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${window.location.origin}/articles/${blogPost.slug}`
            }
          })}
        </script>
      </Helmet>

      <ArticleLayout
        title={blogPost.title}
        excerpt={blogPost.excerpt}
        content={blogPost.content}
        featuredImage={blogPost.featured_image || '/lovable-uploads/24d14ac8-45b8-44c2-8fff-159f96b0fee6.png'}
        publishedDate={blogPost.created_at}
        readingTime={getReadingTime(blogPost.content)}
        tags={tags}
        author="Future Homes Editorial Team"
        backLink="/information"
        backText="Back to Articles"
      >
        <ArticleContent content={blogPost.content} />
      </ArticleLayout>
    </>
  );
};

export default ArticlePage;