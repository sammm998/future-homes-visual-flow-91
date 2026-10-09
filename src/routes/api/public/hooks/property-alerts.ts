import { createFileRoute } from "@tanstack/react-router";
import { LEGACY_SUPABASE_URL, LEGACY_SUPABASE_KEY } from "@/integrations/legacy/client";
import { parsePrice } from "@/utils/priceFormatting";

type Prop = { id: string; ref_no: string | null; title: string; location: string; price: string; property_type: string | null; bedrooms: string | null; property_image: string | null; created_at: string; status: string | null; description?: string | null };
type Hit = { kind: "match" | "price_drop"; prop: Prop; searchId?: string; oldPrice?: string };

const SITE = "https://futurehomesinternational.com";
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { "Content-Type": "application/json" } });
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

function matches(s: any, p: Prop) {
  if (/sold/i.test(p.status ?? "")) return false;
  if (s.city && !p.location?.toLowerCase().includes(String(s.city).toLowerCase())) return false;
  if (s.property_type && !(p.property_type ?? "").toLowerCase().includes(String(s.property_type).toLowerCase())) return false;
  const price = parsePrice(p.price);
  if (s.max_price && (!price || price > Number(s.max_price))) return false;
  if (s.min_bedrooms && !(p.bedrooms ?? "").split(/[^0-9]+/).some((n) => Number(n) >= Number(s.min_bedrooms))) return false;
  if (s.keywords) {
    const hay = `${p.title} ${p.description ?? ""}`.toLowerCase();
    const words = String(s.keywords).toLowerCase().split(/[,\s]+/).filter((w) => w.length > 2);
    if (words.length && !words.some((w) => hay.includes(w))) return false;
  }
  return true;
}

async function sendEmail(to: string, hits: Hit[]) {
  const key = process.env["RESEND_API_KEY"];
  if (!key) return false;
  const items = hits.map((h) => `
    <tr><td style="padding:12px 0;border-bottom:1px solid #e5e0d4">
      ${h.prop.property_image ? `<img src="${esc(h.prop.property_image)}" width="260" style="border-radius:6px;display:block;margin-bottom:8px" alt="">` : ""}
      <div style="font-size:12px;color:#8a7a55">${h.kind === "price_drop" ? `PRICE DROP · was ${esc(h.oldPrice ?? "")}` : "NEW MATCH"} · REF ${esc(h.prop.ref_no ?? "")}</div>
      <div style="font-size:16px;font-weight:600;color:#071827">${esc(h.prop.title)}</div>
      <div style="color:#071827">${esc(h.prop.location)} · ${esc(h.prop.price)}</div>
      <a href="${SITE}/property/${encodeURIComponent(h.prop.ref_no ?? h.prop.id)}" style="color:#9a7b2e">View home →</a>
    </td></tr>`).join("");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Future Homes VIP Club <info@futurehomesturkey.com>",
      to: [to],
      subject: `${hits.length} home${hits.length > 1 ? "s" : ""} matching your Future Homes alert`,
      html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;background:#F5F2EA;padding:24px"><h2 style="color:#071827">Your Smart Property Alert</h2><table width="100%">${items}</table><p style="font-size:12px;color:#666">You receive this as a Future Homes VIP Club member. Manage alerts at ${SITE}/vip</p></div>`,
    }),
  });
  if (!res.ok) console.error("[alerts] resend", res.status, await res.text());
  return res.ok;
}

async function sendWhatsApp(phone: string, hits: Hit[]) {
  const lovable = process.env["LOVABLE_API_KEY"];
  const twilio = process.env["TWILIO_API_KEY"];
  const from = process.env["TWILIO_WHATSAPP_FROM"];
  if (!lovable || !twilio || !from) return false;
  const body = `Future Homes VIP alert:\n` + hits.slice(0, 5).map((h) => `${h.kind === "price_drop" ? "Price drop" : "New"}: ${h.prop.title} – ${h.prop.price}\n${SITE}/property/${h.prop.ref_no ?? h.prop.id}`).join("\n\n");
  const res = await fetch("https://connector-gateway.lovable.dev/twilio/Messages.json", {
    method: "POST",
    headers: { Authorization: `Bearer ${lovable}`, "X-Connection-Api-Key": twilio, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ To: `whatsapp:${phone.replace(/[^+0-9]/g, "")}`, From: from.startsWith("whatsapp:") ? from : `whatsapp:${from}`, Body: body }),
  });
  if (!res.ok) console.error("[alerts] twilio", res.status, await res.text());
  return res.ok;
}

