import { buildPropertyUrl } from '@/utils/slugHelpers';
import { SUPPORTED_LOCALES } from '@/utils/localeRouting';

export const SITE_URL = 'https://futurehomesinternational.com';
const FALLBACK_OG = `${SITE_URL}/og-image.jpg`;

export interface PropertySeoInput {
  title?: string | null;
  description?: string | null;
  image?: string | null;
  images?: string[] | null;
  refNo?: string | null;
  id?: string | null;
  location?: string | null;
  district?: string | null;
  country?: string | null;
  price?: string | null;
  currency?: string | null;
  bedrooms?: string | number | null;
  bathrooms?: string | number | null;
  area?: string | number | null;
  propertyType?: string | null;
}

/** Always return an absolute, crawlable image URL (Facebook/X require absolute). */
export const absoluteImage = (image?: string | null): string => {
  if (!image) return FALLBACK_OG;
  if (/^https?:\/\//i.test(image)) return image;
  return `${SITE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
};

/** Localized property URL for one language, e.g. /tr/mulk/1370 */
export const propertyPath = (p: PropertySeoInput, lang: string | null): string =>
  buildPropertyUrl({ refNo: p.refNo, ref_no: p.refNo, id: p.id }, lang);

export const propertyUrl = (p: PropertySeoInput, lang: string | null): string =>
  `${SITE_URL}${propertyPath(p, lang)}`;

/** hreflang map covering every supported language for this exact listing. */
export const propertyHreflangUrls = (p: PropertySeoInput): Record<string, string> => {
  const out: Record<string, string> = {};
  SUPPORTED_LOCALES.forEach((code) => {
    out[code] = propertyUrl(p, code);
  });
  return out;
};

const numeric = (value?: string | number | null): number | null => {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  let raw = String(value).replace(/[^0-9.,]/g, '').trim();
  if (!raw) return null;
  // European thousand separators: 175.000 / 1,250,000 / 175.000,50
  if (/^\d{1,3}([.,]\d{3})+([.,]\d{1,2})?$/.test(raw)) {
    const decimalSep = raw.length - raw.lastIndexOf('.') === 3 && raw.includes(',') ? ',' : null;
    if (decimalSep) raw = raw.replace(/\./g, '').replace(',', '.');
    else if (/[.,]\d{1,2}$/.test(raw) && !/[.,]\d{3}$/.test(raw)) raw = raw.replace(/[.,](?=.*[.,])/g, '').replace(',', '.');
    else raw = raw.replace(/[.,]/g, '');
  } else {
    raw = raw.replace(',', '.');
  }
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : null;
};

const currencyOf = (p: PropertySeoInput): string => {
  const raw = `${p.currency ?? ''} ${p.price ?? ''}`;
  if (/EUR|€/i.test(raw)) return 'EUR';
  if (/USD|\$/i.test(raw)) return 'USD';
  if (/GBP|£/i.test(raw)) return 'GBP';
  if (/TRY|₺/i.test(raw)) return 'TRY';
  if (/IDR|Rp/i.test(raw)) return 'IDR';
  return 'EUR';
};

/**
 * schema.org graph for a single listing, in the visitor's language:
 * RealEstateListing + Residence/Accommodation + Offer + BreadcrumbList.
 */
export const buildPropertyStructuredData = (
  p: PropertySeoInput,
  lang: string | null,
  breadcrumbLabels?: { home?: string; properties?: string },
): object[] => {
  const language = lang || 'en';
  const url = propertyUrl(p, language);
  const images = (p.images && p.images.length ? p.images : [p.image]).filter(Boolean).map((i) => absoluteImage(i as string));
  const price = numeric(p.price);
  const beds = numeric(p.bedrooms);
  const baths = numeric(p.bathrooms);
  const size = numeric(p.area);
  const name = p.title || 'Property';

  const address = {
    '@type': 'PostalAddress',
    ...(p.district ? { streetAddress: p.district } : {}),
    ...(p.location ? { addressLocality: p.location } : {}),
    ...(p.country ? { addressCountry: p.country } : {}),
  };

  const accommodation: Record<string, unknown> = {
    '@type': 'Accommodation',
    name,
    ...(p.propertyType ? { additionalType: p.propertyType } : {}),
    address,
    ...(beds !== null ? { numberOfBedrooms: beds } : {}),
    ...(baths !== null ? { numberOfBathroomsTotal: baths } : {}),
    ...(size !== null ? { floorSize: { '@type': 'QuantitativeValue', value: size, unitCode: 'MTK' } } : {}),
  };

  const listing: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': `${url}#listing`,
    url,
    name,
    inLanguage: language,
    ...(p.description ? { description: p.description } : {}),
    ...(images.length ? { image: images } : {}),
    ...(p.refNo ? { identifier: `REF-${p.refNo}`, sku: String(p.refNo) } : {}),
    datePosted: undefined,
    about: accommodation,
    ...(price !== null
      ? {
          offers: {
            '@type': 'Offer',
            url,
            price,
            priceCurrency: currencyOf(p),
            availability: 'https://schema.org/InStock',
            seller: { '@type': 'RealEstateAgent', name: 'Future Homes International', url: SITE_URL },
          },
        }
      : {}),
    provider: { '@type': 'RealEstateAgent', name: 'Future Homes International', url: SITE_URL },
  };
  delete listing.datePosted;

  const localeHome = language === 'en' ? SITE_URL : `${SITE_URL}/${language}`;
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: breadcrumbLabels?.home || 'Home', item: localeHome },
      {
        '@type': 'ListItem',
        position: 2,
        name: breadcrumbLabels?.properties || 'Properties',
        item: `${localeHome}/property-wizard`,
      },
      { '@type': 'ListItem', position: 3, name, item: url },
    ],
  };

  return [listing, breadcrumbs];
};
