import { createFileRoute } from "@tanstack/react-router";
import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";
import { fillTemplate, reminderDue, ruleMatches, type RuleConditions } from "@/admin/workspace/model";

const FROM = "Future Homes International <info@futurehomesturkey.com>";
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

async function sendEmail(to: string, subject: string, text: string) {
  const key = process.env["RESEND_API_KEY"];
  if (!key) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [to], subject,
      html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;white-space:pre-wrap;color:#071827">${esc(text)}</div>` }),
  });
  if (!res.ok) console.error("[workspace-jobs] resend", res.status, await res.text());
  return res.ok;
}

export const Route = createFileRoute("/api/public/hooks/workspace-jobs")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authFailure = await authenticateCronRequest(request);
        if (authFailure) return authFailure;
        const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
        const now = new Date();
        const stats = { reminders: 0, emails: 0, stale: 0 };

        // Emails each admin by id.
        const { data: roleRows } = await db.from("user_roles").select("user_id").eq("role", "admin");
        const emailOf = new Map<string, string>();
        for (const r of roleRows ?? []) {
          const { data } = await db.auth.admin.getUserById(r.user_id);
          if (data.user?.email) emailOf.set(r.user_id, data.user.email);
        }

        // 1. Calendar reminders
        const { data: evs } = await db.from("calendar_events").select("*").is("reminder_sent_at", null)
          .gt("starts_at", now.toISOString()).lt("starts_at", new Date(now.getTime() + 2 * 864e5).toISOString());
        for (const e of evs ?? []) {
          if (!reminderDue(e.starts_at, e.remind_minutes, now, e.reminder_sent_at)) continue;
          const when = new Date(e.starts_at).toLocaleString("en-GB", { timeZone: "Europe/Istanbul", dateStyle: "medium", timeStyle: "short" });
          const lines = `Reminder: ${e.title}\n${when} (Turkey time)${e.location ? `\n${e.location}` : ""}${e.property_ref ? `\nREF ${e.property_ref}` : ""}${e.notes ? `\n\n${e.notes}` : ""}`;
          const owner = e.owner_id ? emailOf.get(e.owner_id) : undefined;
          if (owner) await sendEmail(owner, `Reminder: ${e.title}`, lines);
          if (e.notify_client && e.client_email) await sendEmail(e.client_email, `Reminder: your ${e.kind} with Future Homes International`, `Hello,\n\nThis is a reminder of your ${e.kind} on ${when} (Turkey time)${e.location ? ` at ${e.location}` : ""}.\n\nFuture Homes International`);
          await db.from("calendar_events").update({ reminder_sent_at: now.toISOString() }).eq("id", e.id);
          stats.reminders++;
        }

        // 2. Stale deal rules
        const { data: staleRules } = await db.from("automation_rules").select("*").eq("active", true).eq("trigger_event", "deal_stale");
        if (staleRules?.length) {
          const { data: open } = await db.from("deals").select("id,title,owner_id,lead_id,client_email,stage,stage_changed_at").not("stage", "in", "(won,lost)");
          for (const rule of staleRules) {
            const cond = (rule.conditions ?? {}) as RuleConditions;
            for (const d of open ?? []) {
              const idle = Math.floor((now.getTime() - new Date(d.stage_changed_at).getTime()) / 864e5);
              if (!ruleMatches("deal_stale", cond, "deal_stale", { idle_days: idle })) continue;
              const { count } = await db.from("automation_runs").select("id", { count: "exact", head: true })
                .eq("rule_id", rule.id).eq("entity_id", d.id).gte("created_at", d.stage_changed_at);
              if (count) continue;
              for (const a of (rule.actions ?? []) as Record<string, string>[]) {
                if (a["type"] === "create_task") {
                  await db.from("tasks").insert({ title: `${a["title"] || "Follow up"} – ${d.title}`, lead_id: d.lead_id, assigned_to: a["assignee"] || d.owner_id,
                    due_date: new Date(now.getTime() + (Number(a["due_minutes"]) || 60) * 60_000).toISOString().slice(0, 16) });
                } else if (a["type"] === "feed_post") {
                  await db.from("feed_posts").insert({ body: fillTemplate(a["text"] || "{name} has been idle", { name: d.title }), kind: "system", entity_type: "deal", entity_id: d.id });
                } else if (a["type"] === "assign" && a["assignee"]) {
                  await db.from("deals").update({ owner_id: a["assignee"] }).eq("id", d.id);
                } else if (a["type"] === "move_deal" && a["stage"]) {
                  await db.from("deals").update({ stage: a["stage"] }).eq("id", d.id);
                } else if (a["type"] === "send_email") {
                  const to = a["to"] === "owner" ? (d.owner_id ? emailOf.get(d.owner_id) : undefined) : d.client_email;
                  if (to) await sendEmail(to, fillTemplate(a["subject"] || "", { name: d.title }), fillTemplate(a["body"] || "", { name: d.title }));
                }
              }
              await db.from("automation_runs").insert({ rule_id: rule.id, event: "deal_stale", entity_id: d.id, status: "done", detail: { idle_days: idle } });
              stats.stale++;
            }
          }
        }

        // 3. Queued email actions from instant rules
        const { data: pending } = await db.from("automation_runs").select("*").eq("status", "pending_email").limit(100);
        for (const run of pending ?? []) {
          const detail = run.detail as { action?: Record<string, string>; ctx?: Record<string, string> };
          const a = detail.action ?? {}; const ctx = detail.ctx ?? {};
          const to = a["to"] === "owner" ? (ctx["owner_id"] ? emailOf.get(ctx["owner_id"]) : undefined) : ctx["email"];
          const ok = to ? await sendEmail(to, fillTemplate(a["subject"] || "Future Homes International", ctx), fillTemplate(a["body"] || "", ctx)) : false;
          await db.from("automation_runs").update({ status: ok ? "email_sent" : to ? "error" : "skipped" }).eq("id", run.id);
          if (ok) stats.emails++;
        }

        return Response.json({ success: true, ...stats });
      },
    },
  },
});
