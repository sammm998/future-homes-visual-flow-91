import { expect, test } from 'bun:test';
import { parseSearchPage } from '../src/lib/searchPage';

test('returning to page 3 keeps page 3', () => {
  expect(parseSearchPage(new URLSearchParams('bedrooms=2&page=3').get('page'))).toBe(3);
});
test('missing or invalid pages start at page 1', () => {
  for (const value of [null, '-2', '0', 'abc', '1.5']) expect(parseSearchPage(value)).toBe(1);
});