import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPPORTED_LANGUAGES = ['sv', 'tr', 'ar', 'ru', 'no', 'da', 'fa', 'ur'];

// Generate URL-safe slug from text
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '') // Trim hyphens from start/end
    .substring(0, 100); // Limit length
}

// Translate text using Google Translate API
async function translateText(text: string, targetLang: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: targetLang,
          format: 'text'
        })
      }
    );

    if (!response.ok) {
      console.error(`Translation API error for ${targetLang}:`, await response.text());
      return text;
    }

    const data = await response.json();
    return data.data?.translations?.[0]?.translatedText || text;
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
    const googleApiKey = Deno.env.get('GOOGLE_TRANSLATE_API_KEY');

    if (!googleApiKey) {
      throw new Error('GOOGLE_TRANSLATE_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body for options
    let batchSize = 10;
    let targetLanguages = SUPPORTED_LANGUAGES;
    
    try {
      const body = await req.json();
      if (body.batchSize) batchSize = Math.min(body.batchSize, 50);
      if (body.languages) targetLanguages = body.languages.filter((l: string) => SUPPORTED_LANGUAGES.includes(l));
    } catch {
      // Use defaults
    }

    // Fetch properties that need translation (missing any translated slug)
    const { data: properties, error: fetchError } = await supabase
      .from('properties')
      .select('id, title, slug, slug_sv, slug_tr, slug_ar, slug_ru, slug_no, slug_da, slug_fa, slug_ur')
      .eq('is_active', true)
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
        const translatedTitle = await translateText(property.title, lang, googleApiKey);
        const translatedSlug = generateSlug(translatedTitle);
        
        if (translatedSlug && translatedSlug !== property.slug) {
          updates[`slug_${lang}`] = translatedSlug;
        } else {
          // If translation failed or is same as English, use English slug with language suffix
          updates[`slug_${lang}`] = `${property.slug}-${lang}`;
        }
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
          results.push({ id: property.id, success: true, translations: Object.keys(updates) });
        }
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
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
