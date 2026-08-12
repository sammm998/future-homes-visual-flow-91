import { createFileRoute } from "@tanstack/react-router";
import PropertyGallery from "@/pages/PropertyGallery";

export const Route = createFileRoute("/property-gallery")({
  component: PropertyGallery,
});
