import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ACTIONS, DEAL_STAGES, TRIGGERS, type RuleConditions } from "@/admin/workspace/model";
import { useAdminUsers } from "@/admin/workspace/useAdminUsers";
import { useAdminT } from "@/admin/i18n/AdminI18nContext";

type Action = { type: string; title?: string; due_minutes?: number; assignee?: string; to?: string; subject?: string; body?: string; text?: string; stage?: string };
type Rule = { id: string; name: string; trigger_event: string; conditions: RuleConditions; actions: Action[]; active: boolean };
type Run = { id: string; rule_id: string | null; event: string; status: string; created_at: string };

const sel = "h-9 w-full rounded-md border bg-background px-2 text-sm";
const PRESETS: Omit<Rule, "id">[] = [
  { name: "New lead → call within 1 hour + welcome email", trigger_event: "lead_created", conditions: {}, active: true,
    actions: [{ type: "create_task", title: "Call within 1 hour", due_minutes: 60 }, { type: "send_email", to: "client", subject: "Thank you for contacting Future Homes International", body: "Hi {name},\n\nThank you for your interest. One of our advisors will contact you shortly.\n\nFuture Homes International" }] },
  { name: "Deal won → celebrate in feed", trigger_event: "deal_stage_changed", conditions: { to_stage: "won" }, active: true,
    actions: [{ type: "feed_post", text: "🎉 Congratulations on closing {name}!" }] },
  { name: "Viewing booked → prepare task", trigger_event: "viewing_booked", conditions: {}, active: true,
    actions: [{ type: "create_task", title: "Prepare viewing", due_minutes: 120 }] },
  { name: "Deal idle 7 days → follow-up task", trigger_event: "deal_stale", conditions: { days: 7 }, active: true,
    actions: [{ type: "create_task", title: "Follow up idle deal", due_minutes: 60 }] },
];

