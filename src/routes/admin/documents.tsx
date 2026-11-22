import { createFileRoute } from "@tanstack/react-router";
import DocumentArchive from "@/admin/pages/DocumentArchive";

export const Route = createFileRoute("/admin/documents")({
  component: DocumentArchive,
});
