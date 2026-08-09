import { createFileRoute } from "@tanstack/react-router";
import TasksList from "@/admin/pages/TasksList";

export const Route = createFileRoute("/admin/crm/tasks")({
  component: TasksList,
});
