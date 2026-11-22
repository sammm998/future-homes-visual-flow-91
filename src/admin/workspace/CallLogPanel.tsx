import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone } from "lucide-react";
import { toast } from "sonner";

type Call = { id: string; direction: string; outcome: string; duration_min: number | null; notes: string | null; created_at: string };
const OUTCOMES = ["answered", "no answer", "voicemail", "busy", "wrong number"];

export function CallLogPanel({ leadId, phone }: { leadId: string; phone: string | null }) {
  const [calls, setCalls] = useState<Call[]>([]);
  const [f, setF] = useState({ direction: "outbound", outcome: "answered", duration_min: "", notes: "" });
  const load = useCallback(async () => { const { data } = await supabase.from("call_logs").select("*").eq("lead_id", leadId).order("created_at", { ascending: false }); setCalls((data ?? []) as Call[]); }, [leadId]);
  useEffect(() => { void load(); }, [load]);
  const save = async () => {
    const { data: u } = await supabase.auth.getUser();
    const r = await supabase.from("call_logs").insert({ lead_id: leadId, phone, direction: f.direction, outcome: f.outcome, duration_min: f.duration_min ? Number(f.duration_min) : null, notes: f.notes || null, user_id: u.user?.id });
    if (r.error) return toast.error(r.error.message);
    setF({ ...f, duration_min: "", notes: "" }); toast.success("Call logged"); void load();
  };
  const sel = "h-9 rounded-md border bg-background px-2 text-sm";
  return (
    <div className="space-y-2">
      {phone ? <Button asChild size="sm" className="gap-2"><a href={`tel:${phone}`}><Phone className="h-4 w-4" />Call {phone}</a></Button> : <p className="text-xs text-muted-foreground">No phone number on this lead.</p>}
      <div className="flex flex-wrap gap-2">
        <select aria-label="Call direction" className={sel} value={f.direction} onChange={(e) => setF({ ...f, direction: e.target.value })}><option value="outbound">Outgoing</option><option value="inbound">Incoming</option></select>
        <select aria-label="Call outcome" className={sel} value={f.outcome} onChange={(e) => setF({ ...f, outcome: e.target.value })}>{OUTCOMES.map((o) => <option key={o}>{o}</option>)}</select>
        <Input aria-label="Minutes" type="number" placeholder="min" className="h-9 w-20" value={f.duration_min} onChange={(e) => setF({ ...f, duration_min: e.target.value })} />
      </div>
      <Input aria-label="Call notes" placeholder="What was said?" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} />
      <Button size="sm" variant="outline" onClick={save}>Log call</Button>
      <div className="space-y-1">{calls.map((c) => <div key={c.id} className="rounded border p-2 text-xs"><span className="font-medium">{c.direction === "inbound" ? "Incoming" : "Outgoing"} · {c.outcome}</span>{c.duration_min ? ` · ${c.duration_min} min` : ""} · {new Date(c.created_at).toLocaleString()}{c.notes && <div className="mt-1 text-muted-foreground">{c.notes}</div>}</div>)}</div>
    </div>
  );
}
