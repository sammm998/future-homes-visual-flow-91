import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/CustomerPortal";
import { portalMeta } from "@/content/portalMeta.generated";

export const Route = createFileRoute("/$locale/portal")({
  head: ({ params }) => {
    void params;
    const m = portalMeta((params as { locale?: string }).locale);
    return { meta: [
      { title: m.title },
      { name: "description", content: m.description },
      { property: "og:title", content: m.title },
      { property: "og:description", content: m.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, follow" },
    ] };
  },
  component: Page,
});
