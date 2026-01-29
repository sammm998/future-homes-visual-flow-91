import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPPORTED_LANGUAGES = ['sv', 'tr', 'ar', 'ru', 'no', 'da', 'fa', 'ur'];

const LANGUAGE_NAMES: Record<string, string> = {
  'sv': 'Swedish',
  'tr': 'Turkish',
  'ar': 'Arabic',
  'ru': 'Russian',
  'no': 'Norwegian',
  'da': 'Danish',
  'fa': 'Persian/Farsi',
  'ur': 'Urdu'
};

// Example translations for few-shot prompting
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

// Generate URL-safe slug from text
function generateSlug(text: string): string {
  // Keep unicode letters for languages like Arabic/Russian while still
  // normalizing common Latin diacritics for consistent URLs.
  const normalized = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (Latin)
    // Transliterate common Swedish characters
    .replace(/[åÅ]/g, 'a')
    .replace(/[äÄ]/g, 'a')
    .replace(/[öÖ]/g, 'o')
    // Transliterate Turkish characters
    .replace(/[şŞ]/g, 's')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[üÜ]/g, 'u')
    .replace(/[çÇ]/g, 'c')
    .replace(/[ıİ]/g, 'i');

  return normalized
    .trim()
    .toLowerCase()
    // Remove punctuation/symbols but keep letters+numbers from all scripts.
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

