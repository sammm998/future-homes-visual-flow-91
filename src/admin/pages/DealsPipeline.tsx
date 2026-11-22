import { useEffect, useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, History, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { DEAL_STAGES, summarizeStages, filterDeals } from "@/admin/workspace/model";
import { useAdminUsers } from "@/admin/workspace/useAdminUsers";
import { useAdminT } from "@/admin/i18n/AdminI18nContext";

export type Deal = {
  id: string; title: string; lead_id: string | null; client_name: string | null; client_email: string | null;
  property_ref: string | null; country: string | null; value_eur: number; stage: string; owner_id: string | null;
  expected_close: string | null; position: number; created_at: string;
};
type Hist = { id: string; from_stage: string | null; to_stage: string; changed_by: string | null; created_at: string };
type Comment = { id: string; author_id: string | null; body: string; created_at: string };

const eur = (n: number) => "€" + Math.round(n).toLocaleString("en-US");
const empty = { title: "", client_name: "", client_email: "", property_ref: "", country: "", value_eur: "", owner_id: "", expected_close: "", lead_id: "" };

export default function DealsPipeline() {
  const { t } = useAdminT();
  const { users, me, name } = useAdminUsers();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filter, setFilter] = useState({ owner: "", country: "" });
  const [form, setForm] = useState<typeof empty | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [hist, setHist] = useState<Hist[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");

  const load = async () => {
    const { data, error } = await supabase.from("deals").select("*").order("position").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setDeals((data as Deal[]) ?? []);
  };
  useEffect(() => {
    load();
    const lead = new URLSearchParams(window.location.search).get("lead");
    if (lead) {
      supabase.from("leads").select("id,name,email,property_id,preferred_countries,budget_max").eq("id", lead).maybeSingle().then(({ data }) => {
        if (data) setForm({ ...empty, title: `${data.name}`, client_name: data.name, client_email: data.email ?? "", lead_id: data.id,
          country: data.preferred_countries?.[0] ?? "", value_eur: data.budget_max ? String(data.budget_max) : "" });
      });
    }
  }, []);

  const shown = useMemo(() => filterDeals(deals, filter), [deals, filter]);
  const sums = useMemo(() => summarizeStages(shown), [shown]);
  const countries = useMemo(() => [...new Set(deals.map((d) => d.country).filter(Boolean))] as string[], [deals]);

  const onDragEnd = async (r: DropResult) => {
    if (!r.destination) return;
    const stage = r.destination.droppableId;
    const deal = deals.find((d) => d.id === r.draggableId);
    if (!deal) return;
    const col = shown.filter((d) => d.stage === stage && d.id !== deal.id);
    const before = col[r.destination.index - 1]?.position ?? (col[0]?.position ?? 0) - 1;
    const after = col[r.destination.index]?.position ?? before + 2;
    const position = (before + after) / 2;
    setDeals((ds) => ds.map((d) => (d.id === deal.id ? { ...d, stage, position } : d)).sort((a, b) => a.position - b.position));
    const { error } = await supabase.from("deals").update({ stage, position }).eq("id", deal.id);
    if (error) { toast.error(error.message); load(); }
  };

  const openEdit = async (d: Deal | null) => {
    setEditId(d?.id ?? null);
    setForm(d ? { title: d.title, client_name: d.client_name ?? "", client_email: d.client_email ?? "", property_ref: d.property_ref ?? "", country: d.country ?? "",
      value_eur: String(d.value_eur ?? ""), owner_id: d.owner_id ?? "", expected_close: d.expected_close ?? "", lead_id: d.lead_id ?? "" } : { ...empty, owner_id: me ?? "" });
    setHist([]); setComments([]);
    if (d) {
      const [h, c] = await Promise.all([
        supabase.from("deal_stage_history").select("*").eq("deal_id", d.id).order("created_at", { ascending: false }),
        supabase.from("feed_comments").select("id,author_id,body,created_at").eq("entity_type", "deal").eq("entity_id", d.id).order("created_at"),
      ]);
      setHist((h.data as Hist[]) ?? []); setComments((c.data as Comment[]) ?? []);
    }
  };

  const save = async () => {
    if (!form || !form.title.trim()) return toast.error(t("Title required"));
    const row = {
      title: form.title.trim(), client_name: form.client_name || null, client_email: form.client_email || null,
      property_ref: form.property_ref || null, country: form.country || null, value_eur: Number(form.value_eur) || 0,
      owner_id: form.owner_id || null, expected_close: form.expected_close || null, lead_id: form.lead_id || null,
    };
    const { error } = editId
      ? await supabase.from("deals").update(row).eq("id", editId)
      : await supabase.from("deals").insert({ ...row, created_by: me, position: -Date.now() / 1e6 });
    if (error) return toast.error(error.message);
    toast.success(t("Saved"));
    setForm(null); load();
  };
  const remove = async () => {
    if (!editId || !confirm(t("Delete?"))) return;
    await supabase.from("deals").delete().eq("id", editId);
    setForm(null); load();
  };
  const addComment = async () => {
    if (!editId || !comment.trim()) return;
    const { error } = await supabase.from("feed_comments").insert({ entity_type: "deal", entity_id: editId, author_id: me, body: comment.trim() });
    if (error) return toast.error(error.message);
    setComment("");
    const { data } = await supabase.from("feed_comments").select("id,author_id,body,created_at").eq("entity_type", "deal").eq("entity_id", editId).order("created_at");
    setComments((data as Comment[]) ?? []);
  };
  const stageLabel = (k: string | null) => t(DEAL_STAGES.find((s) => s.key === k)?.label ?? k ?? "—");

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("Pipeline")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("Drag deals between stages.")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select aria-label={t("Salesperson")} className="h-9 rounded-md border bg-background px-2 text-sm" value={filter.owner} onChange={(e) => setFilter({ ...filter, owner: e.target.value })}>
            <option value="">{t("All salespeople")}</option>
            {users.map((u) => <option key={u.id} value={u.id}>{name(u.id)}</option>)}
          </select>
          <select aria-label={t("Country")} className="h-9 rounded-md border bg-background px-2 text-sm" value={filter.country} onChange={(e) => setFilter({ ...filter, country: e.target.value })}>
            <option value="">{t("All countries")}</option>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <Button onClick={() => openEdit(null)}><Plus className="h-4 w-4 mr-2" />{t("New deal")}</Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-4">
          {DEAL_STAGES.map((s) => (
            <Droppable droppableId={s.key} key={s.key}>
              {(p, snap) => (
                <div ref={p.innerRef} {...p.droppableProps} className={`w-64 shrink-0 rounded-lg border bg-admin-surface p-2 ${snap.isDraggingOver ? "ring-2 ring-primary" : ""}`}>
                  <div className="px-1 pb-2">
                    <div className="text-sm font-semibold">{t(s.label)}</div>
                    <div className="text-xs text-muted-foreground">{sums[s.key]?.count ?? 0} · {eur(sums[s.key]?.total ?? 0)}</div>
                  </div>
                  <div className="space-y-2 min-h-16">
                    {shown.filter((d) => d.stage === s.key).map((d, i) => (
                      <Draggable draggableId={d.id} index={i} key={d.id}>
                        {(dp) => (
                          <div ref={dp.innerRef} {...dp.draggableProps} {...dp.dragHandleProps} onClick={() => openEdit(d)}
                            className="cursor-pointer rounded-md border bg-card p-2.5 text-sm shadow-sm hover:border-primary">
                            <div className="font-medium leading-tight">{d.title}</div>
                            {d.property_ref && <div className="text-xs text-muted-foreground mt-0.5">REF {d.property_ref}</div>}
                            <div className="mt-1.5 flex items-center justify-between text-xs">
                              <span className="font-semibold">{eur(Number(d.value_eur))}</span>
                              <span className="text-muted-foreground">{name(d.owner_id)}</span>
                            </div>
                            {d.expected_close && <div className="text-[11px] text-muted-foreground mt-1">{t("Close")}: {d.expected_close}</div>}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {p.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <Dialog open={!!form} onOpenChange={(o) => !o && setForm(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? t("Edit deal") : t("New deal")}</DialogTitle></DialogHeader>
          {form && (
            <div className="space-y-3">
              <div><Label>{t("Title")}</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>{t("Client")}</Label><Input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} /></div>
                <div><Label>{t("Email")}</Label><Input type="email" value={form.client_email} onChange={(e) => setForm({ ...form, client_email: e.target.value })} /></div>
                <div><Label>{t("Property REF")}</Label><Input value={form.property_ref} onChange={(e) => setForm({ ...form, property_ref: e.target.value })} /></div>
                <div><Label>{t("Value (EUR)")}</Label><Input inputMode="numeric" value={form.value_eur} onChange={(e) => setForm({ ...form, value_eur: e.target.value.replace(/[^0-9.]/g, "") })} /></div>
                <div><Label>{t("Country")}</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
                <div><Label>{t("Expected close")}</Label><Input type="date" value={form.expected_close} onChange={(e) => setForm({ ...form, expected_close: e.target.value })} /></div>
              </div>
              <div><Label>{t("Salesperson")}</Label>
                <select className="h-9 w-full rounded-md border bg-background px-2 text-sm" value={form.owner_id} onChange={(e) => setForm({ ...form, owner_id: e.target.value })}>
                  <option value="">—</option>{users.map((u) => <option key={u.id} value={u.id}>{name(u.id)}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <Button onClick={save}>{t("Save")}</Button>
                <Button variant="outline" onClick={() => setForm(null)}>{t("Cancel")}</Button>
                {editId && <Button variant="ghost" className="ml-auto text-destructive" onClick={remove}><Trash2 className="h-4 w-4" /></Button>}
              </div>
              {editId && (
                <>
                  <div className="border-t pt-3">
                    <div className="flex items-center gap-2 text-sm font-semibold mb-2"><History className="h-4 w-4" />{t("History")}</div>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {hist.map((h) => <li key={h.id}>{format(new Date(h.created_at), "d MMM HH:mm")} · {h.from_stage ? `${stageLabel(h.from_stage)} → ` : ""}{stageLabel(h.to_stage)} · {name(h.changed_by)}</li>)}
                    </ul>
                  </div>
                  <div className="border-t pt-3 space-y-2">
                    <div className="text-sm font-semibold">{t("Comments")}</div>
                    {comments.map((c) => <div key={c.id} className="text-sm"><span className="font-medium">{name(c.author_id)}</span> <span className="text-xs text-muted-foreground">{format(new Date(c.created_at), "d MMM HH:mm")}</span><div>{c.body}</div></div>)}
                    <Textarea rows={2} value={comment} onChange={(e) => setComment(e.target.value)} placeholder={t("Write a comment…")} />
                    <Button size="sm" onClick={addComment}>{t("Comment")}</Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
