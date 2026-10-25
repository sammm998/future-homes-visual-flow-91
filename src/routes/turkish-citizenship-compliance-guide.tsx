import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/CitizenshipComplianceGuide";
import { newPagesCopy } from "@/content/newPagesCopy";

export const Route = createFileRoute("/turkish-citizenship-compliance-guide")({
  head: ({ params }) => {
    const m = newPagesCopy((params as { locale?: string }).locale).meta.guide;
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
