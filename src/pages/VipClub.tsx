import { useEffect, useState } from "react";
import { Bell, Heart, Lock, Settings, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { PublicPageHero } from "@/components/PublicEditorial";
import MemberAuthCard from "@/components/MemberAuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase as cloud } from "@/integrations/supabase/client";
import { useMember } from "@/hooks/useMember";
import { Link } from "@/lib/router-compat";
import heroImage from "@/assets/hero-modern-estate.jpg";
import { cn } from "@/lib/utils";

type Tab = "favorites" | "alerts" | "early" | "settings";
const sel = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground";

export default function VipClub() {
  const { user, ready, isAdmin, signOut } = useMember();
  const [tab, setTab] = useState<Tab>("favorites");

  return (
    <div className="min-h-screen bg-ivory">
      <Navigation />
      <PublicPageHero compact eyebrow="Future Homes VIP Club" title="Free membership for serious buyers" description="Save favourites, get Smart Property Alerts, price-drop notices and early access to selected pre-launch projects." image={heroImage} />
      <main className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        {!ready ? null : !user ? (
          <div className="grid items-start gap-8 md:grid-cols-2">
            <ul className="space-y-4">
              {[
                [Heart, "Favourites", "Save homes and see them on any device."],
                [Bell, "Smart Property Alerts", "Tell us what you want – we email you (or WhatsApp, with your consent) when a home matches."],
                [Sparkles, "Price changes & new projects", "Be told when a saved home drops in price."],
                [Lock, "Early access", "Selected pre-launches where we have agreements with developers."],
              ].map(([Icon, t, d]: any) => (
                <li key={t} className="flex gap-4 rounded-lg border border-border bg-card p-4">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold-foreground" />
                  <div><p className="font-semibold text-foreground">{t}</p><p className="text-sm text-muted-foreground">{d}</p></div>
                </li>
              ))}
            </ul>
            <MemberAuthCard />
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">Signed in as <span className="font-medium text-foreground">{user.email}</span></p>
              <div className="flex gap-2">
                {isAdmin ? <Button asChild variant="outline" size="sm"><Link to="/vip/admin">Admin</Link></Button> : null}
                <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
              </div>
            </div>
            <div className="mb-6 flex gap-2 overflow-x-auto">
              {([["favorites", "Favourites", Heart], ["alerts", "Smart alerts", Bell], ["early", "Early access", Sparkles], ["settings", "Settings", Settings]] as const).map(([k, l, Icon]) => (
                <button key={k} onClick={() => setTab(k)} className={cn("flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold", tab === k ? "border-navy bg-navy text-navy-foreground" : "border-border bg-card text-foreground")}>
                  <Icon className="h-4 w-4" />{l}
                </button>
              ))}
            </div>
            {tab === "favorites" && <Favorites />}
            {tab === "alerts" && <Alerts userId={user.id} />}
            {tab === "early" && <EarlyAccess />}
            {tab === "settings" && <SettingsPanel userId={user.id} />}
          </>
        )}
      </main>
    </div>
  );
}

function Favorites() {
  const [rows, setRows] = useState<any[] | null>(null);
  const load = () => cloud.from("favorites").select("*").order("created_at", { ascending: false }).then(({ data }) => setRows(data ?? []));
  useEffect(() => { load(); }, []);
  if (!rows) return null;
  if (!rows.length) return <Empty text="No favourites yet. Tap the heart on any home to save it." />;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {rows.map((f) => (
        <div key={f.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
          <Link to={`/property/${f.ref_no || f.property_id}`} className="min-w-0">
            <p className="text-xs text-muted-foreground">REF {f.ref_no || "–"}</p>
            <p className="truncate font-medium text-foreground">{f.title || "Property"}</p>
            <p className="text-sm text-muted-foreground">Saved at {f.price_at_save || "–"}</p>
          </Link>
          <Button variant="ghost" size="icon" aria-label="Remove" onClick={async () => { await cloud.from("favorites").delete().eq("id", f.id); load(); }}><Trash2 className="h-4 w-4" /></Button>
        </div>
      ))}
    </div>
  );
}

function Alerts({ userId }: { userId: string }) {
  const [rows, setRows] = useState<any[]>([]);
  const [f, setF] = useState({ city: "Antalya", property_type: "Apartment", max_price: "180000", min_bedrooms: "2", keywords: "sea", notify_whatsapp: false });
  const load = () => cloud.from("saved_searches").select("*").order("created_at", { ascending: false }).then(({ data }) => setRows(data ?? []));
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await cloud.from("saved_searches").insert({
      user_id: userId,
      name: `${f.property_type} in ${f.city}`,
      city: f.city || null,
      property_type: f.property_type === "Any" ? null : f.property_type,
      max_price: f.max_price ? Number(f.max_price) : null,
      min_bedrooms: f.min_bedrooms ? Number(f.min_bedrooms) : null,
      keywords: f.keywords || null,
      notify_whatsapp: f.notify_whatsapp,
    });
    if (error) toast.error("Could not save the alert.");
    else { toast.success("Alert saved – we'll tell you when a home matches."); load(); }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr] [&>*]:min-w-0">
      <form onSubmit={add} className="space-y-3 rounded-lg border border-border bg-card p-5">
        <p className="font-semibold text-foreground">New Smart Property Alert</p>
        <select className={sel} value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })}>{["Antalya", "Alanya", "Istanbul", "Mersin", "Dubai", "Cyprus", "Bali"].map((c) => <option key={c}>{c}</option>)}</select>
        <select className={sel} value={f.property_type} onChange={(e) => setF({ ...f, property_type: e.target.value })}>{["Any", "Apartment", "Villa", "Penthouse"].map((c) => <option key={c}>{c}</option>)}</select>
        <Input type="number" placeholder="Max price (€)" value={f.max_price} onChange={(e) => setF({ ...f, max_price: e.target.value })} />
        <Input type="number" placeholder="Min. bedrooms" value={f.min_bedrooms} onChange={(e) => setF({ ...f, min_bedrooms: e.target.value })} />
        <Input placeholder="Keywords, e.g. sea, pool" value={f.keywords} onChange={(e) => setF({ ...f, keywords: e.target.value })} />
        <label className="flex items-start gap-2 text-sm text-foreground"><input type="checkbox" className="mt-1" checked={f.notify_whatsapp} onChange={(e) => setF({ ...f, notify_whatsapp: e.target.checked })} /> Also send via WhatsApp (I consent to WhatsApp messages; add my number under Settings)</label>
        <Button type="submit" className="w-full bg-navy text-navy-foreground hover:bg-navy/90">Save alert</Button>
      </form>
      <div className="space-y-3">
        {rows.length === 0 ? <Empty text="No alerts yet." /> : rows.map((s) => (
          <div key={s.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
            <div className="min-w-0 text-sm">
              <p className="font-semibold text-foreground">{s.name}</p>
              <p className="text-muted-foreground">{[s.max_price && `max €${Number(s.max_price).toLocaleString()}`, s.min_bedrooms && `${s.min_bedrooms}+ bedrooms`, s.keywords].filter(Boolean).join(" · ")}</p>
              <p className="text-xs text-muted-foreground">Email{s.notify_whatsapp ? " + WhatsApp" : ""}</p>
            </div>
            <Button variant="ghost" size="icon" aria-label="Delete alert" onClick={async () => { await cloud.from("saved_searches").delete().eq("id", s.id); load(); }}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function EarlyAccess() {
  const [rows, setRows] = useState<any[] | null>(null);
  useEffect(() => { cloud.from("early_access_projects").select("*").eq("active", true).order("created_at", { ascending: false }).then(({ data }) => setRows(data ?? [])); }, []);
  if (!rows) return null;
  if (!rows.length) return <Empty text="No pre-launches open right now. We'll email you when one opens." />;
  return (
    <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(16rem,1fr))]">
      {rows.map((p) => (
        <div key={p.id} className="overflow-hidden rounded-lg border border-border bg-card">
          {p.image_url ? <img src={p.image_url} alt={p.title} className="aspect-[4/3] w-full object-cover" loading="lazy" /> : null}
          <div className="p-4 text-sm">
            <p className="text-xs uppercase text-gold-foreground">{p.location}</p>
            <p className="font-semibold text-foreground">{p.title}</p>
            {p.price_from ? <p className="text-foreground">From {p.price_from}</p> : null}
            <p className="mt-2 text-muted-foreground">{p.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SettingsPanel({ userId }: { userId: string }) {
  const [p, setP] = useState<any>(null);
  useEffect(() => { cloud.from("vip_profiles").select("*").eq("user_id", userId).maybeSingle().then(({ data }) => setP(data ?? { user_id: userId, email_alerts: true, whatsapp_consent: false })); }, [userId]);
  if (!p) return null;
  const save = async () => {
    const { error } = await cloud.from("vip_profiles").upsert({ user_id: userId, full_name: p.full_name, phone: p.phone, email_alerts: p.email_alerts, whatsapp_consent: p.whatsapp_consent });
    error ? toast.error("Could not save.") : toast.success("Settings saved");
  };
  return (
    <div className="max-w-md space-y-3 rounded-lg border border-border bg-card p-5">
      <Input placeholder="Full name" value={p.full_name ?? ""} onChange={(e) => setP({ ...p, full_name: e.target.value })} />
      <Input placeholder="WhatsApp number with country code, e.g. +46…" value={p.phone ?? ""} onChange={(e) => setP({ ...p, phone: e.target.value })} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={p.email_alerts} onChange={(e) => setP({ ...p, email_alerts: e.target.checked })} /> Email me matches, price changes and new projects</label>
      <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1" checked={p.whatsapp_consent} onChange={(e) => setP({ ...p, whatsapp_consent: e.target.checked })} /> I consent to receive property alerts on WhatsApp. I can withdraw this at any time.</label>
      <Button onClick={save} className="bg-navy text-navy-foreground hover:bg-navy/90">Save settings</Button>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-lg border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">{text}</p>;
}
