export const PROPERTY_TRANSLATION_LANGUAGES = ["sv", "tr", "ar", "ru", "no", "da", "fa", "ur", "de", "fr", "es", "id"] as const;

type Text = { title?: string | null; description?: string | null; location?: string | null };
const normalize = (value?: string | null) => (value ?? "").replace(/\s+/g, " ").trim();

/** Detect copied prose blocks even when other paragraphs were translated. */
export function containsCopiedSourceProse(translated: string, source: string): boolean {
  const blocks = source.replace(/<[^>]*>/g, "\n").split(/\n+|(?<=[.!?])\s+/)
    .map(block => normalize(block).toLowerCase())
    .filter(block => block.length >= 35 && block.split(/\s+/).length >= 6);
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