import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const FROM = "Future Homes International <info@futurehomesturkey.com>";
const GATEWAY = "https://connector-gateway.lovable.dev/whatsapp";

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data } = await ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "admin" });
  if (!data) throw new Error("Administrator access required");
}

const emailInput = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(300),
  html: z.string().min(1).max(200_000),
  attachment: z.object({ filename: z.string().max(200), base64: z.string().max(15_000_000) }).optional(),
  conversationId: z.string().uuid().optional(),
});

export const sendCrmEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => emailInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const key = process.env["RESEND_API_KEY"];
    if (!key) throw new Error("E-mail is not configured");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM, to: [data.to], subject: data.subject, html: data.html,
        ...(data.attachment ? { attachments: [{ filename: data.attachment.filename, content: data.attachment.base64 }] } : {}),
      }),
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`E-mail failed [${res.status}]: ${text}`);
    const id = (JSON.parse(text) as { id?: string }).id ?? null;
    if (data.conversationId) {
      await context.supabase.from("inbox_messages").insert({
        conversation_id: data.conversationId, direction: "out", body: data.html.replace(/<[^>]+>/g, " ").trim(),
        provider_message_id: id ? `email:${id}` : null, status: "sent", author_id: context.userId,
      });
      await context.supabase.from("inbox_conversations").update({ last_message_at: new Date().toISOString() }).eq("id", data.conversationId);
    }
    return { id };
  });

const waInput = z.object({ conversationId: z.string().uuid(), body: z.string().min(1).max(4000) });

export const sendWhatsAppReply = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => waInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const lov = process.env["LOVABLE_API_KEY"];
    const wa = process.env["WHATSAPP_API_KEY"];
    if (!lov || !wa) throw new Error("WhatsApp is not connected yet");
    const { data: conv, error } = await context.supabase.from("inbox_conversations")
      .select("id, channel, contact_handle").eq("id", data.conversationId).single();
    if (error || !conv || conv.channel !== "whatsapp") throw new Error("Conversation not found");
    const res = await fetch(`${GATEWAY}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${lov}`, "X-Connection-Api-Key": wa, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", to: conv.contact_handle, type: "text", text: { body: data.body } }),
    });
    const text = await res.text();
    if (!res.ok) {
      await context.supabase.from("inbox_messages").insert({
        conversation_id: conv.id, direction: "out", body: data.body, status: "failed",
        error: { status: res.status, body: text.slice(0, 2000) }, author_id: context.userId,
      });
      throw new Error(`WhatsApp send failed [${res.status}]: ${text}`);
    }
    const msgId = (JSON.parse(text) as { messages?: { id: string }[] }).messages?.[0]?.id ?? null;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("inbox_messages").insert({
      conversation_id: conv.id, direction: "out", body: data.body, provider_message_id: msgId,
      status: "accepted", author_id: context.userId,
    });
    await supabaseAdmin.from("inbox_conversations").update({ last_message_at: new Date().toISOString() }).eq("id", conv.id);
    const { reconcileStatusesFor } = await import("@/lib/whatsappInbox.server");
    if (msgId) await reconcileStatusesFor(msgId);
    return { id: msgId };
  });
