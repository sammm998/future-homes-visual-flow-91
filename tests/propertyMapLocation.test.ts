import { expect, test } from 'bun:test';
import { propertyMapLocation } from '../src/utils/propertyMapLocation';

test('REF 1389 uses Antalya instead of the saved Cyprus pin', () => {
  const result = propertyMapLocation({ refNo: '1389', location: 'Antalya', property_district: 'Güzelyurt', google_maps_embed: 'https://www.google.com/maps/embed?pb=Cyprus' });
  expect(new URL(result.embed).searchParams.get('q')).toBe('Güzelyurt, Aksu, Antalya, Türkiye');
  expect(new URL(result.mapsLink).searchParams.get('query')).toBe('Güzelyurt, Aksu, Antalya, Türkiye');
  expect(result.embed).not.toContain('Cyprus');
});

test('other listings retain their saved map coordinates', () => {
  const embed = 'https://www.google.com/maps/embed?pb=original';
  expect(propertyMapLocation({ refNo: '1390', google_maps_embed: embed }).embed).toBe(embed);
});