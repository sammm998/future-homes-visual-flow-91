import { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import { PublicPageHero, EditorialSectionHeader } from "@/components/PublicEditorial";
import LeadCaptureCard from "@/components/LeadCaptureCard";
import { Input } from "@/components/ui/input";
import { MARKETS, SCENARIOS, calculate, type MarketKey } from "@/lib/investmentCalc";
import heroImage from "@/assets/hero-modern-estate.jpg";
import { cn } from "@/lib/utils";

const eur = (n: number) => `€${Math.round(n).toLocaleString("en-US")}`;
const pct = (n: number) => `${n.toFixed(1)} %`;

export default function InvestmentCalculator() {
  const [market, setMarket] = useState<MarketKey>("antalya");
  const [price, setPrice] = useState(200000);
  const [down, setDown] = useState(100);
  const [rate, setRate] = useState(7);
  const [nightly, setNightly] = useState(MARKETS.antalya.defaults.nightly);
  const [occ, setOcc] = useState(MARKETS.antalya.defaults.occupancy);
  const [mgmt, setMgmt] = useState(MARKETS.antalya.defaults.managementPct);

  const pick = (k: MarketKey) => {
    setMarket(k);
    setNightly(MARKETS[k].defaults.nightly);
    setOcc(MARKETS[k].defaults.occupancy);
    setMgmt(MARKETS[k].defaults.managementPct);
  };

  const input = { price, downPaymentPct: down, nightly, occupancy: occ, managementPct: mgmt, loanRatePct: rate };
  const base = useMemo(() => calculate(market, input), [market, price, down, nightly, occ, mgmt, rate]);
  const compare = (Object.keys(MARKETS) as MarketKey[]).map((k) => ({
    k,
    r: calculate(k, { ...input, nightly: MARKETS[k].defaults.nightly, occupancy: MARKETS[k].defaults.occupancy, managementPct: MARKETS[k].defaults.managementPct }),
  }));
  const m = MARKETS[market];

  const field = (label: string, value: number, set: (n: number) => void, suffix: string) => (
    <label className="block">
      <span className="text-xs font-semibold uppercase text-muted-foreground">{label}</span>
      <div className="mt-1 flex items-center gap-2">
        <Input type="number" inputMode="decimal" value={value} onChange={(e) => set(Number(e.target.value) || 0)} />
        <span className="w-10 text-sm text-muted-foreground">{suffix}</span>
      </div>
    </label>
  );

  return (
    <div className="min-h-screen bg-ivory">
      <Navigation />
      <PublicPageHero compact eyebrow="Investment calculator" title="Compare Antalya, Dubai and Bali" description="Estimate purchase costs, rental income, fees and net cash flow. These are calculations, not promises." image={heroImage} />
      <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {(Object.keys(MARKETS) as MarketKey[]).map((k) => (
            <button key={k} onClick={() => pick(k)} className={cn("min-h-11 rounded-full border px-5 text-sm font-semibold transition-colors", market === k ? "border-navy bg-navy text-navy-foreground" : "border-border bg-card text-foreground hover:border-gold")}>{MARKETS[k].label}</button>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
          <div className="space-y-4 rounded-lg border border-border bg-card p-5">
            {field("Purchase price", price, setPrice, "€")}
            {field("Cash share of price", down, setDown, "%")}
            {down < 100 ? field("Loan interest", rate, setRate, "%") : null}
            {field("Nightly rate", nightly, setNightly, "€")}
            {field("Occupancy", occ, setOcc, "%")}
            {field("Management fee", mgmt, setMgmt, "%")}
          </div>
          <div className="space-y-6">
            <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(11rem,1fr))]">
              {[
                ["Cash needed", eur(base.cashInvested)],
                ["Gross rent / year", eur(base.gross)],
                ["Net cash flow / month", eur(base.monthly)],
                ["Gross yield", pct(base.grossYield)],
                ["Net return on cash", pct(base.cashOnCash)],
              ].map(([l, v]) => (
                <div key={l} className="rounded-lg bg-navy p-4 text-navy-foreground">
                  <p className="text-[10px] font-semibold uppercase text-gold">{l}</p>
                  <p className="mt-2 text-2xl font-semibold">{v}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-5 text-sm">
                <h3 className="mb-3 font-semibold text-foreground">Purchase costs</h3>
                {m.purchaseCosts.map((c) => <Row key={c.label} l={`${c.label} (${c.pct} %)`} v={eur((price * c.pct) / 100)} />)}
                <Row l="Total" v={eur(base.purchaseCosts)} strong />
              </div>
              <div className="rounded-lg border border-border bg-card p-5 text-sm">
                <h3 className="mb-3 font-semibold text-foreground">Yearly costs</h3>
                {m.yearlyPct.map((c) => <Row key={c.label} l={c.label} v={eur((price * c.pct) / 100)} />)}
                <Row l={`Management (${mgmt} %)`} v={eur(base.management)} />
                {base.yearlyInterest ? <Row l="Loan interest" v={eur(base.yearlyInterest)} /> : null}
                <Row l={`Rental tax (${m.rentalTaxPct} %)`} v={eur(base.tax)} />
                <Row l="Net income / year" v={eur(base.net)} strong />
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-3 font-semibold text-foreground">Risk scenarios</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[30rem] text-sm">
                  <thead><tr className="text-left text-xs uppercase text-muted-foreground"><th className="py-2">Scenario</th><th>Nights</th><th>Gross</th><th>Net / year</th><th>Net / month</th></tr></thead>
                  <tbody>
                    {SCENARIOS.map((s) => {
                      const r = calculate(market, input, s.occFactor, s.rateFactor);
                      return <tr key={s.key} className="border-t border-border"><td className="py-2 font-medium">{s.label}</td><td>{r.nights}</td><td>{eur(r.gross)}</td><td className={r.net < 0 ? "text-destructive" : ""}>{eur(r.net)}</td><td>{eur(r.monthly)}</td></tr>;
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-14">
          <EditorialSectionHeader eyebrow="Side by side" title="Same budget, three markets" description="Uses each market's typical rate, occupancy and management fee." />
          <div className="grid gap-4 md:grid-cols-3">
            {compare.map(({ k, r }) => (
              <div key={k} className={cn("rounded-lg border bg-card p-5", k === market ? "border-gold" : "border-border")}>
                <p className="font-semibold text-foreground">{MARKETS[k].label}</p>
                <div className="mt-3 text-sm">
                  <Row l="Purchase costs" v={eur(r.purchaseCosts)} />
                  <Row l="Gross yield" v={pct(r.grossYield)} />
                  <Row l="Net / month" v={eur(r.monthly)} />
                  <Row l="Net return on cash" v={pct(r.cashOnCash)} strong />
                </div>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-8 rounded-lg bg-secondary p-4 text-xs leading-relaxed text-muted-foreground">
          These are calculations, not promises. Figures use indicative public rates (2025/26) and your own inputs. Taxes, fees, rental rules and permits change and differ by property. Always check with a licensed local adviser before investing.
        </p>

        <div className="mt-10">
          <LeadCaptureCard source="investment-calculator" title="Send me this calculation" description="An adviser reviews your numbers and sends matching homes." details={`Market: ${m.label}\nPrice: ${eur(price)}, cash ${down}%, nightly ${eur(nightly)}, occupancy ${occ}%, management ${mgmt}%\nNet/month: ${eur(base.monthly)}, return on cash ${pct(base.cashOnCash)}`} />
        </div>
      </main>
    </div>
  );
}

function Row({ l, v, strong }: { l: string; v: string; strong?: boolean }) {
  return <div className={cn("flex justify-between gap-4 border-b border-border/60 py-1.5 last:border-0", strong && "font-semibold text-foreground")}><span className="text-muted-foreground">{l}</span><span>{v}</span></div>;
}
