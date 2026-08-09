import { createFileRoute } from "@tanstack/react-router";
import PropertyWizard from "@/pages/PropertyWizard";

export const Route = createFileRoute("/$locale/property-wizard")({
  component: PropertyWizard,
});
