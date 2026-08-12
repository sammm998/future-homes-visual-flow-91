import { createFileRoute } from "@tanstack/react-router";
import CyprusPropertySearch from "@/pages/CyprusPropertySearch";

export const Route = createFileRoute("/$locale/cyprus")({
  component: CyprusPropertySearch,
});
