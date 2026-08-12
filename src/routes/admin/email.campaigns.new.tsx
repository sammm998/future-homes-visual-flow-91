import { createFileRoute } from "@tanstack/react-router";
import CampaignEdit from "@/admin/pages/CampaignEdit";

export const Route = createFileRoute("/admin/email/campaigns/new")({
  component: CampaignEdit,
});
