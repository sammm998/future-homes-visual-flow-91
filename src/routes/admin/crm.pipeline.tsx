import { createFileRoute } from "@tanstack/react-router";
import DealsPipeline from "@/admin/pages/DealsPipeline";

export const Route = createFileRoute("/admin/crm/pipeline")({
  component: DealsPipeline,
});
