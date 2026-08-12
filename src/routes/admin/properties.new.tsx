import { createFileRoute } from "@tanstack/react-router";
import PropertyEdit from "@/admin/pages/PropertyEdit";

export const Route = createFileRoute("/admin/properties/new")({
  component: PropertyEdit,
});
