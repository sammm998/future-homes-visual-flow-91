import { createFileRoute } from "@tanstack/react-router";
import EmailInbox from "@/admin/pages/EmailInbox";

export const Route = createFileRoute("/admin/email/")({
  component: EmailInbox,
});
