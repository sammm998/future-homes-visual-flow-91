import { supabase } from "@/integrations/supabase/client";

export const PROPERTY_TRANSLATION_LANGUAGES = ["sv", "tr", "ar", "ru", "no", "da", "fa", "ur", "de", "fr", "es", "id"];

/** Use the existing translation service; process one language at a time to avoid
 * its batch cap and verify persisted rows rather than trusting a success flag. */
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

  let completed = await readCompleted();
  const count = () => PROPERTY_TRANSLATION_LANGUAGES.filter((code) => completed.has(code)).length;
  onProgress(count(), PROPERTY_TRANSLATION_LANGUAGES.length);
  for (const language of PROPERTY_TRANSLATION_LANGUAGES) {
    if (completed.has(language)) continue;
    const { data, error } = await client.functions.invoke("translate-properties", {
      body: { property_ids: [propertyId], languages: [language], max_translations: 1, force: false },
    });
    // Stop on any failure: no silent retry or continued charges after a denial.
    if (error || data?.error || Number(data?.errors || 0) > 0) {
      throw new Error(`Translation stopped at ${language.toUpperCase()}. Saved translations are kept; retry to finish the missing languages.`);
    }
    completed = await readCompleted();
    if (!completed.has(language)) {
      throw new Error(`The ${language.toUpperCase()} translation was not saved. Check that the property is active and has a description.`);
    }
    onProgress(count(), PROPERTY_TRANSLATION_LANGUAGES.length);
  }
  return count();
}