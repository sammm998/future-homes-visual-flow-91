import { createFileRoute } from "@tanstack/react-router";
import SalesReports from "@/admin/pages/SalesReports";

export const Route = createFileRoute("/admin/reports")({
  component: SalesReports,
});
