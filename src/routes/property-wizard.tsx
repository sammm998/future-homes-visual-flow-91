import { createFileRoute } from "@tanstack/react-router";
import PropertyWizard from "@/pages/PropertyWizard";

export const Route = createFileRoute("/property-wizard")({
  component: PropertyWizard,
});
