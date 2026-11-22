// Server-only Composio REST helpers (v3.1 sessions). One session per admin user per agent.
import { agentById, type AgentId } from "./agents";

const BASE = "https://backend.composio.dev/api/v3.1";

function key(): string {
  const k = process.env["COMPOSIO_API_KEY"];
  if (!k) throw new Error("Composio is not configured");
  return k;
}

async function call<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: init?.method ?? "GET",
    headers: { "x-api-key": key(), "Content-Type": "application/json" },
    ...(init?.body !== undefined ? { body: JSON.stringify(init.body) } : {}),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Composio request failed [${res.status}]: ${text.slice(0, 500)}`);
  return JSON.parse(text) as T;
}

type Db = { from: (t: string) => any };

export async function getSessionId(db: Db, userId: string, agent: AgentId | "integrations"): Promise<string> {
  const { data } = await db.from("composio_sessions").select("session_id").eq("user_id", userId).eq("agent", agent).maybeSingle();
  if (data?.session_id) return data.session_id as string;
  const toolkits = agent === "integrations" ? null : agentById(agent).toolkits;
  const body: Record<string, unknown> = {
    user_id: userId,
    manage_connections: { enable: false },
    workbench: { enable: false },
    ...(toolkits ? { toolkits: { enable: toolkits } } : {}),
  };
  const s = await call<{ session_id: string }>("/tool_router/session", { method: "POST", body });
  const { error } = await db.from("composio_sessions").upsert({ user_id: userId, agent, session_id: s.session_id });
  if (error) throw new Error(error.message);
  return s.session_id;
}

export type ComposioTool = { slug: string; description: string; input_parameters: Record<string, unknown> };

export async function listSessionTools(sessionId: string): Promise<ComposioTool[]> {
  const r = await call<{ items: ComposioTool[] }>(`/tool_router/session/${sessionId}/tools`);
  return r.items ?? [];
}

export async function executeTool(sessionId: string, slug: string, args: Record<string, unknown>): Promise<unknown> {
  return call(`/tool_router/session/${sessionId}/execute`, { method: "POST", body: { tool_slug: slug, arguments: args } });
}

export type ToolkitRow = { slug: string; name: string; logo: string | null; description: string; connected: boolean; status: string | null };

export async function listToolkits(sessionId: string, search: string, cursor: string | null): Promise<{ items: ToolkitRow[]; next: string | null; total: number }> {
  const q = new URLSearchParams({ limit: "48" });
  if (search) q.set("search", search);
  if (cursor) q.set("cursor", cursor);
  const r = await call<{ items: any[]; next_cursor: string | null; total_items: number }>(`/tool_router/session/${sessionId}/toolkits?${q}`);
  return {
    items: (r.items ?? []).map((t) => ({
      slug: t.slug, name: t.name, logo: t.meta?.logo ?? null, description: String(t.meta?.description ?? "").slice(0, 160),
      connected: t.connected_account?.status === "ACTIVE", status: t.connected_account?.status ?? null,
    })),
    next: r.next_cursor ?? null,
    total: r.total_items ?? 0,
  };
}

export async function createLink(sessionId: string, toolkit: string, callbackUrl?: string): Promise<string> {
  const r = await call<{ redirect_url: string }>(`/tool_router/session/${sessionId}/link`, {
    method: "POST", body: { toolkit, ...(callbackUrl ? { callback_url: callbackUrl } : {}) },
  });
  return r.redirect_url;
}
