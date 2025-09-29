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

  // Same image assignment logic as Information page - EXACT COPY for consistency
  const getArticleImage = (title: string, content: string, index = 0) => {
    const text = (title + ' ' + content).toLowerCase();
    
    if (text.includes('dubai') || text.includes('uae') || text.includes('emirates')) {
      const dubaiImages = [
        '/lovable-uploads/0b68014a-5ee4-43ca-9b5e-0b2df4ed80b2.png', // Dubai skyline
        '/lovable-uploads/d3fe2dd9-e9ca-4cce-b5bc-f4a41b59bb9a.png', // Dubai business
        '/lovable-uploads/ae73e4e3-ad0e-453a-a8a5-5b3f6c3b0a6e.png'  // Dubai property
      ];
      return dubaiImages[index % dubaiImages.length];
    }
    
    if (text.includes('bali') || text.includes('indonesia')) {
      const baliImages = [
        '/lovable-uploads/b99c4fb0-7064-449d-a41c-2c8b9cc2ef24.png', // Bali beach property
        '/lovable-uploads/f3a7d4f3-e9c3-4b8e-9a5e-5f89b2a1c8e7.png', // Bali villa
        '/lovable-uploads/c8a2d3f9-e5c7-4b2e-8a1f-9d4e2c7b8a5e.png'  // Bali lifestyle
      ];
      return baliImages[index % baliImages.length];
    }
    
    if (text.includes('turkey') || text.includes('turkish') || text.includes('antalya') || text.includes('mersin')) {
      const turkeyImages = [
        '/lovable-uploads/957fba4b-ca18-42ed-9f96-14b90f654324.png', // Turkish property
        '/lovable-uploads/d8f2e4c7-b9a3-4c8e-9f1d-8e7c2a5b9d4f.png', // Turkey coastline
        '/lovable-uploads/e9c3b8f7-d2a4-4c1e-8f9b-7d6e3a2c8f5e.png'  // Turkey real estate
      ];
      return turkeyImages[index % turkeyImages.length];
    }
    
    if (text.includes('cyprus') || text.includes('mediterranean')) {
      const cyprusImages = [
        '/lovable-uploads/4f8e2a7b-c9d3-4e1a-8b5f-7c2d9a4e8b1f.png', // Cyprus property
        '/lovable-uploads/b3c8e7f2-d9a4-4c1e-8f5b-6a3e9d2c7f8e.png', // Mediterranean villa
        '/lovable-uploads/a7d3f8c2-e9b4-4c7e-8f1d-5b8e2a9c6f3e.png'  // Cyprus lifestyle
      ];
      return cyprusImages[index % cyprusImages.length];
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