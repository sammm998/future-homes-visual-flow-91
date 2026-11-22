import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/CustomerPortal";
import { portalCopy } from "@/content/portalCopy";

export const Route = createFileRoute("/portal")({
  head: ({ params }) => {
    void params;
    const m = portalCopy(undefined).meta;
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
