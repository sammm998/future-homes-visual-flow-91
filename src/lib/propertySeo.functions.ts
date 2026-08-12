import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kiogiyemoqbnuvclneoe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpb2dpeWVtb3FibnV2Y2xuZW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDg4NzIsImV4cCI6MjA2ODI4NDg3Mn0.wZFKwwrvtrps2gCFc15rHN-3eg5T_kEDioBGZV_IctI";

const SUPPORTED_LANGUAGES = [
  "sv",
  "tr",
  "ar",
  "ru",
  "no",
  "da",
  "fa",
  "ur",
  "es",
  "de",
  "fr",
  "id",
];

export interface PropertySeo {
  title: string;
  description: string;
  image: string | null;
  refNo: string | null;
  location: string | null;
  price: string | null;
}

const clean = (text: string, max: number): string => {
  const flat = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:-]+$/, "") + "…";
};

/**
 * Server-side lookup of a property's SEO fields so crawlers get a real,
 * translated <title>/<meta description> in the initial HTML instead of the
 * client-rendered fallback.
 */
export const getPropertySeo = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string; lang?: string | null; ref?: string | null }) => ({
    id: String(data?.id ?? ""),
    lang: data?.lang ?? null,
    ref: data?.ref ?? null,
  }))
  .handler(async ({ data }): Promise<PropertySeo | null> => {
    if (!data.id) return null;

    const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const slugColumns = ["slug", ...SUPPORTED_LANGUAGES.map((l) => `slug_${l}`)];
    const select = "id, title, description, location, price, ref_no, property_image, property_images";

    const findOne = async (column: string, value: string) => {
      const { data: rows } = await supabase
        .from("properties")
        .select(select)
        .eq(column, value)
        .eq("is_active", true)
        .order("ref_no", { ascending: false })
        .limit(1);
      return rows && rows.length > 0 ? (rows[0] as Record<string, any>) : null;
    };

    let property: Record<string, any> | null = null;

    if (data.ref) property = await findOne("ref_no", data.ref);

    const langSlugColumn =
      data.lang && SUPPORTED_LANGUAGES.includes(data.lang) ? `slug_${data.lang}` : "slug";
    if (!property) property = await findOne(langSlugColumn, data.id);

    if (!property) {
      const { data: rows } = await supabase
        .from("properties")
        .select(select)
        .or(slugColumns.map((c) => `${c}.eq.${data.id}`).join(","))
        .eq("is_active", true)
        .order("ref_no", { ascending: false })
        .limit(1);
      property = rows && rows.length > 0 ? (rows[0] as Record<string, any>) : null;
    }

    if (!property) property = await findOne("ref_no", data.id);

    if (!property) return null;

    // Localized title/description when the visitor is not on the English site
    if (data.lang && SUPPORTED_LANGUAGES.includes(data.lang)) {
      const { data: translation } = await supabase
        .from("property_translations")
        .select("title, description, location")
        .eq("property_id", property.id)
        .eq("language_code", data.lang)
        .maybeSingle();

      if (translation) {
        if (translation.title) property.title = translation.title;
        if (translation.description) property.description = translation.description;
        if (translation.location) property.location = translation.location;
      }
    }

    const images: string[] = Array.isArray(property.property_images)
      ? property.property_images
      : [];
    const image = property.property_image || images[0] || null;

    return {
      title: clean(String(property.title ?? "Property"), 90),
      description: clean(String(property.description ?? property.title ?? ""), 155),
      image,
      refNo: property.ref_no ? String(property.ref_no) : null,
      location: property.location ? String(property.location) : null,
      price: property.price ? String(property.price) : null,
    };
  });
