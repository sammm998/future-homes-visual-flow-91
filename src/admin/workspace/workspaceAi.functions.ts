import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data } = await ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "admin" });
  if (!data) throw new Error("Administrator access required");
}

async function askJson(instructions: string, input: string): Promise<any> {
  const { generateResponse } = await import("@lovable.dev/ai-gateway");
  const res: any = await generateResponse({ model: "openai/gpt-6.1-sol", instructions: `${instructions}\nReturn ONLY valid JSON, no prose, no code fences.`, input, store: false } as any);
  const text: string = res.output_text ?? (res.output ?? []).filter((o: any) => o.type === "message").flatMap((o: any) => o.content ?? []).map((c: any) => c.text ?? "").join("");
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("The AI did not return a usable answer. Please try again.");
  return JSON.parse(m[0]);
}

/** Turns a chat text / transcribed voice note into a task draft (title, description, checklist, due date, assignee). */
export const draftTaskFromText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ text: z.string().min(3).max(6000) }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: admins } = await context.supabase.rpc("list_admin_users");
    const today = new Date().toISOString().slice(0, 10);
    const out = await askJson(
      `You turn a real-estate team member's message into one CRM task. Today is ${today}. Team: ${JSON.stringify(admins ?? [])}. The author is user ${context.userId}.
JSON shape: {"title":string,"description":string,"checklist":string[],"due_date":"YYYY-MM-DD"|null,"assigned_to":user id from team|null}. Keep the message language.`,
      data.text,
    );
    return {
      title: String(out.title ?? "").slice(0, 200) || data.text.slice(0, 80),
      description: String(out.description ?? ""),
      checklist: Array.isArray(out.checklist) ? out.checklist.map(String).slice(0, 15) : [],
      due_date: typeof out.due_date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(out.due_date) ? out.due_date : null,
      assigned_to: typeof out.assigned_to === "string" && (admins ?? []).some((a: any) => a.id === out.assigned_to) ? out.assigned_to : context.userId,
    };
  });

/** Summarises meeting notes and creates follow-up tasks. */
export const summarizeMeeting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ meetingId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const db = context.supabase;
    const { data: m, error } = await db.from("meetings").select("id,title,notes,lead_id").eq("id", data.meetingId).single();
    if (error || !m) throw new Error("Meeting not found");
    if (!m.notes?.trim()) throw new Error("Write some notes first");
    const out = await askJson(`Summarise these meeting notes for a real-estate sales team. JSON: {"summary":string (max 6 bullet lines),"tasks":[{"title":string,"due_date":"YYYY-MM-DD"|null}]}. Today is ${new Date().toISOString().slice(0, 10)}. Keep the notes' language.`, `Meeting: ${m.title}\n\n${m.notes}`);
    const summary = String(out.summary ?? "");
    const tasks = (Array.isArray(out.tasks) ? out.tasks : []).slice(0, 10).map((t: any) => ({
      title: String(t.title ?? "").slice(0, 200), due_date: typeof t.due_date === "string" ? t.due_date : null,
      description: `From meeting: ${m.title}`, lead_id: m.lead_id, assigned_to: context.userId, created_by: context.userId,
    })).filter((t: any) => t.title);
    if (tasks.length) { const r = await db.from("tasks").insert(tasks); if (r.error) throw new Error(r.error.message); }
    await db.from("meetings").update({ summary }).eq("id", m.id);
    return { summary, created: tasks.length };
  });
