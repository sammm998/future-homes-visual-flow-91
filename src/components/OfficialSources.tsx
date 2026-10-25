import { ExternalLink, Landmark } from "lucide-react";

export type OfficialSource = { label: string; href: string; note: string };

export const TKGM_SOURCES: OfficialSource[] = [
  { label: "TKGM – General Directorate of Land Registry and Cadastre", href: "https://www.tkgm.gov.tr/", note: "Official authority for title deeds (tapu) in Turkey." },
  { label: "TKGM Web Tapu", href: "https://webtapu.tkgm.gov.tr/", note: "Online appointments, applications and title deed queries." },
  { label: "TKGM Parcel Query", href: "https://parselsorgu.tkgm.gov.tr/", note: "Check the official parcel and plot of a property." },
];

export const CITIZENSHIP_SOURCES: OfficialSource[] = [
  { label: "Invest in Türkiye – Citizenship by investment", href: "https://www.invest.gov.tr/en/investmentguide/pages/acquisition-of-turkish-citizenship-by-investment.aspx", note: "Official government overview of the investment routes." },
  { label: "Population and Citizenship Affairs (NVI)", href: "https://www.nvi.gov.tr/", note: "Authority that processes citizenship applications." },
  { label: "Presidency of Migration Management – e-İkamet", href: "https://e-ikamet.goc.gov.tr/", note: "Residence permit applications." },
  { label: "Revenue Administration (GİB)", href: "https://www.gib.gov.tr/", note: "Tax number (vergi numarası) for foreigners." },
  ...TKGM_SOURCES.slice(0, 2),
];

export function OfficialSources({ title = "Official government sources", sources = TKGM_SOURCES }: { title?: string; sources?: OfficialSource[] }) {
  return (
    <aside className="mt-8 rounded-lg border border-gold/40 bg-ivory p-5 sm:p-6">
      <p className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase text-gold-foreground">
        <Landmark className="h-4 w-4" /> {title}
      </p>
      <ul className="space-y-3">
        {sources.map((s) => (
          <li key={s.href}>
            <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-foreground underline-offset-4 hover:underline">
              {s.label} <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <p className="text-sm text-muted-foreground">{s.note}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
