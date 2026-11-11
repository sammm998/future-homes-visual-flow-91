import { describe, expect, it } from 'vitest';
import { applyTeamImageOverride } from '../src/lib/teamImages';

describe('team portrait recovery', () => {
  const saminId = '8d9e3217-78c8-4864-acf1-f8ff78aed694';
  it('recovers Samin without requesting the restricted legacy host', () => {
    const result = applyTeamImageOverride(saminId, 'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/old.png');
    expect(result).toContain('/__l5e/assets-v1/');
    expect(result).not.toContain('kiogiyemoqbnuvclneoe');
  });
  it('preserves a replacement portrait saved in the CMS', () => {
    expect(applyTeamImageOverride(saminId, '/api/public/media/team/new-photo.jpg')).toBe('/api/public/media/team/new-photo.jpg');
  });
  it('leaves unrecovered original portraits unchanged', () => {
    expect(applyTeamImageOverride('other-member', 'https://example.org/portrait.jpg')).toBe('https://example.org/portrait.jpg');
  });
});