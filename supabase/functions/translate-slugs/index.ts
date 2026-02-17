import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPPORTED_LANGUAGES = ['sv', 'tr', 'ar', 'ru', 'no', 'da', 'fa', 'ur'];

const LANGUAGE_NAMES: Record<string, string> = {
  'sv': 'Swedish', 'tr': 'Turkish', 'ar': 'Arabic', 'ru': 'Russian',
  'no': 'Norwegian', 'da': 'Danish', 'fa': 'Persian/Farsi', 'ur': 'Urdu'
};

const TRANSLATION_EXAMPLES: Record<string, { en: string, translated: string }> = {
  'sv': { en: 'Luxury apartments with sea view in Antalya', translated: 'Lyxiga lägenheter med havsutsikt i Antalya' },
  'tr': { en: 'Luxury apartments with sea view in Antalya', translated: 'Antalya\'da deniz manzaralı lüks daireler' },
  'ar': { en: 'Luxury apartments with sea view in Antalya', translated: 'شقق فاخرة مع إطلالة على البحر في Antalya' },
  'ru': { en: 'Luxury apartments with sea view in Antalya', translated: 'Роскошные апартаменты с видом на море в Antalya' },
  'no': { en: 'Luxury apartments with sea view in Antalya', translated: 'Luksus leiligheter med havutsikt i Antalya' },
  'da': { en: 'Luxury apartments with sea view in Antalya', translated: 'Luksus lejligheder med havudsigt i Antalya' },
  'fa': { en: 'Luxury apartments with sea view in Antalya', translated: 'آپارتمان های لوکس با منظره دریا در Antalya' },
  'ur': { en: 'Luxury apartments with sea view in Antalya', translated: 'Antalya میں سمندری نظارے والے پرتعیش اپارٹمنٹس' }
};

function generateSlug(text: string): string {
  const normalized = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[åÅ]/g, 'a').replace(/[äÄ]/g, 'a').replace(/[öÖ]/g, 'o')
    .replace(/[şŞ]/g, 's').replace(/[ğĞ]/g, 'g').replace(/[üÜ]/g, 'u')
    .replace(/[çÇ]/g, 'c').replace(/[ıİ]/g, 'i');

  return normalized.trim().toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

async function translateText(text: string, targetLang: string, apiKey: string): Promise<string> {
  try {
    const languageName = LANGUAGE_NAMES[targetLang] || targetLang;
    const example = TRANSLATION_EXAMPLES[targetLang];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator specializing in real estate property titles. Translate English property titles to ${languageName}.

RULES:
1. Translate ALL English words to ${languageName}
2. Keep city/location names in their original form (Antalya, Istanbul, Dubai, Mersin, Bali, Cyprus, etc.)
3. Return ONLY the translated text, no explanations
4. The translation should sound natural in ${languageName}

Example:
English: "${example.en}"
${languageName}: "${example.translated}"`
          },
          { role: 'user', content: text }
        ],
        max_tokens: 300,
        temperature: 0.2
      })
    });

    if (!response.ok) {
      console.error(`Translation API error for ${targetLang}:`, await response.text());
      return text;
    }

    const data = await response.json();
    const translatedText = data.choices?.[0]?.message?.content?.trim();
    if (!translatedText) return text;

    return translatedText.replace(/^["']|["']$/g, '');
  } catch (error) {
    console.error(`Translation failed for ${targetLang}:`, error);
    return text;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) throw new Error('LOVABLE_API_KEY not configured');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let batchSize = 5;
    let targetLanguages = SUPPORTED_LANGUAGES;
    let forceRetranslate = false;

    try {
      const body = await req.json();
      if (body.batchSize) batchSize = Math.min(body.batchSize, 10);
      if (body.languages) targetLanguages = body.languages.filter((l: string) => SUPPORTED_LANGUAGES.includes(l));
      if (body.forceRetranslate) forceRetranslate = true;
    } catch { /* defaults */ }

    if (forceRetranslate) {
      const clearUpdate: Record<string, null> = {};
      for (const lang of targetLanguages) clearUpdate[`slug_${lang}`] = null;
      await supabase.from('properties').update(clearUpdate).eq('is_active', true);
    }

    // Fetch properties missing ANY target language slug
    const anyMissingFilter = targetLanguages.map(l => `slug_${l}.is.null`).join(',');

    const { data: properties, error: fetchError } = await supabase
      .from('properties')
      .select('id, title, slug, slug_sv, slug_tr, slug_ar, slug_ru, slug_no, slug_da, slug_fa, slug_ur')
      .eq('is_active', true)
      .or(anyMissingFilter)
      .limit(batchSize);

    if (fetchError) throw new Error(`Failed to fetch: ${fetchError.message}`);

    if (!properties || properties.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'All properties translated', remaining: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${properties.length} properties...`);
    let translatedCount = 0;

    for (const property of properties) {
      const updates: Record<string, string> = {};

      for (const lang of targetLanguages) {
        const slugColumn = `slug_${lang}`;
        if ((property as any)[slugColumn]) continue;

        const translatedTitle = await translateText(property.title, lang, lovableApiKey);
        const translatedSlug = generateSlug(translatedTitle);

        updates[slugColumn] = (translatedSlug && translatedSlug.length > 5 && translatedSlug !== property.slug)
          ? translatedSlug
          : `${property.slug}-${lang}`;

        // Small delay between API calls
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from('properties')
          .update(updates)
          .eq('id', property.id);

        if (updateError) {
          console.error(`Failed to update ${property.id}:`, updateError);
        } else {
          translatedCount++;
          console.log(`Updated ${property.id}: ${property.title}`);
        }
      }
    }

    // Check how many remain
    const { count: remaining } = await supabase
      .from('properties')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true)
      .or(anyMissingFilter);

    // Self-chain: if more properties remain, trigger next batch
    if (remaining && remaining > 0) {
      console.log(`${remaining} properties remaining. Triggering next batch...`);
      const nextUrl = `${supabaseUrl}/functions/v1/translate-slugs`;
      
      (globalThis as any).EdgeRuntime?.waitUntil?.(
        fetch(nextUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ batchSize })
        }).catch(err => console.error('Self-chain failed:', err))
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Translated ${translatedCount} properties`,
        translated: translatedCount,
        remaining: remaining || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