export const Route = createFileRoute("/api/public/hooks/property-alerts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const token = request.headers.get("x-alerts-secret") ?? "";
        const { data: cfg } = await supabaseAdmin.from("alert_cron_config").select("secret").eq("id", 1).maybeSingle();
        if (!cfg?.secret || token !== cfg.secret) return json({ error: "Unauthorized" }, 401);

        const cols = "id,ref_no,title,location,price,property_type,bedrooms,property_image,created_at,status,description";
        const pr = await fetch(`${LEGACY_SUPABASE_URL}/rest/v1/properties?select=${cols}&is_active=eq.true&order=created_at.desc&limit=1000`, {
          headers: { apikey: LEGACY_SUPABASE_KEY, Authorization: `Bearer ${LEGACY_SUPABASE_KEY}` },
        });
        if (!pr.ok) return json({ error: "Could not load properties" }, 502);
        const props = (await pr.json()) as Prop[];
        const byId = new Map(props.map((p) => [String(p.id), p]));

        const [{ data: searches }, { data: favs }, { data: profiles }, { data: sent }] = await Promise.all([
          supabaseAdmin.from("saved_searches").select("*").eq("active", true),
          supabaseAdmin.from("favorites").select("*"),
          supabaseAdmin.from("vip_profiles").select("*"),
          supabaseAdmin.from("alert_deliveries").select("user_id,property_id,kind,channel,price_seen"),
        ]);
        const sentKey = new Set((sent ?? []).map((d) => `${d.user_id}|${d.property_id}|${d.kind}|${d.channel}|${d.price_seen ?? ""}`));
        const hitsByUser = new Map<string, Hit[]>();
        const push = (u: string, h: Hit) => { const a = hitsByUser.get(u) ?? []; if (!a.some((x) => x.prop.id === h.prop.id && x.kind === h.kind)) a.push(h); hitsByUser.set(u, a); };

        for (const s of searches ?? []) for (const p of props) if (new Date(p.created_at) >= new Date(s.created_at) && matches(s, p)) push(s.user_id, { kind: "match", prop: p, searchId: s.id });
        for (const f of favs ?? []) {
          const p = byId.get(String(f.property_id));
          if (!p || !f.price_at_save) continue;
          const now = parsePrice(p.price), before = parsePrice(f.price_at_save);
          if (now && before && now < before) push(f.user_id, { kind: "price_drop", prop: p, oldPrice: f.price_at_save });
        }

        let emails = 0, whatsapps = 0;
        for (const [userId, all] of hitsByUser) {
          const prof = (profiles ?? []).find((p) => p.user_id === userId);
          if (!prof) continue;
          const priceSeen = (h: Hit) => (h.kind === "price_drop" ? h.prop.price : "");
          const fresh = (ch: string) => all.filter((h) => !sentKey.has(`${userId}|${h.prop.id}|${h.kind}|${ch}|${priceSeen(h)}`));
          const record = (ch: string, hits: Hit[]) => supabaseAdmin.from("alert_deliveries").upsert(
            hits.map((h) => ({ user_id: userId, search_id: h.searchId ?? null, property_id: String(h.prop.id), kind: h.kind, channel: ch, price_seen: priceSeen(h) })),
            { onConflict: "user_id,property_id,kind,channel,price_seen", ignoreDuplicates: true },
          );
          const emailHits = fresh("email");
          if (prof.email_alerts && prof.email && emailHits.length && (await sendEmail(prof.email, emailHits))) { await record("email", emailHits); emails++; }
          const wantsWa = (searches ?? []).some((s) => s.user_id === userId && s.notify_whatsapp);
          const waHits = fresh("whatsapp");
          if (wantsWa && prof.whatsapp_consent && prof.phone && waHits.length && (await sendWhatsApp(prof.phone, waHits))) { await record("whatsapp", waHits); whatsapps++; }
        }
        return json({ ok: true, members: hitsByUser.size, emails, whatsapps });
      },
    },
  },
});
