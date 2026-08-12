import React from 'react';
import { Link, useLocation } from '@/lib/router-compat';
import { getLocaleFromPathname, stripLocale } from '@/utils/localeRouting';
import { getNordicInternalLinks, nordicLinksHeading } from '@/data/nordicInternalLinks';

interface Props {
  className?: string;
  /** Render as a compact inline row instead of a bordered block */
  variant?: 'block' | 'inline';
}

/**
 * Contextual internal links from listings / city / category pages to the
 * dedicated Nordic keyword landing pages, with optimised anchor text.
 * Renders nothing outside sv / no / da.
 */
export const NordicRelatedLinks: React.FC<Props> = ({ className = '', variant = 'block' }) => {
  const location = useLocation();
  const pathname = location?.pathname || '/';
  const locale = getLocaleFromPathname(pathname);
  const links = getNordicInternalLinks(locale ?? 'en', stripLocale(pathname));

  if (!locale || links.length === 0) return null;

  if (variant === 'inline') {
    return (
      <nav aria-label={nordicLinksHeading(locale)} className={`flex flex-wrap gap-2 ${className}`}>
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            title={l.title}
            className="text-sm px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
          >
            {l.anchor}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav aria-label={nordicLinksHeading(locale)} className={`border-t pt-8 mt-12 ${className}`}>
      <h2 className="text-xl font-semibold text-foreground mb-4">{nordicLinksHeading(locale)}</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              title={l.title}
              className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline transition-colors"
            >
              {l.anchor}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NordicRelatedLinks;
