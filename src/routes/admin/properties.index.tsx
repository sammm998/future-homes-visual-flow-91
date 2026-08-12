import { createFileRoute } from "@tanstack/react-router";
import PropertiesList from "@/admin/pages/PropertiesList";

export const Route = createFileRoute("/admin/properties/")({
  component: PropertiesList,
});
