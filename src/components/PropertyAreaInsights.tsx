import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MapPin } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import { useProperties } from "@/hooks/useProperties";

const L: Record<string, Record<string, string>> = {
  en: { trend: "Price per m² in", sub: "Median asking price per m² by district — today's available units", this: "price per m²", avg: "Median in", diff: "vs median", units: "units", none: "Not enough priced units in this area yet.", src: "Calculated from the price and size of every available unit in our listings in", src2: "Asking prices, not completed sales. Updated automatically when listings change.", similar: "Similar homes in", map: "Map & location", open: "Open in Google Maps", this_d: "This home's district" },
  sv: { trend: "Pris per m² i", sub: "Medianpris per m² per område — dagens tillgängliga bostäder", this: "pris per m²", avg: "Median i", diff: "jämfört med medianen", units: "bostäder", none: "Inte tillräckligt många prissatta bostäder i området ännu.", src: "Beräknat från pris och storlek på varje tillgänglig bostad i våra annonser i", src2: "Utgångspriser, inte slutpriser. Uppdateras automatiskt när annonserna ändras.", similar: "Liknande bostäder i", map: "Karta & läge", open: "Öppna i Google Maps", this_d: "Den här bostadens område" },
};

const num = (v: unknown) => {
  const m = String(v ?? "").replace(/,/g, "").match(/\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : 0;
};
const cityOf = (loc?: string | null) => (loc || "").split(",")[0].trim().toLowerCase();
const districtKey = (name: string) => name.trim().toLowerCase().replace(/ı/g, "i").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const districtLabel = (name: string) => {
  const key = districtKey(name);
  if (key === "altintas") return "Altıntaş";
  if (key === "muratpsa" || key === "muratpasa") return "Muratpaşa";
  return name.trim();
};
const fmt = (n: number) => `€${Math.round(n).toLocaleString("en-US")}`;
const median = (a: number[]) => {
  if (!a.length) return 0;
  const s = [...a].sort((x, y) => x - y);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/** Real €/m² per unit: each apartment type's own price ÷ its own size. Listings
 * with a single size fall back to price ÷ size. Ranged sizes without unit data
 * are skipped, because "from" price ÷ smallest size is not reliable. */
export const unitPricesPerM2 = (p: any): number[] => {
  let types = p?.apartment_types;
  if (typeof types === "string") {
    try { types = JSON.parse(types.replace(/'/g, '"')); } catch { types = null; }
  }
  const out: number[] = [];
  if (Array.isArray(types)) {
    for (const t of types) {
      const price = num(t?.price), size = num(t?.size);
      if (price > 0 && size > 0) out.push(price / size);
    }
  }
  if (!out.length && !String(p?.sizes_m2 ?? "").includes("<>")) {
    const price = num(p?.price), size = num(p?.sizes_m2 ?? p?.area);
    if (price > 0 && size > 0) out.push(price / size);
  }
  return out.filter((v) => v >= 300 && v <= 30000);
};

interface Props {
  property: any;
  lang: string;
}

export const PropertyAreaInsights = ({ property, lang }: Props) => {
  const tr = L[lang] || L.en;
  const { properties } = useProperties();
  const city = cityOf(property.location);
  const cityLabel = (property.location || "").split(",")[0].trim();

  const area = useMemo(
    () => (properties || []).filter((p: any) => cityOf(p.location) === city && num(p.price) > 0 && String(p.status || "").toLowerCase() !== "sold"),
    [properties, city],
  );

  const ownUnits = unitPricesPerM2(property);
  const ownPpm = median(ownUnits);
  const ownMin = ownUnits.length ? Math.min(...ownUnits) : 0;
  const ownMax = ownUnits.length ? Math.max(...ownUnits) : 0;
  const ownDistrict = districtLabel(String(property.property_district || ""));

  const { districts, avg, unitCount } = useMemo(() => {
    const all: number[] = [];
    const byD = new Map<string, number[]>();
    area.forEach((p: any) => {
      const u = unitPricesPerM2(p);
      all.push(...u);
      const d = districtLabel(String(p.property_district || ""));
      // City-wide/unknown districts remain in the city median, not the district chart.
      if (!d || districtKey(d) === districtKey(cityLabel)) return;
      byD.set(d, [...(byD.get(d) || []), ...u]);
    });
    const districts = [...byD.entries()]
      .filter(([, v]) => v.length > 0)
      .map(([name, v]) => ({ name, value: Math.round(median(v)), count: v.length }))
      .sort((a, b) => b.value - a.value);
    const top = districts.slice(0, 10);
    const own = districts.find((d) => d.name.toLowerCase() === ownDistrict.toLowerCase());
    if (own && !top.includes(own)) top.push(own);
    top.sort((a, b) => b.value - a.value);
    return { districts: top, avg: median(all), unitCount: all.length };
  }, [area, cityLabel, ownDistrict]);

  const hasData = unitCount >= 3;
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
      {/* Price per m² */}
      <section className="border-t border-border pt-10">
        <h2 className="text-2xl font-semibold text-navy sm:text-3xl">
          {tr.trend} {cityLabel}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{tr.sub}</p>
        <div className="mt-8 grid gap-4 text-center sm:grid-cols-2">
          {ownPpm > 0 && (
            <div>
              <p className="text-sm text-muted-foreground">REF {property.refNo} {tr.this}</p>
              <p className="mt-1 text-3xl font-semibold text-navy">{fmt(ownPpm)}/m²</p>
              {ownUnits.length > 1 && <p className="mt-1 text-xs text-muted-foreground">{fmt(ownMin)} – {fmt(ownMax)}/m² · {ownUnits.length} {tr.units}</p>}
            </div>
          )}
          {hasData && (
            <div>
              <p className="text-sm text-muted-foreground">{tr.avg} {cityLabel}</p>
              <p className="mt-1 text-3xl font-semibold text-gold">{fmt(avg)}/m²</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {unitCount} {tr.units}{diff !== null && ` · ${diff > 0 ? "+" : ""}${diff.toFixed(0)}% ${tr.diff}`}
              </p>
            </div>
          )}
        </div>
        {hasData ? (
          <div className="mt-8 w-full" style={{ height: Math.max(220, districts.length * 38) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districts} layout="vertical" margin={{ left: 8, right: 24, top: 4 }}>
                <CartesianGrid stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `€${(v / 1000).toFixed(1)}k`} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }} tickLine={false} axisLine={false} />
                <Tooltip formatter={(v: number, _n, item: any) => [`${fmt(v)}/m² · ${item.payload.count} ${tr.units}`, ""]} cursor={{ fill: "hsl(var(--ivory))" }} contentStyle={{ borderRadius: 6, border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {districts.map((d) => (
                    <Cell key={d.name} fill={d.name.toLowerCase() === ownDistrict.toLowerCase() ? "hsl(var(--gold))" : "hsl(var(--navy))"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="mt-8 rounded-md bg-muted p-6 text-center text-sm text-muted-foreground">{tr.none}</p>
        )}
        {ownDistrict && hasData && (
          <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-gold" /> {tr.this_d}: {ownDistrict}</p>
        )}
        <p className="mt-3 text-xs text-muted-foreground">{tr.src} {cityLabel}. {tr.src2}</p>
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
