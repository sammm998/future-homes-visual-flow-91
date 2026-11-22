import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { addDays, addMonths, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { EVENT_KINDS } from "@/admin/workspace/model";
import { useAdminUsers } from "@/admin/workspace/useAdminUsers";
import { useAdminT } from "@/admin/i18n/AdminI18nContext";

type Ev = {
  id: string; title: string; kind: string; starts_at: string; ends_at: string | null; owner_id: string | null;
  lead_id: string | null; deal_id: string | null; property_ref: string | null; location: string | null; notes: string | null;
  client_email: string | null; notify_client: boolean; remind_minutes: number;
};
type View = "month" | "week" | "day";
const toLocal = (iso: string) => format(new Date(iso), "yyyy-MM-dd'T'HH:mm");
const blank = () => ({ title: "", kind: "viewing", starts_at: format(new Date(), "yyyy-MM-dd'T'10:00"), ends_at: "", owner_id: "", lead_id: "", deal_id: "",
  property_ref: "", location: "", notes: "", client_email: "", notify_client: false, remind_minutes: 60 });

export default function TeamCalendar() {
  const { t } = useAdminT();
  const { users, me, name } = useAdminUsers();
  const [view, setView] = useState<View>("month");
  const [cursor, setCursor] = useState(new Date());
  const [events, setEvents] = useState<Ev[]>([]);
  const [owner, setOwner] = useState("");
  const [form, setForm] = useState<ReturnType<typeof blank> | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [deals, setDeals] = useState<{ id: string; title: string }[]>([]);

  const range = useMemo(() => {
    if (view === "day") return [startOfDay(cursor), addDays(startOfDay(cursor), 1)] as const;
    if (view === "week") return [startOfWeek(cursor, { weekStartsOn: 1 }), addDays(endOfWeek(cursor, { weekStartsOn: 1 }), 1)] as const;
    return [startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 }), addDays(endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 }), 1)] as const;
  }, [view, cursor]);

  const load = async () => {
    const { data, error } = await supabase.from("calendar_events").select("*").gte("starts_at", range[0].toISOString()).lt("starts_at", range[1].toISOString()).order("starts_at");
    if (error) toast.error(error.message);
    setEvents((data as Ev[]) ?? []);
  };
  useEffect(() => { load(); }, [range[0].getTime()]);
  useEffect(() => { supabase.from("deals").select("id,title").order("created_at", { ascending: false }).limit(200).then(({ data }) => setDeals(data ?? [])); }, []);

  const shown = events.filter((e) => !owner || e.owner_id === owner);
  const days: Date[] = [];
  for (let d = range[0]; d < range[1]; d = addDays(d, 1)) days.push(d);
  const step = (n: number) => setCursor((c) => (view === "month" ? addMonths(c, n) : addDays(c, n * (view === "week" ? 7 : 1))));
  const kindCls = (k: string) => EVENT_KINDS.find((x) => x.key === k)?.cls ?? "bg-muted";

  const open = (e: Ev | null, day?: Date) => {
    setEditId(e?.id ?? null);
    setForm(e ? { title: e.title, kind: e.kind, starts_at: toLocal(e.starts_at), ends_at: e.ends_at ? toLocal(e.ends_at) : "", owner_id: e.owner_id ?? "",
      lead_id: e.lead_id ?? "", deal_id: e.deal_id ?? "", property_ref: e.property_ref ?? "", location: e.location ?? "", notes: e.notes ?? "",
      client_email: e.client_email ?? "", notify_client: e.notify_client, remind_minutes: e.remind_minutes }
      : { ...blank(), owner_id: me ?? "", ...(day ? { starts_at: format(day, "yyyy-MM-dd'T'10:00") } : {}) });
  };
  const save = async () => {
    if (!form || !form.title.trim() || !form.starts_at) return toast.error(t("Title and start are required"));
    const row = {
      title: form.title.trim(), kind: form.kind, starts_at: new Date(form.starts_at).toISOString(),
      ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null, owner_id: form.owner_id || null,
      lead_id: form.lead_id || null, deal_id: form.deal_id || null, property_ref: form.property_ref || null,
      location: form.location || null, notes: form.notes || null, client_email: form.client_email || null,
      notify_client: form.notify_client, remind_minutes: Number(form.remind_minutes) || 60,
    };
    const { error } = editId
      ? await supabase.from("calendar_events").update({ ...row, reminder_sent_at: null }).eq("id", editId)
      : await supabase.from("calendar_events").insert({ ...row, created_by: me });
    if (error) return toast.error(error.message);
    toast.success(t("Saved")); setForm(null); load();
  };
  const remove = async () => {
    if (!editId || !confirm(t("Delete?"))) return;
    await supabase.from("calendar_events").delete().eq("id", editId);
    setForm(null); load();
  };

  const evChip = (e: Ev) => (
    <button key={e.id} onClick={(x) => { x.stopPropagation(); open(e); }} className={`block w-full truncate rounded px-1.5 py-0.5 text-left text-[11px] ${kindCls(e.kind)}`}>
      {format(new Date(e.starts_at), "HH:mm")} {e.title}{view !== "month" ? ` · ${name(e.owner_id)}` : ""}
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("Calendar")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("Viewings, meetings and calls for the whole team.")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select aria-label={t("Salesperson")} className="h-9 rounded-md border bg-background px-2 text-sm" value={owner} onChange={(e) => setOwner(e.target.value)}>
            <option value="">{t("All salespeople")}</option>{users.map((u) => <option key={u.id} value={u.id}>{name(u.id)}</option>)}
          </select>
          <div className="flex rounded-md border">
            {(["month", "week", "day"] as View[]).map((v) => (
              <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 text-sm capitalize ${view === v ? "bg-primary text-primary-foreground" : ""}`}>{t(v === "month" ? "Month" : v === "week" ? "Week" : "Day")}</button>
            ))}
          </div>
          <Button onClick={() => open(null)}><Plus className="h-4 w-4 mr-2" />{t("New event")}</Button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="icon" variant="outline" aria-label={t("Previous")} onClick={() => step(-1)}><ChevronLeft className="h-4 w-4" /></Button>
        <Button variant="outline" onClick={() => setCursor(new Date())}>{t("Today")}</Button>
        <Button size="icon" variant="outline" aria-label={t("Next")} onClick={() => step(1)}><ChevronRight className="h-4 w-4" /></Button>
        <div className="ml-2 font-semibold">{view === "day" ? format(cursor, "EEEE d MMMM yyyy") : format(cursor, "MMMM yyyy")}</div>
        <div className="ml-auto hidden gap-2 sm:flex">{EVENT_KINDS.map((k) => <span key={k.key} className={`rounded px-2 py-0.5 text-xs ${k.cls}`}>{t(k.label)}</span>)}</div>
      </div>

      {view === "month" ? (
        <div className="grid grid-cols-7 overflow-hidden rounded-lg border bg-admin-surface text-sm">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d} className="border-b p-2 text-xs font-semibold text-muted-foreground">{t(d)}</div>)}
          {days.map((d) => (
            <div key={d.toISOString()} onClick={() => open(null, d)} className={`min-h-24 cursor-pointer border-b border-r p-1 space-y-0.5 ${isSameMonth(d, cursor) ? "" : "opacity-40"}`}>
              <div className={`text-xs ${isSameDay(d, new Date()) ? "font-bold text-primary" : ""}`}>{format(d, "d")}</div>
              {shown.filter((e) => isSameDay(new Date(e.starts_at), d)).map(evChip)}
            </div>
          ))}
        </div>
      ) : (
        <div className={`grid gap-2 ${view === "week" ? "grid-cols-1 md:grid-cols-7" : "grid-cols-1"}`}>
          {days.map((d) => (
            <div key={d.toISOString()} onClick={() => open(null, d)} className="min-h-40 cursor-pointer rounded-lg border bg-admin-surface p-2 space-y-1">
              <div className={`text-xs font-semibold ${isSameDay(d, new Date()) ? "text-primary" : "text-muted-foreground"}`}>{format(d, "EEE d MMM")}</div>
              {shown.filter((e) => isSameDay(new Date(e.starts_at), d)).map(evChip)}
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!form} onOpenChange={(o) => !o && setForm(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? t("Edit event") : t("New event")}</DialogTitle></DialogHeader>
          {form && (
            <div className="space-y-3">
              <div><Label>{t("Title")}</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>{t("Type")}</Label>
                  <select className="h-9 w-full rounded-md border bg-background px-2 text-sm" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
                    {EVENT_KINDS.map((k) => <option key={k.key} value={k.key}>{t(k.label)}</option>)}
                  </select></div>
                <div><Label>{t("Salesperson")}</Label>
                  <select className="h-9 w-full rounded-md border bg-background px-2 text-sm" value={form.owner_id} onChange={(e) => setForm({ ...form, owner_id: e.target.value })}>
                    <option value="">—</option>{users.map((u) => <option key={u.id} value={u.id}>{name(u.id)}</option>)}
                  </select></div>
                <div><Label>{t("Start")}</Label><Input type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} /></div>
                <div><Label>{t("End")}</Label><Input type="datetime-local" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} /></div>
                <div><Label>{t("Property REF")}</Label><Input value={form.property_ref} onChange={(e) => setForm({ ...form, property_ref: e.target.value })} /></div>
                <div><Label>{t("Location")}</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
              </div>
              <div><Label>{t("Deal")}</Label>
                <select className="h-9 w-full rounded-md border bg-background px-2 text-sm" value={form.deal_id} onChange={(e) => setForm({ ...form, deal_id: e.target.value })}>
                  <option value="">—</option>{deals.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
                </select></div>
              <div><Label>{t("Notes")}</Label><Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>{t("Reminder (minutes before)")}</Label><Input inputMode="numeric" value={form.remind_minutes} onChange={(e) => setForm({ ...form, remind_minutes: Number(e.target.value.replace(/\D/g, "")) || 0 })} /></div>
                <div><Label>{t("Client email")}</Label><Input type="email" value={form.client_email} onChange={(e) => setForm({ ...form, client_email: e.target.value })} /></div>
              </div>
              <label className="flex items-center gap-2 text-sm"><Checkbox checked={form.notify_client} onCheckedChange={(v) => setForm({ ...form, notify_client: !!v })} />{t("Also remind the client")}</label>
              <div className="flex gap-2">
                <Button onClick={save}>{t("Save")}</Button>
                <Button variant="outline" onClick={() => setForm(null)}>{t("Cancel")}</Button>
                {editId && <Button variant="ghost" className="ml-auto text-destructive" aria-label={t("Delete")} onClick={remove}><Trash2 className="h-4 w-4" /></Button>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