export default function Automations() {
  const { t } = useAdminT();
  const { users, me, name } = useAdminUsers();
  const [rules, setRules] = useState<Rule[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [edit, setEdit] = useState<(Omit<Rule, "id"> & { id?: string }) | null>(null);

  const load = async () => {
    const [r, l] = await Promise.all([
      supabase.from("automation_rules").select("*").order("created_at"),
      supabase.from("automation_runs").select("id,rule_id,event,status,created_at").order("created_at", { ascending: false }).limit(50),
    ]);
    setRules((r.data as unknown as Rule[]) ?? []);
    setRuns((l.data as Run[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!edit || !edit.name.trim() || !edit.actions.length) return toast.error(t("Name and at least one action are required"));
    const row = { name: edit.name.trim(), trigger_event: edit.trigger_event, conditions: edit.conditions as never, actions: edit.actions as never, active: edit.active };
    const { error } = edit.id ? await supabase.from("automation_rules").update(row).eq("id", edit.id) : await supabase.from("automation_rules").insert({ ...row, created_by: me });
    if (error) return toast.error(error.message);
    toast.success(t("Saved")); setEdit(null); load();
  };
  const toggle = async (r: Rule) => { await supabase.from("automation_rules").update({ active: !r.active }).eq("id", r.id); load(); };
  const remove = async (id: string) => { if (!confirm(t("Delete?"))) return; await supabase.from("automation_rules").delete().eq("id", id); load(); };
  const setAction = (i: number, a: Action) => edit && setEdit({ ...edit, actions: edit.actions.map((x, j) => (j === i ? a : x)) });
  const trig = (k: string) => t(TRIGGERS.find((x) => x.key === k)?.label ?? k);
  const describe = (a: Action) => `${t(ACTIONS.find((x) => x.key === a.type)?.label ?? a.type)}${a.title ? `: ${a.title}` : a.subject ? `: ${a.subject}` : a.stage ? `: ${t(DEAL_STAGES.find((s) => s.key === a.stage)?.label ?? "")}` : a.assignee ? `: ${name(a.assignee)}` : ""}`;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("Automations")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("When something happens, do something automatically.")}</p>
        </div>
        <Button onClick={() => setEdit({ name: "", trigger_event: "lead_created", conditions: {}, actions: [{ type: "create_task", title: "", due_minutes: 60 }], active: true })}>
          <Plus className="h-4 w-4 mr-2" />{t("New rule")}</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground self-center">{t("Templates")}:</span>
        {PRESETS.map((p) => <Button key={p.name} size="sm" variant="outline" onClick={() => setEdit({ ...p, name: t(p.name) })}>{t(p.name)}</Button>)}
      </div>

      <div className="space-y-2">
        {rules.map((r) => (
          <Card key={r.id} className="bg-admin-surface"><CardContent className="flex items-center gap-3 p-4">
            <Zap className="h-5 w-5 text-primary shrink-0" />
            <button className="flex-1 text-left min-w-0" onClick={() => setEdit(r)}>
              <div className="font-medium">{r.name}</div>
              <div className="text-xs text-muted-foreground truncate">{t("When")}: {trig(r.trigger_event)}{r.conditions.to_stage ? ` (${t(DEAL_STAGES.find((s) => s.key === r.conditions.to_stage)?.label ?? "")})` : ""}{r.conditions.days ? ` (${r.conditions.days} ${t("days")})` : ""} → {r.actions.map(describe).join(" · ")}</div>
            </button>
            <label className="flex items-center gap-1.5 text-xs"><Checkbox checked={r.active} onCheckedChange={() => toggle(r)} aria-label={t("Active")} />{t("Active")}</label>
            <Button size="icon" variant="ghost" aria-label={t("Delete")} onClick={() => remove(r.id)}><Trash2 className="h-4 w-4" /></Button>
          </CardContent></Card>
        ))}
        {!rules.length && <p className="text-sm text-muted-foreground">{t("No rules yet.")}</p>}
      </div>

      <div>
        <h2 className="font-semibold mb-2">{t("Run log")}</h2>
        <div className="rounded-lg border bg-admin-surface divide-y text-sm">
          {runs.map((r) => (
            <div key={r.id} className="flex gap-3 px-3 py-2">
              <span className="text-muted-foreground w-28 shrink-0">{format(new Date(r.created_at), "d MMM HH:mm")}</span>
              <span className="flex-1 truncate">{rules.find((x) => x.id === r.rule_id)?.name ?? "—"}</span>
              <span className="text-xs text-muted-foreground">{trig(r.event)}</span>
              <span className={`text-xs ${r.status === "error" ? "text-destructive" : "text-muted-foreground"}`}>{r.status}</span>
            </div>
          ))}
          {!runs.length && <div className="px-3 py-2 text-muted-foreground">{t("Nothing has run yet.")}</div>}
        </div>
      </div>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{edit?.id ? t("Edit rule") : t("New rule")}</DialogTitle></DialogHeader>
          {edit && (
            <div className="space-y-4">
              <div><Label>{t("Name")}</Label><Input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></div>
              <div><Label>{t("When")}</Label>
                <select className={sel} value={edit.trigger_event} onChange={(e) => setEdit({ ...edit, trigger_event: e.target.value, conditions: e.target.value === "deal_stale" ? { days: 7 } : {} })}>
                  {TRIGGERS.map((x) => <option key={x.key} value={x.key}>{t(x.label)}</option>)}
                </select></div>
              {edit.trigger_event === "deal_stage_changed" && (
                <div><Label>{t("Only when moved to")}</Label>
                  <select className={sel} value={edit.conditions.to_stage ?? ""} onChange={(e) => setEdit({ ...edit, conditions: { ...edit.conditions, to_stage: e.target.value } })}>
                    <option value="">{t("Any stage")}</option>{DEAL_STAGES.map((s) => <option key={s.key} value={s.key}>{t(s.label)}</option>)}
                  </select></div>
              )}
              {edit.trigger_event === "lead_created" && (
                <div><Label>{t("Only from source (optional)")}</Label><Input value={edit.conditions.source ?? ""} onChange={(e) => setEdit({ ...edit, conditions: { ...edit.conditions, source: e.target.value } })} /></div>
              )}
              {edit.trigger_event === "deal_stale" && (
                <div><Label>{t("Days without stage change")}</Label><Input inputMode="numeric" value={edit.conditions.days ?? 7} onChange={(e) => setEdit({ ...edit, conditions: { days: Number(e.target.value.replace(/\D/g, "")) || 1 } })} /></div>
              )}
              <div className="space-y-3">
                <Label>{t("Then")}</Label>
                {edit.actions.map((a, i) => (
                  <div key={i} className="rounded-md border p-3 space-y-2">
                    <div className="flex gap-2">
                      <select className={sel} value={a.type} onChange={(e) => setAction(i, { type: e.target.value })}>
                        {ACTIONS.map((x) => <option key={x.key} value={x.key}>{t(x.label)}</option>)}
                      </select>
                      <Button size="icon" variant="ghost" aria-label={t("Remove")} onClick={() => setEdit({ ...edit, actions: edit.actions.filter((_, j) => j !== i) })}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                    {a.type === "create_task" && <div className="grid grid-cols-3 gap-2">
                      <Input className="col-span-2" placeholder={t("Task title")} value={a.title ?? ""} onChange={(e) => setAction(i, { ...a, title: e.target.value })} />
                      <Input inputMode="numeric" placeholder={t("Due in min")} value={a.due_minutes ?? 60} onChange={(e) => setAction(i, { ...a, due_minutes: Number(e.target.value.replace(/\D/g, "")) || 60 })} />
                    </div>}
                    {(a.type === "create_task" || a.type === "assign") && (
                      <select className={sel} value={a.assignee ?? ""} onChange={(e) => setAction(i, { ...a, assignee: e.target.value })}>
                        <option value="">{a.type === "assign" ? "—" : t("Responsible salesperson")}</option>{users.map((u) => <option key={u.id} value={u.id}>{name(u.id)}</option>)}
                      </select>
                    )}
                    {a.type === "send_email" && <>
                      <select className={sel} value={a.to ?? "client"} onChange={(e) => setAction(i, { ...a, to: e.target.value })}>
                        <option value="client">{t("Client")}</option><option value="owner">{t("Responsible salesperson")}</option>
                      </select>
                      <Input placeholder={t("Subject")} value={a.subject ?? ""} onChange={(e) => setAction(i, { ...a, subject: e.target.value })} />
                      <Textarea rows={4} placeholder={t("Message — use {name}")} value={a.body ?? ""} onChange={(e) => setAction(i, { ...a, body: e.target.value })} />
                    </>}
                    {a.type === "feed_post" && <Input placeholder={t("Text — use {name}")} value={a.text ?? ""} onChange={(e) => setAction(i, { ...a, text: e.target.value })} />}
                    {a.type === "move_deal" && (
                      <select className={sel} value={a.stage ?? ""} onChange={(e) => setAction(i, { ...a, stage: e.target.value })}>
                        <option value="">—</option>{DEAL_STAGES.map((s) => <option key={s.key} value={s.key}>{t(s.label)}</option>)}
                      </select>
                    )}
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={() => setEdit({ ...edit, actions: [...edit.actions, { type: "create_task", title: "", due_minutes: 60 }] })}><Plus className="h-4 w-4 mr-1" />{t("Add action")}</Button>
              </div>
              <div className="flex gap-2"><Button onClick={save}>{t("Save")}</Button><Button variant="outline" onClick={() => setEdit(null)}>{t("Cancel")}</Button></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
