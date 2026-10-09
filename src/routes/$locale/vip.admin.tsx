import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/VipAdmin";

export const Route = createFileRoute("/$locale/vip/admin")({
  head: () => ({
    meta: [
      { title: "VIP Club Admin | Future Homes International" },
      { name: "description", content: "Manage VIP members, partners and early-access projects." },
      { property: "og:title", content: "VIP Club Admin | Future Homes International" },
      { property: "og:description", content: "Manage VIP members, partners and early-access projects." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Page,
});
