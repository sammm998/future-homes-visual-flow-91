// Server-only agent loop: Lovable AI Gateway (Responses) + CRM tools + Composio app tools.
import { generateResponse } from "@lovable.dev/ai-gateway";
import { AGENTS, agentById, needsApproval, type AgentId } from "./agents";
import { executeTool, getSessionId, listSessionTools } from "./composio.server";

const MODEL = "openai/gpt-6.1-sol" as const;
const FROM = "Future Homes International <info@futurehomesturkey.com>";

type Db = any;
export type Ctx = { supabase: Db; userId: string };
type FnTool = { type: "function"; name: string; description: string; parameters: Record<string, unknown> };
export type PendingAction = { tool: string; args: Record<string, unknown>; agent: AgentId; summary: string };
export type ActionLog = { tool: string; agent: AgentId; ok: boolean; summary: string };

const obj = (properties: Record<string, unknown>, required: string[] = []) => ({ type: "object", properties, required, additionalProperties: false });
const s = (description?: string) => ({ type: "string", ...(description ? { description } : {}) });
const n = (description?: string) => ({ type: "number", ...(description ? { description } : {}) });
const opt = (schema: Record<string, unknown>) => ({ ...schema, type: [schema["type"] as string, "null"] });

const CRM_TOOLS: FnTool[] = [
  { type: "function", name: "search_leads", description: "Search CRM leads by name/e-mail/phone and/or status.", parameters: obj({ query: opt(s()), status: opt(s()), limit: opt(n()) }, ["query", "status", "limit"]) },
  { type: "function", name: "create_lead", description: "Create a CRM lead.", parameters: obj({ name: s(), email: opt(s()), phone: opt(s()), message: opt(s()), source: opt(s()) }, ["name", "email", "phone", "message", "source"]) },
  { type: "function", name: "update_lead", description: "Update a lead's status, assigned salesperson (user id) or tags.", parameters: obj({ id: s(), status: opt(s()), assigned_to: opt(s()), tags: opt({ type: "array", items: { type: "string" } }) }, ["id", "status", "assigned_to", "tags"]) },
  { type: "function", name: "list_deals", description: "List pipeline deals, optionally by stage (new, contacted, viewing, negotiation, reservation, won, lost).", parameters: obj({ stage: opt(s()) }, ["stage"]) },
  { type: "function", name: "create_deal", description: "Create a deal in the sales pipeline.", parameters: obj({ title: s(), client_name: opt(s()), client_email: opt(s()), property_ref: opt(s()), value_eur: opt(n()), lead_id: opt(s()) }, ["title", "client_name", "client_email", "property_ref", "value_eur", "lead_id"]) },
  { type: "function", name: "move_deal", description: "Move a deal to another stage.", parameters: obj({ id: s(), stage: s() }, ["id", "stage"]) },
  { type: "function", name: "create_task", description: "Create a task (due_date ISO).", parameters: obj({ title: s(), description: opt(s()), due_date: opt(s()), lead_id: opt(s()), assigned_to: opt(s()) }, ["title", "description", "due_date", "lead_id", "assigned_to"]) },
  { type: "function", name: "create_calendar_event", description: "Book a viewing, meeting or call (kind: viewing|meeting|call). ISO datetimes.", parameters: obj({ title: s(), kind: s(), starts_at: s(), ends_at: opt(s()), lead_id: opt(s()), property_ref: opt(s()), location: opt(s()) }, ["title", "kind", "starts_at", "ends_at", "lead_id", "property_ref", "location"]) },
  { type: "function", name: "search_properties", description: "Search active property listings.", parameters: obj({ query: opt(s("text in title/location")), ref: opt(s()), max_price: opt(n()), bedrooms: opt(s()) }, ["query", "ref", "max_price", "bedrooms"]) },
  { type: "function", name: "create_quote", description: "Create a quotation with line items.", parameters: obj({ client_name: s(), client_email: opt(s()), property_ref: opt(s()), deal_id: opt(s()), items: { type: "array", items: obj({ description: s(), qty: n(), unit_price: n() }, ["description", "qty", "unit_price"]) } }, ["client_name", "client_email", "property_ref", "deal_id", "items"]) },
  { type: "function", name: "sales_summary", description: "Pipeline value per stage and leads in the last 30 days.", parameters: obj({}) },
  { type: "function", name: "create_blog_draft", description: "Save an unpublished English blog draft.", parameters: obj({ title: s(), content: s("HTML or markdown"), excerpt: opt(s()), category: opt(s()) }, ["title", "content", "excerpt", "category"]) },
  { type: "function", name: "post_to_feed", description: "Post a message to the internal team feed.", parameters: obj({ body: s() }, ["body"]) },
  { type: "function", name: "search_wiki", description: "Search the internal knowledge base.", parameters: obj({ query: s() }, ["query"]) },
  { type: "function", name: "create_project", description: "Create a project with optional tasks.", parameters: obj({ name: s(), description: opt(s()), tasks: opt({ type: "array", items: { type: "string" } }) }, ["name", "description", "tasks"]) },
  { type: "function", name: "list_team", description: "List admin team members (id + e-mail).", parameters: obj({}) },
  { type: "function", name: "send_email", description: "Send an e-mail from info@futurehomesturkey.com. Needs user approval.", parameters: obj({ to: s(), subject: s(), html: s() }, ["to", "subject", "html"]) },
  { type: "function", name: "delete_task", description: "Delete a task. Needs user approval.", parameters: obj({ id: s() }, ["id"]) },
];

