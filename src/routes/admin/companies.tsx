import { createFileRoute } from "@tanstack/react-router";
import Companies from "@/admin/pages/Companies";

export const Route = createFileRoute("/admin/companies")({
  component: Companies,
});
