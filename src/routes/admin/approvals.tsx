import { createFileRoute } from "@tanstack/react-router";
import Approvals from "@/admin/pages/Approvals";

export const Route = createFileRoute("/admin/approvals")({
  component: Approvals,
});
