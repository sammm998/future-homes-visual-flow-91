import { createFileRoute } from "@tanstack/react-router";
import BaliPropertySearch from "@/pages/BaliPropertySearch";

export const Route = createFileRoute("/bali")({
  component: BaliPropertySearch,
});
