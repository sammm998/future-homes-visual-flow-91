import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MapPin } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import { useProperties } from "@/hooks/useProperties";

const L: Record<string, Record<string, string>> = {
  en: { trend: "Price development in", sub: "Average asking price per m², last:", m: "mo", this: "asking price", avg: "Area average", diff: "vs area average", none: "Not enough listings for this period yet.", src: "Based on Future Homes listings in the area.", similar: "Similar homes in", map: "Map & location", open: "Open in Google Maps" },
  sv: { trend: "Prisutveckling i", sub: "Genomsnittligt utgångspris per m², senaste:", m: "mån", this: "utgångspris", avg: "Snitt i området", diff: "jämfört med områdets snitt", none: "Inte tillräckligt många bostäder för perioden ännu.", src: "Baserat på Future Homes bostäder i området.", similar: "Liknande bostäder i", map: "Karta & läge", open: "Öppna i Google Maps" },
};

const num = (v: unknown) => {
  const m = String(v ?? "").replace(/,/g, "").match(/\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : 0;
};
const cityOf = (loc?: string | null) => (loc || "").split(",")[0].trim().toLowerCase();
const fmt = (n: number) => `€${Math.round(n).toLocaleString("en-US")}`;

interface Props {
  property: any;
  lang: string;
}

export const PropertyAreaInsights = ({ property, lang }: Props) => {
  const tr = L[lang] || L.en;
  const { properties } = useProperties();
  const [months, setMonths] = useState(12);
  const city = cityOf(property.location);
  const cityLabel = (property.location || "").split(",")[0].trim();

  const area = useMemo(
    () => (properties || []).filter((p: any) => cityOf(p.location) === city && num(p.price) > 0),
    [properties, city],
  );

  const ownPpm = num(property.price) && num(property.area || property.sizes_m2) ? num(property.price) / num(property.area || property.sizes_m2) : 0;

  const { series, avg } = useMemo(() => {
    const since = new Date();
    since.setMonth(since.getMonth() - months + 1);
    since.setDate(1);
    const buckets = new Map<string, number[]>();
    for (let i = 0; i < months; i++) {
      const d = new Date(since);
      d.setMonth(since.getMonth() + i);
      buckets.set(d.toISOString().slice(0, 7), []);
    }
    const all: number[] = [];
    area.forEach((p: any) => {
      const s = num(p.sizes_m2);
      if (!s) return;
      const ppm = num(p.price) / s;
      if (ppm < 300 || ppm > 30000) return;
      all.push(ppm);
      const k = String(p.created_at || "").slice(0, 7);
      buckets.get(k)?.push(ppm);
    });
    // Running average so the line stays continuous between sparse months
    let carry: number[] = [];
    const series = [...buckets.entries()].map(([k, v]) => {
      carry = [...carry, ...v].slice(-25);
      const d = new Date(k + "-01");
      return { label: d.toLocaleDateString(lang, { month: "short", year: "2-digit" }), value: carry.length ? Math.round(carry.reduce((a, b) => a + b, 0) / carry.length) : null };
    });
    return { series, avg: all.length ? all.reduce((a, b) => a + b, 0) / all.length : 0 };
  }, [area, months, lang]);

  const hasData = series.filter((s) => s.value).length >= 2;
  const diff = ownPpm && avg ? ((ownPpm - avg) / avg) * 100 : null;

  const ownPrice = num(property.price);
  const similar = useMemo(
    () =>
      area
        .filter((p: any) => p.id !== property.id && String(p.ref_no) !== String(property.refNo) && String(p.status || "").toLowerCase() !== "sold")
        .sort((a: any, b: any) => Math.abs(num(a.price) - ownPrice) - Math.abs(num(b.price) - ownPrice))
        .slice(0, 4),
    [area, property.id, property.refNo, ownPrice],
  );

  const embed =
    property.google_maps_embed && String(property.google_maps_embed).startsWith("https://www.google.com/maps/embed")
      ? property.google_maps_embed
      : `https://maps.google.com/maps?q=${encodeURIComponent([property.property_district, property.location].filter(Boolean).join(", "))}&z=13&output=embed`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([property.property_district, property.location].filter(Boolean).join(", "))}`;

  return (
    <div className="space-y-16 sm:space-y-20">
      {/* Price development */}
      <section className="border-t border-border pt-10">
        <h2 className="text-2xl font-semibold text-navy sm:text-3xl">
          {tr.trend} {cityLabel}
        </h2>
        <p className="mt-6 text-center text-sm text-muted-foreground">{tr.sub}</p>
        <div className="mx-auto mt-3 grid max-w-xl grid-cols-4 overflow-hidden rounded-md border border-border">
          {[6, 12, 24, 36].map((m) => (
            <button
              key={m}
              onClick={() => setMonths(m)}
              className={`py-3 text-sm font-semibold transition ${months === m ? "bg-navy text-navy-foreground" : "bg-background text-navy hover:bg-ivory"}`}
            >
              {m} {tr.m}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-4 text-center sm:grid-cols-2">
          {ownPpm > 0 && (
            <div>
              <p className="text-sm text-muted-foreground">REF {property.refNo} {tr.this}</p>
              <p className="mt-1 text-3xl font-semibold text-navy">{fmt(ownPpm)}/m²</p>
            </div>
          )}
          {avg > 0 && (
            <div>
              <p className="text-sm text-muted-foreground">{tr.avg}</p>
              <p className="mt-1 text-3xl font-semibold text-gold">{fmt(avg)}/m²</p>
              {diff !== null && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {diff > 0 ? "+" : ""}{diff.toFixed(0)}% {tr.diff}
                </p>
              )}
            </div>
          )}
        </div>
        <div className="relative mt-8 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ left: 8, right: 8, top: 10 }}>
              <defs>
                <linearGradient id="ppm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--gold))" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="hsl(var(--gold))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tickFormatter={(v) => `€${(v / 1000).toFixed(1)}k`} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} width={52} domain={["auto", "auto"]} />
              <Tooltip formatter={(v: number) => [`${fmt(v)}/m²`, ""]} contentStyle={{ borderRadius: 6, border: "1px solid hsl(var(--border))" }} />
              <Area type="monotone" dataKey="value" stroke="hsl(var(--navy))" strokeWidth={2} fill="url(#ppm)" connectNulls />
            </AreaChart>
          </ResponsiveContainer>
          {!hasData && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 text-sm text-muted-foreground">{tr.none}</div>
          )}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{tr.src}</p>
      </section>

      {/* Map */}
      <section className="border-t border-border pt-10">
        <h2 className="text-2xl font-semibold text-navy sm:text-3xl">{tr.map}</h2>
        <p className="mt-4 flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-5 w-5 text-gold" />
          {[property.property_district, property.location].filter(Boolean).join(", ")}
        </p>
        <div className="mt-6 overflow-hidden rounded-md border border-border">
          <iframe title={tr.map} src={embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-[22rem] w-full border-0 sm:h-[28rem]" allowFullScreen />
        </div>
        <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-navy underline underline-offset-4 hover:text-gold">
          {tr.open}
        </a>
      </section>

      {/* Similar */}
      {similar.length > 0 && (
        <section className="border-t border-border pt-10">
          <h2 className="mb-8 text-2xl font-semibold text-navy sm:text-3xl">
            {tr.similar} {cityLabel}
          </h2>
          <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(16rem,1fr))]">
            {similar.map((p: any) => (
              <PropertyCard key={p.id} property={{ ...p, area: p.sizes_m2 || "", refNo: p.ref_no }} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default PropertyAreaInsights;
