import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const source = (name: string) => readFileSync(`supabase/functions/${name}/index.ts`, 'utf8');
describe('selected security fixes', () => {
  for (const name of ['setup-admin-account', 'setup-crm-users', 'setup-fhi-admin', 'admin-reset-passwords', 'ai-chat', 'elevenlabs-delete-conversation']) {
    it(`${name} has no privileged side effects`, () => {
      expect(source(name)).toContain('status: 410');
      expect(source(name)).not.toMatch(/createClient|password:|listUsers|fetch\(|\.update\(|\.upsert\(/);
    });
  }
  for (const name of ['generate-article', 'generate-article-images', 'translate-blog-posts', 'translate-properties', 'translate-slugs']) {
    it(`${name} verifies identity and protected roles before work`, () => {
      const text = source(name);
      const start = text.indexOf('serve(async');
      expect(text.indexOf('/auth/v1/user', start)).toBeGreaterThan(start);
      expect(text.indexOf('/rest/v1/user_roles', start)).toBeGreaterThan(start);
      expect(text.indexOf('status: 403', start)).toBeLessThan(text.indexOf('  try {', start));
    });
  }
  it('design-home never fetches a caller-selected URL', () => {
    expect(source('design-home')).not.toContain('fetch(imageUrl)');
    expect(source('design-home')).toContain('Invalid image');
  });
  it('maintenance verifies admin before importing the privileged client', () => {
    const text = readFileSync('src/routes/api/translations-fill.ts', 'utf8');
    expect(text.indexOf('if (denied) return denied')).toBeLessThan(text.indexOf('import("@/integrations/supabase/client.server")'));
  });
});