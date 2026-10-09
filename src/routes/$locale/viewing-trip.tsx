import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/ViewingTripPlanner";

export const Route = createFileRoute("/$locale/viewing-trip")({
  head: () => ({
    meta: [
      { title: "Viewing Trip Planner | Future Homes International" },
      { name: "description", content: "Plan a day-by-day property viewing trip by city, dates, budget and home type." },
      { property: "og:title", content: "Viewing Trip Planner | Future Homes International" },
      { property: "og:description", content: "Plan a day-by-day property viewing trip by city, dates, budget and home type." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
