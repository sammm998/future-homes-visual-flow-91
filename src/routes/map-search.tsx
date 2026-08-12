import { createFileRoute } from "@tanstack/react-router";
import MapSearch from "@/pages/MapSearch";

export const Route = createFileRoute("/map-search")({
  component: MapSearch,
});
