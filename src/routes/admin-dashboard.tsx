import { createFileRoute } from "@tanstack/react-router";
import AdminDashboard from "@/pages/AdminDashboard";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";

export const Route = createFileRoute("/admin-dashboard")({
  component: () => (
    <ProtectedAdminRoute>
      <AdminDashboard />
    </ProtectedAdminRoute>
  ),
});
