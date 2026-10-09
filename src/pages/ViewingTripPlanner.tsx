import { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import { PublicPageHero } from "@/components/PublicEditorial";
import LeadCaptureCard from "@/components/LeadCaptureCard";
import { Input } from "@/components/ui/input";
import { useProperties } from "@/hooks/useProperties";
import { parsePrice } from "@/utils/priceFormatting";
import { buildPropertyUrl } from "@/utils/slugHelpers";
import { getCurrentLanguage } from "@/utils/seoUtils";
import { Link } from "@/lib/router-compat";
import heroImage from "@/assets/hero-modern-estate.jpg";

const CITIES = ["Antalya", "Istanbul", "Mersin", "Dubai", "Cyprus", "Bali"];
const TYPES = ["Any", "Apartment", "Villa", "Penthouse"];

export default function ViewingTripPlanner() {
  const { properties } = useProperties() as { properties: any[] };
  const [city, setCity] = useState("Antalya");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [budget, setBudget] = useState(300000);
  const [type, setType] = useState("Any");
  const [beds, setBeds] = useState(0);
  const [travellers, setTravellers] = useState(2);
  const [pickup, setPickup] = useState(true);
  const lang = getCurrentLanguage();

  const matches = useMemo(() => {
    return (properties || [])
      .filter((p) => !/sold/i.test(String(p.status ?? "")))
      .filter((p) => String(p.location ?? "").toLowerCase().includes(city.toLowerCase()))
      .filter((p) => { const v = parsePrice(p.price); return !v || v <= budget; })
      .filter((p) => type === "Any" || String(p.property_type ?? "").toLowerCase().includes(type.toLowerCase()))
      .filter((p) => !beds || String(p.bedrooms ?? "").split(/[^0-9]+/).some((n) => Number(n) >= beds))
      .slice(0, 8);
  }, [properties, city, budget, type, beds]);

  const days = Math.max(1, Math.ceil(matches.length / 3));
  const plan = Array.from({ length: days }, (_, d) => matches.slice(d * 3, d * 3 + 3));
  const details = `City: ${city}\nDates: ${from || "?"} – ${to || "?"}\nBudget: €${budget.toLocaleString()}\nType: ${type}, bedrooms ${beds || "any"}\nTravellers: ${travellers}, airport pickup: ${pickup ? "yes" : "no"}\nHomes: ${matches.map((p) => `REF ${p.ref_no}`).join(", ")}`;

  const sel = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground";
  return (
    <div className="min-h-screen bg-ivory">
      <Navigation />
      <PublicPageHero compact eyebrow="Viewing trip planner" title="Plan your viewing trip" description="Choose city, dates and budget. We draft a day-by-day viewing plan you can book with an adviser." image={heroImage} />
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 [&>*]:min-w-0 pb-20 sm:px-6 lg:grid-cols-[22rem_1fr] lg:px-8">
        <div className="h-fit space-y-4 rounded-lg border border-border bg-card p-5">
          <L t="City"><select className={sel} value={city} onChange={(e) => setCity(e.target.value)}>{CITIES.map((c) => <option key={c}>{c}</option>)}</select></L>
          <div className="grid grid-cols-2 gap-3">
            <L t="Arrival"><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></L>
            <L t="Departure"><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></L>
          </div>
          <L t="Max budget (€)"><Input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value) || 0)} /></L>
          <L t="Property type"><select className={sel} value={type} onChange={(e) => setType(e.target.value)}>{TYPES.map((c) => <option key={c}>{c}</option>)}</select></L>
          <L t="Min. bedrooms"><select className={sel} value={beds} onChange={(e) => setBeds(Number(e.target.value))}>{[0, 1, 2, 3, 4].map((n) => <option key={n} value={n}>{n || "Any"}</option>)}</select></L>
          <L t="Travellers"><Input type="number" min={1} value={travellers} onChange={(e) => setTravellers(Number(e.target.value) || 1)} /></L>
          <label className="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" checked={pickup} onChange={(e) => setPickup(e.target.checked)} /> Airport pickup</label>
        </div>
        <div className="space-y-6">
          {matches.length === 0 ? (
            <p className="rounded-lg border border-border bg-card p-6 text-muted-foreground">No homes match yet – try a higher budget or another type. An adviser can still build a trip for you.</p>
          ) : plan.map((list, d) => (
            <div key={d} className="rounded-lg border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase text-gold-foreground">Day {d + 1}</p>
              <div className="mt-3 grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(14rem,1fr))]">
                {list.map((p) => (
                  <Link key={p.id} to={buildPropertyUrl(p, lang)} className="overflow-hidden rounded-md border border-border bg-background transition-colors hover:border-gold">
                    <img src={p.property_image || p.property_images?.[0]} alt={p.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                    <div className="p-3 text-sm">
                      <p className="text-xs text-muted-foreground">REF {p.ref_no} · {p.location}</p>
                      <p className="line-clamp-1 font-medium text-foreground">{p.title}</p>
                      <p className="text-foreground">{p.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <LeadCaptureCard source="viewing-trip" title="Book this viewing trip" description="An adviser confirms the homes, times and transfers with you." details={details} cta="Request booking" />
        </div>
      </main>
    </div>
  );
}

function L({ t, children }: { t: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-xs font-semibold uppercase text-muted-foreground">{t}</span><div className="mt-1">{children}</div></label>;
}