const DELEGATE: FnTool = { type: "function", name: "delegate_to_agent", description: `Hand a task to a specialist: ${AGENTS.filter((a) => a.id !== "assistant").map((a) => `${a.id} (${a.description})`).join("; ")}.`, parameters: obj({ agent: s(), task: s() }, ["agent", "task"]) };

const clean = (a: Record<string, unknown>) => Object.fromEntries(Object.entries(a).filter(([, v]) => v !== null && v !== undefined && v !== ""));

async function runCrm(ctx: Ctx, tool: string, raw: Record<string, unknown>): Promise<unknown> {
  const db = ctx.supabase; const a = clean(raw) as Record<string, any>;
  const must = <T>(r: { data: T; error: { message: string } | null }) => { if (r.error) throw new Error(r.error.message); return r.data; };
  switch (tool) {
    case "search_leads": {
      let q = db.from("leads").select("id,name,email,phone,status,source,assigned_to,created_at").order("created_at", { ascending: false }).limit(Math.min(a.limit ?? 20, 50));
      if (a.query) q = q.or(`name.ilike.%${String(a.query).replace(/[%,()]/g, "")}%,email.ilike.%${String(a.query).replace(/[%,()]/g, "")}%,phone.ilike.%${String(a.query).replace(/[%,()]/g, "")}%`);
      if (a.status) q = q.eq("status", a.status);
      return must(await q);
    }
    case "create_lead": return must(await db.from("leads").insert({ ...a, source: a.source ?? "agent" }).select("id,name").single());
    case "update_lead": { const { id, ...rest } = a; return must(await db.from("leads").update(rest).eq("id", id).select("id,status,assigned_to").single()); }
    case "list_deals": { let q = db.from("deals").select("id,title,stage,value_eur,client_name,property_ref,owner_id").order("updated_at", { ascending: false }).limit(50); if (a.stage) q = q.eq("stage", a.stage); return must(await q); }
    case "create_deal": return must(await db.from("deals").insert({ ...a, stage: "new", owner_id: ctx.userId, created_by: ctx.userId }).select("id,title,stage").single());
    case "move_deal": return must(await db.from("deals").update({ stage: a.stage }).eq("id", a.id).select("id,stage").single());
    case "create_task": return must(await db.from("tasks").insert({ ...a, assigned_to: a.assigned_to ?? ctx.userId, created_by: ctx.userId }).select("id,title").single());
    case "create_calendar_event": return must(await db.from("calendar_events").insert({ ...a, owner_id: ctx.userId, created_by: ctx.userId }).select("id,title,starts_at").single());
    case "search_properties": {
      let q = db.from("properties").select("id,ref_no,title,location,property_district,price,bedrooms,status").eq("is_active", true).eq("language_code", "en").limit(15);
      if (a.ref) q = q.eq("ref_no", a.ref);
      if (a.query) q = q.or(`title.ilike.%${String(a.query).replace(/[%,()]/g, "")}%,location.ilike.%${String(a.query).replace(/[%,()]/g, "")}%`);
      if (a.bedrooms) q = q.ilike("bedrooms", `%${a.bedrooms}%`);
      return must(await q);
    }
    case "create_quote": {
      const { items = [], ...q } = a;
      const quote = must(await db.from("quotes").insert({ ...q, created_by: ctx.userId }).select("id,quote_no").single()) as { id: string; quote_no: string };
      if (items.length) must(await db.from("quote_items").insert(items.map((it: any, i: number) => ({ ...it, quote_id: quote.id, position: i }))));
      return quote;
    }
    case "sales_summary": {
      const deals = must(await db.from("deals").select("stage,value_eur")) as { stage: string; value_eur: number }[];
      const since = new Date(Date.now() - 30 * 864e5).toISOString();
      const { count } = await db.from("leads").select("id", { count: "exact", head: true }).gte("created_at", since);
      const byStage: Record<string, { count: number; value_eur: number }> = {};
      for (const d of deals) { const r = (byStage[d.stage] ??= { count: 0, value_eur: 0 }); r.count++; r.value_eur += Number(d.value_eur) || 0; }
      return { byStage, leadsLast30Days: count ?? 0 };
    }
    case "create_blog_draft": {
      const slug = `${String(a.title).toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70)}-${Date.now().toString(36)}`;
      return must(await db.from("blog_posts").insert({ ...a, slug, published: false, language_code: "en", author_id: ctx.userId }).select("id,title,slug").single());
    }
    case "post_to_feed": return must(await db.from("feed_posts").insert({ body: a.body, author_id: ctx.userId, kind: "post" }).select("id").single());
    case "search_wiki": { const t = String(a.query).replace(/[%,()]/g, ""); return must(await db.from("wiki_pages").select("id,title,category,body").or(`title.ilike.%${t}%,body.ilike.%${t}%`).limit(5)); }
    case "create_project": {
      const p = must(await db.from("projects").insert({ name: a.name, description: a.description ?? null, owner_id: ctx.userId }).select("id,name").single()) as { id: string };
      if (a.tasks?.length) must(await db.from("project_tasks").insert(a.tasks.map((t: string, i: number) => ({ project_id: p.id, title: t, position: i }))));
      return p;
    }
    case "list_team": return must(await db.rpc("list_admin_users"));
    case "send_email": {
      const k = process.env["RESEND_API_KEY"]; if (!k) throw new Error("E-mail is not configured");
      const res = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${k}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: FROM, to: [a.to], subject: a.subject, html: a.html }) });
      const text = await res.text(); if (!res.ok) throw new Error(`E-mail failed [${res.status}]: ${text}`);
      return JSON.parse(text);
    }
    case "delete_task": must(await db.from("tasks").delete().eq("id", a.id)); return { deleted: a.id };
  }
  throw new Error(`Unknown tool ${tool}`);
}

