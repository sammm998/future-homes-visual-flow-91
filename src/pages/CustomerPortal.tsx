import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { LogOut, Menu, Bot, GraduationCap, CheckCircle2, Award, Calculator, FileText, Heart, Home, LifeBuoy, MessageCircle, Receipt, Send, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { PublicPageHero } from "@/components/PublicEditorial";
import MemberAuthCard from "@/components/MemberAuthCard";
import { Alerts } from "@/pages/VipClub";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase as cloud } from "@/integrations/supabase/client";
import { useMember } from "@/hooks/useMember";
import { useTranslation } from "@/hooks/useTranslation";
import { portalCopy, type PortalCopy } from "@/content/portalCopy";
import { analyzeInvestment, portalAssistant, sharedDocumentUrl } from "@/portal/portal.functions";
import { Link } from "@/lib/router-compat";
import heroImage from "@/assets/hero-modern-estate.jpg";
import { cn } from "@/lib/utils";

export const STAGES = ["viewing", "reservation", "contract", "payment", "handover", "aftersales"] as const;
type Tab = keyof PortalCopy["tabs"];
const sel = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground";
const card = "rounded-lg border border-border bg-card p-5";
const eur = (n: number, c = "EUR") => new Intl.NumberFormat("en-US", { style: "currency", currency: c, maximumFractionDigits: 0 }).format(n || 0);

