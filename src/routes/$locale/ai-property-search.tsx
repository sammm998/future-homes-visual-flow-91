import { createFileRoute } from "@tanstack/react-router";
import AIPropertySearch from "@/pages/AIPropertySearch";

export const Route = createFileRoute("/$locale/ai-property-search")({
  component: AIPropertySearch,
});