const COMPOSIO_META = new Set(["COMPOSIO_SEARCH_TOOLS", "COMPOSIO_GET_TOOL_SCHEMAS", "COMPOSIO_MULTI_EXECUTE_TOOL"]);

async function composioTools(ctx: Ctx, agent: AgentId): Promise<{ sessionId: string | null; tools: FnTool[] }> {
  if (!process.env["COMPOSIO_API_KEY"]) return { sessionId: null, tools: [] };
  try {
    const sessionId = await getSessionId(ctx.supabase, ctx.userId, agent);
    const items = await listSessionTools(sessionId);
    return { sessionId, tools: items.filter((t) => COMPOSIO_META.has(t.slug)).map((t) => ({ type: "function", name: t.slug, description: String(t.description).slice(0, 3000), parameters: t.input_parameters })) };
  } catch (e) {
    console.error("Composio tools unavailable", e);
    return { sessionId: null, tools: [] };
  }
}

/** Executes one tool call. Pending actions are returned instead of executed. */
export async function executeAction(ctx: Ctx, agent: AgentId, tool: string, args: Record<string, unknown>): Promise<unknown> {
  if (COMPOSIO_META.has(tool)) {
    const sessionId = await getSessionId(ctx.supabase, ctx.userId, agent);
    return executeTool(sessionId, tool, args);
  }
  return runCrm(ctx, tool, args);
}

const truncate = (v: unknown) => { const t = typeof v === "string" ? v : JSON.stringify(v); return t.length > 12000 ? `${t.slice(0, 12000)}…[truncated]` : t; };

export function summarizeAction(tool: string, args: Record<string, unknown>): string {
  if (tool === "send_email") return `Send e-mail to ${args["to"]}: "${args["subject"]}"`;
  if (tool === "COMPOSIO_MULTI_EXECUTE_TOOL") return `Run in connected apps: ${((args["tools"] as { tool_slug: string }[]) ?? []).map((t) => t.tool_slug).join(", ")}`;
  return `${tool} ${JSON.stringify(args).slice(0, 200)}`;
}

export type RunResult = { text: string; actions: ActionLog[]; pending: PendingAction | null; agent: AgentId };

