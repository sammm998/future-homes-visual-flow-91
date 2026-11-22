import { createFileRoute } from "@tanstack/react-router";
import Integrations from "@/admin/pages/Integrations";

export const Route = createFileRoute("/admin/integrations")({
  component: Integrations,
});
