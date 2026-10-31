import { expect, test } from 'bun:test';
import { QueryClient } from '@tanstack/react-query';
import { propertySearchOptions } from '../src/lib/propertySearchQuery';

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