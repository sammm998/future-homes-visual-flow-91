import { createFileRoute } from "@tanstack/react-router";
import LeadsList from "@/admin/pages/LeadsList";

export const Route = createFileRoute("/admin/crm/leads/")({
  component: LeadsList,
});
