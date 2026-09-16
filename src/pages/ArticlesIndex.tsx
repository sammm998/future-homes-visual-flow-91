import { Link } from "@/lib/router-compat";
import Navigation from "@/components/Navigation";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useCanonicalUrl } from "@/hooks/useCanonicalUrl";
import { getCurrentLanguage } from "@/utils/seoUtils";
import { localizePath } from "@/utils/localeRouting";

const ArticlesIndex = () => {
  const { blogPosts, loading } = useBlogPosts();
  const canonicalUrl = useCanonicalUrl();
  const lang = getCurrentLanguage() || "en";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Property Guides & Turkey Travel Articles | Future Homes International"
        description="Guides on buying property in Turkey, Dubai, Cyprus and Bali — plus city guides, costs, citizenship and lifestyle articles from Future Homes International."
        keywords="turkey property guide, buying property in turkey, dubai property guide, turkish cities, turkish food, property articles"
        canonicalUrl={canonicalUrl}
      />
      <Navigation />
      <main className="container mx-auto px-4 pt-32 pb-20">
        <header className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Articles &amp; Property Guides
          </h1>
          <p className="text-lg text-muted-foreground">
            Everything you need before buying abroad: city guides, costs, legal steps and
            lifestyle in Turkey, Dubai, Cyprus and Bali.
          </p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-xl" />
            ))}
          </div>
        ) : blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                to={localizePath(`/articles/${post.slug}`, lang)}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
              >
                <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-elegant group-hover:-translate-y-1">
                  <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        loading="lazy"
                        width={640}
                        height={400}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No articles published yet.</p>
        )}
      </main>
    </div>
  );
};

export default ArticlesIndex;
