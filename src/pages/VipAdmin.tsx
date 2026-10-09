import { useEffect, useState } from "react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase as cloud } from "@/integrations/supabase/client";
import { useMember } from "@/hooks/useMember";
import MemberAuthCard from "@/components/MemberAuthCard";

export default function VipAdmin() {
  const { user, ready, isAdmin } = useMember();
  const [data, setData] = useState<any>({ members: [], favorites: [], searches: [], partners: [], referrals: [], early: [] });

  const load = async () => {
    const [members, favorites, searches, partners, referrals, early] = await Promise.all([
      cloud.from("vip_profiles").select("*").order("created_at", { ascending: false }),
      cloud.from("favorites").select("*"),
      cloud.from("saved_searches").select("*"),
      cloud.from("partners").select("*").order("created_at", { ascending: false }),
      cloud.from("partner_referrals").select("*").order("created_at", { ascending: false }),
      cloud.from("early_access_projects").select("*").order("created_at", { ascending: false }),
    ]);
    setData({ members: members.data ?? [], favorites: favorites.data ?? [], searches: searches.data ?? [], partners: partners.data ?? [], referrals: referrals.data ?? [], early: early.data ?? [] });
  };
  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  if (!ready) return null;
  if (!user) return <Shell><MemberAuthCard title="Admin sign in" next="/vip/admin" /></Shell>;
  if (!isAdmin) return <Shell><p className="text-center text-muted-foreground">This account has no admin access.</p></Shell>;

  const updPartner = async (id: string, patch: any) => { const { error } = await cloud.from("partners").update(patch).eq("id", id); error ? toast.error(error.message) : load(); };
  const updRef = async (id: string, status: string) => { const { error } = await cloud.from("partner_referrals").update({ status }).eq("id", id); error ? toast.error(error.message) : load(); };
  const partnerName = (id: string) => data.partners.find((p: any) => p.id === id)?.company ?? "–";

  return (
    <Shell>
      <Section title={`VIP members (${data.members.length})`}>
        <Table head={["Joined", "Name", "Email", "Phone", "WhatsApp", "Favourites", "Alerts"]} rows={data.members.map((m: any) => [
          new Date(m.created_at).toLocaleDateString(), m.full_name, m.email, m.phone, m.whatsapp_consent ? "Yes" : "No",
          data.favorites.filter((f: any) => f.user_id === m.user_id).map((f: any) => f.ref_no).join(", "),
          data.searches.filter((s: any) => s.user_id === m.user_id).map((s: any) => s.name).join(", "),
        ])} />
      </Section>
      <Section title={`Partners (${data.partners.length})`}>
        <Table head={["Company", "Contact", "Type", "Status", "Commission %", "Code", ""]} rows={data.partners.map((p: any) => [
          p.company, `${p.contact_name} · ${p.email}`, p.partner_type, p.status,
          <Input key="c" type="number" step="0.1" defaultValue={p.commission_pct} className="h-8 w-20" onBlur={(e) => Number(e.target.value) !== Number(p.commission_pct) && updPartner(p.id, { commission_pct: Number(e.target.value) })} />,
          p.ref_code,
          <div key="a" className="flex gap-1">{p.status !== "approved" ? <Button size="sm" onClick={() => updPartner(p.id, { status: "approved" })}>Approve</Button> : null}{p.status !== "rejected" ? <Button size="sm" variant="outline" onClick={() => updPartner(p.id, { status: "rejected" })}>Reject</Button> : null}</div>,
        ])} />
      </Section>
      <Section title={`Partner introductions (${data.referrals.length})`}>
        <Table head={["Date", "Partner", "Client", "Source", "Status"]} rows={data.referrals.map((r: any) => [
          new Date(r.created_at).toLocaleDateString(), partnerName(r.partner_id), [r.client_name, r.client_email, r.client_phone].filter(Boolean).join(" · "), r.source,
          <select key="s" className="h-8 rounded border border-input bg-background px-2" value={r.status} onChange={(e) => updRef(r.id, e.target.value)}>{["new", "viewing", "reserved", "sold", "lost"].map((s) => <option key={s}>{s}</option>)}</select>,
        ])} />
      </Section>
      <EarlyAccessAdmin rows={data.early} onChange={load} />
    </Shell>
  );
}

function EarlyAccessAdmin({ rows, onChange }: { rows: any[]; onChange: () => void }) {
  const [f, setF] = useState({ title: "", location: "", price_from: "", image_url: "", description: "" });
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await cloud.from("early_access_projects").insert(f);
    if (error) toast.error(error.message); else { setF({ title: "", location: "", price_from: "", image_url: "", description: "" }); onChange(); }
  };
  return (
    <Section title="VIP early-access projects">
      <form onSubmit={add} className="mb-4 grid gap-2 sm:grid-cols-5">
        <Input required placeholder="Title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
        <Input placeholder="Location" value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} />
        <Input placeholder="Price from" value={f.price_from} onChange={(e) => setF({ ...f, price_from: e.target.value })} />
        <Input placeholder="Image URL" value={f.image_url} onChange={(e) => setF({ ...f, image_url: e.target.value })} />
        <Button type="submit">Add</Button>
        <Input className="sm:col-span-5" placeholder="Description" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
      </form>
      <Table head={["Title", "Location", "Price", "Visible", ""]} rows={rows.map((p) => [
        p.title, p.location, p.price_from, p.active ? "Yes" : "No",
        <Button key="t" size="sm" variant="outline" onClick={async () => { await cloud.from("early_access_projects").update({ active: !p.active }).eq("id", p.id); onChange(); }}>{p.active ? "Hide" : "Show"}</Button>,
      ])} />
    </Section>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-ivory"><Navigation /><main className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6"><h1 className="text-3xl font-semibold text-foreground">VIP Club & partners</h1>{children}</main></div>;
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-lg border border-border bg-card p-5"><h2 className="mb-3 text-lg font-semibold text-foreground">{title}</h2>{children}</section>;
}
function Table({ head, rows }: { head: string[]; rows: any[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] text-sm">
        <thead><tr className="text-left text-xs uppercase text-muted-foreground">{head.map((h) => <th key={h} className="py-2 pr-3">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i} className="border-t border-border">{r.map((c, j) => <td key={j} className="py-2 pr-3 align-top">{c ?? "–"}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
