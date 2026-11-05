import { buildRouteSeoHead } from "@/lib/seoTags";
import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Partners";

export const Route = createFileRoute("/partners")({
  head: () =>
    buildRouteSeoHead({
      locale: "en",
      path: "/partners",
      title: "Real Estate Partner Program | Future Homes",
      description: "Refer property buyers to Future Homes with your own link, a partner portal and agreed commission.",
      type: "website",
    }),
  component: Page,
});
