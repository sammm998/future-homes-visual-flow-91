import { createFileRoute } from "@tanstack/react-router";
import AdminOverview from "@/admin/pages/AdminOverview";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});
