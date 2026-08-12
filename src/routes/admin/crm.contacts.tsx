import { createFileRoute } from "@tanstack/react-router";
import ContactsList from "@/admin/pages/ContactsList";

export const Route = createFileRoute("/admin/crm/contacts")({
  component: ContactsList,
});
