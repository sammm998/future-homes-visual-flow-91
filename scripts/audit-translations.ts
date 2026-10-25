// Audit: find every t('key') used in src and report which languages lack it.
import { readdirSync, statSync, readFileSync } from 'fs';
import { join } from 'path';
import { translations } from '../src/utils/translationsSource';

const LANGS = ['en','sv','no','da','de','fr','es','tr','ru','ar','fa','ur','id'];

const files: string[] = [];
const walk = (dir: string) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (/\.(tsx?|jsx?)$/.test(p)) files.push(p);
  }
};
walk('src');

const keys = new Set<string>();
const keyRe = /\bt\(\s*['"`]([a-zA-Z0-9_.-]+)['"`]/g;
for (const f of files) {
  if (f.includes('/admin/')) continue;
  const src = readFileSync(f, 'utf8');
  let m: RegExpExecArray | null;
  while ((m = keyRe.exec(src))) keys.add(m[1]);
}

const missing: Record<string, string[]> = {};
const missingEn: string[] = [];
for (const k of [...keys].sort()) {
  if (!translations.en?.[k]) missingEn.push(k);
  for (const l of LANGS) {
    if (l === 'en') continue;
    if (!translations[l]?.[k]) (missing[l] ||= []).push(k);
  }
}

console.log('total keys used:', keys.size);
console.log('missing in EN (no source string):', missingEn.length);
for (const l of LANGS.filter((x) => x !== 'en')) {
  console.log(l, (missing[l] || []).length);
}
require('fs').writeFileSync('/tmp/missing.json', JSON.stringify({ missingEn, missing }, null, 2));

// Second pass: values identical to English (likely untranslated)
const same: Record<string, string[]> = {};
for (const k of [...keys].sort()) {
  const en = translations.en?.[k];
  if (!en) continue;
  for (const l of LANGS) {
    if (l === 'en') continue;
    const v = translations[l]?.[k];
    if (v && v.trim() === en.trim() && /[a-zA-Z]{3}/.test(en)) (same[l] ||= []).push(k);
  }
}
console.log('--- identical to EN ---');
for (const l of LANGS.filter((x) => x !== 'en')) console.log(l, (same[l] || []).length);
require('fs').writeFileSync('/tmp/same.json', JSON.stringify(same, null, 2));
