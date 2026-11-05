/** Dictionary key that stores a page's localized SEO title/description. */
export const PAGE_META_KEY = (path: string, field: 'title' | 'description') => `__seo:${path}:${field}`;

/** Locale-free, lower-case path without query, hash or trailing slash. */
export const normalizeMetaPath = (path: string): string => {
  const p = (path || '/').split('?')[0].split('#')[0];
  if (p === '' || p === '/') return '/';
  return ('/' + p.replace(/^\/+/, '').replace(/\/+$/, '')).toLowerCase();
};
