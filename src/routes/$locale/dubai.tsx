import { createFileRoute } from "@tanstack/react-router";
import DubaiPropertySearch from "@/pages/DubaiPropertySearch";

export const Route = createFileRoute("/$locale/dubai")({
  component: DubaiPropertySearch,
});
