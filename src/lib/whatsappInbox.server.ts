import { nextMessageStatus } from "@/admin/crm/model";

type Db = any;
async function db(): Promise<Db> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}
const must = <T>(r: { data: T; error: { message: string } | null }) => {
  if (r.error) throw new Error(r.error.message);
  return r.data;
};

async function ensureConversation(d: Db, handle: string, name: string | null) {
  const existing = must(await d.from("inbox_conversations").select("id, lead_id").eq("channel", "whatsapp").eq("contact_handle", handle).maybeSingle()) as { id: string; lead_id: string | null } | null;
  if (existing) return existing;
  const lead = must(await d.from("leads").insert({ name: name || `+${handle}`, phone: `+${handle}`, source: "WhatsApp", status: "new" }).select("id").single()) as { id: string };
  const conv = must(await d.from("inbox_conversations").upsert(
    { channel: "whatsapp", contact_handle: handle, contact_name: name, lead_id: lead.id },
    { onConflict: "channel,contact_handle" },
  ).select("id, lead_id").single()) as { id: string; lead_id: string | null };
  return conv;
}

async function applyStatus(d: Db, s: any): Promise<boolean> {
  const row = must(await d.from("inbox_messages").select("id, status, status_times, error").eq("provider_message_id", s.id).maybeSingle()) as any;
  if (!row) return false; // outbound row not saved yet — keep pending
  const at = s.timestamp ? new Date(Number(s.timestamp) * 1000).toISOString() : null;
  const times = { ...(row.status_times ?? {}) };
  if (at && !times[s.status]) times[s.status] = at;
  const status = nextMessageStatus(row.status, s.status);
  must(await d.from("inbox_messages").update({
    status, status_times: times, status_at: times[status] ?? row.status_at ?? at,
    error: s.errors?.length ? s.errors : row.error,
  }).eq("id", row.id));
  return true;
}

/** Processes one stored delivery. Throws to keep it pending. */
async function processEvent(d: Db, ev: { event: string; payload: any }) {
  const value = ev.payload?.entry?.[0]?.changes?.[0]?.value ?? {};
  if (ev.event === "whatsapp.message") {
    const names: Record<string, string> = {};
    for (const c of value.contacts ?? []) if (c.wa_id) names[c.wa_id] = c.profile?.name ?? null;
    for (const m of value.messages ?? []) {
      const conv = await ensureConversation(d, String(m.from), names[m.from] ?? null);
      const media = m.image ?? m.document ?? m.audio ?? m.video ?? m.sticker ?? null;
      const body = m.text?.body ?? media?.caption ?? (media ? `[${m.type}]` : `[${m.type ?? "message"}]`);
      const ins = await d.from("inbox_messages").upsert({
        conversation_id: conv.id, direction: "in", body,
        media: media ? { type: m.type, id: media.id, mime_type: media.mime_type, filename: media.filename ?? null } : null,
        provider_message_id: m.id, status: "received",
        created_at: m.timestamp ? new Date(Number(m.timestamp) * 1000).toISOString() : new Date().toISOString(),
      }, { onConflict: "provider_message_id", ignoreDuplicates: true });
      if (ins.error) throw new Error(ins.error.message);
      const cur = must(await d.from("inbox_conversations").select("unread_count").eq("id", conv.id).single()) as { unread_count: number };
      must(await d.from("inbox_conversations").update({
        unread_count: (cur.unread_count ?? 0) + 1, last_message_at: new Date().toISOString(),
        last_inbound_at: new Date().toISOString(), status: "open",
      }).eq("id", conv.id));
    }
    return;
  }
  if (ev.event === "whatsapp.status") {
    for (const s of value.statuses ?? []) {
      const ok = await applyStatus(d, s);
      if (!ok) throw new Error(`deferred: message ${s.id} not stored yet`);
    }
  }
  // Other events (templates, account updates, errors) are stored for review and acknowledged.
}

export async function processStoredEvent(id: string) {
  const d = await db();
  const ev = must(await d.from("whatsapp_webhook_events").select("*").eq("id", id).single()) as any;
  if (ev.processed_at) return;
  try {
    await processEvent(d, ev);
    must(await d.from("whatsapp_webhook_events").update({ processed_at: new Date().toISOString(), processing_error: null }).eq("id", id));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const attempts = (ev.attempts ?? 0) + 1;
    const delayMin = Math.min(60, 2 ** attempts);
    await d.from("whatsapp_webhook_events").update({
      processing_error: msg, attempts, next_attempt_at: new Date(Date.now() + delayMin * 60_000).toISOString(),
    }).eq("id", id);
    throw e;
  }
}

/** Bounded recovery: oldest due rows first, rescheduled with backoff so blocked rows don't starve others. */
export async function recoverPending(limit = 5) {
  const d = await db();
  const rows = must(await d.from("whatsapp_webhook_events").select("id").is("processed_at", null)
    .lte("next_attempt_at", new Date().toISOString()).order("next_attempt_at").limit(limit)) as { id: string }[];
  for (const r of rows) { try { await processStoredEvent(r.id); } catch { /* rescheduled */ } }
}

/** Called after an outbound row is saved: apply any status callbacks that arrived first. */
export async function reconcileStatusesFor(messageId: string) {
  const d = await db();
  const rows = must(await d.from("whatsapp_webhook_events").select("id, payload").eq("event", "whatsapp.status").is("processed_at", null).limit(50)) as any[];
  for (const r of rows) {
    const ids = (r.payload?.entry?.[0]?.changes?.[0]?.value?.statuses ?? []).map((s: any) => s.id);
    if (ids.includes(messageId)) { try { await processStoredEvent(r.id); } catch { /* stays pending */ } }
  }
}