// Translate text using Lovable AI Gateway
async function translateText(text: string, targetLang: string, apiKey: string): Promise<string> {
  try {
    const languageName = LANGUAGE_NAMES[targetLang] || targetLang;
    const example = TRANSLATION_EXAMPLES[targetLang];
    
    const systemPrompt = `You are a professional translator specializing in real estate property titles. Your task is to translate English property titles to ${languageName}.

RULES:
1. Translate ALL English words to ${languageName}
2. Keep city/location names in their original form (Antalya, Istanbul, Dubai, Mersin, Bali, Cyprus, etc.)
3. Return ONLY the translated text, no explanations
4. The translation should sound natural in ${languageName}

Example:
English: "${example.en}"
${languageName}: "${example.translated}"

Now translate the following property title:`;

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
            content: systemPrompt
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: 300,
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Translation API error for ${targetLang}:`, errorText);
      return text;
    }

    const data = await response.json();
    const translatedText = data.choices?.[0]?.message?.content?.trim();
    
    if (!translatedText) {
      console.error(`No translation returned for ${targetLang}`);
      return text;
    }
    
    // Remove any quotes that might be in the response
    const cleanedTranslation = translatedText.replace(/^["']|["']$/g, '');
    
    console.log(`Translated "${text}" to ${targetLang}: "${cleanedTranslation}"`);
    return cleanedTranslation;
  } catch (error) {
    console.error(`Translation failed for ${targetLang}:`, error);
    return text;
  }
}

// Background translation function
async function translateAllProperties(supabase: any, lovableApiKey: string, targetLanguages: string[]) {
  let offset = 0;
  const batchSize = 10;
  let totalTranslated = 0;
  
  while (true) {
    // Fetch batch of properties needing translation
    const { data: properties, error: fetchError } = await supabase
      .from('properties')
      .select('id, title, slug, slug_sv, slug_tr, slug_ar, slug_ru, slug_no, slug_da, slug_fa, slug_ur')
      .eq('is_active', true)
      .range(offset, offset + batchSize - 1);

    if (fetchError) {
      console.error('Failed to fetch properties:', fetchError);
      break;
    }

    if (!properties || properties.length === 0) {
      console.log('No more properties to process');
      break;
    }

    console.log(`Processing batch ${offset / batchSize + 1}: ${properties.length} properties`);

    for (const property of properties) {
      const updates: Record<string, string> = {};
      
      for (const lang of targetLanguages) {
        const slugColumn = `slug_${lang}` as keyof typeof property;
        
        // Skip if already translated
        if (property[slugColumn]) {
          continue;
        }
        
        // Translate the title
        const translatedTitle = await translateText(property.title, lang, lovableApiKey);
        const translatedSlug = generateSlug(translatedTitle);
        
        if (translatedSlug && translatedSlug.length > 5 && translatedSlug !== property.slug) {
          updates[`slug_${lang}`] = translatedSlug;
        } else {
          // If translation failed or is same as English, use English slug with language suffix
          updates[`slug_${lang}`] = `${property.slug}-${lang}`;
        }
        
        // Small delay between translations
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Update property if there are translations
      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from('properties')
          .update(updates)
          .eq('id', property.id);

        if (updateError) {
          console.error(`Failed to update property ${property.id}:`, updateError);
        } else {
          totalTranslated++;
          console.log(`Updated property ${property.id}: ${property.title}`);
        }
      }
    }

    offset += batchSize;
    
    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`Background translation complete. Total translated: ${totalTranslated}`);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body for options
    let batchSize = 10;
    let targetLanguages = SUPPORTED_LANGUAGES;
    let runInBackground = false;
    let forceRetranslate = false;
    
    try {
      const body = await req.json();
      if (body.batchSize) batchSize = Math.min(body.batchSize, 50);
      if (body.languages) targetLanguages = body.languages.filter((l: string) => SUPPORTED_LANGUAGES.includes(l));
      if (body.background) runInBackground = true;
      if (body.forceRetranslate) forceRetranslate = true;
    } catch {
      // Use defaults
    }

    // If force retranslate, clear existing slugs first
    if (forceRetranslate) {
      console.log('Force retranslate enabled - clearing existing translated slugs');
      const { error: clearError } = await supabase
        .from('properties')
        .update({
          slug_sv: null,
          slug_tr: null,
          slug_ar: null,
          slug_ru: null,
          slug_no: null,
          slug_da: null,
          slug_fa: null,
          slug_ur: null
        })
        .eq('is_active', true);
      
      if (clearError) {
        console.error('Failed to clear slugs:', clearError);
      }
    }

    // Run in background mode
    if (runInBackground) {
      // Use EdgeRuntime.waitUntil for background processing
      (globalThis as any).EdgeRuntime?.waitUntil?.(
        translateAllProperties(supabase, lovableApiKey, targetLanguages)
      );
      
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Translation started in background',
          mode: 'background'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Synchronous mode - just process one batch
    const { data: properties, error: fetchError } = await supabase
      .from('properties')
      .select('id, title, slug, slug_sv, slug_tr, slug_ar, slug_ru, slug_no, slug_da, slug_fa, slug_ur')
      .eq('is_active', true)
      .is('slug_sv', null)
      .limit(batchSize);

    if (fetchError) {
      throw new Error(`Failed to fetch properties: ${fetchError.message}`);
    }

    if (!properties || properties.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No properties to translate', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${properties.length} properties for translation`);
    
    let translatedCount = 0;
    const results: any[] = [];

    for (const property of properties) {
      const updates: Record<string, string> = {};
      
      for (const lang of targetLanguages) {
        const slugColumn = `slug_${lang}` as keyof typeof property;
        
        // Skip if already translated
        if (property[slugColumn]) {
          continue;
        }
        
        // Translate the title
        const translatedTitle = await translateText(property.title, lang, lovableApiKey);
        const translatedSlug = generateSlug(translatedTitle);
        
        if (translatedSlug && translatedSlug.length > 5 && translatedSlug !== property.slug) {
          updates[`slug_${lang}`] = translatedSlug;
        } else {
          // If translation failed or is same as English, use English slug with language suffix
          updates[`slug_${lang}`] = `${property.slug}-${lang}`;
        }
        
        // Small delay between translations
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Update property if there are translations
      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from('properties')
          .update(updates)
          .eq('id', property.id);

        if (updateError) {
          console.error(`Failed to update property ${property.id}:`, updateError);
          results.push({ id: property.id, success: false, error: updateError.message });
        } else {
          translatedCount++;
          results.push({ id: property.id, title: property.title, success: true, translations: updates });
        }
      }
    }

    console.log(`Successfully translated ${translatedCount} properties`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Translated ${translatedCount} properties`,
        count: translatedCount,
        results
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
