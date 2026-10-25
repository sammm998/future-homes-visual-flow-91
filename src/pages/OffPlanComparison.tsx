import { useMemo } from "react";
import Navigation from "@/components/Navigation";
import { EditorialCta, EditorialSectionHeader, PublicPageHero } from "@/components/PublicEditorial";
import { useProperties } from "@/hooks/useProperties";
import { buildPropertyUrl } from "@/utils/slugHelpers";
import { Link } from "@/lib/router-compat";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { newPagesCopy } from "@/content/newPagesCopy";
import heroImage from "@/assets/destinations/dubai-cinematic.webp";

const LINKS = [
  { key: "tkgmLink" as const, href: "https://www.tkgm.gov.tr/" },
  { key: "dldLink" as const, href: "https://dubailand.gov.ae/" },
];

export default function OffPlanComparison() {
  const { lang } = useTranslation();
  const c = newPagesCopy(lang).offplan;
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
        <PublicPageHero compact eyebrow={c.eyebrow} title={c.title} description={c.description} image={heroImage} imageAlt={c.imageAlt} primaryLabel={c.primary} primaryTo="/off-plan-property-turkey" secondaryLabel={c.secondary} secondaryTo="/dubai" />

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <EditorialSectionHeader eyebrow={c.tableEyebrow} title={c.tableTitle} />
          <div className="overflow-x-auto rounded-lg border border-navy/10">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-navy text-navy-foreground">
                <tr><th className="p-4">{c.topic}</th><th className="p-4">{c.turkey}</th><th className="p-4">{c.dubai}</th></tr>
              </thead>
              <tbody>
                {c.rows.map((r) => (
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
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold underline-offset-4 hover:underline">{c[l.key]}<ExternalLink className="h-3.5 w-3.5" /></a>
            ))}
          </p>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <EditorialSectionHeader eyebrow={c.deliveryEyebrow} title={c.deliveryTitle} description={c.deliveryDesc} />
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {byYear.map(([y, v]) => (
              <div key={y} className="rounded-lg border border-navy/10 p-4">
                <p className="text-2xl font-semibold text-foreground">{y}</p>
                <p className="text-sm text-muted-foreground">{c.turkey}: {v.Turkey} · {c.dubai}: {v.Dubai}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <EditorialSectionHeader eyebrow={c.projectsEyebrow} title={c.projectsTitle} />
          <div className="overflow-x-auto rounded-lg border border-navy/10">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-ivory"><tr><th className="p-3">REF</th><th className="p-3">{c.project}</th><th className="p-3">{c.country}</th><th className="p-3">{c.from}</th><th className="p-3">{c.delivery}</th></tr></thead>
              <tbody>
                {timeline.slice(0, 30).map((p) => (
                  <tr key={p.id} className="border-t border-navy/10">
                    <td className="p-3">{p.ref_no}</td>
                    <td className="p-3"><Link to={buildPropertyUrl(p, lang)} className="font-semibold hover:underline">{p.title}</Link></td>
                    <td className="p-3 text-muted-foreground">{p.country === "Dubai" ? c.dubai : c.turkey}</td>
                    <td className="p-3 text-muted-foreground">{p.starting_price_eur ? `€${p.starting_price_eur}` : p.price}</td>
                    <td className="p-3 text-muted-foreground">{p.building_complete_date?.slice(0, 7)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <EditorialCta eyebrow={c.ctaEyebrow} title={c.ctaTitle} description={c.ctaDesc} primaryLabel={c.ctaPrimary} primaryTo="/contact-us" secondaryLabel={c.ctaSecondary} secondaryTo="/where-should-i-buy" />
      </main>
    </div>
  );
}
