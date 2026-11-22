import { createFileRoute } from "@tanstack/react-router";
import QuotesInvoices from "@/admin/pages/QuotesInvoices";

export const Route = createFileRoute("/admin/quotes")({
  component: QuotesInvoices,
});
