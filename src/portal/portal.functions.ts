import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { investmentNumbers, marketFor, parsePrice } from "./investment";

const MODEL = "anthropic/claude-sonnet-5" as const;
const LANG_NAMES: Record<string, string> = { en: "English", sv: "Swedish", tr: "Turkish", ar: "Arabic", ru: "Russian", no: "Norwegian", da: "Danish", fa: "Persian", ur: "Urdu", es: "Spanish", de: "German", fr: "French", id: "Indonesian" };

function textOf(res: any): string {
  return (res?.content ?? []).filter((b: any) => b.type === "text").map((b: any) => b.text).join("").trim();
}

/** AI investment analysis for one listing; numbers come from the calculator, AI writes the assessment. */
export const analyzeInvestment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { ref: string; lang?: string; nightly?: number }) => ({ ref: String(d.ref).slice(0, 20), lang: String(d.lang ?? "en").slice(0, 5), nightly: Number(d.nightly) || undefined }))
  .handler(async ({ data, context }) => {
    const { data: p } = await context.supabase.from("properties")
      .select("ref_no, title, location, country, price, starting_price_eur, bedrooms, sizes_m2, property_type, building_complete_date, distance_to_beach_km")
      .eq("ref_no", data.ref).maybeSingle();
    if (!p) throw new Error("Property not found");
    const price = parsePrice((p as any).starting_price_eur || (p as any).price);
    if (!price) throw new Error("This property has no price to analyse");
    const nums = investmentNumbers(price, marketFor((p as any).location, (p as any).country), data.nightly);
    const { generateMessage } = await import("@lovable.dev/ai-gateway");
    const res: any = await generateMessage({
      model: MODEL,
      max_tokens: 1500,
      system: `You are a cautious real-estate investment analyst for Future Homes International. Write in ${LANG_NAMES[data.lang] ?? "English"}. Use ONLY the numbers provided; do not invent prices. Return ONLY JSON: {"summary":string,"strengths":string[3-5],"risks":string[3-5],"areaComparison":string,"recommendation":string}. Mention that figures are indicative and not financial advice.`,
      messages: [{ role: "user", content: JSON.stringify({ property: p, analysis: nums }) }],
    } as any);
    const t = textOf(res);
    const ai = JSON.parse(t.slice(t.indexOf("{"), t.lastIndexOf("}") + 1));
    const result = { ...nums, price, ai };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin.from("investment_analyses")
      .insert({ user_id: context.userId, property_ref: data.ref, title: (p as any).title, result: result as any }).select("id").single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

type ChatMsg = { role: "user" | "assistant"; content: string };

/** Customer AI assistant: sees only the caller's own portal data; may open tickets for them. */
export const portalAssistant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { messages: ChatMsg[]; lang?: string }) => ({
    lang: String(d.lang ?? "en").slice(0, 5),
    messages: (Array.isArray(d.messages) ? d.messages : []).slice(-16).map((m) => ({ role: m.role === "assistant" ? "assistant" as const : "user" as const, content: String(m.content).slice(0, 4000) })),
  }))
  .handler(async ({ data, context }) => {
    const sb = context.supabase;
    const [acc, favs, tickets, shared, analyses] = await Promise.all([
      sb.from("customer_accounts").select("full_name, stage, budget, wishes").eq("user_id", context.userId).maybeSingle(),
      sb.from("favorites").select("ref_no, title, price_at_save").eq("user_id", context.userId).limit(30),
      sb.from("support_tickets").select("subject, category, status, created_at").eq("user_id", context.userId).order("created_at", { ascending: false }).limit(10),
      sb.from("shared_items").select("kind, title").eq("user_id", context.userId).limit(30),
      sb.from("investment_analyses").select("property_ref, title, created_at").eq("user_id", context.userId).limit(10),
    ]);
    const ctx = { account: acc.data, savedHomes: favs.data, tickets: tickets.data, sharedDocuments: shared.data, analyses: analyses.data };
    const system = `You are the personal assistant in the Future Homes International customer portal. Answer in ${LANG_NAMES[data.lang] ?? "the customer's language"}.
Help with the customer's own homes, documents, the buying process in Turkey, Dubai, Northern Cyprus and Bali, fees, title deeds, residence permits and Turkish citizenship by investment. Be concise and practical, plain text without markdown; say when something needs a lawyer or the sales team. Never invent contract terms, prices or deadlines that are not in the context.
If the customer wants a viewing, a call, documents or help from staff, use the create_ticket tool.
Customer context (only this customer's data): ${JSON.stringify(ctx)}`;
    const tools = [{
      name: "create_ticket",
      description: "Open a support ticket for this customer so the sales team follows up.",
      input_schema: { type: "object", properties: {
        category: { type: "string", enum: ["question", "viewing", "documents", "payment", "after_sales", "other"] },
        subject: { type: "string" }, details: { type: "string" }, property_ref: { type: "string" },
      }, required: ["category", "subject", "details"] },
    }];
    const { generateMessage } = await import("@lovable.dev/ai-gateway");
    const first: any = await generateMessage({ model: MODEL, max_tokens: 1200, system, tools, messages: data.messages } as any);
    const use = (first?.content ?? []).find((b: any) => b.type === "tool_use" && b.name === "create_ticket");
    if (!use) return { reply: textOf(first), ticketId: null as string | null };
    const inp = use.input ?? {};
    const { data: t, error } = await sb.from("support_tickets").insert({
      user_id: context.userId, category: String(inp.category ?? "question").slice(0, 30), subject: String(inp.subject ?? "Request").slice(0, 200), property_ref: inp.property_ref ? String(inp.property_ref).slice(0, 20) : null,
    }).select("id").single();
    if (!error && t) await sb.from("ticket_messages").insert({ ticket_id: t.id, author_id: context.userId, body: String(inp.details ?? "").slice(0, 4000) });
    const second: any = await generateMessage({
      model: MODEL, max_tokens: 800, system, tools,
      messages: [...data.messages, { role: "assistant", content: first.content }, { role: "user", content: [{ type: "tool_result", tool_use_id: use.id, content: error ? `Failed: ${error.message}` : `Ticket created (id ${t!.id}).` }] }],
    } as any);
    return { reply: textOf(second), ticketId: error ? null : t!.id };
  });

/** Short-lived download link for a document the team shared with the caller. */
export const sharedDocumentUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { documentId: string }) => ({ documentId: String(d.documentId) }))
  .handler(async ({ data, context }) => {
    // RLS only returns the row when it is shared with the caller (or the caller is admin)
    const { data: doc } = await context.supabase.from("documents").select("path, filename").eq("id", data.documentId).maybeSingle();
    if (!doc) throw new Error("Document not available");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: s, error } = await supabaseAdmin.storage.from("crm-documents").createSignedUrl(doc.path, 300, { download: doc.filename });
    if (error || !s) throw new Error("Could not create download link");
    return { url: s.signedUrl };
  });
