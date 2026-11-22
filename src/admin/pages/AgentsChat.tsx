import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Bot, Check, Loader2, Plus, Plug, Send, X } from "lucide-react";
import { toast } from "sonner";
import { AGENTS, agentById } from "@/admin/agents/agents";
import { decideAgentAction, sendAgentMessage } from "@/admin/agents/agent.functions";

type Conv = { id: string; title: string; updated_at: string };
type Msg = { id: string; role: string; agent: string; content: string; actions: { tool: string; ok: boolean; summary: string }[]; pending_action: { summary: string } | null; action_status: string | null; created_at: string };

function renderBold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => (part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part));
}

export default function AgentsChat() {
  const send = useServerFn(sendAgentMessage);
  const decide = useServerFn(decideAgentAction);
  const [convs, setConvs] = useState<Conv[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [agent, setAgent] = useState("assistant");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const loadConvs = useCallback(async () => {
    const { data } = await supabase.from("agent_conversations").select("id,title,updated_at").order("updated_at", { ascending: false }).limit(50);
    setConvs((data ?? []) as Conv[]);
  }, []);
  const loadMsgs = useCallback(async (id: string) => {
    const { data } = await supabase.from("agent_messages").select("id,role,agent,content,actions,pending_action,action_status,created_at").eq("conversation_id", id).order("created_at");
    setMsgs((data ?? []) as unknown as Msg[]);
  }, []);
  useEffect(() => { void loadConvs(); }, [loadConvs]);
  useEffect(() => { if (active) void loadMsgs(active); else setMsgs([]); }, [active, loadMsgs]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, busy]);

  const submit = async () => {
    const t = text.trim(); if (!t || busy) return;
    setBusy(true); setText("");
    setMsgs((m) => [...m, { id: `tmp-${Date.now()}`, role: "user", agent, content: t, actions: [], pending_action: null, action_status: null, created_at: new Date().toISOString() }]);
    try {
      const r = await send({ data: { conversationId: active, text: t, agent } });
      if (r.conversationId !== active) { setActive(r.conversationId); await loadConvs(); } else await loadMsgs(r.conversationId);
    } catch (e) { toast.error((e as Error).message); setText(t); }
    finally { setBusy(false); }
  };

  const onDecide = async (id: string, approve: boolean) => {
    try { const r = await decide({ data: { messageId: id, approve } }); toast[r.status === "failed" ? "error" : "success"](r.status === "done" ? "Done" : r.status === "rejected" ? "Rejected" : "Failed"); }
    catch (e) { toast.error((e as Error).message); }
    if (active) await loadMsgs(active);
  };

  return (
    <div className="grid h-[calc(100vh-8rem)] gap-4 md:grid-cols-[240px_1fr]">
      <aside className="hidden flex-col gap-2 overflow-y-auto md:flex">
        <Button onClick={() => setActive(null)} className="justify-start gap-2"><Plus className="h-4 w-4" /> New conversation</Button>
        <Button asChild variant="outline" className="justify-start gap-2"><Link to="/admin/integrations"><Plug className="h-4 w-4" /> Connect apps</Link></Button>
        <div className="mt-2 space-y-1">
          {convs.map((c) => (
            <button key={c.id} onClick={() => setActive(c.id)} className={`w-full truncate rounded-md px-3 py-2 text-left text-sm ${active === c.id ? "bg-muted font-medium" : "hover:bg-muted/60"}`}>{c.title}</button>
          ))}
        </div>
      </aside>
      <Card className="flex min-h-0 flex-col">
        <div className="flex flex-wrap gap-2 border-b p-3">
          {AGENTS.map((a) => (
            <button key={a.id} onClick={() => setAgent(a.id)} title={a.description} className={`rounded-full border px-3 py-1 text-xs ${agent === a.id ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"}`}>@{a.handle}</button>
          ))}
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {!msgs.length && (
            <div className="mx-auto max-w-xl space-y-3 pt-8 text-center text-sm text-muted-foreground">
              <Bot className="mx-auto h-10 w-10" />
              <p>All agents are here. Write to the assistant, or start with @marketing, @sales, @admin, @service or @analytics.</p>
              <div className="grid gap-2 text-left sm:grid-cols-2">
                {AGENTS.map((a) => <div key={a.id} className="rounded-md border p-2"><div className="font-medium text-foreground">{a.name}</div><div className="text-xs">{a.description}</div></div>)}
              </div>
            </div>
          )}
          {msgs.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-lg px-4 py-2 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                {m.role !== "user" && <div className="mb-1 text-xs font-semibold opacity-70">{agentById(m.agent).name}</div>}
                <div className="whitespace-pre-wrap">{renderBold(m.content)}</div>
                {!!m.actions?.length && (
                  <div className="mt-2 flex flex-wrap gap-1">{m.actions.map((a, i) => <Badge key={i} variant={a.ok ? "secondary" : "destructive"} className="text-[10px]" title={a.summary}>{a.ok ? "✓" : "✗"} {a.tool}</Badge>)}</div>
                )}
                {m.pending_action && (
                  <div className="mt-3 rounded-md border bg-background p-2 text-foreground">
                    <div className="text-xs font-medium">Needs approval</div>
                    <div className="text-xs">{m.pending_action.summary}</div>
                    {m.action_status === "pending" ? (
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" onClick={() => onDecide(m.id, true)} className="gap-1"><Check className="h-3 w-3" /> Approve</Button>
                        <Button size="sm" variant="outline" onClick={() => onDecide(m.id, false)} className="gap-1"><X className="h-3 w-3" /> Reject</Button>
                      </div>
                    ) : <Badge variant="outline" className="mt-2">{m.action_status}</Badge>}
                  </div>
                )}
              </div>
            </div>
          ))}
          {busy && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> {agentById(agent).name} is working…</div>}
          <div ref={endRef} />
        </div>
        <div className="flex gap-2 border-t p-3">
          <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={`Message @${agentById(agent).handle}…`} rows={2}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void submit(); } }} aria-label="Message" />
          <Button onClick={submit} disabled={busy || !text.trim()} aria-label="Send"><Send className="h-4 w-4" /></Button>
        </div>
      </Card>
    </div>
  );
}
