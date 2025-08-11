import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const googleTranslateApiKey = Deno.env.get('GOOGLE_TRANSLATE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, targetLanguage = 'sv' } = await req.json();

    if (!text) {
      throw new Error('Text is required');
    }

    if (!googleTranslateApiKey) {
      throw new Error('Google Translate API key is not configured');
    }

    // Map language codes to Google Translate format
    const languageMap: { [key: string]: string } = {
      'sv': 'sv',
      'tr': 'tr', 
      'fr': 'fr',
      'ar': 'ar',
      'ru': 'ru',
      'da': 'da',
      'no': 'no',
      'fi': 'fi',
      'de': 'de',
      'es': 'es',
      'nl': 'nl',
      'en': 'en'
    };

    const targetLang = languageMap[targetLanguage] || 'sv';

    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${googleTranslateApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLang,
        source: 'en'
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Translate API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.data || !data.data.translations || !data.data.translations[0]) {
      throw new Error('Invalid response from Google Translate API');
    }
    
    const translatedText = data.data.translations[0].translatedText;

    return new Response(JSON.stringify({ translatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in translate-text function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});