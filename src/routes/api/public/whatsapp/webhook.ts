import { createFileRoute } from "@tanstack/react-router";
import { verifyWebhookRequest } from "@lovable.dev/webhooks-js";

export const Route = createFileRoute("/api/public/whatsapp/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["WHATSAPP_API_KEY"];
        if (!secret) return new Response("Not configured", { status: 503 });
        let payload: unknown;
        try {
          const verified = await verifyWebhookRequest({ req: request, secret, maxBodyBytes: 4 * 1024 * 1024 });
          payload = verified.payload;
        } catch {
          return new Response("Invalid signature", { status: 401 });
        }
        const deliveryId = request.headers.get("X-Lovable-Delivery")?.trim();
        const event = request.headers.get("X-Lovable-Event")?.trim();
        if (!deliveryId || !event) return new Response("Missing headers", { status: 400 });

        const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
        const ins = await db.from("whatsapp_webhook_events")
          .upsert({ delivery_id: deliveryId, event, payload: payload as any }, { onConflict: "delivery_id", ignoreDuplicates: true });
        if (ins.error) return new Response("Storage failed", { status: 500 });
        const { data: row, error } = await db.from("whatsapp_webhook_events").select("id, processed_at, event, processing_error").eq("delivery_id", deliveryId).single();
        if (error || !row) return new Response("Storage failed", { status: 500 });

        const { processStoredEvent, recoverPending } = await import("@/lib/whatsappInbox.server");
        if (!row.processed_at) {
          try { await processStoredEvent(row.id); }
          catch (e) {
            const msg = e instanceof Error ? e.message : "";
            // A status that arrived before its outbound row is durably scheduled; acknowledge it.
            if (!msg.startsWith("deferred:")) return new Response("Processing failed", { status: 500 });
          }
        }
        try { await recoverPending(3); } catch { /* best effort */ }
        return new Response("ok");
      },
    },
  },
});
