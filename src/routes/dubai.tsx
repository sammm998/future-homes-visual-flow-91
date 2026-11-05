import { createFileRoute } from "@tanstack/react-router";
import DubaiPropertySearch from "@/pages/DubaiPropertySearch";

export const Route = createFileRoute("/dubai")({
  component: DubaiPropertySearch,
});
