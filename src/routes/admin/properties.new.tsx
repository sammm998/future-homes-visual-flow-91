import { createFileRoute } from "@tanstack/react-router";
import PropertyEdit from "@/admin/pages/PropertyEdit";

export const Route = createFileRoute("/admin/properties/new")({
  head: () => ({ meta: [
    { title: "New Property | Future Homes International Admin" },
    { name: "description", content: "Create a property listing and translate it into the supported site languages." },
    { property: "og:title", content: "New Property | Future Homes International Admin" },
    { property: "og:description", content: "Create and manage a multilingual property listing." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: PropertyEdit,
});
