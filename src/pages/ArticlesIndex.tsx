import { Link } from "@/lib/router-compat";
import Navigation from "@/components/Navigation";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useCanonicalUrl } from "@/hooks/useCanonicalUrl";
import { getCurrentLanguage } from "@/utils/seoUtils";
import { localizePath } from "@/utils/localeRouting";
import { ArrowRight } from "lucide-react";
import { EditorialCta, EditorialSectionHeader, PublicPageHero } from "@/components/PublicEditorial";
import informationHero from "@/assets/property-investment.jpg";

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
      <main>
        <PublicPageHero
          eyebrow="Future Homes Journal"
          title="Articles & Property Guides"
          description="Everything you need before buying abroad: city guides, costs, legal steps and lifestyle in Turkey, Dubai, Cyprus and Bali."
          image={informationHero}
          imageAlt="International property investment research and planning"
          primaryLabel="Explore properties"
          primaryTo={localizePath('/property-for-sale-in-turkey', lang)}
          secondaryLabel="Speak to an advisor"
          secondaryTo={localizePath('/contact-us', lang)}
          compact
        />
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <EditorialSectionHeader eyebrow="Expert knowledge" title="Make every decision with confidence" description="Current market guidance, buying steps and destination inspiration from our international team." />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] w-full rounded-lg" />
            ))}
          </div>
        ) : blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                to={localizePath(`/articles/${post.slug}`, lang)}
                className="group block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <Card className="h-full overflow-hidden rounded-lg border-border/70 bg-card transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-luxe)]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        loading="lazy"
                        width={640}
                        height={400}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <CardContent className="p-6">
                    <p className="mb-3 text-[11px] font-semibold uppercase text-gold-foreground">Property intelligence</p>
                    <h2 className="mb-3 text-xl font-semibold leading-snug text-foreground transition-colors group-hover:text-gold-foreground">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-foreground">Read guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No articles published yet.</p>
        )}
        </section>
        <EditorialCta eyebrow="Private consultation" title="Turn research into the right purchase" description="Tell us what you are looking for and receive a curated shortlist from a local property advisor." primaryLabel="Start Easy Find" primaryTo={localizePath('/ai-property-search', lang)} secondaryLabel="Contact our team" secondaryTo={localizePath('/contact-us', lang)} />
      </main>
    </div>
  );
};

export default ArticlesIndex;
