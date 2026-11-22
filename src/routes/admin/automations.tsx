import { createFileRoute } from "@tanstack/react-router";
import Automations from "@/admin/pages/Automations";

export const Route = createFileRoute("/admin/automations")({
  component: Automations,
});
