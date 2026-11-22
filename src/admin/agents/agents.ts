// Client-safe agent catalogue and approval rules.
export type AgentId = "assistant" | "marketing" | "sales" | "admin" | "service" | "analytics";

export type AgentDef = {
  id: AgentId;
  name: string;
  handle: string;
  description: string;
  /** Composio toolkits this agent may use; null = every app the user has connected. */
  toolkits: string[] | null;
  focus: string;
};

export const AGENTS: AgentDef[] = [
  { id: "assistant", name: "Future Homes Assistant", handle: "assistant", description: "Can do everything and hands work to the specialists.", toolkits: null,
    focus: "You are the lead assistant. Do any admin/CRM task yourself or delegate to a specialist with delegate_to_agent when the task clearly belongs to one." },
  { id: "marketing", name: "Marketing", handle: "marketing", description: "Blogs, social posts, campaigns and ad copy.",
    toolkits: ["instagram", "facebook", "linkedin", "youtube", "mailchimp", "canva", "googleads", "metaads", "googledocs", "googledrive"],
    focus: "You are the marketing specialist: blog drafts, social media posts, campaigns, ad copy and SEO-friendly texts for Future Homes International properties." },
  { id: "sales", name: "Sales & Quotes", handle: "sales", description: "Deals, quotes, invoices and follow-ups.",
    toolkits: ["gmail", "outlook", "googledrive", "googlesheets", "googledocs", "hubspot", "zoom", "googlemeet"],
    focus: "You are the sales specialist: qualify leads, create and move deals, write quotes, schedule viewings and follow up with clients." },
  { id: "admin", name: "Admin & Properties", handle: "admin", description: "Listings, calendar, tasks and office work.",
    toolkits: ["googlecalendar", "googledrive", "googlesheets", "googledocs", "notion", "slack", "trello", "asana"],
    focus: "You are the admin specialist: properties, calendar, tasks, projects, internal documents and team coordination." },
  { id: "service", name: "Customer Service", handle: "service", description: "Replies to customers and qualifies leads.",
    toolkits: ["gmail", "outlook", "whatsapp", "slack", "intercom"],
    focus: "You are the customer service specialist: answer customer questions politely, qualify leads, log notes and create follow-up tasks." },
  { id: "analytics", name: "Analytics", handle: "analytics", description: "Reports, KPIs and forecasts.",
    toolkits: ["googlesheets", "google_analytics", "google_search_console"],
    focus: "You are the analytics specialist: sales summaries, KPIs, conversion, forecasts and website performance." },
];

export const agentById = (id: string): AgentDef => AGENTS.find((a) => a.id === id) ?? AGENTS[0]!;

/** "@marketing write a post" → { agent: "marketing", text: "write a post" } */
export function parseMention(text: string): { agent: AgentId | null; text: string } {
  const m = /^\s*@(\w+)\s*/.exec(text);
  if (!m) return { agent: null, text };
  const a = AGENTS.find((x) => x.handle === m[1]!.toLowerCase());
  return a ? { agent: a.id, text: text.slice(m[0].length) } : { agent: null, text };
}

const READ_VERB = /_(GET|LIST|FETCH|SEARCH|FIND|READ|RETRIEVE|LOOKUP|QUERY|DOWNLOAD|DESCRIBE)(_|$)/;

/** Actions that send, delete, publish or pay something must be approved by the user first. */
export function needsApproval(tool: string, args: Record<string, unknown>): boolean {
  if (tool === "send_email") return true;
  if (tool.startsWith("delete_")) return true;
  if (tool === "COMPOSIO_MULTI_EXECUTE_TOOL") {
    const list = Array.isArray(args["tools"]) ? (args["tools"] as { tool_slug?: unknown }[]) : [];
    if (list.length === 0) return true;
    return list.some((t) => !READ_VERB.test(String(t.tool_slug ?? "").toUpperCase()));
  }
  return false;
}
