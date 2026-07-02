import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Undo,
  Redo,
  Save,
  FileDown,
  Plus,
  Trash2,
  FileText,
  Image as ImageIcon,
  Link2,
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "@/assets/future-homes-logo.png";

interface Doc {
  id: string;
  name: string;
  html: string;
  updated: number;
}

const KEY = "fh_admin_documents";
const load = (): Doc[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};
const persist = (docs: Doc[]) => localStorage.setItem(KEY, JSON.stringify(docs));

export default function OfficeDocuments() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = load();
    setDocs(d);
    if (d[0]) openDoc(d[0]);
  }, []);

  const active = docs.find((d) => d.id === activeId) || null;

  const openDoc = (d: Doc) => {
    setActiveId(d.id);
    setName(d.name);
    setTimeout(() => {
      if (editorRef.current) editorRef.current.innerHTML = d.html || "";
    }, 0);
  };

  const create = () => {
    const d: Doc = {
      id: `d_${Date.now()}`,
      name: "Untitled document",
      html: "<h1>New document</h1><p>Start writing…</p>",
      updated: Date.now(),
    };
    const next = [d, ...docs];
    setDocs(next);
    persist(next);
    openDoc(d);
  };

  const save = () => {
    if (!active) return;
    const html = editorRef.current?.innerHTML || "";
    const next = docs.map((d) =>
      d.id === active.id ? { ...d, name, html, updated: Date.now() } : d
    );
    setDocs(next);
    persist(next);
    toast.success("Saved");
  };

  const remove = (id: string) => {
    if (!confirm("Delete document?")) return;
    const next = docs.filter((d) => d.id !== id);
    setDocs(next);
    persist(next);
    if (activeId === id) {
      setActiveId(null);
      if (editorRef.current) editorRef.current.innerHTML = "";
    }
  };

  const cmd = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertImage = () => {
    const url = prompt("Image URL:");
    if (url) cmd("insertImage", url);
  };
  const insertLink = () => {
    const url = prompt("Link URL:");
    if (url) cmd("createLink", url);
  };

  const exportDoc = () => {
    const html = editorRef.current?.innerHTML || "";
    const full = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>${name}</title></head><body>${html}</body></html>`;
    const blob = new Blob([full], { type: "application/msword" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${name.replace(/[^\w-]+/g, "_")}.doc`;
    a.click();
  };

  const exportPDF = async () => {
    if (!editorRef.current) return;
    const canvas = await html2canvas(editorRef.current, { scale: 2, backgroundColor: "#fff" });
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const w = pdf.internal.pageSize.getWidth() - 60;
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.9), "JPEG", 30, 30, w, h);
    pdf.save(`${name.replace(/[^\w-]+/g, "_")}.pdf`);
  };

  const Tool = ({ icon: Icon, onClick, title }: any) => (
    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClick} title={title}>
      <Icon className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
          <p className="text-muted-foreground text-sm mt-1">Word-style editor with PDF & .doc export.</p>
        </div>
        <Button onClick={create}>
          <Plus className="h-4 w-4 mr-1.5" /> New document
        </Button>
      </div>

      <div className="grid grid-cols-[220px_1fr] gap-4 max-lg:grid-cols-1">
        <div className="space-y-1">
          {docs.map((d) => (
            <div
              key={d.id}
              onClick={() => openDoc(d)}
              className={`flex items-center gap-2 p-2 rounded-md cursor-pointer group ${
                d.id === activeId ? "bg-admin-accent/15 text-admin-accent" : "hover:bg-muted"
              }`}
            >
              <FileText className="h-4 w-4 shrink-0" />
              <span className="text-sm truncate flex-1">{d.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  remove(d.id);
                }}
                className="opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </button>
            </div>
          ))}
          {docs.length === 0 && (
            <div className="text-xs text-muted-foreground p-2">No documents yet.</div>
          )}
        </div>

        {active ? (
          <Card className="bg-white">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 p-2 border-b flex-wrap">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="max-w-[220px] h-8"
                />
                <div className="flex items-center gap-0.5 ml-2">
                  <select
                    className="h-8 rounded border bg-background text-xs px-1"
                    onChange={(e) => cmd("formatBlock", e.target.value)}
                    defaultValue="p"
                  >
                    <option value="p">Normal</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                  </select>
                  <Tool icon={Bold} onClick={() => cmd("bold")} title="Bold" />
                  <Tool icon={Italic} onClick={() => cmd("italic")} title="Italic" />
                  <Tool icon={Underline} onClick={() => cmd("underline")} title="Underline" />
                  <Tool icon={List} onClick={() => cmd("insertUnorderedList")} title="Bullet list" />
                  <Tool icon={ListOrdered} onClick={() => cmd("insertOrderedList")} title="Numbered" />
                  <Tool icon={AlignLeft} onClick={() => cmd("justifyLeft")} title="Left" />
                  <Tool icon={AlignCenter} onClick={() => cmd("justifyCenter")} title="Center" />
                  <Tool icon={AlignRight} onClick={() => cmd("justifyRight")} title="Right" />
                  <Tool icon={ImageIcon} onClick={insertImage} title="Image" />
                  <Tool icon={Link2} onClick={insertLink} title="Link" />
                  <Tool icon={Undo} onClick={() => cmd("undo")} title="Undo" />
                  <Tool icon={Redo} onClick={() => cmd("redo")} title="Redo" />
                </div>
                <div className="ml-auto flex gap-2">
                  <Button variant="outline" size="sm" onClick={save}>
                    <Save className="h-4 w-4 mr-1.5" /> Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportDoc}>
                    .doc
                  </Button>
                  <Button size="sm" onClick={exportPDF}>
                    <FileDown className="h-4 w-4 mr-1.5" /> PDF
                  </Button>
                </div>
              </div>
              <div className="p-6 bg-muted/30 flex justify-center overflow-auto">
                <div
                  className="bg-white shadow-md"
                  style={{ width: 794, minHeight: 1000, padding: "72px 64px" }}
                >
                  <img src={logo} alt="" className="h-8 mb-6 object-contain" />
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    className="prose max-w-none outline-none min-h-[700px] fh-doc"
                    onBlur={save}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-admin-surface">
            <CardContent className="p-10 text-center text-muted-foreground">
              Select or create a document.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
