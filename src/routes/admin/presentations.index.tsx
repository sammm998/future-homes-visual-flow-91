import { createFileRoute } from "@tanstack/react-router";
import PresentationsList from "@/admin/pages/PresentationsList";

export const Route = createFileRoute("/admin/presentations/")({
  component: PresentationsList,
});
