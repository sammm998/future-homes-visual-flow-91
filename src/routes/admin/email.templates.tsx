import { createFileRoute } from "@tanstack/react-router";
import TemplatesList from "@/admin/pages/TemplatesList";

export const Route = createFileRoute("/admin/email/templates")({
  component: TemplatesList,
});
