import { buildRouteSeoHead } from "@/lib/seoTags";
import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/IstanbulRentalYield";

export const Route = createFileRoute("/$locale/istanbul-rental-yield")({
  // English fallback; other languages come from the per-language dictionaries (seoMetaExtra).
  head: ({ params }) =>
    buildRouteSeoHead({
      locale: (params as { locale?: string }).locale,
      path: "/istanbul-rental-yield",
      title: "Istanbul Rental Yields by District | Future Homes",
      description: "Indicative rental yields for 12 Istanbul districts, sample listings and a net yield calculator after costs and tax.",
      type: "article",
    }),
  component: Page,
});
