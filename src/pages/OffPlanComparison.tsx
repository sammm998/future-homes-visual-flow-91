import { useMemo } from "react";
import Navigation from "@/components/Navigation";
import { EditorialCta, EditorialSectionHeader, PublicPageHero } from "@/components/PublicEditorial";
import { useProperties } from "@/hooks/useProperties";
import { buildPropertyUrl } from "@/utils/slugHelpers";
import { Link } from "@/lib/router-compat";
import { ExternalLink } from "lucide-react";
import heroImage from "@/assets/destinations/dubai-cinematic.webp";

const ROWS: { topic: string; turkey: string; dubai: string }[] = [
  { topic: "Typical down payment", turkey: "30–50% at contract", dubai: "10–20% at booking" },
  { topic: "Payment plan", turkey: "Instalments until delivery, sometimes 0% interest up to 24–36 months", dubai: "Construction-linked plans, often 60/40 or post-handover plans" },
  { topic: "Price timeline", turkey: "Prices usually rise in phases as construction progresses", dubai: "Developers raise prices per launch phase; early-phase buyers pay least" },
  { topic: "Buyer protection", turkey: "Pre-sale contract at a notary; title deed or floor easement (kat irtifakı) registered at TKGM", dubai: "Payments into a RERA-regulated escrow account (Law No. 8 of 2007); Oqood registration with Dubai Land Department" },
  { topic: "Developer guarantees", turkey: "Contractual delivery date, penalty clauses, bank guarantee letters on some projects", dubai: "Escrow release only against verified construction progress; structural warranty by law" },
  { topic: "Title deed", turkey: "Tapu issued on completion (or kat irtifakı before)", dubai: "Oqood during build, title deed on handover" },
  { topic: "Resale before delivery", turkey: "Possible by assignment, depends on developer", dubai: "Common after a set % is paid, developer NOC needed" },
];

const LINKS = [
  { label: "TKGM – Turkish Land Registry", href: "https://www.tkgm.gov.tr/" },
  { label: "Dubai Land Department", href: "https://dubailand.gov.ae/" },
];

export default function OffPlanComparison() {
  const { properties: tr } = useProperties("Antalya");
  const { properties: ist } = useProperties("Istanbul");
  const { properties: dxb } = useProperties("Dubai");

  const timeline = useMemo(() => {
    const pickRows = (rows: any[], country: string) =>
      rows.filter((p) => p.building_complete_date && /construction/i.test(p.status || ""))
        .map((p) => ({ ...p, country }));
    return [...pickRows(tr as any[], "Turkey"), ...pickRows(ist as any[], "Turkey"), ...pickRows(dxb as any[], "Dubai")]
      .sort((a, b) => a.building_complete_date.localeCompare(b.building_complete_date));
  }, [tr, ist, dxb]);

  const byYear = useMemo(() => {
    const m = new Map<string, { Turkey: number; Dubai: number }>();
    timeline.forEach((p) => {
      const y = p.building_complete_date.slice(0, 4);
      const v = m.get(y) ?? { Turkey: 0, Dubai: 0 };
      v[p.country as "Turkey" | "Dubai"]++;
      m.set(y, v);
    });
    return [...m.entries()].sort();
  }, [timeline]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <PublicPageHero compact eyebrow="Off-plan comparison" title="Off-plan in Turkey vs Dubai" description="Delivery dates, payment and price timelines and developer guarantees side by side — with real off-plan projects we are selling now." image={heroImage} imageAlt="Dubai skyline with towers under construction" primaryLabel="Off-plan in Turkey" primaryTo="/off-plan-property-turkey" secondaryLabel="Dubai homes" secondaryTo="/dubai" />

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <EditorialSectionHeader eyebrow="Side by side" title="How the two markets compare" />
          <div className="overflow-x-auto rounded-lg border border-navy/10">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-navy text-navy-foreground">
                <tr><th className="p-4">Topic</th><th className="p-4">Turkey</th><th className="p-4">Dubai</th></tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.topic} className="border-t border-navy/10 align-top">
                    <th className="p-4 font-semibold text-foreground">{r.topic}</th>
                    <td className="p-4 text-muted-foreground">{r.turkey}</td>
                    <td className="p-4 text-muted-foreground">{r.dubai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 flex flex-wrap gap-4 text-sm">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold underline-offset-4 hover:underline">{l.label}<ExternalLink className="h-3.5 w-3.5" /></a>
            ))}
          </p>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <EditorialSectionHeader eyebrow="Delivery dates" title="When our off-plan projects complete" description="Number of projects under construction per expected delivery year." />
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {byYear.map(([y, v]) => (
              <div key={y} className="rounded-lg border border-navy/10 p-4">
                <p className="text-2xl font-semibold text-foreground">{y}</p>
                <p className="text-sm text-muted-foreground">Turkey: {v.Turkey} · Dubai: {v.Dubai}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <EditorialSectionHeader eyebrow="Projects" title="Off-plan projects by delivery date" />
          <div className="overflow-x-auto rounded-lg border border-navy/10">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-ivory"><tr><th className="p-3">REF</th><th className="p-3">Project</th><th className="p-3">Country</th><th className="p-3">From</th><th className="p-3">Delivery</th></tr></thead>
              <tbody>
                {timeline.slice(0, 30).map((p) => (
                  <tr key={p.id} className="border-t border-navy/10">
                    <td className="p-3">{p.ref_no}</td>
                    <td className="p-3"><Link to={buildPropertyUrl(p, "en")} className="font-semibold hover:underline">{p.title}</Link></td>
                    <td className="p-3 text-muted-foreground">{p.country}</td>
                    <td className="p-3 text-muted-foreground">{p.starting_price_eur ? `€${p.starting_price_eur}` : p.price}</td>
                    <td className="p-3 text-muted-foreground">{p.building_complete_date?.slice(0, 7)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <EditorialCta eyebrow="Off-plan advice" title="Not sure which market fits you?" description="We compare payment plans and guarantees for the projects on your shortlist." primaryLabel="Contact an expert" primaryTo="/contact-us" secondaryLabel="Where should I buy?" secondaryTo="/where-should-i-buy" />
      </main>
    </div>
  );
}