export default function CustomerPortal() {
  const { user, ready, signOut } = useMember();
  const { lang } = useTranslation();
  const c = portalCopy(lang);
  const [tab, setTab] = useState<Tab>("overview");
  const [account, setAccount] = useState<any>(null);

  useEffect(() => {
    if (!user) return setAccount(null);
    cloud.rpc("link_customer_account").then(({ data, error }) => { if (error) toast.error(c.error); setAccount(data); });
  }, [user]);

  const tabs: [Tab, any][] = [["overview", Home], ["messages", MessageCircle], ["tickets", LifeBuoy], ["documents", FileText], ["payments", Receipt], ["saved", Heart], ["analysis", Calculator], ["academy", GraduationCap], ["assistant", Bot], ["profile", UserIcon]];

  const [more, setMore] = useState(false);
  const primary: Tab[] = ["overview", "messages", "documents", "academy"];
  const current = tabs.find(([k]) => k === tab)!;
  const CurrentIcon = current[1];
  const initials = (account?.full_name || user?.email || "?").slice(0, 2).toUpperCase();
  const pick = (k: Tab) => { setTab(k); setMore(false); if (typeof window !== "undefined") window.scrollTo({ top: 0 }); };
  const panel = {
    overview: <Overview c={c} account={account} userId={user?.id ?? ""} go={pick} />,
    messages: <Messages c={c} userId={user?.id ?? ""} />,
    tickets: <Tickets c={c} userId={user?.id ?? ""} />,
    documents: <Documents c={c} />,
    payments: <Payments c={c} />,
    saved: <Saved c={c} userId={user?.id ?? ""} onAnalyse={() => pick("analysis")} />,
    analysis: <Analysis c={c} lang={lang} />,
    academy: <Academy c={c} userId={user?.id ?? ""} />,
    assistant: <Assistant c={c} lang={lang} />,
    profile: <Profile c={c} account={account} onSaved={setAccount} />,
  } as Record<Tab, React.ReactNode>;

  if (!ready) return <div className="min-h-screen bg-ivory"><Navigation /></div>;
  if (!user) return (
    <div className="min-h-screen bg-ivory">
      <Navigation />
      <PublicPageHero compact eyebrow={c.hero.eyebrow} title={c.hero.title} description={c.hero.description} image={heroImage} />
      <main className="mx-auto max-w-md px-4 pb-20"><MemberAuthCard title={c.signInTitle} next="/portal" /></main>
    </div>
  );

  return (
    <div className="min-h-screen bg-ivory">
      <Navigation />
      <div className="mx-auto flex max-w-7xl gap-6 px-3 pb-28 pt-6 sm:px-6 lg:pb-12">
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-64 shrink-0 flex-col rounded-2xl bg-navy p-4 text-navy-foreground shadow-xl lg:flex">
          <div className="mb-5 border-b border-navy-foreground/15 px-2 pb-4">
            <p className="text-xs uppercase tracking-[0.25em] text-gold">{c.hero.eyebrow}</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold text-sm font-bold text-gold-foreground">{initials}</div>
              <div className="min-w-0"><p className="truncate text-sm font-semibold">{account?.full_name || c.signedInAs}</p><p className="truncate text-xs text-navy-foreground/60">{user.email}</p></div>
            </div>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {tabs.map(([k, Icon]) => (
              <button key={k} onClick={() => pick(k)} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors", tab === k ? "bg-gold text-gold-foreground" : "text-navy-foreground/75 hover:bg-navy-foreground/10 hover:text-navy-foreground")}>
                <Icon className="h-4 w-4 shrink-0" /><span className="truncate">{c.tabs[k]}</span>
              </button>
            ))}
          </nav>
          <button onClick={signOut} className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-navy-foreground/70 hover:bg-navy-foreground/10"><LogOut className="h-4 w-4" />{c.signOut}</button>
        </aside>
        <main className="min-w-0 flex-1">
          <header className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy text-gold"><CurrentIcon className="h-5 w-5" /></div>
              <div className="min-w-0"><p className="text-xs uppercase tracking-widest text-muted-foreground">{c.hero.eyebrow}</p><h1 className="truncate text-xl font-semibold sm:text-2xl">{c.tabs[tab]}</h1></div>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gold text-sm font-bold text-gold-foreground lg:hidden">{initials}</div>
          </header>
          <div className="rounded-2xl border border-border bg-background/60 p-4 sm:p-6">{panel[tab]}</div>
        </main>
      </div>

      {more && (
        <div className="fixed inset-0 z-40 bg-navy/50 lg:hidden" onClick={() => setMore(false)}>
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-card p-5 pb-24 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <p className="mb-3 truncate text-sm text-muted-foreground">{user.email}</p>
            <div className="grid grid-cols-3 gap-2">
              {tabs.filter(([k]) => !primary.includes(k)).map(([k, Icon]) => (
                <button key={k} onClick={() => pick(k)} className={cn("flex flex-col items-center gap-2 rounded-2xl border p-3 text-center text-xs font-medium", tab === k ? "border-navy bg-navy text-navy-foreground" : "border-border")}>
                  <Icon className="h-5 w-5" />{c.tabs[k]}
                </button>
              ))}
              <button onClick={signOut} className="flex flex-col items-center gap-2 rounded-2xl border border-border p-3 text-xs font-medium text-destructive"><LogOut className="h-5 w-5" />{c.signOut}</button>
            </div>
          </div>
        </div>
      )}
      <nav data-portal-nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {primary.map((k) => { const Icon = tabs.find(([t]) => t === k)![1]; return (
          <button key={k} onClick={() => pick(k)} className={cn("flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-[11px] font-medium", tab === k ? "text-navy" : "text-muted-foreground")}>
            <span className={cn("grid h-8 w-12 place-items-center rounded-full", tab === k && "bg-gold/25")}><Icon className="h-5 w-5" /></span><span className="max-w-full truncate">{c.tabs[k]}</span>
          </button>); })}
        <button onClick={() => setMore(!more)} className={cn("flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium", more || !primary.includes(tab) ? "text-navy" : "text-muted-foreground")}>
          <span className={cn("grid h-8 w-12 place-items-center rounded-full", (more || !primary.includes(tab)) && "bg-gold/25")}><Menu className="h-5 w-5" /></span>{c.portalMore}
        </button>
      </nav>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-lg border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">{text}</p>;
}

function Overview({ c, account, userId, go }: { c: PortalCopy; account: any; userId: string; go: (t: Tab) => void }) {
  const [stats, setStats] = useState({ open: 0, unread: 0, docs: 0 });
  useEffect(() => {
    Promise.all([
      cloud.from("support_tickets").select("id", { count: "exact", head: true }).neq("status", "resolved"),
      cloud.from("portal_messages").select("id", { count: "exact", head: true }).eq("customer_id", userId).eq("from_staff", true).is("read_at", null),
      cloud.from("shared_items").select("id", { count: "exact", head: true }),
    ]).then(([a, b, d]) => setStats({ open: a.count ?? 0, unread: b.count ?? 0, docs: d.count ?? 0 }));
  }, [userId]);
  const stage = (account?.stage ?? "viewing") as (typeof STAGES)[number];
  const idx = Math.max(0, STAGES.indexOf(stage));
  return (
    <div className="space-y-6">
      <section className={card}>
        <h2 className="mb-4 text-lg font-semibold">{c.overview.progress}</h2>
        <ol className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {STAGES.map((s, i) => (
            <li key={s} className="text-center">
              <div className={cn("mx-auto mb-2 h-2 rounded-full", i <= idx ? "bg-gold" : "bg-muted")} />
              <span className={cn("text-xs", i === idx ? "font-semibold text-foreground" : "text-muted-foreground")}>{c.stages[s]}</span>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-sm"><span className="font-semibold">{c.overview.next}:</span> {c.overview.nextByStage[stage]}</p>
        {!account?.lead_id && <p className="mt-3 text-sm text-muted-foreground">{c.overview.noLead}</p>}
      </section>
      <div className="grid gap-4 sm:grid-cols-3">
        {([[c.overview.openTickets, stats.open, "tickets"], [c.overview.unread, stats.unread, "messages"], [c.overview.documents, stats.docs, "documents"]] as const).map(([l, n, t]) => (
          <button key={t} onClick={() => go(t)} className={cn(card, "text-left hover:border-gold")}>
            <p className="text-3xl font-bold text-foreground">{n}</p><p className="text-sm text-muted-foreground">{l}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function Thread({ items, c, userId }: { items: any[]; c: PortalCopy; userId: string }) {
  return (
    <div className="space-y-3">
      {items.map((m) => {
        const mine = !m.from_staff && m.author_id === userId;
        return (
          <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[80%] rounded-2xl px-4 py-2 text-sm", mine ? "bg-navy text-navy-foreground" : "border border-border bg-card text-foreground")}>
              <p className="mb-0.5 text-[11px] opacity-70">{mine ? c.messages.you : c.messages.team} · {new Date(m.created_at).toLocaleString()}</p>
              <p className="whitespace-pre-wrap">{m.body}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Messages({ c, userId }: { c: PortalCopy; userId: string }) {
  const [rows, setRows] = useState<any[]>([]);
  const [text, setText] = useState("");
  const load = async () => {
    const { data } = await cloud.from("portal_messages").select("*").eq("customer_id", userId).order("created_at");
    setRows(data ?? []);
    await cloud.from("portal_messages").update({ read_at: new Date().toISOString() }).eq("customer_id", userId).eq("from_staff", true).is("read_at", null);
  };
  useEffect(() => { load(); const i = setInterval(load, 20000); return () => clearInterval(i); }, [userId]);
  const send = async () => {
    if (!text.trim()) return;
    const { error } = await cloud.from("portal_messages").insert({ customer_id: userId, author_id: userId, body: text.trim() });
    if (error) return toast.error(c.error);
    setText(""); load();
  };
  return (
    <div className={cn(card, "space-y-4")}>
      {rows.length ? <Thread items={rows} c={c} userId={userId} /> : <p className="text-sm text-muted-foreground">{c.messages.empty}</p>}
      <div className="flex gap-2">
        <Textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder={c.messages.placeholder} />
        <Button onClick={send} className="self-end"><Send className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}

function Tickets({ c, userId }: { c: PortalCopy; userId: string }) {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [f, setF] = useState({ category: "question", subject: "", details: "", property_ref: "", preferred_at: "" });
  const load = () => cloud.from("support_tickets").select("*").order("created_at", { ascending: false }).then(({ data }) => setRows(data ?? []));
  useEffect(() => { load(); }, []);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.subject.trim()) return;
    const { data, error } = await cloud.from("support_tickets").insert({ user_id: userId, category: f.category, subject: f.subject.trim(), property_ref: f.property_ref || null, preferred_at: f.preferred_at ? new Date(f.preferred_at).toISOString() : null }).select("id").single();
    if (error || !data) return toast.error(c.error);
    if (f.details.trim()) await cloud.from("ticket_messages").insert({ ticket_id: data.id, author_id: userId, body: f.details.trim() });
    toast.success(c.tickets.created);
    setF({ category: "question", subject: "", details: "", property_ref: "", preferred_at: "" }); load();
  };
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
      <form onSubmit={submit} className={cn(card, "space-y-3")}>
        <h2 className="font-semibold">{c.tickets.new}</h2>
        <div><Label>{c.tickets.category}</Label>
          <select className={sel} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>
            {Object.entries(c.tickets.categories).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select></div>
        <div><Label>{c.tickets.subject}</Label><Input value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })} required /></div>
        <div><Label>{c.tickets.details}</Label><Textarea rows={4} value={f.details} onChange={(e) => setF({ ...f, details: e.target.value })} /></div>
        <div><Label>{c.tickets.propertyRef}</Label><Input value={f.property_ref} onChange={(e) => setF({ ...f, property_ref: e.target.value })} /></div>
        {f.category === "viewing" && <div><Label>{c.tickets.preferredAt}</Label><Input type="datetime-local" value={f.preferred_at} onChange={(e) => setF({ ...f, preferred_at: e.target.value })} /></div>}
        <Button type="submit" className="w-full">{c.tickets.submit}</Button>
      </form>
      <div className="space-y-3">
        {!rows.length && <Empty text={c.tickets.empty} />}
        {rows.map((t) => (
          <div key={t.id} className={card}>
            <button className="flex w-full items-start justify-between gap-3 text-left" onClick={() => setOpen(open === t.id ? null : t.id)}>
              <div><p className="font-medium">{t.subject}</p><p className="text-xs text-muted-foreground">{(c.tickets.categories as any)[t.category] ?? t.category} · {new Date(t.created_at).toLocaleDateString()}{t.property_ref ? ` · REF ${t.property_ref}` : ""}</p></div>
              <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold", t.status === "resolved" ? "bg-muted text-muted-foreground" : "bg-gold/20 text-foreground")}>{(c.tickets.status as any)[t.status] ?? t.status}</span>
            </button>
            {open === t.id && <TicketThread c={c} ticketId={t.id} userId={userId} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function TicketThread({ c, ticketId, userId }: { c: PortalCopy; ticketId: string; userId: string }) {
  const [rows, setRows] = useState<any[]>([]);
  const [text, setText] = useState("");
  const load = () => cloud.from("ticket_messages").select("*").eq("ticket_id", ticketId).order("created_at").then(({ data }) => setRows(data ?? []));
  useEffect(() => { load(); }, [ticketId]);
  return (
    <div className="mt-4 space-y-3 border-t border-border pt-4">
      <Thread items={rows} c={c} userId={userId} />
      <div className="flex gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder={c.tickets.reply} />
        <Button onClick={async () => { if (!text.trim()) return; await cloud.from("ticket_messages").insert({ ticket_id: ticketId, author_id: userId, body: text.trim() }); setText(""); load(); }}>{c.tickets.send}</Button>
      </div>
    </div>
  );
}

function Documents({ c }: { c: PortalCopy }) {
  const [items, setItems] = useState<any[] | null>(null);
  const getUrl = useServerFn(sharedDocumentUrl);
  useEffect(() => {
    (async () => {
      const { data: shared } = await cloud.from("shared_items").select("*").order("created_at", { ascending: false });
      const sigIds = (shared ?? []).filter((s) => s.kind === "signature").map((s) => s.item_id);
      const { data: sigs } = sigIds.length ? await cloud.from("signature_requests").select("id, token, status, signed_at").in("id", sigIds) : { data: [] as any[] };
      setItems((shared ?? []).map((s) => ({ ...s, sig: (sigs ?? []).find((x: any) => x.id === s.item_id) })));
    })();
  }, []);
  if (!items) return null;
  if (!items.length) return <Empty text={c.documents.empty} />;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((s) => (
        <div key={s.id} className={cn(card, "flex items-center justify-between gap-3")}>
          <div className="min-w-0"><p className="text-xs text-muted-foreground">{(c.documents as any)[s.kind]}</p><p className="truncate font-medium">{s.title || "—"}</p></div>
          {s.kind === "document" && <Button size="sm" variant="outline" onClick={async () => { try { const r = await getUrl({ data: { documentId: s.item_id } }); window.open(r.url, "_blank", "noopener"); } catch { toast.error(c.error); } }}>{c.documents.download}</Button>}
          {s.kind === "signature" && s.sig && (s.sig.status === "signed" ? <span className="text-sm font-semibold text-foreground">{c.documents.signed}</span> : <Button size="sm" asChild><a href={`/sign/${s.sig.token}`}>{c.documents.sign}</a></Button>)}
          {(s.kind === "invoice" || s.kind === "quote") && <span className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</span>}
        </div>
      ))}
    </div>
  );
}

function Payments({ c }: { c: PortalCopy }) {
  const [rows, setRows] = useState<any[] | null>(null);
  useEffect(() => {
    (async () => {
      const { data: inv } = await cloud.from("invoices").select("*").order("due_date");
      const ids = (inv ?? []).map((i) => i.id);
      const { data: pays } = ids.length ? await cloud.from("invoice_payments").select("*").in("invoice_id", ids) : { data: [] as any[] };
      setRows((inv ?? []).map((i) => ({ ...i, paid: (pays ?? []).filter((p: any) => p.invoice_id === i.id).reduce((s: number, p: any) => s + Number(p.amount || 0), 0) })));
    })();
  }, []);
  if (!rows) return null;
  if (!rows.length) return <Empty text={c.payments.empty} />;
  return (
    <div className="space-y-3">
      {rows.map((i) => {
        const pct = i.amount ? Math.min(100, (i.paid / Number(i.amount)) * 100) : 0;
        return (
          <div key={i.id} className={card}>
            <div className="flex flex-wrap justify-between gap-2"><p className="font-medium">{i.invoice_no} · {i.description}</p><p className="text-sm text-muted-foreground">{c.payments.due} {i.due_date ?? "—"}</p></div>
            <div className="my-3 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-gold" style={{ width: `${pct}%` }} /></div>
            <div className="flex flex-wrap gap-6 text-sm"><span>{c.payments.amount}: <b>{eur(Number(i.amount), i.currency || "EUR")}</b></span><span>{c.payments.paid}: <b>{eur(i.paid, i.currency || "EUR")}</b></span><span>{c.payments.remaining}: <b>{eur(Number(i.amount) - i.paid, i.currency || "EUR")}</b></span></div>
          </div>
        );
      })}
    </div>
  );
}

function Saved({ c, userId, onAnalyse }: { c: PortalCopy; userId: string; onAnalyse: () => void }) {
  const [rows, setRows] = useState<any[] | null>(null);
  const [pick, setPick] = useState<string[]>([]);
  const [compare, setCompare] = useState<any[] | null>(null);
  useEffect(() => { cloud.from("favorites").select("*").order("created_at", { ascending: false }).then(({ data }) => setRows(data ?? [])); }, []);
  const doCompare = async () => {
    const { data } = await cloud.from("properties").select("ref_no, title, location, price, starting_price_eur, bedrooms, sizes_m2, property_type, building_complete_date, distance_to_beach_km").in("ref_no", pick);
    setCompare(data ?? []);
  };
  return (
    <div className="space-y-8">
      <section>
        <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold">{c.saved.title}</h2>
          {pick.length > 1 && <Button size="sm" onClick={doCompare}>{c.saved.compare} ({pick.length})</Button>}</div>
        {rows && !rows.length && <div className="space-y-3"><Empty text={c.saved.empty} /><Button asChild variant="outline"><Link to="/map-search">{c.saved.browse}</Link></Button></div>}
        <div className="grid gap-3 sm:grid-cols-2">
          {(rows ?? []).map((f) => (
            <div key={f.id} className={cn(card, "flex items-center gap-3")}>
              <input type="checkbox" className="h-4 w-4" checked={pick.includes(f.ref_no)} onChange={(e) => setPick(e.target.checked ? [...pick, f.ref_no].slice(-4) : pick.filter((x) => x !== f.ref_no))} />
              <Link to={`/property/${f.ref_no}`} className="min-w-0 flex-1"><p className="text-xs text-muted-foreground">REF {f.ref_no}</p><p className="truncate font-medium">{f.title}</p></Link>
              <Button size="sm" variant="outline" onClick={() => { sessionStorage.setItem("fh_analyse_ref", f.ref_no); onAnalyse(); }}>{c.saved.analyse}</Button>
            </div>
          ))}
        </div>
        {compare && (
          <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-sm">
              <tbody>
                {[["REF", "ref_no"], ["", "title"], ["📍", "location"], ["€", "starting_price_eur"], ["🛏", "bedrooms"], ["m²", "sizes_m2"], ["🏗", "building_complete_date"], ["🏖 km", "distance_to_beach_km"]].map(([l, k]) => (
                  <tr key={k} className="border-b border-border"><th className="p-3 text-left font-medium text-muted-foreground">{l}</th>{compare.map((p) => <td key={p.ref_no} className="p-3">{String(p[k!] ?? p.price ?? "—")}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <section><h2 className="mb-3 text-lg font-semibold">{c.saved.alerts}</h2><Alerts userId={userId} /></section>
    </div>
  );
}

function Analysis({ c, lang }: { c: PortalCopy; lang: string }) {
  const run = useServerFn(analyzeInvestment);
  const [ref, setRef] = useState("");
  const [nightly, setNightly] = useState("");
  const [busy, setBusy] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [active, setActive] = useState<any>(null);
  const load = () => cloud.from("investment_analyses").select("*").order("created_at", { ascending: false }).then(({ data }) => { setList(data ?? []); return data ?? []; });
  useEffect(() => { const r = sessionStorage.getItem("fh_analyse_ref"); if (r) { setRef(r); sessionStorage.removeItem("fh_analyse_ref"); } load().then((d) => d[0] && setActive(d[0])); }, []);
  const go = async () => {
    if (!ref.trim()) return;
    setBusy(true);
    try { const r = await run({ data: { ref: ref.trim(), lang, nightly: Number(nightly) || undefined } }); const d = await load(); setActive(d.find((x: any) => x.id === r.id)); }
    catch (e) { toast.error(e instanceof Error ? e.message : c.error); }
    finally { setBusy(false); }
  };
  const r = active?.result;
  const base = r?.scenarios?.find((s: any) => s.key === "base");
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
      <div className="space-y-4">
        <div className={cn(card, "space-y-3")}>
          <p className="text-sm text-muted-foreground">{c.analysis.intro}</p>
          <div><Label>{c.analysis.ref}</Label><Input value={ref} onChange={(e) => setRef(e.target.value)} /></div>
          <div><Label>{c.analysis.nightly}</Label><Input type="number" value={nightly} onChange={(e) => setNightly(e.target.value)} /></div>
          <Button className="w-full" disabled={busy} onClick={go}>{busy ? c.analysis.running : c.analysis.run}</Button>
        </div>
        {list.length > 0 && <div className={card}><p className="mb-2 text-sm font-semibold">{c.analysis.history}</p>
          {list.map((a) => <button key={a.id} onClick={() => setActive(a)} className={cn("block w-full truncate rounded px-2 py-1.5 text-left text-sm", active?.id === a.id ? "bg-muted font-medium" : "")}>REF {a.property_ref} · {a.title}</button>)}</div>}
      </div>
      {r && base && (
        <div className={cn(card, "space-y-5")}>
          <div><p className="text-xs text-muted-foreground">REF {active.property_ref} · {r.marketLabel}</p><h2 className="text-xl font-semibold">{active.title}</h2></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[[c.analysis.purchaseCosts, eur(base.purchaseCosts)], [c.analysis.netYear, eur(base.net)], [c.analysis.grossYield, `${base.grossYield.toFixed(1)}%`], [c.analysis.value10y, eur(r.projections.find((p: any) => p.scenario === "base")?.value10y)]].map(([l, v]) => (
              <div key={l} className="rounded-md bg-muted p-3"><p className="text-lg font-bold">{v}</p><p className="text-xs text-muted-foreground">{l}</p></div>
            ))}
          </div>
          <p className="text-sm leading-relaxed">{r.ai?.summary}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><p className="mb-1 font-semibold">{c.analysis.strengths}</p><ul className="list-disc space-y-1 pl-5 text-sm">{r.ai?.strengths?.map((s: string) => <li key={s}>{s}</li>)}</ul></div>
            <div><p className="mb-1 font-semibold">{c.analysis.risks}</p><ul className="list-disc space-y-1 pl-5 text-sm">{r.ai?.risks?.map((s: string) => <li key={s}>{s}</li>)}</ul></div>
          </div>
          <div><p className="mb-1 font-semibold">{c.analysis.area}</p><p className="text-sm">{r.ai?.areaComparison}</p></div>
          <div><p className="mb-1 font-semibold">{c.analysis.scenarios}</p>
            <div className="overflow-x-auto"><table className="w-full text-sm"><tbody>{r.scenarios.map((s: any) => <tr key={s.key} className="border-b border-border"><td className="py-2">{s.label}</td><td>{eur(s.net)}</td><td>{s.cashOnCash.toFixed(1)}%</td></tr>)}</tbody></table></div></div>
          <div className="rounded-md border border-gold/40 bg-gold/10 p-3"><p className="mb-1 font-semibold">{c.analysis.recommendation}</p><p className="text-sm">{r.ai?.recommendation}</p></div>
          <p className="text-xs text-muted-foreground">{c.analysis.disclaimer}</p>
        </div>
      )}
    </div>
  );
}

function Assistant({ c, lang }: { c: PortalCopy; lang: string }) {
  const ask = useServerFn(portalAssistant);
  const [msgs, setMsgs] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: "nearest" }); }, [msgs, busy]);
  const send = async (q: string) => {
    if (!q.trim() || busy) return;
    const next = [...msgs, { role: "user" as const, content: q.trim() }];
    setMsgs(next); setText(""); setBusy(true);
    try { const r = await ask({ data: { messages: next, lang } }); setMsgs([...next, { role: "assistant", content: r.reply }]); if (r.ticketId) toast.success(c.assistant.ticketCreated); }
    catch { toast.error(c.error); }
    finally { setBusy(false); }
  };
  return (
    <div className={cn(card, "space-y-4")}>
      {!msgs.length && (<><p className="text-sm text-muted-foreground">{c.assistant.intro}</p>
        <div className="flex flex-wrap gap-2">{c.assistant.suggestions.map((s) => <button key={s} onClick={() => send(s)} className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-gold">{s}</button>)}</div></>)}
      <div className="max-h-[55vh] space-y-3 overflow-y-auto">
        {msgs.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm", m.role === "user" ? "bg-navy text-navy-foreground" : "bg-muted text-foreground")}>{m.content}</div>
          </div>
        ))}
        {busy && <p className="text-sm text-muted-foreground">{c.assistant.thinking}</p>}
        <div ref={end} />
      </div>
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); send(text); }}>
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder={c.assistant.placeholder} />
        <Button type="submit" disabled={busy}><Send className="h-4 w-4" /></Button>
      </form>
    </div>
  );
}

function Profile({ c, account, onSaved }: { c: PortalCopy; account: any; onSaved: (a: any) => void }) {
  const [f, setF] = useState({ full_name: "", phone: "", preferred_language: "en", budget: "", wishes: "" });
  useEffect(() => { if (account) setF({ full_name: account.full_name ?? "", phone: account.phone ?? "", preferred_language: account.preferred_language ?? "en", budget: account.budget ?? "", wishes: account.wishes ?? "" }); }, [account]);
  const langs = useMemo(() => ["en", "sv", "tr", "ar", "ru", "no", "da", "fa", "ur", "es", "de", "fr", "id"], []);
  if (!account) return null;
  return (
    <form className={cn(card, "grid max-w-2xl gap-3 sm:grid-cols-2")} onSubmit={async (e) => {
      e.preventDefault();
      const { data, error } = await cloud.from("customer_accounts").update(f).eq("user_id", account.user_id).select().single();
      if (error) return toast.error(c.error);
      onSaved(data); toast.success(c.profile.saved);
    }}>
      <div><Label>{c.profile.name}</Label><Input value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} /></div>
      <div><Label>{c.profile.phone}</Label><Input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
      <div><Label>{c.profile.language}</Label><select className={sel} value={f.preferred_language} onChange={(e) => setF({ ...f, preferred_language: e.target.value })}>{langs.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}</select></div>
      <div><Label>{c.profile.budget}</Label><Input value={f.budget} onChange={(e) => setF({ ...f, budget: e.target.value })} /></div>
      <div className="sm:col-span-2"><Label>{c.profile.wishes}</Label><Textarea rows={3} value={f.wishes} onChange={(e) => setF({ ...f, wishes: e.target.value })} /></div>
      <Button type="submit" className="sm:col-span-2">{c.profile.save}</Button>
    </form>
  );
}

function Academy({ c, userId }: { c: PortalCopy; userId: string }) {
  const [courses, setCourses] = useState<any[]>([]);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const [{ data: cs }, { data: pr }] = await Promise.all([
        cloud.from("courses").select("id,slug,title,description,country_code,hero_image,estimated_minutes,course_modules(id,slug,title,summary,order_index,is_published)").eq("is_published", true).eq("language_code", "en").order("order_index"),
        cloud.from("course_progress").select("module_id").eq("user_id", userId),
      ]);
      setCourses((cs ?? []).map((x: any) => ({ ...x, modules: (x.course_modules ?? []).filter((m: any) => m.is_published).sort((a: any, b: any) => a.order_index - b.order_index) })));
      setDone(new Set((pr ?? []).map((r: any) => r.module_id)));
    })();
  }, [userId]);
  const toggle = async (id: string) => {
    const has = done.has(id);
    const { error } = has
      ? await cloud.from("course_progress").delete().eq("user_id", userId).eq("module_id", id)
      : await cloud.from("course_progress").insert({ user_id: userId, module_id: id });
    if (error) return toast.error(c.error);
    const n = new Set(done); has ? n.delete(id) : n.add(id); setDone(n);
  };
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">{c.academy.intro}</p>
      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((co) => {
          const total = co.modules.length; const n = co.modules.filter((m: any) => done.has(m.id)).length; const pct = total ? Math.round((n / total) * 100) : 0;
          return (
            <div key={co.id} className="rounded-2xl border border-border bg-card p-5">
              <button className="w-full text-left" onClick={() => setOpen(open === co.id ? null : co.id)}>
                <h3 className="text-lg font-semibold">{co.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{total} {c.academy.lessons}{co.estimated_minutes ? ` · ${co.estimated_minutes} ${c.academy.min}` : ""}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-gold" style={{ width: `${pct}%` }} /></div>
                <p className="mt-1 text-xs text-muted-foreground">{n}/{total} · {pct}%</p>
              </button>
              {pct === 100 && <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-gold"><Award className="h-4 w-4" />{c.academy.certificate}</p>}
              {open === co.id && (
                <ul className="mt-4 space-y-2">
                  {co.modules.map((m: any) => (
                    <li key={m.id} className="flex items-center justify-between gap-2 rounded-xl border border-border p-3">
                      <Link to={`/courses/${co.country_code}/${m.slug}`} className="flex-1 text-sm font-medium hover:underline">{m.title}</Link>
                      <Button size="sm" variant={done.has(m.id) ? "default" : "outline"} onClick={() => toggle(m.id)}>
                        {done.has(m.id) ? <><CheckCircle2 className="mr-1 h-4 w-4" />{c.academy.done}</> : c.academy.markDone}
                      </Button>
                    </li>
                  ))}
                  <li><Link to={`/courses/${co.country_code}/final-exam`} className="text-sm font-semibold text-gold hover:underline">{c.academy.exam} →</Link></li>
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
