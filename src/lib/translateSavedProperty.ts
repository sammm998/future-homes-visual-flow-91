import { supabase } from "@/integrations/legacy/client";
import { translatePropertyText } from "@/lib/translatePropertyText.functions";
import { PROPERTY_TRANSLATION_LANGUAGES, isCompletePropertyTranslation, pickPropertyTranslation } from "./propertyTranslationRules";
import { supabase as cloud } from "@/integrations/supabase/client";
export { PROPERTY_TRANSLATION_LANGUAGES } from "./propertyTranslationRules";

/** Translate one language at a time via Lovable AI, save with the admin's own
 * session and verify persisted rows rather than trusting a success flag. */
export async function translateSavedProperty(
  propertyId: string,
  onProgress: (completed: number, total: number) => void,
  client = supabase,
  force = false,
) {
  // A language counts as done when either database holds a complete,
  // current translation; the site reads both.
  const readCompleted = async () => {
    const [{ data, error }, { data: cloudRows }] = await Promise.all([
      client.from("property_translations").select("language_code,title,description,location").eq("property_id", propertyId),
      cloud.from("property_text_translations").select("language_code,title,description,location,source_hash").eq("property_id", propertyId),
    ]);
    if (error) throw new Error("Could not check saved translations.");
    const legacy = new Map((data || []).map((row) => [row.language_code, row]));
    const stored = new Map((cloudRows || []).map((row) => [row.language_code, row]));
    return new Set(PROPERTY_TRANSLATION_LANGUAGES.filter((code) =>
      isCompletePropertyTranslation(pickPropertyTranslation(legacy.get(code), stored.get(code), property!), property)));
  };

  const { data: property, error: propError } = await client.from("properties")
    .select("title,description,location").eq("id", propertyId).maybeSingle();
  if (propError || !property?.title || !property?.description) {
    throw new Error("The property needs a title and description before it can be translated.");
  }

  let completed = force ? new Set<string>() : await readCompleted();
  const count = () => PROPERTY_TRANSLATION_LANGUAGES.filter((code) => completed.has(code)).length;
  onProgress(count(), PROPERTY_TRANSLATION_LANGUAGES.length);
  const { data: sess } = await client.auth.getSession();
  const accessToken = sess.session?.access_token ?? "";
  if (!accessToken) throw new Error("Please sign in to the property administration before translating.");
  const pending = PROPERTY_TRANSLATION_LANGUAGES.filter(code => force || !completed.has(code));
  for (const language of pending) {
    let translated;
    try {
      translated = await translatePropertyText({
        data: { title: property.title, description: property.description, location: property.location || "", language, accessToken, propertyId },
      });
    } catch (e) {
      // Stop on any failure: no silent retry or continued charges after a denial.
      throw new Error(`Translation stopped at ${language.toUpperCase()}: ${e instanceof Error ? e.message : "unknown error"} Saved translations are kept; retry to finish.`);
    }
    if (!isCompletePropertyTranslation(translated, property)) throw new Error(`The ${language.toUpperCase()} translation is incomplete or still contains the English original. No translation was overwritten.`);
    const { error } = await client.from("property_translations").upsert(
      { property_id: propertyId, language_code: language, ...translated, updated_at: new Date().toISOString() },
      { onConflict: "property_id,language_code" },
    );
    // The Cloud copy was saved by the server; the original database may refuse writes.
    if (error) console.warn(`[translations] original database refused ${language}: ${error.message}`);
    completed = await readCompleted();
    if (!completed.has(language)) throw new Error(`The ${language.toUpperCase()} translation was not saved.`);
    onProgress(count(), PROPERTY_TRANSLATION_LANGUAGES.length);
  }
  return count();
}
