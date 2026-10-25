import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/CitizenshipComplianceGuide";

export const Route = createFileRoute("/turkish-citizenship-compliance-guide")({
  head: () => ({
    meta: [
      { title: "Turkish Citizenship Documents Guide | Future Homes" },
      { name: "description", content: "Step-by-step English and Turkish guide from property purchase to Turkish citizenship, with documents and official links." },
      { property: "og:title", content: "Turkish Citizenship Documents Guide | Future Homes" },
      { property: "og:description", content: "Step-by-step English and Turkish guide from property purchase to Turkish citizenship, with documents and official links." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
