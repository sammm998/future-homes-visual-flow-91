import { createFileRoute } from "@tanstack/react-router";
import TestimonialsManager from "@/admin/pages/TestimonialsManager";

export const Route = createFileRoute("/admin/testimonials")({
  head: () => ({ meta: [
    { title: "Testimonials CMS | Future Homes International" },
    { name: "description", content: "Manage Future Homes International customer reviews, photos and translations." },
    { property: "og:title", content: "Testimonials CMS | Future Homes International" },
    { property: "og:description", content: "Manage customer reviews, photos and translations in the Future Homes International CMS." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: TestimonialsManager,
});