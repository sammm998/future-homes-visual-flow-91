import { useEffect, useState } from "react";
import { Copy, Handshake, Link2, LineChart } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { PublicPageHero } from "@/components/PublicEditorial";
import MemberAuthCard from "@/components/MemberAuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase as cloud } from "@/integrations/supabase/client";
import { useMember } from "@/hooks/useMember";
import heroImage from "@/assets/hero-modern-estate.jpg";

const STATUS: Record<string, string> = { new: "New", viewing: "Viewing", reserved: "Reserved", sold: "Sold", lost: "Closed" };

export default function Partners() {
  const { user, ready } = useMember();
  const [partner, setPartner] = useState<any | undefined>(undefined);

  const load = () => {
    if (!user) return setPartner(null);
    cloud.from("partners").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => setPartner(data ?? null));
  };
  useEffect(load, [user]);

  return (
    <div className="min-h-screen bg-ivory">
      <Navigation />
      <PublicPageHero compact eyebrow="Partner program" title="Refer buyers to Future Homes" description="For agents, relocation companies, business owners and advisers. Your own link, your own portal and a clear record of every introduction." image={heroImage} />
      <main className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-10 grid gap-4 md:grid-cols-3">
          {[
            [Link2, "Your own link", "Clients who arrive through your link are registered to you for 90 days."],
            [LineChart, "Live portal", "Follow every introduction from new enquiry to completed sale."],
            [Handshake, "Agreed commission", "Default 3 % of the sale price, set in writing per partner and paid on completion."],
          ].map(([Icon, t, d]: any) => (
            <div key={t} className="rounded-lg border border-border bg-card p-5">
              <Icon className="h-5 w-5 text-gold-foreground" />
              <p className="mt-3 font-semibold text-foreground">{t}</p>
              <p className="text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>

        {!ready || partner === undefined ? null : !user ? (
          <MemberAuthCard title="Create your partner account" next="/partners" />
        ) : !partner ? (
          <ApplyForm userId={user.id} email={user.email ?? ""} onDone={load} />
        ) : partner.status !== "approved" ? (
          <p className="rounded-lg border border-border bg-card p-6 text-center text-muted-foreground">
            {partner.status === "pending" ? "Thank you – your application is being reviewed. We'll email you when your partner link is active." : "Your application was not approved. Contact info@futurehomesinternational.com for details."}
          </p>
        ) : (
          <Portal partner={partner} />
        )}

        <p className="mt-10 text-xs leading-relaxed text-muted-foreground">
          Commissions are agreed in writing per partner and paid only on completed sales. Partners must follow the real-estate agency, referral and marketing rules in their own country and in the country of the property, including any licensing and disclosure duties to the client.
        </p>
      </main>
    </div>
  );
}

function ApplyForm({ userId, email, onDone }: { userId: string; email: string; onDone: () => void }) {
  const [f, setF] = useState({ company: "", contact_name: "", email, phone: "", partner_type: "agent", country: "", website: "", terms: false });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.terms) return toast.error("Please accept the partner terms.");
    const { terms, ...rest } = f;
    const { error } = await cloud.from("partners").insert({ ...rest, user_id: userId, status: "pending", commission_pct: 3, terms_accepted_at: new Date().toISOString() });
    if (error) toast.error("Could not send the application.");
    else { toast.success("Application sent"); onDone(); }
  };
  const sel = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground";
  return (
    <form onSubmit={submit} className="mx-auto grid max-w-2xl gap-3 rounded-lg border border-border bg-card p-6 sm:grid-cols-2">
      <h2 className="text-2xl font-semibold text-foreground sm:col-span-2">Apply to become a partner</h2>
      <Input required placeholder="Company" value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} />
      <Input required placeholder="Contact name" value={f.contact_name} onChange={(e) => setF({ ...f, contact_name: e.target.value })} />
      <Input required type="email" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <Input placeholder="Phone" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
      <select className={sel} value={f.partner_type} onChange={(e) => setF({ ...f, partner_type: e.target.value })}>
        <option value="agent">Real-estate agent</option><option value="relocation">Relocation company</option><option value="business">Business owner</option><option value="advisor">Adviser / consultant</option>
      </select>
      <Input placeholder="Country" value={f.country} onChange={(e) => setF({ ...f, country: e.target.value })} />
      <Input className="sm:col-span-2" placeholder="Website" value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} />
      <label className="flex items-start gap-2 text-sm sm:col-span-2"><input type="checkbox" className="mt-1" checked={f.terms} onChange={(e) => setF({ ...f, terms: e.target.checked })} /> I accept that commission is agreed in writing, paid only on completed sales, and that I follow local agency and marketing rules.</label>
      <Button type="submit" className="bg-navy text-navy-foreground hover:bg-navy/90 sm:col-span-2">Send application</Button>
    </form>
  );
}

function Portal({ partner }: { partner: any }) {
  const [rows, setRows] = useState<any[]>([]);
  const [c, setC] = useState({ client_name: "", client_email: "", client_phone: "", notes: "" });
  const link = typeof window !== "undefined" ? `${window.location.origin}/?partner=${partner.ref_code}` : "";
  const load = () => cloud.from("partner_referrals").select("*").eq("partner_id", partner.id).order("created_at", { ascending: false }).then(({ data }) => setRows(data ?? []));
  useEffect(() => { load(); }, []);

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await cloud.from("partner_referrals").insert({ ...c, partner_id: partner.id, source: "partner-portal", status: "new", agreed_commission_pct: partner.commission_pct });
    if (error) toast.error("Could not register the client.");
    else { toast.success("Client registered"); setC({ client_name: "", client_email: "", client_phone: "", notes: "" }); load(); }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-navy p-5 text-navy-foreground">
        <p className="text-xs font-semibold uppercase text-gold">Your partner link · {partner.commission_pct} % agreed commission</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <code className="min-w-0 break-all text-sm">{link}</code>
          <Button size="sm" className="bg-gold text-gold-foreground hover:bg-gold/90" onClick={() => { navigator.clipboard.writeText(link); toast.success("Link copied"); }}><Copy className="h-4 w-4" />Copy</Button>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[22rem_1fr] [&>*]:min-w-0">
        <form onSubmit={register} className="space-y-3 rounded-lg border border-border bg-card p-5">
          <p className="font-semibold text-foreground">Register a client introduction</p>
          <Input required placeholder="Client name" value={c.client_name} onChange={(e) => setC({ ...c, client_name: e.target.value })} />
          <Input type="email" placeholder="Client email" value={c.client_email} onChange={(e) => setC({ ...c, client_email: e.target.value })} />
          <Input placeholder="Client phone" value={c.client_phone} onChange={(e) => setC({ ...c, client_phone: e.target.value })} />
          <Input placeholder="What are they looking for?" value={c.notes} onChange={(e) => setC({ ...c, notes: e.target.value })} />
          <Button type="submit" className="w-full bg-navy text-navy-foreground hover:bg-navy/90">Register client</Button>
        </form>
        <div className="overflow-x-auto rounded-lg border border-border bg-card p-5">
          <p className="mb-3 font-semibold text-foreground">Your introductions ({rows.length})</p>
          <table className="w-full min-w-[32rem] text-sm">
            <thead><tr className="text-left text-xs uppercase text-muted-foreground"><th className="py-2">Date</th><th>Client</th><th>Source</th><th>Status</th><th>Commission</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="py-2">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td>{r.client_name || r.client_email || "–"}</td>
                  <td>{r.source}</td>
                  <td>{STATUS[r.status] ?? r.status}</td>
                  <td>{r.agreed_commission_pct ?? partner.commission_pct} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
