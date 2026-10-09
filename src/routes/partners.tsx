import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Partners";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partner Program | Future Homes International" },
      { name: "description", content: "Refer property buyers to Future Homes with your own link, a partner portal and agreed commission." },
      { property: "og:title", content: "Partner Program | Future Homes International" },
      { property: "og:description", content: "Refer property buyers to Future Homes with your own link, a partner portal and agreed commission." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
