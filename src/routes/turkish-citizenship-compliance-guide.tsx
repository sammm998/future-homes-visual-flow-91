import { buildRouteSeoHead } from "@/lib/seoTags";
import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/CitizenshipComplianceGuide";

export const Route = createFileRoute("/turkish-citizenship-compliance-guide")({
  // English fallback; other languages come from the per-language dictionaries (seoMetaExtra).
  head: ({ params }) =>
    buildRouteSeoHead({
      locale: (params as { locale?: string }).locale,
      path: "/turkish-citizenship-compliance-guide",
      title: "Turkish Citizenship Documents Guide | Future Homes",
      description: "Step-by-step guide from property purchase to Turkish citizenship, with documents and official government links.",
      type: "article",
    }),
  component: Page,
});
