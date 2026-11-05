import { createFileRoute } from "@tanstack/react-router";
import MersinPropertySearch from "@/pages/MersinPropertySearch";

export const Route = createFileRoute("/mersin")({
  component: MersinPropertySearch,
});
