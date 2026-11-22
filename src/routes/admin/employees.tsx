import { createFileRoute } from "@tanstack/react-router";
import Employees from "@/admin/pages/Employees";

export const Route = createFileRoute("/admin/employees")({
  component: Employees,
});
