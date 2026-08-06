import React from 'react';
import { Link } from 'react-router-dom';

interface SEOInternalLinksProps {
  /** Optional heading override */
  heading?: string;
  className?: string;
}

const LINKS: { to: string; label: string }[] = [
  { to: '/antalya', label: 'Property for sale in Antalya' },
  { to: '/dubai', label: 'Dubai off-plan apartments and investments' },
  { to: '/istanbul', label: 'Istanbul apartments for investment' },
  { to: '/mersin', label: 'Affordable property in Mersin' },
  { to: '/cyprus', label: 'North Cyprus homes for sale' },
  { to: '/bali', label: 'Bali villas and investment property' },
  { to: '/property-for-sale-in-turkey', label: 'All property for sale in Turkey' },
  { to: '/luxury-villas-in-turkey', label: 'Luxury villas in Turkey' },
  { to: '/off-plan-property-turkey', label: 'Off-plan property projects in Turkey' },
  { to: '/turkish-citizenship-by-investment', label: 'Turkish citizenship by property investment' },
  { to: '/expenses-buying-property-turkey', label: 'Costs and taxes when buying in Turkey' },
  { to: '/information', label: 'Buyer guides and market information' },
  { to: '/about-us', label: 'About Future Homes International' },
  { to: '/ali-karan', label: 'Ali Karan, founder and CEO' },
  { to: '/contact-us', label: 'Contact our property advisors' },
];

/**
 * Contextual internal link block used to strengthen internal linking
 * and give crawlers descriptive anchor text on deep pages.
 */
export const SEOInternalLinks: React.FC<SEOInternalLinksProps> = ({
  heading = 'Explore more of Future Homes International',
  className = '',
}) => (
  <nav aria-label="Related pages" className={`border-t pt-8 mt-12 ${className}`}>
    <h2 className="text-xl font-semibold text-foreground mb-4">{heading}</h2>
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
      {LINKS.map((l) => (
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
);

export default SEOInternalLinks;
