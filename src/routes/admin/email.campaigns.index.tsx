import { createFileRoute } from "@tanstack/react-router";
import CampaignsList from "@/admin/pages/CampaignsList";

export const Route = createFileRoute("/admin/email/campaigns/")({
  component: CampaignsList,
});
