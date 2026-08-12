import React from 'react';
import { Link } from '@/lib/router-compat';
import { Card } from './ui/card';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useTranslation } from '@/hooks/useTranslation';
import { ArrowRight } from 'lucide-react';

interface ArticleInternalLinksProps {
  /** Slug of the article currently being read, so it is excluded. */
  currentSlug?: string;
  title: string;
  content: string;
}

interface TopicLink {
  to: string;
  label: string;
  match: RegExp;
}

/** Topic pages linked contextually from article bodies. */
const TOPIC_LINKS: TopicLink[] = [
  { to: '/antalya', label: 'Property for sale in Antalya', match: /antalya|konyaalt|lara/i },
  { to: '/alanya-property-for-sale', label: 'Property for sale in Alanya', match: /alanya/i },
  { to: '/istanbul', label: 'Property for sale in Istanbul', match: /istanbul|bosphorus/i },
  { to: '/mersin', label: 'Property for sale in Mersin', match: /mersin/i },
  { to: '/dubai', label: 'Property for sale in Dubai', match: /dubai|uae|emirates/i },
  { to: '/bali', label: 'Villas and property in Bali', match: /bali|indonesia/i },
  { to: '/cyprus', label: 'Property for sale in Cyprus', match: /cyprus|kyrenia|famagusta/i },
  { to: '/luxury-villas-in-turkey', label: 'Luxury villas for sale in Turkey', match: /villa/i },
  { to: '/apartments-for-sale-in-turkey', label: 'Apartments for sale in Turkey', match: /apartment|flat|penthouse/i },
  { to: '/off-plan-property-turkey', label: 'Off-plan property in Turkey', match: /off-plan|off plan|under construction|new build/i },
  { to: '/turkish-citizenship-by-investment', label: 'Turkish citizenship by investment', match: /citizenship|passport|400,?000/i },
  { to: '/articles/expenses-buying-property-turkey', label: 'Costs of buying property in Turkey', match: /cost|fee|tax|expense|price/i },
  { to: '/property-for-sale-in-turkey', label: 'All property for sale in Turkey', match: /turkey|turkish/i },
  { to: '/contact-us', label: 'Talk to a property advisor', match: /./ },
];

/**
 * Contextual internal links rendered at the end of every information article:
 * related articles plus topic/destination pages matched against the article
 * text. Articles previously had no outgoing internal links at all.
 */
const ArticleInternalLinks: React.FC<ArticleInternalLinksProps> = ({
  currentSlug,
  title,
  content,
}) => {
  const { blogPosts } = useBlogPosts();
  const { t } = useTranslation();

  const plain = `${title} ${content}`.replace(/<[^>]*>/g, ' ');
  const topics = TOPIC_LINKS.filter((l) => l.match.test(plain)).slice(0, 6);

  const related = (blogPosts || [])
    .filter((p) => p.slug !== currentSlug)
    .slice(0, 4);

  if (!topics.length && !related.length) return null;

  return (
    <section aria-label="Related reading" className="mt-12 space-y-8">
      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {t('article.related.heading') !== 'article.related.heading'
              ? t('article.related.heading')
              : 'Related articles'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((post) => (
              <Link key={post.id} to={`/articles/${post.slug}`} className="block group">
                <Card className="p-4 h-full transition-colors group-hover:border-primary/50">
                  <h3 className="font-medium text-foreground group-hover:text-primary line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
                  )}
                  <span className="mt-3 inline-flex items-center gap-1 text-sm text-primary">
                    <ArrowRight size={14} />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {topics.length > 0 && (
        <nav aria-label="Related pages" className="border-t pt-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {t('seo.links.heading') !== 'seo.links.heading'
              ? t('seo.links.heading')
              : 'Explore more'}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
            {topics.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </section>
  );
};

export default ArticleInternalLinks;
