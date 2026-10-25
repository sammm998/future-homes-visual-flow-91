export const PROPERTY_TRANSLATION_LANGUAGES = ["sv", "tr", "ar", "ru", "no", "da", "fa", "ur", "de", "fr", "es", "id"] as const;

type Text = { title?: string | null; description?: string | null; location?: string | null };
const normalize = (value?: string | null) => (value ?? "").replace(/\s+/g, " ").trim();

/** Detect copied prose blocks even when other paragraphs were translated. */
export function containsCopiedSourceProse(translated: string, source: string): boolean {
  const blocks = source.replace(/<[^>]*>/g, "\n").split(/\n+|(?<=[.!?])\s+/)
    .map(block => normalize(block).toLowerCase())
    .filter(block => block.length >= 35 && block.split(/\s+/).length >= 6)
    // Distance/data lines such as "Ngurah Rai International Airport (DPS): 17 km" are names, not prose.
    .filter(block => !/:\s*[\d~≈]/.test(block));
  const target = normalize(translated.replace(/<[^>]*>/g, " ")).toLowerCase();
  return blocks.some(block => target.includes(block));
}

/** Empty fields and copied English prose are not completed translations. */
export function isCompletePropertyTranslation(translation: Text | null | undefined, source?: Text | null): boolean {
  if (!translation || !normalize(translation.title) || !normalize(translation.description)) return false;
  if (source?.location && !normalize(translation.location)) return false;
  if (source && (normalize(translation.title) === normalize(source.title) || normalize(translation.description) === normalize(source.description))) return false;
  if (source?.description && containsCopiedSourceProse(translation.description ?? "", source.description)) return false;
  return true;
}

export function propertyTranslationSourceChanged(previous: Text | null, next: Text): boolean {
  return !!previous && ["title", "description", "location"].some(key => normalize(previous[key as keyof Text]) !== normalize(next[key as keyof Text]));
}
/** Stable fingerprint of the English source, so stored translations are only
 * used while they still describe the current listing text. */
export function propertyTranslationSourceHash(source: Text): string {
  const input = ["title", "description", "location"].map(key => normalize(source[key as keyof Text])).join("\u0001");
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

type StoredTranslation = Text & { source_hash?: string | null };

/** Prefer a complete original-database translation; otherwise use the
 * Lovable Cloud copy when it matches the current English source. */
export function pickPropertyTranslation(
  legacy: Text | null | undefined,
  cloud: StoredTranslation | null | undefined,
  source: Text,
): Text | null {
  if (isCompletePropertyTranslation(legacy, source)) return legacy!;
  if (cloud && cloud.source_hash === propertyTranslationSourceHash(source) && isCompletePropertyTranslation(cloud, source)) return cloud;
  return legacy ?? null;
}
