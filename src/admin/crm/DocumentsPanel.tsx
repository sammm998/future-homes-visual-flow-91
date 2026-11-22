import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, Trash2, ExternalLink, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useAdminT } from "@/admin/i18n/AdminI18nContext";

export type Doc = { id: string; path: string; filename: string; mime: string | null; size_bytes: number | null; lead_id: string | null; deal_id: string | null; property_ref: string | null; tags: string[]; created_at: string };
type Scope = { leadId?: string | null; dealId?: string | null; propertyRef?: string | null };

const BUCKET = "crm-documents";
const safe = (n: string) => n.normalize("NFKD").replace(/[^\w.\-]+/g, "_").slice(-120);

export async function openDoc(d: Doc) {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(d.path, 300);
  if (error || !data) return toast.error(error?.message ?? "Error");
  window.open(data.signedUrl, "_blank", "noopener");
}

/** Upload/list documents for one scope (lead, deal or property); with no scope lists everything. */
export default function DocumentsPanel({ scope = {}, compact = false, query = "" }: { scope?: Scope; compact?: boolean; query?: string }) {
  const { t } = useAdminT();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [rename, setRename] = useState<{ id: string; name: string } | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const load = async () => {
    let q = supabase.from("documents").select("*").order("created_at", { ascending: false }).limit(500);
    if (scope.leadId) q = q.eq("lead_id", scope.leadId);
    if (scope.dealId) q = q.eq("deal_id", scope.dealId);
    if (scope.propertyRef) q = q.eq("property_ref", scope.propertyRef);
    const { data } = await q;
    setDocs((data as Doc[]) ?? []);
  };
  useEffect(() => { load(); }, [scope.leadId, scope.dealId, scope.propertyRef]);

  const upload = async (files: FileList | File[]) => {
    setBusy(true);
    const { data: u } = await supabase.auth.getUser();
    const folder = scope.leadId ? `lead/${scope.leadId}` : scope.dealId ? `deal/${scope.dealId}` : scope.propertyRef ? `property/${safe(scope.propertyRef)}` : "general";
    for (const f of Array.from(files)) {
      const path = `${folder}/${crypto.randomUUID()}-${safe(f.name)}`;
      const up = await supabase.storage.from(BUCKET).upload(path, f, { contentType: f.type || undefined, upsert: false });
      if (up.error) { toast.error(`${f.name}: ${up.error.message}`); continue; }
      const ins = await supabase.from("documents").insert({ path, filename: f.name, mime: f.type || null, size_bytes: f.size, lead_id: scope.leadId ?? null, deal_id: scope.dealId ?? null, property_ref: scope.propertyRef ?? null, uploaded_by: u.user?.id ?? null });
      if (ins.error) toast.error(ins.error.message);
    }
    setBusy(false); load();
  };
  const remove = async (d: Doc) => {
    if (!confirm(t("Delete this file?"))) return;
    await supabase.storage.from(BUCKET).remove([d.path]);
    const { error } = await supabase.from("documents").delete().eq("id", d.id);
    if (error) return toast.error(error.message);
    load();
  };
  const saveRename = async () => {
    if (!rename?.name.trim()) return;
    await supabase.from("documents").update({ filename: rename.name.trim() }).eq("id", rename.id);
    setRename(null); load();
  };
  const addTag = async (d: Doc) => {
    const tag = prompt(t("Tag (e.g. contract, passport, floor plan)"))?.trim().toLowerCase();
    if (!tag) return;
    await supabase.from("documents").update({ tags: Array.from(new Set([...d.tags, tag])) }).eq("id", d.id);
    load();
  };
  const removeTag = async (d: Doc, tag: string) => { await supabase.from("documents").update({ tags: d.tags.filter((x) => x !== tag) }).eq("id", d.id); load(); };

  const q = query.trim().toLowerCase();
  const shown = q ? docs.filter((d) => [d.filename, d.property_ref ?? "", ...d.tags].join(" ").toLowerCase().includes(q)) : docs;

  return (
    <div className="space-y-3">
      <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files.length) upload(e.dataTransfer.files); }}
        onClick={() => input.current?.click()}
        className={`cursor-pointer rounded-lg border-2 border-dashed ${compact ? "p-3" : "p-6"} text-center text-sm text-muted-foreground ${drag ? "border-primary bg-primary/5" : ""}`}>
        <Upload className="mx-auto mb-1 h-5 w-5" />{busy ? t("Uploading…") : t("Drop files here or click to upload")}
        <input ref={input} type="file" multiple className="hidden" onChange={(e) => e.target.files && upload(e.target.files)} />
      </div>
      <ul className="divide-y rounded-lg border">
        {shown.length === 0 && <li className="p-3 text-sm text-muted-foreground">{t("No documents yet")}</li>}
        {shown.map((d) => (
          <li key={d.id} className="flex flex-wrap items-center gap-2 p-2 text-sm">
            {rename?.id === d.id ? (
              <Input className="h-8 max-w-xs" autoFocus value={rename.name} onChange={(e) => setRename({ ...rename, name: e.target.value })} onKeyDown={(e) => e.key === "Enter" && saveRename()} onBlur={saveRename} />
            ) : <button className="mr-1 truncate font-medium hover:underline text-left" onClick={() => openDoc(d)}>{d.filename}</button>}
            {d.property_ref && <Badge variant="outline">REF {d.property_ref}</Badge>}
            {d.tags.map((tg) => <Badge key={tg} variant="secondary" className="cursor-pointer" onClick={() => removeTag(d, tg)}>{tg} ×</Badge>)}
            <button className="text-xs text-muted-foreground underline" onClick={() => addTag(d)}>+ tag</button>
            <span className="ml-auto text-xs text-muted-foreground">{d.size_bytes ? `${Math.round(d.size_bytes / 1024)} KB · ` : ""}{d.created_at.slice(0, 10)}</span>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openDoc(d)}><ExternalLink className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setRename({ id: d.id, name: d.filename })}><Pencil className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => remove(d)}><Trash2 className="h-4 w-4" /></Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
