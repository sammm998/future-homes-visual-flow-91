import { createFileRoute } from "@tanstack/react-router";
import OfficeSpreadsheet from "@/admin/pages/OfficeSpreadsheet";

export const Route = createFileRoute("/admin/office/spreadsheet")({
  component: OfficeSpreadsheet,
});
