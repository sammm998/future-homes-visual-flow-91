import { createFileRoute } from "@tanstack/react-router";
import PropertiesList from "@/admin/pages/PropertiesList";

export const Route = createFileRoute("/admin/properties/")({
  head: () => ({ meta: [
    { title: "Property administration | Future Homes International" },
    { name: "description", content: "Manage Future Homes International listings and saved property translations." },
    { property: "og:title", content: "Property administration | Future Homes International" },
    { property: "og:description", content: "Manage listings and saved property translations." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: PropertiesList,
});
