import { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import PropertyCard from "@/components/PropertyCard";
import { EditorialCta, EditorialSectionHeader, PublicPageHero } from "@/components/PublicEditorial";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProperties } from "@/hooks/useProperties";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { newPagesCopy } from "@/content/newPagesCopy";
import heroImage from "@/assets/destinations/istanbul-cinematic.webp";

// Indicative gross long-let yield ranges per district — planning assumptions, not guarantees.
export const DISTRICTS = [
  { name: "Esenyurt", side: "European", gross: 7.5, key: "esenyurt" as const },
  { name: "Beylikdüzü", side: "European", gross: 6.5, key: "beylikduzu" as const },
  { name: "Küçükçekmece", side: "European", gross: 6.0, key: "kucukcekmece" as const },
  { name: "Başakşehir", side: "European", gross: 5.5, key: "basaksehir" as const },
  { name: "Bağcılar", side: "European", gross: 6.0, key: "bagcilar" as const },
  { name: "Zeytinburnu", side: "European", gross: 5.0, key: "zeytinburnu" as const },
  { name: "Şişli", side: "European", gross: 4.5, key: "sisli" as const },
  { name: "Kağıthane", side: "European", gross: 5.0, key: "kagithane" as const },
  { name: "Kadıköy", side: "Asian", gross: 4.0, key: "kadikoy" as const },
  { name: "Ataşehir", side: "Asian", gross: 4.5, key: "atasehir" as const },
  { name: "Üsküdar", side: "Asian", gross: 4.0, key: "uskudar" as const },
  { name: "Kartal / Pendik / Maltepe", side: "Asian", gross: 5.5, key: "kartal" as const },
];

export function netYield(i: { price: number; monthlyRent: number; occupancy: number; managementPct: number; annualCosts: number; taxPct: number }) {
  const gross = i.monthlyRent * 12 * (i.occupancy / 100);
  const afterMgmt = gross * (1 - i.managementPct / 100) - i.annualCosts;
  const net = afterMgmt > 0 ? afterMgmt * (1 - i.taxPct / 100) : afterMgmt;
  return { grossIncome: gross, netIncome: net, grossYield: i.price ? (i.monthlyRent * 12 / i.price) * 100 : 0, netYield: i.price ? (net / i.price) * 100 : 0 };
}

const fmt = (n: number) => `€${Math.round(n).toLocaleString("en-US")}`;

export default function IstanbulRentalYield() {
  const { lang } = useTranslation();
  const c = newPagesCopy(lang).yield;
  const [district, setDistrict] = useState(DISTRICTS[2]);
  const [price, setPrice] = useState(200000);
  const [monthlyRent, setMonthlyRent] = useState(Math.round((200000 * DISTRICTS[2].gross) / 100 / 12));
  const [occupancy, setOccupancy] = useState(92);
  const [managementPct, setManagementPct] = useState(8);
  const [annualCosts, setAnnualCosts] = useState(1200);
  const [taxPct, setTaxPct] = useState(15);
  const r = netYield({ price, monthlyRent, occupancy, managementPct, annualCosts, taxPct });

  const pick = (d: (typeof DISTRICTS)[number]) => {
    setDistrict(d);
    setMonthlyRent(Math.round((price * d.gross) / 100 / 12));
  };

  const { properties, loading } = useProperties("Istanbul");
  const samples = useMemo(() => {
    const key = district.name.split(" ")[0].toLowerCase().slice(0, 5);
    const list = (properties as any[]).filter((p) => (p.property_district || "").toLowerCase().startsWith(key));
    return (list.length ? list : (properties as any[])).slice(0, 3);
  }, [properties, district]);

  const field = (id: string, label: string, value: number, set: (n: number) => void, suffix?: string) => (
    <div>
      <Label htmlFor={id}>{label}{suffix ? ` (${suffix})` : ""}</Label>
      <Input id={id} type="number" min={0} value={value} onChange={(e) => set(Number(e.target.value) || 0)} className="mt-1.5" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <PublicPageHero compact eyebrow={c.eyebrow} title={c.title} description={c.description} image={heroImage} imageAlt={c.imageAlt} primaryLabel={c.viewHomes} primaryTo="/istanbul" />

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <EditorialSectionHeader eyebrow={c.overviewEyebrow} title={c.overviewTitle} description={c.overviewDesc} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DISTRICTS.map((d) => (
              <button key={d.name} type="button" onClick={() => pick(d)} className={cn("rounded-lg border p-4 text-left transition-colors", district.name === d.name ? "border-gold bg-ivory" : "border-navy/10 hover:border-gold/60")}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-foreground">{d.name}</span>
                  <span className="text-lg font-semibold text-gold-foreground">~{d.gross}%</span>
                </div>
                <p className="text-xs uppercase text-muted-foreground">{d.side === "Asian" ? c.asian : c.european}</p>
                <p className="mt-2 text-sm text-muted-foreground">{c.profiles[d.key]}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <EditorialSectionHeader eyebrow={c.calcEyebrow} title={c.calcTitle.replace("{district}", district.name)} description={c.calcDesc} />
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="grid gap-4 sm:grid-cols-2">
              {field("price", c.price, price, setPrice, "€")}
              {field("rent", c.rent, monthlyRent, setMonthlyRent, "€")}
              {field("occ", c.occupancy, occupancy, setOccupancy, "%")}
              {field("mgmt", c.management, managementPct, setManagementPct, c.ofRent)}
              {field("costs", c.costs, annualCosts, setAnnualCosts, "€")}
              {field("tax", c.tax, taxPct, setTaxPct, "%")}
            </div>
            <div className="rounded-lg bg-navy p-6 text-navy-foreground shadow-[var(--shadow-luxe)]">
              <p className="text-xs uppercase text-gold">{c.result}</p>
              <p className="mt-2 text-5xl font-semibold">{r.netYield.toFixed(2)}%</p>
              <p className="text-sm text-navy-foreground/75">{c.perYear}</p>
              <dl className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between"><dt>{c.grossYield}</dt><dd>{r.grossYield.toFixed(2)}%</dd></div>
                <div className="flex justify-between"><dt>{c.incomeYear}</dt><dd>{fmt(r.grossIncome)}</dd></div>
                <div className="flex justify-between"><dt>{c.netYear}</dt><dd>{fmt(r.netIncome)}</dd></div>
                <div className="flex justify-between"><dt>{c.netMonth}</dt><dd>{fmt(r.netIncome / 12)}</dd></div>
              </dl>
              <p className="mt-6 text-xs text-navy-foreground/60">{c.disclaimer}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <EditorialSectionHeader eyebrow={c.samplesEyebrow} title={c.samplesTitle.replace("{district}", district.name)} />
          {loading ? <p className="text-muted-foreground">{c.loading}</p> : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {samples.map((p: any, i: number) => <PropertyCard key={p.id} property={p} priority={i === 0} />)}
            </div>
          )}
        </section>

        <EditorialCta eyebrow={c.ctaEyebrow} title={c.ctaTitle} description={c.ctaDesc} primaryLabel={c.ctaPrimary} primaryTo="/contact-us" secondaryLabel={c.ctaSecondary} secondaryTo="/investment-calculator" />
      </main>
    </div>
  );
}
