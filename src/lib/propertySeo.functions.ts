import { readCloudTranslations, pickPropertyTranslation } from "@/lib/cloudPropertyTranslations";
import { createServerFn } from "@tanstack/react-start";
import { createPublicCloudClient } from "@/integrations/legacy/publicCloud";


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
  images: string[];
  refNo: string | null;
  location: string | null;
  country: string | null;
  district: string | null;
  price: string | null;
  currency: string | null;
  bedrooms: string | null;
  bathrooms: string | null;
  area: string | null;
  propertyType: string | null;
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

    const supabase = createPublicCloudClient() as any;

    const slugColumns = ["slug", ...SUPPORTED_LANGUAGES.map((l) => `slug_${l}`)];
    const select =
      "id, title, description, location, price, ref_no, property_image, property_images, og_image, price_currency, bedrooms, bathrooms, sizes_m2, property_type, property_district, country";

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
      const [{ data: legacyTranslation }, cloudRows] = await Promise.all([
        supabase
          .from("property_translations")
          .select("title, description, location")
          .eq("property_id", property.id)
          .eq("language_code", data.lang)
          .maybeSingle(),
        readCloudTranslations(data.lang, property.id),
      ]);
      const translation = pickPropertyTranslation(legacyTranslation, cloudRows.get(property.id), property);

      if (translation) {
        if (translation.title) property.title = translation.title;
        if (translation.description) property.description = translation.description;
        if (translation.location) property.location = translation.location;
      }
    }

    const images: string[] = Array.isArray(property.property_images)
      ? property.property_images
      : [];
    const image = property.og_image || property.property_image || images[0] || null;
    const str = (v: unknown) => (v === null || v === undefined || v === "" ? null : String(v));

    return {
      title: clean(String(property.title ?? "Property"), 90),
      description: clean(String(property.description ?? property.title ?? ""), 155),
      image,
      images: [image, ...images].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).slice(0, 6) as string[],
      refNo: str(property.ref_no),
      location: str(property.location),
      country: str(property.country),
      district: str(property.property_district),
      price: str(property.price),
      currency: str(property.price_currency),
      bedrooms: str(property.bedrooms),
      bathrooms: str(property.bathrooms),
      area: str(property.sizes_m2),
      propertyType: str(property.property_type),
    };
  });

/** Short, unique, descriptive <title> for a property page (≤ ~60 chars, always ends with the REF). */
export function buildPropertySeoTitle(
  p: { title?: string | null; bedrooms?: string | number | null; propertyType?: string | null; district?: string | null; location?: string | null; refNo?: string | number | null },
  lang: string,
  bedroomsLabel = "Bed",
): string {
  const suffix = p.refNo ? ` | REF ${p.refNo}` : " | Future Homes";
  const city = (p.location || "").split(/[,/]/)[0].trim();
  const district = (p.district || "").trim();
  const place = [district && district.toLowerCase() !== city.toLowerCase() ? district : null, city || null].filter(Boolean).join(", ");
  const beds = String(p.bedrooms ?? "").replace(/\s*<>\s*/g, "–").replace(/\s+/g, " ").trim();
  const type = (p.propertyType || "").trim();
  const limit = 60 - suffix.length;
  const fit = (s: string) => (s.length <= limit ? s : s.slice(0, limit - 1).replace(/\s+\S*$/, "").replace(/[\s,.;:–-]+$/, "") + "…");
  if (lang === "en" && (type || beds) && place) {
    const typeLabel = type ? type.charAt(0).toUpperCase() + type.slice(1) : "Home";
    const head = beds && /\d/.test(beds) ? `${beds} ${bedroomsLabel} ${typeLabel}` : typeLabel;
    const full = `${head} for Sale in ${place}`;
    return fit(full.length <= limit ? full : `${head} in ${place}`) + suffix;
  }
  const base = (p.title || "Property").trim();
  return fit(place ? `${base.length > limit - place.length - 3 ? base.slice(0, Math.max(10, limit - place.length - 4)).replace(/\s+\S*$/, "") + "…" : base} – ${place}` : base) + suffix;
}
