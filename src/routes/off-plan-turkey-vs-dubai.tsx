import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/OffPlanComparison";

export const Route = createFileRoute("/off-plan-turkey-vs-dubai")({
  head: () => ({
    meta: [
      { title: "Off-Plan Turkey vs Dubai Compared | Future Homes" },
      { name: "description", content: "Compare off-plan delivery dates, payment and price timelines and developer guarantees in Turkey and Dubai." },
      { property: "og:title", content: "Off-Plan Turkey vs Dubai Compared | Future Homes" },
      { property: "og:description", content: "Compare off-plan delivery dates, payment and price timelines and developer guarantees in Turkey and Dubai." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
