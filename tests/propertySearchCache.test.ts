import { expect, test } from 'bun:test';
import { QueryClient } from '@tanstack/react-query';
import { propertySearchOptions, SEARCH_FIELDS } from '../src/lib/propertySearchQuery';

test('search projection keeps bedroom pricing, districts, country and every localized slug', () => {
  const fields = SEARCH_FIELDS.split(',');
  expect(fields).not.toContain('*');
  for (const field of ['apartment_types', 'property_prices_by_room', 'price_currency', 'property_district', 'country']) {
    expect(fields).toContain(field);
  }
  for (const language of ['sv', 'tr', 'ar', 'ru', 'no', 'da', 'fa', 'ur', 'es', 'de', 'fr', 'id']) {
    expect(fields).toContain(`slug_${language}`);
  }
});

test('cached catalog serves Antalya without including Antalya-like unrelated locations', async () => {
  const client = new QueryClient();
  client.setQueryData(['property-search-source', 'all'], [
    { id: '1', location: 'Antalya, Lara' },
    { id: '2', location: 'Antalya' },
    { id: '3', location: 'Antalyafoo' },
    { id: '4', location: 'Mersin, Erdemli' },
  ]);
  const rows = await client.fetchQuery(propertySearchOptions(client, 'en', 'Antalya'));
  expect(rows.map(row => row.id)).toEqual(['1', '2']);
  client.clear();
});