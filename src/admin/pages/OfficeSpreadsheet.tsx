import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Save, FileDown, Upload, Table2 } from "lucide-react";
import { toast } from "sonner";

interface Sheet {
  id: string;
  name: string;
  cells: Record<string, string>;
  rows: number;
  cols: number;
  updated: number;
}

const KEY = "fh_admin_sheets";
const load = (): Sheet[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};
const persist = (s: Sheet[]) => localStorage.setItem(KEY, JSON.stringify(s));

const colLabel = (i: number) => {
  let s = "";
  i++;
  while (i > 0) {
    const m = (i - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    i = Math.floor((i - 1) / 26);
  }
  return s;
};
const colIndex = (label: string) => {
  let n = 0;
  for (const ch of label) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
};

/* ---------- formula engine ---------- */
function evaluate(raw: string, cells: Record<string, string>, seen = new Set<string>()): string {
  if (raw == null) return "";
  if (!raw.startsWith("=")) return raw;
  try {
    let expr = raw.slice(1);

    const rangeVals = (a: string, b: string): number[] => {
      const [c1, r1] = a.match(/([A-Z]+)(\d+)/)!.slice(1);
      const [c2, r2] = b.match(/([A-Z]+)(\d+)/)!.slice(1);
      const ci1 = colIndex(c1), ci2 = colIndex(c2);
      const ri1 = +r1, ri2 = +r2;
      const out: number[] = [];
      for (let c = Math.min(ci1, ci2); c <= Math.max(ci1, ci2); c++)
        for (let r = Math.min(ri1, ri2); r <= Math.max(ri1, ri2); r++)
          out.push(+cellNum(`${colLabel(c)}${r}`));
      return out;
    };
    const cellNum = (ref: string): number => {
      if (seen.has(ref)) return 0;
      const v = cells[ref];
      if (v == null || v === "") return 0;
      const r = v.startsWith("=") ? evaluate(v, cells, new Set([...seen, ref])) : v;
      const n = parseFloat(r);
      return isNaN(n) ? 0 : n;
    };

    // functions
    expr = expr.replace(/(SUM|AVERAGE|AVG|MIN|MAX|COUNT|PRODUCT)\(([^)]+)\)/gi, (_, fn, args) => {
      let nums: number[] = [];
      for (const part of args.split(",")) {
        const p = part.trim();
        const range = p.match(/([A-Z]+\d+):([A-Z]+\d+)/);
        if (range) nums.push(...rangeVals(range[1], range[2]));
        else if (/^[A-Z]+\d+$/.test(p)) nums.push(cellNum(p));
        else nums.push(parseFloat(p) || 0);
      }
      const f = fn.toUpperCase();
      if (f === "SUM") return String(nums.reduce((a, b) => a + b, 0));
      if (f === "PRODUCT") return String(nums.reduce((a, b) => a * b, 1));
      if (f === "AVERAGE" || f === "AVG")
        return String(nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0);
      if (f === "MIN") return String(Math.min(...nums));
      if (f === "MAX") return String(Math.max(...nums));
      if (f === "COUNT") return String(nums.filter((n) => !isNaN(n)).length);
      return "0";
    });

    // single cell refs
    expr = expr.replace(/([A-Z]+\d+)/g, (m) => String(cellNum(m)));

    // only allow safe math chars
    if (!/^[-+*/(). 0-9eE%]*$/.test(expr)) return "#ERR";
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict";return (${expr || 0})`)();
    return typeof result === "number" && !isFinite(result) ? "#DIV/0" : String(result);
  } catch {
    return "#ERR";
  }
}

