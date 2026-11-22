import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

export type Unit = { type: string; price: string; size?: string };
export const parsePrice = (p: string | null | undefined) => Number(String(p ?? "").replace(/[^\d.]/g, "")) || 0;
type Prop = { ref_no: string | null; title: string; location: string; price: string; apartment_types: Unit[] | null };

/** Search the catalogue by REF/title and pick a unit type; calls onPick with REF, type and numeric price. */
export function PropertyPicker({ onPick }: { onPick: (p: { ref: string; unit: string; price: number; title: string }) => void }) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Prop[]>([]);
  const [sel, setSel] = useState<Prop | null>(null);
  useEffect(() => {
    if (q.trim().length < 2) { setHits([]); return; }
    const t = setTimeout(async () => {
      const s = q.trim().replace(/[%,()]/g, "");
      const { data } = await supabase.from("properties").select("ref_no,title,location,price,apartment_types").eq("is_active", true).or(`ref_no.ilike.${s}%,title.ilike.%${s}%,location.ilike.%${s}%`).limit(8);
      setHits((data ?? []) as any);
    }, 250);
    return () => clearTimeout(t);
  }, [q]);
  const units: Unit[] = sel ? (sel.apartment_types?.length ? sel.apartment_types : [{ type: "Standard", price: sel.price }]) : [];
  return (
    <div className="space-y-2 rounded-md border p-2">
      <Input aria-label="Find property" placeholder="Pick from catalogue: REF, title or area…" value={q} onChange={(e) => { setQ(e.target.value); setSel(null); }} />
      {!sel && hits.map((h) => <button type="button" key={h.ref_no ?? h.title} onClick={() => setSel(h)} className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-muted">REF {h.ref_no} · {h.title} · {h.location}</button>)}
      {sel && <div className="flex flex-wrap gap-2">{units.map((u) => <button type="button" key={u.type} aria-label={`Unit ${u.type}`} onClick={() => { onPick({ ref: sel.ref_no ?? "", unit: u.type.trim(), price: parsePrice(u.price), title: sel.title }); setQ(""); setSel(null); setHits([]); }} className="rounded-full border px-3 py-1 text-sm hover:bg-muted">{u.type.trim()} · €{u.price}{u.size ? ` · ${u.size} m²` : ""}</button>)}</div>}
    </div>
  );
}