export async function runAgent(ctx: Ctx, agentId: AgentId, history: { role: "user" | "assistant"; content: string }[], depth = 0): Promise<RunResult> {
  const agent = agentById(agentId);
  const { tools: appTools } = await composioTools(ctx, agent.id);
  const tools: FnTool[] = [...CRM_TOOLS, ...appTools, ...(agent.id === "assistant" && depth === 0 ? [DELEGATE] : [])];
  const { data: me } = await ctx.supabase.auth.getUser();
  const instructions = [
    `${agent.focus}`,
    `The current user is ${me?.user?.email ?? "an admin"} (user id ${ctx.userId}). "me" means this user; assign to this id unless told otherwise.`,
    "To e-mail anyone, call send_email (company address) unless the user explicitly asks to use their own Gmail/Outlook. Never just describe an e-mail — call the tool so the user gets an Approve button.",
    "You work inside the Future Homes International CRM (real estate in Turkey, Dubai, Northern Cyprus, Bali, France). Today is " + new Date().toISOString().slice(0, 10) + ".",
    "Use tools to act — never claim something was done unless a tool result confirms it. Ask briefly when required details are missing.",
    appTools.length ? "For external apps (Gmail, Instagram, Google Calendar, ...) first COMPOSIO_SEARCH_TOOLS, then COMPOSIO_MULTI_EXECUTE_TOOL with exact slugs. If an app is not connected, tell the user to connect it on the Integrations page." : "External apps are not available right now.",
    "Sending e-mails, deleting and writing to external apps wait for the user's approval; say so when that happens.",
    "Reply in the user's language, concise, with short bullet points.",
  ].join("\n");
  const input: any[] = history.map((m) => ({ role: m.role, content: m.content }));
  const actions: ActionLog[] = [];
  for (let step = 0; step < 10; step++) {
    const res: any = await generateResponse({ model: MODEL, instructions, input, tools: tools as any, store: false, include: ["reasoning.encrypted_content"], reasoning: { effort: "low" } } as any);
    const output: any[] = res.output ?? [];
    const calls = output.filter((o) => o.type === "function_call");
    if (!calls.length) {
      const text = output.filter((o) => o.type === "message").flatMap((o) => o.content ?? []).filter((c: any) => c.type === "output_text").map((c: any) => c.text).join("\n").trim();
      return { text: text || res.output_text || "", actions, pending: null, agent: agent.id };
    }
    input.push(...output);
    for (const c of calls) {
      let args: Record<string, unknown> = {};
      try { args = JSON.parse(c.arguments || "{}"); } catch { /* keep empty */ }
      if (c.name === "delegate_to_agent") {
        const target = agentById(String(args["agent"]));
        const sub = await runAgent(ctx, target.id, [{ role: "user", content: String(args["task"]) }], depth + 1);
        actions.push(...sub.actions, { tool: `delegated to ${target.name}`, agent: target.id, ok: true, summary: sub.text.slice(0, 200) });
        if (sub.pending) return { text: sub.text, actions, pending: sub.pending, agent: target.id };
        input.push({ type: "function_call_output", call_id: c.call_id, output: sub.text });
        continue;
      }
      if (needsApproval(c.name, args)) {
        const pending = { tool: c.name, args, agent: agent.id, summary: summarizeAction(c.name, args) };
        input.push({ type: "function_call_output", call_id: c.call_id, output: "Queued: waiting for the user to press Approve." });
        const fin: any = await generateResponse({ model: MODEL, instructions, input, store: false, include: ["reasoning.encrypted_content"], reasoning: { effort: "low" } } as any);
        const text = (fin.output ?? []).filter((o: any) => o.type === "message").flatMap((o: any) => o.content ?? []).filter((x: any) => x.type === "output_text").map((x: any) => x.text).join("\n").trim();
        return { text: text || `Waiting for your approval: ${pending.summary}`, actions, pending, agent: agent.id };
      }
      try {
        const out = await executeAction(ctx, agent.id, c.name, args);
        if (!c.name.startsWith("COMPOSIO_SEARCH") && !c.name.startsWith("COMPOSIO_GET") && !c.name.startsWith("search_") && !c.name.startsWith("list_") && c.name !== "sales_summary") actions.push({ tool: c.name, agent: agent.id, ok: true, summary: summarizeAction(c.name, args) });
        input.push({ type: "function_call_output", call_id: c.call_id, output: truncate(out) });
      } catch (e) {
        actions.push({ tool: c.name, agent: agent.id, ok: false, summary: (e as Error).message.slice(0, 200) });
        input.push({ type: "function_call_output", call_id: c.call_id, output: `Error: ${(e as Error).message}` });
      }
    }
  }
  return { text: "I stopped after many steps; please narrow the request.", actions, pending: null, agent: agent.id };
}
