import { createFileRoute } from "@tanstack/react-router";
import OfficeDocuments from "@/admin/pages/OfficeDocuments";

export const Route = createFileRoute("/admin/office/documents")({
  component: OfficeDocuments,
});
