// Generates src/utils/translationsFix.ts filling untranslated keys per language.
import { translations } from '../src/utils/translations';
import { writeFileSync } from 'fs';

const same: Record<string, string[]> = JSON.parse(require('fs').readFileSync('/tmp/same.json', 'utf8'));

// Proper nouns / brand strings that must stay identical in every language.
const SKIP = new Set([
  'hero.title', 'info.bali', 'info.dubai',
  'wizard.loc_antalya', 'wizard.loc_bali', 'wizard.loc_dubai',
  'wizard.loc_istanbul', 'wizard.loc_mersin',
]);

const LANG_NAMES: Record<string, string> = {
  sv: 'Swedish', no: 'Norwegian', da: 'Danish', de: 'German', fr: 'French',
  es: 'Spanish', tr: 'Turkish', ru: 'Russian', ar: 'Arabic', fa: 'Persian (Farsi)',
  ur: 'Urdu', id: 'Indonesian',
};

const EXTRA_KEYS: Record<string, string> = { area: 'Area' };

const out: Record<string, Record<string, string>> = {};

const callAI = async (lang: string, payload: Record<string, string>) => {
  const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        {
          role: 'system',
          content:
            `You translate UI strings for a luxury international real-estate website into ${LANG_NAMES[lang]}. ` +
            'Return ONLY a JSON object mapping every input key to its translated string. ' +
            'Keep placeholders like {city} or {n} intact. Keep it short and natural for buttons/labels. ' +
            'Never leave a value in English unless it is a proper noun or a word used untranslated in the target language.',
        },
        { role: 'user', content: JSON.stringify(payload) },
      ],
    }),
  });
  const json: any = await res.json();
  const text: string = json?.choices?.[0]?.message?.content ?? '';
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error(`no json for ${lang}: ${text.slice(0, 200)}`);
  return JSON.parse(m[0]) as Record<string, string>;
};

for (const [lang, keys] of Object.entries(same)) {
  const payload: Record<string, string> = { ...EXTRA_KEYS };
  for (const k of keys) {
    if (SKIP.has(k)) continue;
    const en = translations.en?.[k];
    if (en) payload[k] = en;
  }
  if (Object.keys(payload).length === 0) continue;
  const translated = await callAI(lang, payload);
  out[lang] = translated;
  console.log(lang, Object.keys(translated).length);
}
// English source values for the extra keys
out.en = { ...EXTRA_KEYS };

const body =
  '// Auto-generated translation backfill for strings that were still in English.\n' +
  '// Merged last in translations.ts.\n' +
  'export const translationsFix: Record<string, Record<string, string>> = ' +
  JSON.stringify(out, null, 2) +
  ';\n';
writeFileSync('src/utils/translationsFix.ts', body);
console.log('written');
