import { createFileRoute } from "@tanstack/react-router";
import PropertyEdit from "@/admin/pages/PropertyEdit";

export const Route = createFileRoute("/admin/properties/$id/edit")({
  head: () => ({ meta: [
    { title: "Edit Property | Future Homes International Admin" },
    { name: "description", content: "Update a property listing and complete any missing translations." },
    { property: "og:title", content: "Edit Property | Future Homes International Admin" },
    { property: "og:description", content: "Manage property details and saved translations." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: PropertyEdit,
});
