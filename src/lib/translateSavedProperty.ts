import { supabase } from "@/integrations/supabase/client";
import { translatePropertyText } from "@/lib/translatePropertyText.functions";

export const PROPERTY_TRANSLATION_LANGUAGES = ["sv", "tr", "ar", "ru", "no", "da", "fa", "ur", "de", "fr", "es", "id"];

/** Translate one language at a time via Lovable AI, save with the admin's own
 * session and verify persisted rows rather than trusting a success flag. */
export async function translateSavedProperty(
  propertyId: string,
  onProgress: (completed: number, total: number) => void,
  client = supabase,
) {
  const readCompleted = async () => {
    const { data, error } = await client.from("property_translations")
      .select("language_code,title,description")
      .eq("property_id", propertyId);
    if (error) throw new Error("Could not check saved translations.");
    return new Set((data || []).filter((row) => row.title?.trim() && row.description?.trim()).map((row) => row.language_code));
  };

  const { data: property, error: propError } = await client.from("properties")
    .select("title,description,location").eq("id", propertyId).maybeSingle();
  if (propError || !property?.title || !property?.description) {
    throw new Error("The property needs a title and description before it can be translated.");
  }

  let completed = await readCompleted();
  const count = () => PROPERTY_TRANSLATION_LANGUAGES.filter((code) => completed.has(code)).length;
  onProgress(count(), PROPERTY_TRANSLATION_LANGUAGES.length);
  for (const language of PROPERTY_TRANSLATION_LANGUAGES) {
    if (completed.has(language)) continue;
    let translated;
    try {
      translated = await translatePropertyText({
        data: { title: property.title, description: property.description, location: property.location || "", language },
      });
    } catch (e) {
      // Stop on any failure: no silent retry or continued charges after a denial.
      throw new Error(`Translation stopped at ${language.toUpperCase()}: ${e instanceof Error ? e.message : "unknown error"} Saved translations are kept; retry to finish.`);
    }
    const { error } = await client.from("property_translations").upsert(
      { property_id: propertyId, language_code: language, ...translated },
      { onConflict: "property_id,language_code" },
    );
    if (error) throw new Error(`The ${language.toUpperCase()} translation could not be saved: ${error.message}`);
    completed = await readCompleted();
    if (!completed.has(language)) throw new Error(`The ${language.toUpperCase()} translation was not saved.`);
    onProgress(count(), PROPERTY_TRANSLATION_LANGUAGES.length);
  }
  return count();
}
