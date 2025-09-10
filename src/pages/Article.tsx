import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ArticleLayout from '@/components/ArticleLayout';
import ArticleContent from '@/components/ArticleContent';
import { Helmet } from 'react-helmet-async';

const Article = () => {
  const { id } = useParams(); // This is the slug
  
  // Function to create slug from title
  const createSlug = (title: string) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') 
      .replace(/\s+/g, '-') 
      .replace(/-+/g, '-');
  };

  const getArticleBySlug = (slug: string) => {
    // Create a comprehensive mapping of all articles from Information.tsx
    const allArticles = [
      {
        slug: 'turkish-citizenship',
        title: 'Turkish Citizenship Through Property Investment',
        description: 'Complete guide to obtaining Turkish citizenship through property investment',
        excerpt: 'Turkey offers a unique opportunity to obtain citizenship through property investment. This comprehensive guide covers everything you need to know about this pathway to Turkish citizenship.',
        featuredImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
        tags: ['Citizenship', 'Investment', 'Legal'],
        author: 'Future Homes Legal Team',
        content: `
          <div class="space-y-8">
            <div class="highlight-box">
              <h2 class="text-2xl font-bold text-primary mb-4">Investment Requirements</h2>
              <p class="text-lg leading-relaxed">To qualify for Turkish citizenship, you must invest a minimum of $400,000 in Turkish real estate. This investment must be maintained for at least 3 years.</p>
            </div>

            <div>
              <h2 class="text-2xl font-bold text-foreground mb-4">Application Process</h2>
              <p class="text-lg leading-relaxed mb-4">The application process typically takes 3-6 months and involves several steps including property purchase, legal documentation, and government approvals.</p>
              
              <div class="info-box">
                <h3 class="text-xl font-semibold mb-3">Step-by-Step Process:</h3>
                <ol class="list-decimal list-inside space-y-2">
                  <li>Purchase property worth minimum $400,000</li>
                  <li>Submit application to property register</li>
                  <li>Ministry determines property value</li>
                  <li>Property marked as non-sellable for 3 years</li>
                  <li>Submit citizenship application</li>
                  <li>Receive citizenship decision</li>
                  <li>Apply for Turkish passport</li>
                </ol>
              </div>
            </div>

            <div class="success-box">
              <h2 class="text-2xl font-bold text-green-800 mb-4">Advantages of Turkish Citizenship</h2>
              <p class="text-lg text-green-700 mb-4">There are great advantages with obtaining a Turkish citizenship. Some of these are:</p>
              
              <ul class="space-y-3">
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>You can keep your current nationality and passport</span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>The application process only takes 4 months</span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>You get visa-free entry to 110+ countries</span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Access to free healthcare and education</span>
                </li>
              </ul>
            </div>

            <div class="warning-box">
              <h2 class="text-2xl font-bold text-yellow-800 mb-4">Investment Options</h2>
              <p class="text-lg text-yellow-700 mb-4">What investments are required to meet the conditions for a Turkish citizenship?</p>
              
              <ul class="space-y-3">
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>An investment of at least USD 400,000 or its equivalent in foreign currency or Turkish lira</span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>A deposit of at least USD 400,000 or the equivalent in foreign currency or Turkish lira to a bank operating in Turkey. This provided that the money is not withdrawn over the next three years</span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Purchase of shares, purchase of real estate, investment funds or venture capital investment funds for at least USD 400,000 or the equivalent in foreign currency or Turkish lira. This provided that the holding is not sold for the next three years</span>
                </li>
              </ul>
            </div>
          </div>
        `
      },
      {
        slug: 'property-purchase-process',
        title: 'Complete Guide to Buying Property in Turkey',
        description: 'Step-by-step guide to buying property in Turkey',
        excerpt: 'Turkey offers excellent opportunities for property investment. This guide walks you through the entire purchase process step by step.',
        featuredImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
        tags: ['Property', 'Investment', 'Legal Process'],
        author: 'Future Homes Property Team',
        content: `
          <div class="space-y-8">
            <div class="highlight-box">
              <h2 class="text-2xl font-bold text-primary mb-4">Legal Requirements</h2>
              <p class="text-lg leading-relaxed">Foreign nationals can purchase property in Turkey with some restrictions. Most areas are open to foreign ownership, but military zones and border areas may have limitations.</p>
            </div>

            <div>
              <h2 class="text-2xl font-bold text-foreground mb-4">Purchase Process</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="info-box">
                  <h3 class="text-xl font-semibold mb-3">Step 1-3: Initial Steps</h3>
                  <ol class="list-decimal list-inside space-y-2">
                    <li>Choose your property and negotiate price</li>
                    <li>Sign preliminary purchase agreement</li>
                    <li>Pay deposit (usually 10-20%)</li>
                  </ol>
                </div>
                <div class="info-box">
                  <h3 class="text-xl font-semibold mb-3">Step 4-6: Documentation</h3>
                  <ol class="list-decimal list-inside space-y-2" start="4">
                    <li>Get tax number from tax office</li>
                    <li>Open Turkish bank account</li>
                    <li>Complete title deed transfer</li>
                  </ol>
                </div>
              </div>
            </div>

            <div class="success-box">
              <h2 class="text-2xl font-bold text-green-800 mb-4">Required Documents</h2>
              <ul class="space-y-2">
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Valid passport and copies</span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Turkish tax number</span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Proof of funds (bank statements)</span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Property evaluation report</span>
                </li>
              </ul>
            </div>
          </div>
        `
      },
      {
        slug: 'banking-in-turkey',
        title: 'Banking Services in Turkey',
        description: 'Opening bank accounts and financial services for foreign residents',
        excerpt: 'Understanding Turkish banking system and how to access financial services as a foreign resident or property owner.',
        featuredImage: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800&h=600&fit=crop',
        tags: ['Banking', 'Finance', 'Services'],
        author: 'Future Homes Finance Team',
        content: `
          <div class="space-y-8">
            <div class="highlight-box">
              <h2 class="text-2xl font-bold text-primary mb-4">Major Banks</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="info-box">
                  <h3 class="font-semibold text-lg mb-2">Garanti BBVA</h3>
                  <p class="text-sm text-muted-foreground">Full English support, international services</p>
                </div>
                <div class="info-box">
                  <h3 class="font-semibold text-lg mb-2">Akbank</h3>
                  <p class="text-sm text-muted-foreground">Extensive branch network, good online banking</p>
                </div>
                <div class="info-box">
                  <h3 class="font-semibold text-lg mb-2">İş Bankası</h3>
                  <p class="text-sm text-muted-foreground">Turkey's oldest bank, reliable services</p>
                </div>
              </div>
            </div>

            <div class="success-box">
              <h2 class="text-2xl font-bold text-blue-800 mb-4">Account Opening Requirements</h2>
              <ul class="space-y-2">
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Valid passport with Turkish visa or residence permit</span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Turkish tax number (vergi numarası)</span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Proof of address in Turkey</span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Initial deposit (varies by bank, typically $100-500)</span>
                </li>
              </ul>
            </div>
          </div>
        `
      },
      {
        slug: 'bali-life',
        title: 'The Bali Lifestyle Appeal',
        description: 'Discover the unique lifestyle and investment opportunities in Bali',
        excerpt: 'Bali has captured the hearts of international property buyers not just for its investment potential, but for the extraordinary lifestyle it offers. The Island of Gods provides a unique blend of tropical paradise, rich cultural heritage, and modern amenities.',
        featuredImage: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop',
        tags: ['Bali', 'Lifestyle', 'Investment', 'Culture'],
        author: 'Future Homes Bali Team',
        content: `
          <div class="space-y-8">
            <h2 class="text-3xl font-bold text-foreground mb-6">Natural Beauty and Climate</h2>
            <p class="text-lg leading-relaxed mb-6">The island's year-round tropical climate, stunning beaches, and lush landscapes provide an idyllic backdrop for daily life. From sunrise yoga sessions overlooking rice terraces to sunset cocktails on pristine beaches, Bali offers a natural setting that enhances quality of life in ways that few destinations can match.</p>
            
            <p class="text-lg leading-relaxed mb-6">The diverse geography means you can choose from beachfront villas in Seminyak, jungle retreats in Ubud, or cliff-top properties in Uluwatu, each offering its own unique lifestyle experience.</p>

            <div class="highlight-box">
              <h3 class="text-2xl font-bold text-primary mb-4">Rich Cultural Heritage</h3>
              <p class="text-lg leading-relaxed mb-4">Living in Bali means immersing yourself in a culture that values spirituality, community, and artistic expression. The Balinese Hindu traditions create a peaceful, harmonious atmosphere that many international residents find deeply enriching.</p>
              
              <p class="text-lg leading-relaxed">Daily temple ceremonies, traditional art forms, and the warm hospitality of the Balinese people contribute to a sense of belonging that goes beyond mere property ownership.</p>
            </div>

            <div class="success-box">
              <h3 class="text-2xl font-bold text-green-800 mb-4">Modern Amenities and Infrastructure</h3>
              <p class="text-lg text-green-700 mb-4">Despite its traditional charm, Bali offers excellent modern infrastructure. High-speed internet makes it ideal for digital nomads and remote workers, while international schools cater to expat families. World-class restaurants, spas, and healthcare facilities ensure comfort and convenience.</p>
            </div>

            <div class="info-box">
              <h3 class="text-2xl font-bold text-blue-800 mb-4">Community and Networking</h3>
              <p class="text-lg text-blue-700 mb-4">The international community in Bali is vibrant and welcoming. Networking events, co-working spaces, and social clubs make it easy to connect with like-minded individuals from around the world, creating both personal and professional opportunities.</p>
            </div>

            <div class="warning-box">
              <h3 class="text-2xl font-bold text-yellow-800 mb-4">Cost of Living Advantages</h3>
              <p class="text-lg text-yellow-700 mb-4">Compared to major Western cities, Bali offers exceptional value for money. Your property investment can provide not just potential returns, but also access to a high-quality lifestyle at a fraction of the cost you might expect elsewhere.</p>
            </div>

            <h2 class="text-3xl font-bold text-foreground mb-6">Investment Opportunities</h2>
            <p class="text-lg leading-relaxed mb-6">Bali's property market offers diverse investment opportunities, from luxury villas that can generate strong rental income to commercial properties in growing tourist areas. The combination of lifestyle benefits and investment potential makes Bali an attractive proposition for discerning international buyers.</p>

            <blockquote class="border-l-4 border-primary pl-6 py-4 my-6 bg-muted/50 rounded-r-lg">
              <p class="text-foreground font-medium italic">"Bali isn't just a place to invest; it's a place to live a richer, more fulfilling life while your investment grows."</p>
            </blockquote>
          </div>
        `
      }
      // Add more articles here as needed
    ];

    return allArticles.find(article => article.slug === slug);
  };

  if (!id) {
    return <Navigate to="/information" replace />;
  }

  const article = getArticleBySlug(id);

  if (!article) {
    return <Navigate to="/information" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{article.title} - Future Homes</title>
        <meta name="description" content={article.description} />
        <meta name="keywords" content={article.tags?.join(', ')} />
        <link rel="canonical" href={`/article/${article.slug}`} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`/article/${article.slug}`} />
        {article.featuredImage && (
          <meta property="og:image" content={article.featuredImage} />
        )}
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.description} />
        {article.featuredImage && (
          <meta name="twitter:image" content={article.featuredImage} />
        )}
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": article.description,
            "image": article.featuredImage,
            "author": {
              "@type": "Organization",
              "name": article.author || "Future Homes"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Future Homes",
              "logo": {
                "@type": "ImageObject",
                "url": "/lovable-uploads/24d14ac8-45b8-44c2-8fff-159f96b0fee6.png"
              }
            },
            "url": `/article/${article.slug}`,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `/article/${article.slug}`
            }
          })}
        </script>
      </Helmet>

      <ArticleLayout
        title={article.title}
        excerpt={article.excerpt}
        content={article.content}
        featuredImage={article.featuredImage}
        tags={article.tags}
        author={article.author}
        backLink="/information"
        backText="Back to Articles"
      >
        <ArticleContent content={article.content} />
      </ArticleLayout>
    </>
  );
};

export default Article;