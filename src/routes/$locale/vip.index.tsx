import { buildRouteSeoHead } from "@/lib/seoTags";
import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/VipClub";

export const Route = createFileRoute("/$locale/vip/")({
  head: ({ params }) =>
    buildRouteSeoHead({
      locale: params.locale,
      path: "/vip",
      title: "Future Homes VIP Club | Free Membership",
      description: "Save favourites, get Smart Property Alerts, price-drop notices and early access to selected pre-launch projects.",
      type: "website",
    }),
  component: Page,
});
