import { parseApartmentTypes } from './apartmentTypes';

export const normalizeDistrict = (value: string) => {
  const slug = value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return ({ muratpsa: 'muratpasa', 'naunu-city': 'nuanu-city', 'jumeriah-village-circle': 'jumeirah-village-circle', 'jumeirah-lake-towers-jlt': 'jumeirah-lake-towers', dlrc: 'dubai-land-residence-complex' } as Record<string, string>)[slug] || slug;
};

export const districtMatches = (district: string | null | undefined, selected: string) =>
  !selected || selected === 'all' || normalizeDistrict(district || '') === normalizeDistrict(selected);

const bedroomCount = (value: string): number | null => {
  if (/studio/i.test(value)) return 0;
  const match = value.trim().match(/^(\d+)/);
  return match ? Number(match[1]) : null;
};
export const bedroomMatches = (unit: string, selected: string) => {
  if (!selected || selected === 'all' || selected === 'any') return true;
  const count = bedroomCount(unit);
  const wanted = selected === 'studio' ? 0 : Number(selected);
  return count !== null && (wanted === 5 ? count >= 5 : count === wanted);
};

interface SearchSelectionSource {
  price: string;
  bedrooms?: string | null;
  apartment_types?: unknown;
  property_prices_by_room?: string | null;
  price_currency?: string | null;
}

export function searchUnits(property: SearchSelectionSource): Array<{ type: string; price: string }> {
  const structured = parseApartmentTypes(property.apartment_types).filter((unit: any) => unit.type);
  if (structured.length) return structured;
  return (property.property_prices_by_room || '').split(/[;\n]/).flatMap(line => {
    const match = line.match(/^\s*(studio|\d+\s*\+\s*\d+).*?[-–]\s*(?:[€$£]\s*)?([\d][\d,. ]*)\s*$/i);
    return match ? [{ type: match[1], price: match[2].trim() }] : [];
  });
}

// An unpriced selected unit must never inherit the cheaper unit's price.
export function selectSearchPrice(property: SearchSelectionSource, selected: string): string {
  if (!selected || selected === 'all' || selected === 'any') return property.price;
  const units = searchUnits(property);
  const matches = units.filter(unit => bedroomMatches(unit.type, selected));
  const prices = matches.map(unit => Number(String(unit.price).replace(/[^\d.]/g, ''))).filter(price => Number.isFinite(price) && price > 0);
  if (prices.length) {
    const currency = property.price_currency || (property.price.includes('$') ? 'USD' : property.price.includes('£') ? 'GBP' : 'EUR');
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Math.min(...prices));
  }
  const counts = (property.bedrooms || '').split(/<>|,|-/).map(bedroomCount).filter(count => count !== null);
  return !units.length && counts.length === 1 && bedroomMatches(property.bedrooms || '', selected) ? property.price : '';
}

export function buildDistrictOptions(rows: Array<{ location: string | null; property_district: string | null }>) {
  const locations = ['Antalya', 'Istanbul', 'Mersin', 'Dubai', 'Cyprus', 'Bali'];
  const buckets: Record<string, Map<string, string>> = {};
  for (const row of rows) {
    const location = locations.find(city => (row.location || '').trim().toLowerCase().startsWith(city.toLowerCase()));
    const label = (row.property_district || '').trim();
    const value = normalizeDistrict(label);
    if (!location || !value || value === normalizeDistrict(location)) continue;
    const labels: Record<string, string> = { altintas: 'Altıntaş', muratpasa: 'Muratpaşa', 'nuanu-city': 'Nuanu City', 'jumeirah-village-circle': 'Jumeirah Village Circle', 'jumeirah-lake-towers': 'Jumeirah Lake Towers', 'dubai-land-residence-complex': 'Dubai Land Residence Complex' };
    (buckets[location] ||= new Map()).set(value, labels[value] || label);
  }
  return Object.fromEntries(Object.entries(buckets).map(([location, districts]) => [location, [...districts].map(([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label))]));
}