export default function OfficeSpreadsheet() {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let s = load();
    if (s.length === 0) {
      s = [makeSheet("Sheet 1")];
      persist(s);
    }
    setSheets(s);
    setActiveId(s[0].id);
  }, []);

  const active = sheets.find((s) => s.id === activeId) || null;

  function makeSheet(name: string): Sheet {
    return { id: `s_${Date.now()}`, name, cells: {}, rows: 40, cols: 12, updated: Date.now() };
  }

  const saveSheets = (next: Sheet[]) => {
    setSheets(next);
    persist(next);
  };

  const create = () => {
    const s = makeSheet(`Sheet ${sheets.length + 1}`);
    const next = [...sheets, s];
    saveSheets(next);
    setActiveId(s.id);
  };

  const remove = (id: string) => {
    if (sheets.length <= 1) return;
    const next = sheets.filter((s) => s.id !== id);
    saveSheets(next);
    if (activeId === id) setActiveId(next[0].id);
  };

  const setCell = (ref: string, value: string) => {
    if (!active) return;
    const cells = { ...active.cells };
    if (value === "") delete cells[ref];
    else cells[ref] = value;
    saveSheets(sheets.map((s) => (s.id === active.id ? { ...s, cells, updated: Date.now() } : s)));
  };

  const exportCSV = () => {
    if (!active) return;
    const lines: string[] = [];
    for (let r = 1; r <= active.rows; r++) {
      const row: string[] = [];
      for (let c = 0; c < active.cols; c++) {
        const ref = `${colLabel(c)}${r}`;
        const raw = active.cells[ref] || "";
        const val = raw.startsWith("=") ? evaluate(raw, active.cells) : raw;
        row.push(`"${val.replace(/"/g, '""')}"`);
      }
      lines.push(row.join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${active.name.replace(/[^\w-]+/g, "_")}.csv`;
    a.click();
    toast.success("CSV exported");
  };

  const importCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const rows = text.split(/\r?\n/).map((l) => l.split(","));
      const cells: Record<string, string> = {};
      rows.forEach((row, r) => {
        row.forEach((v, c) => {
          const clean = v.replace(/^"|"$/g, "").replace(/""/g, '"');
          if (clean) cells[`${colLabel(c)}${r + 1}`] = clean;
        });
      });
      const s = makeSheet(file.name.replace(/\.csv$/i, ""));
      s.cells = cells;
      s.rows = Math.max(40, rows.length);
      s.cols = Math.max(12, ...rows.map((r) => r.length));
      const next = [...sheets, s];
      saveSheets(next);
      setActiveId(s.id);
      toast.success("Imported");
    };
    reader.readAsText(file);
  };

  const commit = () => {
    if (editing) setCell(editing, draft);
    setEditing(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Spreadsheets</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Excel-style grid with formulas (=SUM, =AVERAGE, =A1+B2 …) and CSV import/export.
          </p>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && importCSV(e.target.files[0])}
          />
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4 mr-1.5" /> Import CSV
          </Button>
          <Button variant="outline" onClick={exportCSV}>
            <FileDown className="h-4 w-4 mr-1.5" /> Export CSV
          </Button>
        </div>
      </div>

      {active && (
        <Card className="bg-white">
          <CardContent className="p-0">
            <div className="overflow-auto max-h-[65vh]">
              <table className="border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="sticky left-0 top-0 z-20 bg-muted border w-10 h-7" />
                    {Array.from({ length: active.cols }).map((_, c) => (
                      <th
                        key={c}
                        className="sticky top-0 z-10 bg-muted border px-2 h-7 font-medium text-muted-foreground min-w-[90px]"
                      >
                        {colLabel(c)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: active.rows }).map((_, r) => {
                    const row = r + 1;
                    return (
                      <tr key={row}>
                        <td className="sticky left-0 z-10 bg-muted border text-center text-muted-foreground text-xs w-10">
                          {row}
                        </td>
                        {Array.from({ length: active.cols }).map((_, c) => {
                          const ref = `${colLabel(c)}${row}`;
                          const raw = active.cells[ref] || "";
                          const display = raw.startsWith("=") ? evaluate(raw, active.cells) : raw;
                          const isEditing = editing === ref;
                          return (
                            <td key={ref} className="border p-0 min-w-[90px]">
                              {isEditing ? (
                                <input
                                  autoFocus
                                  value={draft}
                                  onChange={(e) => setDraft(e.target.value)}
                                  onBlur={commit}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") commit();
                                    if (e.key === "Escape") setEditing(null);
                                  }}
                                  className="w-full h-7 px-1 outline-none border-2 border-admin-accent"
                                />
                              ) : (
                                <div
                                  onClick={() => {
                                    setEditing(ref);
                                    setDraft(raw);
                                  }}
                                  className="h-7 px-1 leading-7 truncate cursor-cell hover:bg-muted/50"
                                  title={raw}
                                >
                                  {display}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-1 flex-wrap">
        {sheets.map((s) => (
          <div
            key={s.id}
            className={`flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm cursor-pointer group ${
              s.id === activeId ? "bg-admin-accent/15 text-admin-accent border-admin-accent" : "hover:bg-muted"
            }`}
            onClick={() => setActiveId(s.id)}
          >
            <Table2 className="h-3.5 w-3.5" />
            {s.name}
            {sheets.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  remove(s.id);
                }}
                className="opacity-0 group-hover:opacity-100 ml-1"
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </button>
            )}
          </div>
        ))}
        <Button variant="ghost" size="sm" onClick={create}>
          <Plus className="h-4 w-4 mr-1" /> Sheet
        </Button>
      </div>
    </div>
  );
}
