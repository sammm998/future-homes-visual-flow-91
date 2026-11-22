import { createMeeting } from "@/admin/pages/Meetings";
import { Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hash, User, Plus, Send } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAdminUsers } from "@/admin/workspace/useAdminUsers";
import { useAdminT } from "@/admin/i18n/AdminI18nContext";

type Channel = { id: string; name: string; is_direct: boolean; member_ids: string[] };
type Msg = { id: string; channel_id: string; author_id: string | null; body: string; created_at: string };

export default function TeamChat() {
  const { t } = useAdminT();
  const { users, me, name } = useAdminUsers();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [unread, setUnread] = useState<Record<string, number>>({});
  const bottom = useRef<HTMLDivElement>(null);

  const loadChannels = async () => {
    const { data } = await supabase.from("chat_channels").select("id,name,is_direct,member_ids").order("created_at");
    const list = (data as Channel[]) ?? [];
    setChannels(list);
    setActive((a) => a ?? list[0]?.id ?? null);
  };
  const loadUnread = async (uid: string) => {
    const [{ data: reads }, { data: recent }] = await Promise.all([
      supabase.from("chat_reads").select("channel_id,last_read_at").eq("user_id", uid),
      supabase.from("chat_messages").select("channel_id,created_at,author_id").gte("created_at", new Date(Date.now() - 30 * 864e5).toISOString()),
    ]);
    const map: Record<string, number> = {};
    for (const m of recent ?? []) {
      if (m.author_id === uid) continue;
      const r = reads?.find((x) => x.channel_id === m.channel_id);
      if (!r || m.created_at > r.last_read_at) map[m.channel_id] = (map[m.channel_id] ?? 0) + 1;
    }
    setUnread(map);
  };
  useEffect(() => { loadChannels(); }, []);
  useEffect(() => { if (me) loadUnread(me); }, [me]);

  useEffect(() => {
    if (!active) return;
    supabase.from("chat_messages").select("*").eq("channel_id", active).order("created_at").limit(300).then(({ data }) => setMsgs((data as Msg[]) ?? []));
    if (me) {
      supabase.from("chat_reads").upsert({ user_id: me, channel_id: active, last_read_at: new Date().toISOString() }).then(() => {});
      setUnread((u) => ({ ...u, [active]: 0 }));
    }
  }, [active, me]);

  useEffect(() => {
    const ch = supabase.channel(`chat-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, (p) => {
        const m = p.new as Msg;
        setActive((a) => {
          if (m.channel_id === a) setMsgs((ms) => (ms.some((x) => x.id === m.id) ? ms : [...ms, m]));
          else setUnread((u) => ({ ...u, [m.channel_id]: (u[m.channel_id] ?? 0) + 1 }));
          return a;
        });
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);
  useEffect(() => { bottom.current?.scrollIntoView({ block: "end" }); }, [msgs]);

  const send = async () => {
    if (!active || !text.trim()) return;
    const body = text.trim(); setText("");
    const { data, error } = await supabase.from("chat_messages").insert({ channel_id: active, author_id: me, body }).select().single();
    if (error) return toast.error(error.message);
    setMsgs((ms) => (ms.some((x) => x.id === data.id) ? ms : [...ms, data as Msg]));
    if (me) supabase.from("chat_reads").upsert({ user_id: me, channel_id: active, last_read_at: new Date().toISOString() }).then(() => {});
  };
  const newChannel = async () => {
    const n = prompt(t("Channel name"));
    if (!n?.trim()) return;
    const { error } = await supabase.from("chat_channels").insert({ name: n.trim(), created_by: me });
    if (error) return toast.error(error.message);
    loadChannels();
  };
  const openDirect = async (uid: string) => {
    if (!me) return;
    const ex = channels.find((c) => c.is_direct && c.member_ids.includes(me) && c.member_ids.includes(uid) && c.member_ids.length === (uid === me ? 1 : 2));
    if (ex) return setActive(ex.id);
    const { data, error } = await supabase.from("chat_channels").insert({ name: "dm", is_direct: true, member_ids: uid === me ? [me] : [me, uid], created_by: me }).select().single();
    if (error) return toast.error(error.message);
    await loadChannels(); setActive(data.id);
  };

  const label = (c: Channel) => (c.is_direct ? name(c.member_ids.find((x) => x !== me) ?? me) : c.name);
  const visible = channels.filter((c) => !c.is_direct || (me && c.member_ids.includes(me)));
  const current = channels.find((c) => c.id === active);

  return (
    <div className="flex h-[calc(100vh-8rem)] rounded-lg border bg-admin-surface overflow-hidden">
      <aside className="w-56 shrink-0 border-r p-3 space-y-4 overflow-y-auto">
        <div>
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground mb-1">{t("Channels")}
            <button aria-label={t("New channel")} onClick={newChannel}><Plus className="h-3.5 w-3.5" /></button></div>
          {visible.filter((c) => !c.is_direct).map((c) => (
            <button key={c.id} onClick={() => setActive(c.id)} className={`flex w-full items-center gap-1.5 rounded px-2 py-1 text-sm ${active === c.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
              <Hash className="h-3.5 w-3.5" /><span className="truncate flex-1 text-left">{c.name}</span>
              {!!unread[c.id] && <span className="rounded-full bg-destructive px-1.5 text-[10px] text-destructive-foreground">{unread[c.id]}</span>}
            </button>
          ))}
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{t("Direct messages")}</div>
          {users.filter((u) => u.id !== me).map((u) => {
            const dm = visible.find((c) => c.is_direct && c.member_ids.includes(u.id));
            return (
              <button key={u.id} onClick={() => openDirect(u.id)} className={`flex w-full items-center gap-1.5 rounded px-2 py-1 text-sm ${dm && active === dm.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                <User className="h-3.5 w-3.5" /><span className="truncate flex-1 text-left">{name(u.id)}</span>
                {dm && !!unread[dm.id] && <span className="rounded-full bg-destructive px-1.5 text-[10px] text-destructive-foreground">{unread[dm.id]}</span>}
              </button>
            );
          })}
        </div>
      </aside>
      <section className="flex flex-1 flex-col min-w-0">
        <header className="flex items-center justify-between gap-2 border-b px-4 py-3 font-semibold"><span>{current ? (current.is_direct ? label(current) : `# ${current.name}`) : ""}</span>{current && <Button size="sm" variant="outline" className="gap-2" onClick={async () => { const m = await createMeeting(current.is_direct ? "Team call" : current.name, new Date().toISOString()); if (!m) return; await supabase.from("chat_messages").insert({ channel_id: current.id, author_id: me, body: `📹 Video meeting: ${m.room_url}` }); window.open(m.room_url, "_blank", "noopener"); }}><Video className="h-4 w-4" />Video call</Button>}</header>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {msgs.map((m) => (
            <div key={m.id} className="text-sm">
              <span className="font-semibold">{name(m.author_id)}</span>{" "}
              <span className="text-xs text-muted-foreground">{format(new Date(m.created_at), "d MMM HH:mm")}</span>
              <div className="whitespace-pre-wrap">{m.body}</div>
            </div>
          ))}
          {!msgs.length && <p className="text-sm text-muted-foreground">{t("No messages yet.")}</p>}
          <div ref={bottom} />
        </div>
        <form className="flex gap-2 border-t p-3" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder={t("Write a message…")} aria-label={t("Message")} />
          <Button type="submit" aria-label={t("Send")}><Send className="h-4 w-4" /></Button>
        </form>
      </section>
    </div>
  );
}
