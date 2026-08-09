import { createFileRoute } from "@tanstack/react-router";
import PropertyGallery from "@/pages/PropertyGallery";

export const Route = createFileRoute("/$locale/property-gallery")({
  component: PropertyGallery,
});
