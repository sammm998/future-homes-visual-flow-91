import { createFileRoute } from "@tanstack/react-router";
import AdminLayout from "@/admin/AdminLayout";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";

export const Route = createFileRoute("/admin")({
  component: () => (
    <ProtectedAdminRoute>
      <AdminLayout />
    </ProtectedAdminRoute>
  ),
});
