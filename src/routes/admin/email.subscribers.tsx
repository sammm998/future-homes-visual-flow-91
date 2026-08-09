import { createFileRoute } from "@tanstack/react-router";
import SubscribersList from "@/admin/pages/SubscribersList";

export const Route = createFileRoute("/admin/email/subscribers")({
  component: SubscribersList,
});
