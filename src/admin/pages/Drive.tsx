import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Folder, FolderPlus, Upload, Download, Link2, Trash2, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { shareExpiry } from "@/admin/workspace/meeting";

type F = { id: string; name: string; parent_id: string | null };
type File_ = { id: string; filename: string; path: string; size_bytes: number | null; created_at: string; folder_id: string | null };

export default function Drive() {
  const [folders, setFolders] = useState<F[]>([]);
  const [files, setFiles] = useState<File_[]>([]);
  const [cwd, setCwd] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [days, setDays] = useState(7);
  const input = useRef<HTMLInputElement>(null);
  const load = useCallback(async () => {
    const [f, x] = await Promise.all([supabase.from("drive_folders").select("id,name,parent_id").order("name"), supabase.from("drive_files").select("*").order("created_at", { ascending: false })]);
    setFolders((f.data ?? []) as F[]); setFiles((x.data ?? []) as File_[]);
  }, []);
  useEffect(() => { void load(); }, [load]);
  const here = folders.filter((f) => f.parent_id === cwd);
  const hereFiles = files.filter((f) => f.folder_id === cwd);
  const crumbs: F[] = []; for (let c = folders.find((f) => f.id === cwd); c; c = folders.find((f) => f.id === c!.parent_id)) crumbs.unshift(c);
  const addFolder = async () => { if (!name.trim()) return; const r = await supabase.from("drive_folders").insert({ name, parent_id: cwd }); if (r.error) return toast.error(r.error.message); setName(""); void load(); };
  const upload = async (list: File[]) => {
    if (!list.length) return;
    const { data: u } = await supabase.auth.getUser();
    for (const file of list) {
      const path = `${cwd ?? "root"}/${crypto.randomUUID()}-${file.name.replace(/[^\w.-]+/g, "_")}`;
      const up = await supabase.storage.from("crm-drive").upload(path, file, { upsert: false, contentType: file.type || undefined });
      if (up.error) { toast.error(up.error.message); continue; }
      const ins = await supabase.from("drive_files").insert({ folder_id: cwd, path, filename: file.name, mime: file.type, size_bytes: file.size, uploaded_by: u.user?.id });
      if (ins.error) { toast.error(ins.error.message); continue; }
    }
    toast.success("Uploaded"); void load();
  };
  const download = async (f: File_) => { const { data, error } = await supabase.storage.from("crm-drive").createSignedUrl(f.path, 120, { download: f.filename }); if (error) return toast.error(error.message); window.open(data.signedUrl, "_blank", "noopener"); };
  const share = async (f: File_) => {
    const r = await supabase.from("share_links").insert({ file_id: f.id, expires_at: shareExpiry(days) }).select("token").single();
    if (r.error) return toast.error(r.error.message);
    const url = `${window.location.origin}/api/public/share/${r.data.token}`;
    void navigator.clipboard?.writeText(url).catch(() => {});
    toast.success(`Share link copied (valid ${days} days)`, { description: url });
  };
  const del = async (f: File_) => { await supabase.storage.from("crm-drive").remove([f.path]); const r = await supabase.from("drive_files").delete().eq("id", f.id); if (r.error) return toast.error(r.error.message); void load(); };
  const delFolder = async (f: F) => { if (files.some((x) => x.folder_id === f.id) || folders.some((x) => x.parent_id === f.id)) return toast.error("Folder is not empty"); await supabase.from("drive_folders").delete().eq("id", f.id); void load(); };
  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-semibold">Drive</h1><p className="text-sm text-muted-foreground">Shared company files. Share a file outside the team with a link that expires.</p></div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button className="underline" onClick={() => setCwd(null)}>Drive</button>{crumbs.map((c) => <span key={c.id}> / <button className="underline" onClick={() => setCwd(c.id)}>{c.name}</button></span>)}
      </div>
      <Card><CardContent className="flex flex-wrap items-center gap-2 p-4">
        {cwd && <Button variant="ghost" size="sm" onClick={() => setCwd(folders.find((f) => f.id === cwd)?.parent_id ?? null)} className="gap-1"><ChevronLeft className="h-4 w-4" />Up</Button>}
        <Input className="max-w-xs" aria-label="Folder name" placeholder="New folder" value={name} onChange={(e) => setName(e.target.value)} />
        <Button variant="outline" className="gap-2" onClick={addFolder}><FolderPlus className="h-4 w-4" />Create folder</Button>
        <input ref={input} type="file" multiple hidden aria-label="Upload files" onChange={(e) => { const picked = Array.from(e.target.files ?? []); e.target.value = ""; void upload(picked); }} />
        <Button className="gap-2" onClick={() => input.current?.click()}><Upload className="h-4 w-4" />Upload</Button>
        <label className="ml-auto flex items-center gap-2 text-sm">Share links valid <Input type="number" min={1} max={90} className="w-20" aria-label="Share days" value={days} onChange={(e) => setDays(Number(e.target.value) || 7)} /> days</label>
      </CardContent></Card>
      <div className="divide-y rounded-md border">
        {here.map((f) => <div key={f.id} className="flex items-center gap-3 p-3"><Folder className="h-4 w-4 text-muted-foreground" /><button className="flex-1 text-left font-medium" onClick={() => setCwd(f.id)}>{f.name}</button><Button size="icon" variant="ghost" aria-label={`Delete folder ${f.name}`} onClick={() => delFolder(f)}><Trash2 className="h-4 w-4" /></Button></div>)}
        {hereFiles.map((f) => <div key={f.id} className="flex items-center gap-3 p-3 text-sm"><span className="flex-1 truncate">{f.filename}</span><span className="text-xs text-muted-foreground">{f.size_bytes ? `${Math.ceil(f.size_bytes / 1024)} KB` : ""}</span>
          <Button size="icon" variant="ghost" aria-label={`Download ${f.filename}`} onClick={() => download(f)}><Download className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost" aria-label={`Share ${f.filename}`} onClick={() => share(f)}><Link2 className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost" aria-label={`Delete ${f.filename}`} onClick={() => del(f)}><Trash2 className="h-4 w-4" /></Button></div>)}
        {!here.length && !hereFiles.length && <p className="p-6 text-center text-sm text-muted-foreground">This folder is empty.</p>}
      </div>
    </div>
  );
}
