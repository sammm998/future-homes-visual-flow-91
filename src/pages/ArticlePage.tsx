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

  // Same image assignment logic as Information page
  const getArticleImage = (title: string, content: string) => {
    const text = (title + ' ' + content).toLowerCase();
    
    if (text.includes('legal') || text.includes('law') || text.includes('citizenship') || text.includes('visa')) {
      const legalImages = [
        '/lovable-uploads/e3b2ee1e-9aba-420b-a9f7-2bfaab5eacd0.png', // Legal consultation
        '/lovable-uploads/fe0a5d97-1db3-47f0-8c31-14b7d26c4fa7.png', // Legal documentation
        '/lovable-uploads/f2ecaa46-de2c-4b29-9c74-de4aadb9c5ed.png'  // Legal process
      ];
      return legalImages[0];
    }
    
    if (text.includes('finance') || text.includes('tax') || text.includes('investment') || text.includes('bitcoin') || text.includes('crypto')) {
      const financeImages = [
        '/lovable-uploads/7b25e970-4a85-4c31-b6f5-5cf63d1c88c4.png', // Financial planning
        '/lovable-uploads/56dce5e8-4cbc-4ce4-abd7-bfe86eedbb0c.png', // Investment strategy
        '/lovable-uploads/31013ba8-d9a5-4b1a-ab64-a4cb0c41c6e9.png'  // Finance management
      ];
      return financeImages[0];
    }
    
    if (text.includes('healthcare') || text.includes('health') || text.includes('medical')) {
      const healthImages = [
        '/lovable-uploads/d8a74b43-f48a-42e0-b9a2-e0ff4ddbf75b.png', // Healthcare services
        '/lovable-uploads/b7c69e48-25b6-4da5-9ef4-4b2e57b31a78.png', // Medical consultation
        '/lovable-uploads/a1d4cb0c-9817-4f5e-a9a4-0f8b02d4e9cd.png'  // Health management
      ];
      return healthImages[0];
    }
    
    if (text.includes('dubai') || text.includes('uae') || text.includes('emirates')) {
      const dubaiImages = [
        '/lovable-uploads/7ab8b28b-c9e3-4ad9-b6a6-c82f18fc7e5e.png', // Dubai skyline
        '/lovable-uploads/5bc6d8b9-e7f4-4c1a-9d3a-b8e9f2c4d7a6.png', // Dubai business
        '/lovable-uploads/3a7f9e2d-c8b1-4f6e-8d9c-7e5a2b4f8c3d.png'  // Dubai lifestyle
      ];
      return dubaiImages[0];
    }
    
    if (text.includes('bali') || text.includes('indonesia')) {
      const baliImages = [
        '/lovable-uploads/6a2b8c9d-e7f3-4a1b-9c8e-2d5f8a4b7c1d.png', // Bali paradise
        '/lovable-uploads/4e8f2a7c-9b1d-3c6e-8a4f-7b2c9d5e8f1a.png', // Bali lifestyle
        '/lovable-uploads/8c5a2f7e-4b9d-6e3a-9f8c-1d4a7b2e5c8f.png'  // Bali culture
      ];
      return baliImages[0];
    }
    
    if (text.includes('turkey') || text.includes('turkish') || text.includes('istanbul') || text.includes('antalya') || text.includes('mersin')) {
      const turkeyImages = [
        '/lovable-uploads/8f2e6a3c-7b4d-9e1a-c5f8-2a7b4e9c1d6f.png', // Turkey properties
        '/lovable-uploads/2c7f9a4e-8b1d-6e3a-9c5f-4a8b2e7c9d1f.png', // Turkish real estate
        '/lovable-uploads/9e3a6c2f-4b8d-1e7a-c9f5-8a2b7e4c9d6f.png'  // Turkey lifestyle
      ];
      return turkeyImages[0];
    }
    
    if (text.includes('living') || text.includes('lifestyle') || text.includes('culture') || text.includes('social')) {
      const livingImages = [
        '/lovable-uploads/956541d2-b461-4acd-a29a-463c5a97983e.png', // Antalya lifestyle
        '/lovable-uploads/60f987b0-c196-47b5-894d-173d604fa4c8.png', // Mersin living
        '/lovable-uploads/0ecd2ba5-fc2d-42db-8052-d51cffc0b438.png'  // Social lifestyle
      ];
      return livingImages[0];
    }
    
    if (text.includes('business') || text.includes('opportunity')) {
      const businessImages = [
        '/lovable-uploads/35d77b72-fddb-4174-b101-7f0dd0f3385d.png', // Business opportunity
        '/lovable-uploads/4d9ff093-d8bd-4855-80db-6c58534a8e44.png', // Investment opportunity
        '/lovable-uploads/9537b0b1-89b0-4c63-ae02-494c98caab5d.png'  // Business growth
      ];
      return businessImages[0];
    }
    
    if (text.includes('music') || text.includes('arts') || text.includes('art')) {
      const artsImages = [
        '/lovable-uploads/000f440d-ddb1-4c1b-9202-eef1ef588a8c.png', // Arts/culture
        '/lovable-uploads/0d7b0c8a-f652-488b-bfca-3a11c1694220.png', // Cultural activities
        '/lovable-uploads/2209cb13-f5ad-47af-ad83-fac59b9edd3b.png'  // Music/arts scene
      ];
      return artsImages[0];
    }
    
    // Default category - use property images
    const defaultImages = [
      '/lovable-uploads/4c6b5b9c-7b79-4474-b629-9e61e450f00b.png', // Default property 1
      '/lovable-uploads/227fa1b1-f9c2-4427-a969-9521d121dd51.png', // Default property 2  
      '/lovable-uploads/2adcc5fd-ef6d-4fee-8ed8-cc57be79fccf.png'  // Default property 3
    ];
    return defaultImages[0];
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
        <meta property="og:image" content={blogPost.featured_image || getArticleImage(blogPost.title, blogPost.content)} />
        <meta property="article:published_time" content={blogPost.created_at} />
        {blogPost.updated_at && (
          <meta property="article:modified_time" content={blogPost.updated_at} />
        )}
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blogPost.title} />
        <meta name="twitter:description" content={blogPost.excerpt || blogPost.title} />
        <meta name="twitter:image" content={blogPost.featured_image || getArticleImage(blogPost.title, blogPost.content)} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": blogPost.title,
            "description": blogPost.excerpt || blogPost.title,
            "image": blogPost.featured_image || getArticleImage(blogPost.title, blogPost.content),
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
        featuredImage={blogPost.featured_image || getArticleImage(blogPost.title, blogPost.content)}
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