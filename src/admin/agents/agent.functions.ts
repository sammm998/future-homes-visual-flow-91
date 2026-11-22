import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { agentById, parseMention, type AgentId } from "./agents";

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data } = await ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "admin" });
  if (!data) throw new Error("Administrator access required");
}

const sendInput = z.object({ conversationId: z.string().uuid().nullable(), text: z.string().min(1).max(8000), agent: z.string().nullable() });

export const sendAgentMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => sendInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const db = context.supabase;
    const mention = parseMention(data.text);
    const agent: AgentId = mention.agent ?? (data.agent ? agentById(data.agent).id : "assistant");
    let conversationId = data.conversationId;
    if (!conversationId) {
      const { data: c, error } = await db.from("agent_conversations").insert({ user_id: context.userId, title: data.text.slice(0, 60) }).select("id").single();
      if (error) throw new Error(error.message);
      conversationId = c.id as string;
    }
    const { error: insErr } = await db.from("agent_messages").insert({ conversation_id: conversationId, user_id: context.userId, role: "user", agent, content: data.text });
    if (insErr) throw new Error(insErr.message);
    const { data: hist } = await db.from("agent_messages").select("role,content").eq("conversation_id", conversationId).order("created_at", { ascending: false }).limit(20);
    const history = ((hist ?? []) as { role: string; content: string }[]).reverse().filter((m) => m.content).map((m) => ({ role: m.role === "user" ? "user" as const : "assistant" as const, content: m.content }));
    const { runAgent } = await import("./agentRunner.server");
    let result;
    try {
      result = await runAgent({ supabase: db, userId: context.userId }, agent, history);
    } catch (e) {
      console.error("Agent run failed", e);
      result = { text: `Sorry — the agent could not finish: ${(e as Error).message.slice(0, 300)}`, actions: [], pending: null, agent };
    }
    const { error } = await db.from("agent_messages").insert({
      conversation_id: conversationId, user_id: context.userId, role: "assistant", agent: result.agent, content: result.text,
      actions: result.actions as never, pending_action: result.pending as never, action_status: result.pending ? "pending" : null,
    });
    if (error) throw new Error(error.message);
    await db.from("agent_conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId);
    return { conversationId };
  });

export const decideAgentAction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ messageId: z.string().uuid(), approve: z.boolean() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const db = context.supabase;
    const { data: msg, error } = await db.from("agent_messages").select("id,conversation_id,pending_action,action_status,agent").eq("id", data.messageId).single();
    if (error || !msg) throw new Error("Message not found");
    if (msg.action_status !== "pending" || !msg.pending_action) throw new Error("This action was already handled");
    // Claim first so a double click cannot run it twice.
    const { data: claimed } = await db.from("agent_messages").update({ action_status: data.approve ? "running" : "rejected" }).eq("id", msg.id).eq("action_status", "pending").select("id");
    if (!claimed?.length) throw new Error("This action was already handled");
    if (!data.approve) return { status: "rejected" };
    const p = msg.pending_action as { tool: string; args: Record<string, unknown>; agent: AgentId; summary: string };
    const { executeAction } = await import("./agentRunner.server");
    let content: string; let status: string;
    try {
      const out = await executeAction({ supabase: db, userId: context.userId }, p.agent, p.tool, p.args);
      const failed = typeof out === "object" && out !== null && ("error" in out && (out as any).error);
      status = failed ? "failed" : "done";
      content = failed ? `Could not complete: ${p.summary}\n${JSON.stringify((out as any).error).slice(0, 400)}` : `Done: ${p.summary}`;
    } catch (e) {
      status = "failed"; content = `Could not complete: ${p.summary}\n${(e as Error).message.slice(0, 400)}`;
    }
    await db.from("agent_messages").update({ action_status: status }).eq("id", msg.id);
    await db.from("agent_messages").insert({ conversation_id: msg.conversation_id, user_id: context.userId, role: "assistant", agent: p.agent, content });
    return { status };
  });

export const listIntegrations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ search: z.string().max(80), cursor: z.string().max(200).nullable() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { getSessionId, listToolkits } = await import("./composio.server");
    const sid = await getSessionId(context.supabase, context.userId, "integrations");
    return listToolkits(sid, data.search, data.cursor);
  });

export const connectIntegration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ toolkit: z.string().regex(/^[a-z0-9_]+$/).max(80), callbackUrl: z.string().url().max(300) }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { getSessionId, createLink } = await import("./composio.server");
    const sid = await getSessionId(context.supabase, context.userId, "integrations");
    return { url: await createLink(sid, data.toolkit, data.callbackUrl) };
  });
