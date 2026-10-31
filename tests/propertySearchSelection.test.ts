import { expect, test } from 'bun:test';
import { buildDistrictOptions, districtMatches, selectSearchPrice } from '../src/utils/propertySearchSelection';
import { filterProperties, type PropertyFilters } from '../src/utils/propertyFilter';

const listing = { id: '3019', refNo: '3019', title: 'Apartments in Mersin', location: 'Mersin', property_district: 'Erdemli', price: '58,000', price_currency: 'EUR', bedrooms: '1<>2', bathrooms: '1<>2', area: '57<>85', status: 'available', image: '', coordinates: [0, 0] as [number, number], apartment_types: [{ type: '1+1', price: '58,000' }, { type: '2+1', price: '95,000' }, { type: '3+1', price: '125,000' }] };
const filters: PropertyFilters = { propertyType: '', bedrooms: '2', location: 'Mersin', district: '', minPrice: '', maxPrice: '', minSquareFeet: '', maxSquareFeet: '', facilities: [], sortBy: 'price-low', referenceNo: '' };
test('2-bedroom result uses €95,000 rather than €58,000', () => expect(selectSearchPrice(listing, '2')).toBe('€95,000'));
test('3-bedroom result does not show the 1-bedroom price', () => expect(selectSearchPrice(listing, '3')).toBe('€125,000'));
test('no bedroom selection preserves listing starting price', () => expect(selectSearchPrice(listing, '')).toBe('58,000'));
test('missing selected-unit price never substitutes a cheaper unit price', () => expect(selectSearchPrice(listing, '4')).toBe(''));
test('legacy room text provides matching unit prices', () => expect(selectSearchPrice({ ...listing, apartment_types: null, property_prices_by_room: '1+1 (Flat) - 57m² - €58,000; 2+1 (Flat) - 85m² - €95,000' }, '2')).toBe('€95,000'));
test('price limits use the 2-bedroom price', () => expect(filterProperties([listing], { ...filters, maxPrice: '90000' })).toHaveLength(0));
test('price sorting uses selected-unit prices', () => {
  const cheaperTwoBed = { ...listing, id: '3010', price: '74,000', apartment_types: [{ type: '1+1', price: '74,000' }, { type: '2+1', price: '90,000' }] };
  expect(filterProperties([listing, cheaperTwoBed], filters).map(p => p.id)).toEqual(['3010', '3019']);
});
test('district slugs match diacritics and multiword districts', () => {
  expect(districtMatches('Altıntaş', 'altintas')).toBe(true);
  expect(districtMatches('Jumeirah Village Circle', 'jumeirah-village-circle')).toBe(true);
  expect(districtMatches('Mezitli', 'erdemli')).toBe(false);
});
test('clearing a district retains the bedroom search and restores other districts', () => {
  const other = { ...listing, id: '3018', property_district: 'Mezitli' };
  expect(filterProperties([listing, other], { ...filters, district: 'erdemli' })).toHaveLength(1);
  expect(filterProperties([listing, other], { ...filters, district: '' })).toHaveLength(2);
});
test('district options belong to their city and consolidate spelling variants', () => {
  const options = buildDistrictOptions([{ location: ' Antalya ', property_district: 'Altintas' }, { location: 'Antalya', property_district: 'Altıntaş' }, { location: 'Antalya', property_district: 'Antalya' }, { location: 'Mersin', property_district: 'Mezitli' }]);
  expect(options.Antalya).toEqual([{ value: 'altintas', label: 'Altıntaş' }]);
  expect(options.Mersin).toEqual([{ value: 'mezitli', label: 'Mezitli' }]);
});