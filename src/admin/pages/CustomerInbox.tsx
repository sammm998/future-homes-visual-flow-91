import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import { MessageCircle, Mail, Instagram, Facebook, Check, CheckCheck, AlertCircle, Plus } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { useAdminUsers } from "@/admin/workspace/useAdminUsers";
import { useAdminT } from "@/admin/i18n/AdminI18nContext";
import { sendCrmEmail, sendWhatsAppReply } from "@/admin/crm/crm.functions";

type Conv = { id: string; channel: string; contact_handle: string; contact_name: string | null; lead_id: string | null; assigned_to: string | null; status: string; unread_count: number; last_message_at: string; last_inbound_at: string | null };
type Msg = { id: string; direction: string; body: string; status: string; created_at: string; author_id: string | null; error: unknown };

const ICON: Record<string, typeof Mail> = { whatsapp: MessageCircle, email: Mail, instagram: Instagram, facebook: Facebook };

export default function CustomerInbox() {
  const { t } = useAdminT();
  const { users, me, name } = useAdminUsers();
  const [convs, setConvs] = useState<Conv[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState<"open" | "done" | "mine">("open");
  const [newEmail, setNewEmail] = useState("");
  const sendWa = useServerFn(sendWhatsAppReply);
  const sendMail = useServerFn(sendCrmEmail);

  const loadConvs = async () => {
    const { data } = await supabase.from("inbox_conversations").select("*").order("last_message_at", { ascending: false }).limit(300);
    setConvs((data as Conv[]) ?? []);
  };
  const loadMsgs = async (id: string) => {
    const { data } = await supabase.from("inbox_messages").select("id, direction, body, status, created_at, author_id, error").eq("conversation_id", id).order("created_at");
    setMsgs((data as Msg[]) ?? []);
  };
  useEffect(() => {
    loadConvs();
    const ch = supabase.channel(`inbox-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "inbox_messages" }, () => { loadConvs(); setSel((s) => { if (s) loadMsgs(s); return s; }); })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);
  useEffect(() => {
    if (!sel) return;
    loadMsgs(sel);
    supabase.from("inbox_conversations").update({ unread_count: 0 }).eq("id", sel).then(() => setConvs((cs) => cs.map((c) => (c.id === sel ? { ...c, unread_count: 0 } : c))));
  }, [sel]);

  const list = useMemo(() => convs.filter((c) => filter === "mine" ? c.assigned_to === me && c.status === "open" : c.status === filter), [convs, filter, me]);
  const conv = convs.find((c) => c.id === sel) ?? null;
  const windowOpen = conv?.last_inbound_at ? Date.now() - new Date(conv.last_inbound_at).getTime() < 24 * 3600 * 1000 : false;

  const send = async () => {
    if (!conv || !text.trim()) return;
    try {
      if (conv.channel === "whatsapp") await sendWa({ data: { conversationId: conv.id, body: text.trim() } });
      else if (conv.channel === "email") await sendMail({ data: { to: conv.contact_handle, subject: "Future Homes International", html: `<p style="white-space:pre-wrap">${text.trim().replace(/</g, "&lt;")}</p>`, conversationId: conv.id } });
      else return toast.error(t("This channel is not connected yet"));
      setText(""); loadMsgs(conv.id);
    } catch (e) { toast.error(e instanceof Error ? e.message : String(e)); }
  };
  const update = async (patch: Partial<Conv>) => {
    if (!conv) return;
    const { error } = await supabase.from("inbox_conversations").update(patch).eq("id", conv.id);
    if (error) return toast.error(error.message);
    loadConvs();
  };
  const startEmail = async () => {
    const email = newEmail.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error(t("Enter a valid e-mail"));
    const { data: lead } = await supabase.from("leads").select("id, name").eq("email", email).limit(1).maybeSingle();
    let leadId = lead?.id ?? null;
    if (!leadId) {
      const { data: nl, error } = await supabase.from("leads").insert({ name: email, email, source: "E-mail", status: "new" }).select("id").single();
      if (error) return toast.error(error.message);
      leadId = nl.id;
    }
    const { data, error } = await supabase.from("inbox_conversations").upsert({ channel: "email", contact_handle: email, contact_name: lead?.name ?? null, lead_id: leadId }, { onConflict: "channel,contact_handle" }).select("id").single();
    if (error) return toast.error(error.message);
    setNewEmail(""); await loadConvs(); setSel(data.id);
  };

  const StatusIcon = ({ s }: { s: string }) => s === "read" ? <CheckCheck className="h-3 w-3 text-primary" /> : s === "delivered" ? <CheckCheck className="h-3 w-3" /> : s === "failed" ? <AlertCircle className="h-3 w-3 text-destructive" /> : <Check className="h-3 w-3" />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">{t("Customer inbox")}</h1>
        <p className="text-sm text-muted-foreground">{t("WhatsApp and e-mail conversations, linked to leads.")} <span className="opacity-70">Instagram · Facebook — {t("coming soon")}</span></p>
      </div>
      <div className="grid gap-4 md:grid-cols-[320px_1fr] h-[calc(100vh-200px)] min-h-[520px]">
        <div className="flex flex-col rounded-lg border bg-card overflow-hidden">
          <div className="flex gap-1 p-2 border-b">
            {(["open", "mine", "done"] as const).map((f) => (
              <Button key={f} size="sm" variant={filter === f ? "default" : "ghost"} onClick={() => setFilter(f)}>{t(f === "open" ? "Open" : f === "mine" ? "Mine" : "Done")}</Button>
            ))}
          </div>
          <div className="flex gap-1 p-2 border-b">
            <Input placeholder={t("New e-mail conversation")} value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="h-8" />
            <Button size="sm" variant="outline" onClick={startEmail}><Plus className="h-4 w-4" /></Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {list.length === 0 && <p className="p-4 text-sm text-muted-foreground">{t("No conversations yet")}</p>}
            {list.map((c) => { const I = ICON[c.channel] ?? Mail; return (
              <button key={c.id} onClick={() => setSel(c.id)} className={`w-full text-left px-3 py-2 border-b flex gap-2 items-start hover:bg-muted/50 ${sel === c.id ? "bg-muted" : ""}`}>
                <I className="h-4 w-4 mt-1 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2"><span className="truncate font-medium text-sm">{c.contact_name || c.contact_handle}</span>{c.unread_count > 0 && <Badge>{c.unread_count}</Badge>}</div>
                  <div className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(c.last_message_at), { addSuffix: true })}{c.assigned_to ? ` · ${name(c.assigned_to)}` : ""}</div>
                </div>
              </button>
            ); })}
          </div>
        </div>
        <div className="flex flex-col rounded-lg border bg-card overflow-hidden">
          {!conv ? <p className="m-auto text-sm text-muted-foreground">{t("Select a conversation")}</p> : (
            <>
              <div className="flex flex-wrap items-center gap-2 p-3 border-b">
                <div className="mr-auto"><div className="font-medium">{conv.contact_name || conv.contact_handle}</div><div className="text-xs text-muted-foreground">{conv.channel} · {conv.contact_handle}</div></div>
                {conv.lead_id && <Link to={`/admin/crm/leads/${conv.lead_id}`} className="text-sm underline">{t("Open lead")}</Link>}
                <select className="h-8 rounded border bg-background px-2 text-sm" value={conv.assigned_to ?? ""} onChange={(e) => update({ assigned_to: e.target.value || null })}>
                  <option value="">{t("Unassigned")}</option>
                  {users.map((u) => <option key={u.id} value={u.id}>{name(u.id)}</option>)}
                </select>
                <Button size="sm" variant="outline" onClick={() => update({ status: conv.status === "open" ? "done" : "open" })}>{conv.status === "open" ? t("Mark done") : t("Reopen")}</Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {msgs.map((m) => (
                  <div key={m.id} className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${m.direction === "out" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"}`}>
                    <div className="whitespace-pre-wrap">{m.body}</div>
                    <div className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-70">
                      {m.author_id ? `${name(m.author_id)} · ` : ""}{format(new Date(m.created_at), "d MMM HH:mm")}{m.direction === "out" && <StatusIcon s={m.status} />}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t p-3 space-y-2">
                {conv.channel === "whatsapp" && !windowOpen && <p className="text-xs text-muted-foreground">{t("More than 24 hours since the customer wrote — WhatsApp only allows approved templates now.")}</p>}
                <div className="flex gap-2">
                  <Textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder={t("Write a reply…")} onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send(); }} />
                  <Button onClick={send} disabled={!text.trim()}>{t("Send")}</Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
