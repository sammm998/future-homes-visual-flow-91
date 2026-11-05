import { buildRouteSeoHead } from "@/lib/seoTags";
import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/WhereShouldIBuy";

export const Route = createFileRoute("/$locale/where-should-i-buy")({
  head: ({ params }) =>
    buildRouteSeoHead({
      locale: params.locale,
      path: "/where-should-i-buy",
      title: "Where Should I Buy Property Abroad? Free Quiz",
      description: "Find which country fits your budget and goals: Turkey, Dubai, Northern Cyprus or Bali.",
      type: "website",
    }),
  component: Page,
});
