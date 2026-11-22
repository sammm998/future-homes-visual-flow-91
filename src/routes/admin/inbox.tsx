import { createFileRoute } from "@tanstack/react-router";
import CustomerInbox from "@/admin/pages/CustomerInbox";

export const Route = createFileRoute("/admin/inbox")({
  component: CustomerInbox,
});
