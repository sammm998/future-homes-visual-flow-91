import { createFileRoute } from "@tanstack/react-router";
import PresentationEdit from "@/admin/pages/PresentationEdit";

export const Route = createFileRoute("/admin/presentations/$id")({
  component: PresentationEdit,
});
