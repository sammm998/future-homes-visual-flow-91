import { createFileRoute } from "@tanstack/react-router";
import AdminLayout from "@/admin/AdminLayout";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex" }, { name: "apple-mobile-web-app-capable", content: "yes" }, { name: "apple-mobile-web-app-title", content: "FH Admin" }, { name: "theme-color", content: "#071827" }],
    links: [{ rel: "manifest", href: "/admin.webmanifest" }, { rel: "apple-touch-icon", href: "/apple-touch-icon.png" }],
  }),
  component: () => (
    <ProtectedAdminRoute>
      <AdminLayout />
    </ProtectedAdminRoute>
  ),
});
