import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/VipClub";

export const Route = createFileRoute("/$locale/vip/")({
  head: () => ({
    meta: [
      { title: "Future Homes VIP Club | Free Membership" },
      { name: "description", content: "Save favourites, get Smart Property Alerts, price-drop notices and early access to selected pre-launch projects." },
      { property: "og:title", content: "Future Homes VIP Club | Free Membership" },
      { property: "og:description", content: "Save favourites, get Smart Property Alerts, price-drop notices and early access to selected pre-launch projects." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
