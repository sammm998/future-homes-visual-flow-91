import { createFileRoute } from "@tanstack/react-router";
import AntalyaPropertySearch from "@/pages/AntalyaPropertySearch";

export const Route = createFileRoute("/$locale/antalya")({
  component: AntalyaPropertySearch,
});
