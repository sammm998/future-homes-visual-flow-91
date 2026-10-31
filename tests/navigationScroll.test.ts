import { expect, test } from 'bun:test';
import { shouldResetNavigationScroll } from '../src/lib/navigationScroll';

test('bedroom/type/range query updates keep the search page in place', () => {
  expect(shouldResetNavigationScroll('/mersin', '.')).toBe(false);
  expect(shouldResetNavigationScroll('/mersin', '/mersin')).toBe(false);
  expect(shouldResetNavigationScroll('/id/antalya', '/id/antalya')).toBe(false);
});
test('opening a different page retains ordinary scroll reset', () => {
  expect(shouldResetNavigationScroll('/mersin', '/property/3019')).toBe(true);
});
test('explicit navigation scroll behavior is respected', () => {
  expect(shouldResetNavigationScroll('/mersin', '/mersin', true)).toBe(true);
  expect(shouldResetNavigationScroll('/mersin', '/istanbul', false)).toBe(false);
});