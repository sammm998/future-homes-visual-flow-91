import { createFileRoute } from "@tanstack/react-router";
import ContactUs from "@/pages/ContactUs";

export const Route = createFileRoute("/$locale/contact-us")({
  component: ContactUs,
});
