import { buildRouteSeoHead } from "@/lib/seoTags";
import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/ViewingTripPlanner";

export const Route = createFileRoute("/$locale/viewing-trip")({
  head: ({ params }) =>
    buildRouteSeoHead({
      locale: params.locale,
      path: "/viewing-trip",
      title: "Property Viewing Trip Planner | Future Homes",
      description: "Plan a day-by-day property viewing trip by city, dates, budget and home type.",
      type: "website",
    }),
  component: Page,
});
