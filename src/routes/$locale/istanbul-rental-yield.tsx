import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/IstanbulRentalYield";
import { newPagesCopy } from "@/content/newPagesCopy";

export const Route = createFileRoute("/$locale/istanbul-rental-yield")({
  head: ({ params }) => {
    const m = newPagesCopy((params as { locale?: string }).locale).meta.yield;
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
