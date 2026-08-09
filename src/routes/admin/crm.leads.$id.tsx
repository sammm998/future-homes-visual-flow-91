import { createFileRoute } from "@tanstack/react-router";
import LeadDetail from "@/admin/pages/LeadDetail";

export const Route = createFileRoute("/admin/crm/leads/$id")({
  component: LeadDetail,
});
