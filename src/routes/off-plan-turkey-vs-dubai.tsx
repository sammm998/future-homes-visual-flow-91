import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/OffPlanComparison";
import { newPagesCopy } from "@/content/newPagesCopy";

export const Route = createFileRoute("/off-plan-turkey-vs-dubai")({
  head: ({ params }) => {
    const m = newPagesCopy((params as { locale?: string }).locale).meta.offplan;
    return {
      meta: [
        { title: m.title },
        { name: "description", content: m.description },
        { property: "og:title", content: m.title },
        { property: "og:description", content: m.description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: Page,
});
