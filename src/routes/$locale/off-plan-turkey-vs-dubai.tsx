import { buildRouteSeoHead } from "@/lib/seoTags";
import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/OffPlanComparison";

export const Route = createFileRoute("/$locale/off-plan-turkey-vs-dubai")({
  // English fallback; other languages come from the per-language dictionaries (seoMetaExtra).
  head: ({ params }) =>
    buildRouteSeoHead({
      locale: (params as { locale?: string }).locale,
      path: "/off-plan-turkey-vs-dubai",
      title: "Off-Plan Turkey vs Dubai Compared | Future Homes",
      description: "Compare off-plan delivery dates, payment and price timelines and developer guarantees in Turkey and Dubai.",
      type: "article",
    }),
  component: Page,
});
