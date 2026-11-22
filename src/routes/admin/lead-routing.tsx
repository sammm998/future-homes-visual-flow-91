import { createFileRoute } from "@tanstack/react-router";
import LeadRouting from "@/admin/pages/LeadRouting";

export const Route = createFileRoute("/admin/lead-routing")({
  component: LeadRouting,
});
