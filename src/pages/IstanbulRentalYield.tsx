import { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import PropertyCard from "@/components/PropertyCard";
import { EditorialCta, EditorialSectionHeader, PublicPageHero } from "@/components/PublicEditorial";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProperties } from "@/hooks/useProperties";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/destinations/istanbul-cinematic.webp";

// Indicative gross long-let yield ranges per district — planning assumptions, not guarantees.
export const DISTRICTS = [
  { name: "Esenyurt", side: "European", gross: 7.5, profile: "Entry-level prices, high tenant demand from families and students." },
  { name: "Beylikdüzü", side: "European", gross: 6.5, profile: "Newer complexes near the coast and metrobus line." },
  { name: "Küçükçekmece", side: "European", gross: 6.0, profile: "Large regeneration projects, lake and airport access." },
  { name: "Başakşehir", side: "European", gross: 5.5, profile: "Family compounds, city hospital and new metro links." },
  { name: "Bağcılar", side: "European", gross: 6.0, profile: "Dense, central-west residential area with steady demand." },
  { name: "Zeytinburnu", side: "European", gross: 5.0, profile: "Close to the historic peninsula and Marmaray." },
  { name: "Şişli", side: "European", gross: 4.5, profile: "Business district, corporate and short-stay tenants." },
  { name: "Kağıthane", side: "European", gross: 5.0, profile: "Transforming area next to Levent and Maslak." },
  { name: "Kadıköy", side: "Asian", gross: 4.0, profile: "Prime lifestyle area, high prices and low vacancy." },
  { name: "Ataşehir", side: "Asian", gross: 4.5, profile: "Financial centre, modern towers." },
  { name: "Üsküdar", side: "Asian", gross: 4.0, profile: "Bosphorus side, established and in demand." },
  { name: "Kartal / Pendik / Maltepe", side: "Asian", gross: 5.5, profile: "Coastal Asian side, metro and Sabiha Gökçen airport." },
];

export function netYield(i: { price: number; monthlyRent: number; occupancy: number; managementPct: number; annualCosts: number; taxPct: number }) {
  const gross = i.monthlyRent * 12 * (i.occupancy / 100);
  const afterMgmt = gross * (1 - i.managementPct / 100) - i.annualCosts;
  const net = afterMgmt > 0 ? afterMgmt * (1 - i.taxPct / 100) : afterMgmt;
  return { grossIncome: gross, netIncome: net, grossYield: i.price ? (i.monthlyRent * 12 / i.price) * 100 : 0, netYield: i.price ? (net / i.price) * 100 : 0 };
}

const fmt = (n: number) => `€${Math.round(n).toLocaleString("en-US")}`;

export default function IstanbulRentalYield() {
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
        <PublicPageHero compact eyebrow="Istanbul rental-yield report" title="Rental yields in Istanbul, district by district" description="Compare indicative gross yields across 12 Istanbul districts, see real homes we have for sale there and calculate your own net yield after costs and tax." image={heroImage} imageAlt="Istanbul skyline over the Bosphorus" primaryLabel="View Istanbul homes" primaryTo="/istanbul" />

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <EditorialSectionHeader eyebrow="District overview" title="Indicative gross yields" description="Long-term rental yields before costs. These are planning estimates based on typical asking prices and rents — always check current rents for the specific building." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DISTRICTS.map((d) => (
              <button key={d.name} type="button" onClick={() => pick(d)} className={cn("rounded-lg border p-4 text-left transition-colors", district.name === d.name ? "border-gold bg-ivory" : "border-navy/10 hover:border-gold/60")}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-foreground">{d.name}</span>
                  <span className="text-lg font-semibold text-gold-foreground">~{d.gross}%</span>
                </div>
                <p className="text-xs uppercase text-muted-foreground">{d.side} side</p>
                <p className="mt-2 text-sm text-muted-foreground">{d.profile}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <EditorialSectionHeader eyebrow="Net yield calculator" title={`Your net yield in ${district.name}`} description="Change any number. Rent is pre-filled from the district's indicative yield." />
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="grid gap-4 sm:grid-cols-2">
              {field("price", "Purchase price", price, setPrice, "€")}
              {field("rent", "Monthly rent", monthlyRent, setMonthlyRent, "€")}
              {field("occ", "Occupancy", occupancy, setOccupancy, "%")}
              {field("mgmt", "Management fee", managementPct, setManagementPct, "% of rent")}
              {field("costs", "Annual costs (maintenance, insurance, aidat)", annualCosts, setAnnualCosts, "€")}
              {field("tax", "Income tax on rent", taxPct, setTaxPct, "%")}
            </div>
            <div className="rounded-lg bg-navy p-6 text-navy-foreground shadow-[var(--shadow-luxe)]">
              <p className="text-xs uppercase text-gold">Result</p>
              <p className="mt-2 text-5xl font-semibold">{r.netYield.toFixed(2)}%</p>
              <p className="text-sm text-navy-foreground/75">net yield per year</p>
              <dl className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between"><dt>Gross yield</dt><dd>{r.grossYield.toFixed(2)}%</dd></div>
                <div className="flex justify-between"><dt>Rental income / year</dt><dd>{fmt(r.grossIncome)}</dd></div>
                <div className="flex justify-between"><dt>Net income / year</dt><dd>{fmt(r.netIncome)}</dd></div>
                <div className="flex justify-between"><dt>Net income / month</dt><dd>{fmt(r.netIncome / 12)}</dd></div>
              </dl>
              <p className="mt-6 text-xs text-navy-foreground/60">Estimates, not promises. Turkish rental tax is progressive; ask an accountant for your exact rate.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <EditorialSectionHeader eyebrow="Sample listings" title={`Homes for sale in and around ${district.name}`} />
          {loading ? <p className="text-muted-foreground">Loading homes…</p> : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {samples.map((p: any, i: number) => <PropertyCard key={p.id} property={p} priority={i === 0} />)}
            </div>
          )}
        </section>

        <EditorialCta eyebrow="Istanbul investment" title="Want a yield check on a specific home?" description="Our Istanbul team can send real rent comparisons for the buildings you shortlist." primaryLabel="Contact an expert" primaryTo="/contact-us" secondaryLabel="Investment calculator" secondaryTo="/investment-calculator" />
      </main>
    </div>
  );
}
