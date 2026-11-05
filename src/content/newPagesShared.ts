// Lightweight access to the page meta + official-source labels of the new
// content pages, without loading their full multi-language body copy.
import { NEW_PAGES_SHARED } from "./newPagesShared.generated";
import type { NewPagesCopy } from "./newPagesCopy";

type Shared = { meta: NewPagesCopy["meta"]; sources: NewPagesCopy["sources"] };
const ALL = NEW_PAGES_SHARED as unknown as Record<string, Shared>;

export function newPagesShared(lang?: string | null): Shared {
  return (lang && ALL[lang]) || ALL.en;
}
