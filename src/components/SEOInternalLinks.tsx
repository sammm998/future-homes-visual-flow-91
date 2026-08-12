import React from 'react';
import { Link } from '@/lib/router-compat';
import { useTranslation } from '@/hooks/useTranslation';
import NordicRelatedLinks from '@/components/NordicRelatedLinks';

interface SEOInternalLinksProps {
  /** Optional heading override */
  heading?: string;
  className?: string;
}

const LINKS: { to: string; key: string }[] = [
  { to: '/antalya', key: 'seo.links.antalya' },
  { to: '/dubai', key: 'seo.links.dubai' },
  { to: '/istanbul', key: 'seo.links.istanbul' },
  { to: '/mersin', key: 'seo.links.mersin' },
  { to: '/cyprus', key: 'seo.links.cyprus' },
  { to: '/bali', key: 'seo.links.bali' },
  { to: '/property-for-sale-in-turkey', key: 'seo.links.turkey' },
  { to: '/luxury-villas-in-turkey', key: 'seo.links.luxury' },
  { to: '/off-plan-property-turkey', key: 'seo.links.offplan' },
  { to: '/turkish-citizenship-by-investment', key: 'seo.links.citizenship' },
  { to: '/articles/expenses-buying-property-turkey', key: 'seo.links.costs' },
  { to: '/information', key: 'seo.links.information' },
  { to: '/about-us', key: 'seo.links.about' },
  { to: '/ali-karan', key: 'seo.links.alikaran' },
  { to: '/contact-us', key: 'seo.links.contact' },
];

/**
 * Contextual internal link block used to strengthen internal linking
 * and give crawlers descriptive anchor text on deep pages.
 */
export const SEOInternalLinks: React.FC<SEOInternalLinksProps> = ({
  heading,
  className = '',
}) => {
  const { t } = useTranslation();
  return (
    <nav aria-label="Related pages" className={`border-t pt-8 mt-12 ${className}`}>
      <h2 className="text-xl font-semibold text-foreground mb-4">
        {heading ?? t('seo.links.heading')}
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
        {LINKS.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline transition-colors"
            >
              {t(l.key)}
            </Link>
          </li>
        ))}
      </ul>
      <NordicRelatedLinks variant="inline" className="mt-6" />
    </nav>
  );
};

export default SEOInternalLinks;
