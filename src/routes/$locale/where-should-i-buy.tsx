import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/WhereShouldIBuy";

export const Route = createFileRoute("/$locale/where-should-i-buy")({
  head: () => ({
    meta: [
      { title: "Where Should I Buy? Country Quiz | Future Homes International" },
      { name: "description", content: "Find which country fits your budget and goals: Turkey, Dubai, Northern Cyprus or Bali." },
      { property: "og:title", content: "Where Should I Buy? Country Quiz | Future Homes International" },
      { property: "og:description", content: "Find which country fits your budget and goals: Turkey, Dubai, Northern Cyprus or Bali." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
