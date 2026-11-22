import { createFileRoute } from "@tanstack/react-router";
import CustomerPortalAdmin from "@/admin/pages/CustomerPortalAdmin";

export const Route = createFileRoute("/admin/portal")({
  head: () => ({ meta: [
    { title: "Customer Portal | Future Homes Admin" },
    { name: "description", content: "Manage customer portal requests, messages, purchase stages and shared documents." },
    { property: "og:title", content: "Customer Portal | Future Homes Admin" },
    { property: "og:description", content: "Manage customer portal requests, messages and shared documents." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: CustomerPortalAdmin,
});
