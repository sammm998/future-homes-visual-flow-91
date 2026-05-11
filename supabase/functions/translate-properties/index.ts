import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const TARGET_LANGUAGES = [
  { code: "sv", name: "Swedish" },
  { code: "tr", name: "Turkish" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" },
  { code: "no", name: "Norwegian" },
  { code: "da", name: "Danish" },
  { code: "fa", name: "Persian (Farsi)" },
  { code: "ur", name: "Urdu" },
  { code: "de", name: "German" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "nl", name: "Dutch" },
];

interface TranslationResult {
  title: string;
  description: string;
  location: string;
}

async function translateProperty(
  title: string,
  description: string,
  location: string,
  targetLang: string,
  targetLangName: string,
  apiKey: string,
): Promise<TranslationResult | null> {
  const systemPrompt = `You are a professional real estate translator. Translate the following property information from English to ${targetLangName}. Preserve real estate terminology, location names should remain recognizable but be transliterated/translated naturally for the target language. Keep the tone professional and appealing to property buyers. Return ONLY the JSON object, no other text.`;

  const userPrompt = `Translate to ${targetLangName}:\n\nTitle: ${title}\n\nLocation: ${location}\n\nDescription: ${description}`;

  try {
    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "save_translation",
                description: "Return the translated property fields",
                parameters: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    location: { type: "string" },
                  },
                  required: ["title", "description", "location"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "save_translation" },
          },
        }),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      console.error(`AI gateway error ${response.status}:`, text);
      return null;
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response", JSON.stringify(data));
      return null;
    }

    const parsed = JSON.parse(toolCall.function.arguments);
    return {
      title: parsed.title || title,
      description: parsed.description || description,
      location: parsed.location || location,
    };
  } catch (e) {
    console.error("Translation error:", e);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing required environment variables" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json().catch(() => ({}));
    const propertyIds: string[] | undefined = body.property_ids;
    const limit: number = body.limit || 5; // batch size to avoid rate limits
    const force: boolean = body.force || false;

    // Fetch properties to translate
    let query = supabase
      .from("properties")
      .select("id, title, description, location")
      .eq("is_active", true);

    if (propertyIds && propertyIds.length > 0) {
      query = query.in("id", propertyIds);
    } else {
      query = query.limit(limit);
    }

    const { data: properties, error: propError } = await query;

    if (propError) {
      console.error("Failed to fetch properties:", propError);
      return new Response(
        JSON.stringify({ error: propError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!properties || properties.length === 0) {
      return new Response(
        JSON.stringify({ message: "No properties found", translated: 0 }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    let totalTranslations = 0;
    let totalErrors = 0;
    const results: any[] = [];

    for (const property of properties) {
      if (!property.title || !property.description) {
        continue;
      }

      // Get existing translations for this property
      const { data: existing } = await supabase
        .from("property_translations")
        .select("language_code")
        .eq("property_id", property.id);

      const existingLangs = new Set(
        (existing || []).map((e: any) => e.language_code),
      );

      for (const lang of TARGET_LANGUAGES) {
        // Skip if already translated and not forcing
        if (!force && existingLangs.has(lang.code)) {
          continue;
        }

        const translation = await translateProperty(
          property.title,
          property.description || "",
          property.location || "",
          lang.code,
          lang.name,
          LOVABLE_API_KEY,
        );

        if (translation) {
          const { error: upsertError } = await supabase
            .from("property_translations")
            .upsert(
              {
                property_id: property.id,
                language_code: lang.code,
                title: translation.title,
                description: translation.description,
                location: translation.location,
              },
              { onConflict: "property_id,language_code" },
            );

          if (upsertError) {
            console.error(
              `Failed to save ${lang.code} for ${property.id}:`,
              upsertError,
            );
            totalErrors++;
          } else {
            totalTranslations++;
          }
        } else {
          totalErrors++;
        }

        // Small delay to avoid rate limits
        await new Promise((r) => setTimeout(r, 300));
      }

      results.push({
        property_id: property.id,
        title: property.title,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        properties_processed: properties.length,
        translations_saved: totalTranslations,
        errors: totalErrors,
        results,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (e) {
    console.error("Function error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
