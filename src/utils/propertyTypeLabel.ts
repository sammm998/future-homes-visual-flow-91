import { t } from './translations';

export function propertyTypeLabel(value: string | null | undefined, language: string): string {
  const type = (value ?? 'apartment').trim().toLowerCase();
  const key = type.includes('villa') ? 'search.villas'
    : type.includes('commercial') ? 'search.commercial'
    : type.includes('house') ? 'search.houses'
    : type.includes('penthouse') ? 'wizard.pt_penthouse'
    : type.includes('land') ? 'wizard.pt_land'
    : 'search.apartments';
  return t(key, language);
}