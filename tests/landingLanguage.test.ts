import { describe, expect, it } from 'bun:test';
import { resolveUrlLocale, SUPPORTED_LOCALES } from '../src/utils/localeRouting';

describe('Google landing language', () => {
  it('selects all thirteen URL languages without browser storage', () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(resolveUrlLocale(locale === 'en' ? '/antalya' : `/${locale}/antalya`)).toBe(locale);
    }
  });
  it('honors Indonesian, Urdu and French legacy Google links', () => {
    for (const locale of ['id', 'ur', 'fr']) {
      expect(resolveUrlLocale('/property/1415', `?lang=${locale}`)).toBe(locale);
    }
  });
  it('keeps the prefixed language when a query disagrees', () => {
    expect(resolveUrlLocale('/id/properti/1415', '?lang=en')).toBe('id');
    expect(resolveUrlLocale('/fr/antalya', '?lang=ur')).toBe('fr');
  });
});