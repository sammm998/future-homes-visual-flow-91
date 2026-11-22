import { createFileRoute } from "@tanstack/react-router";
import BIBuilder from "@/admin/pages/BIBuilder";

export const Route = createFileRoute("/admin/bi")({
  component: BIBuilder,
});
