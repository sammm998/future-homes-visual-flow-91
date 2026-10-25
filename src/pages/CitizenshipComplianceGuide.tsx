import Navigation from "@/components/Navigation";
import { EditorialCta, EditorialSectionHeader, PublicPageHero } from "@/components/PublicEditorial";
import { CITIZENSHIP_SOURCES, OfficialSources } from "@/components/OfficialSources";
import { useTranslation } from "@/hooks/useTranslation";
import { newPagesCopy } from "@/content/newPagesCopy";
import heroImage from "@/assets/destinations/istanbul-cinematic.webp";

const STEP_LINKS: ({ label: string; href: string } | null)[] = [
  { label: "GİB – Gelir İdaresi", href: "https://www.gib.gov.tr/" },
  null,
  { label: "Invest in Türkiye", href: "https://www.invest.gov.tr/en/investmentguide/pages/acquisition-of-turkish-citizenship-by-investment.aspx" },
  { label: "TKGM", href: "https://www.tkgm.gov.tr/" },
  null,
  { label: "e-İkamet", href: "https://e-ikamet.goc.gov.tr/" },
  { label: "NVI", href: "https://www.nvi.gov.tr/" },
];

export default function CitizenshipComplianceGuide() {
  const { lang } = useTranslation();
  const c = newPagesCopy(lang).guide;
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <PublicPageHero compact eyebrow={c.eyebrow} title={c.title} description={c.description} image={heroImage} imageAlt={c.imageAlt} primaryLabel={c.primary} primaryTo="/turkish-citizenship-by-investment" />
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <EditorialSectionHeader eyebrow={c.stepsEyebrow} title={c.stepsTitle} />
          <ol className="space-y-5">
            {c.steps.map((s, i) => (
              <li key={i} className="rounded-lg border border-navy/10 p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase text-gold-foreground">{c.step} {i + 1}</p>
                <h3 className="mt-1 text-xl font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-muted-foreground">{s.body}</p>
                <p className="mt-4 text-sm font-semibold text-foreground">{c.docs}</p>
                <ul className="mt-1 list-disc ps-5 text-sm text-muted-foreground">{s.docs.map((d) => <li key={d}>{d}</li>)}</ul>
                {STEP_LINKS[i] ? <a href={STEP_LINKS[i]!.href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold underline underline-offset-4">{STEP_LINKS[i]!.label} ↗</a> : null}
              </li>
            ))}
          </ol>
          <OfficialSources sources={CITIZENSHIP_SOURCES} />
          <p className="mt-6 text-sm text-muted-foreground">{c.note}</p>
        </section>
        <EditorialCta eyebrow={c.ctaEyebrow} title={c.ctaTitle} description={c.ctaDesc} primaryLabel={c.ctaPrimary} primaryTo="/contact-us" />
      </main>
    </div>
  );
}
