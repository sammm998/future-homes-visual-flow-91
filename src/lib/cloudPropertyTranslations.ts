import { supabase as cloud } from "@/integrations/supabase/client";
import { pickPropertyTranslation } from "./propertyTranslationRules";

type Row = { property_id: string; title: string | null; description: string | null; location: string | null; source_hash?: string | null };

/** Translations generated into Lovable Cloud for listings whose original
 * database row is missing or still English. Reads only; never generates. */
export async function readCloudTranslations(language: string, propertyId?: string): Promise<Map<string, Row>> {
  let query = cloud.from("property_text_translations")
    .select("property_id,title,description,location,source_hash")
    .eq("language_code", language);
  if (propertyId) query = query.eq("property_id", propertyId);
  const { data, error } = await query;
  if (error) {
    console.warn("[translations] cloud read failed", error.message);
    return new Map();
  }
  return new Map((data ?? []).map((row) => [row.property_id, row]));
}

export { pickPropertyTranslation };
