import { ExternalLink, Landmark } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import type { NewPagesCopy } from "@/content/newPagesCopy";
import { newPagesShared } from "@/content/newPagesShared";

type SourceKey = keyof Omit<NewPagesCopy["sources"], "title">;
export type OfficialSource = { label: string; href: string; key: SourceKey };

export const TKGM_SOURCES: OfficialSource[] = [
  { label: "TKGM – Tapu ve Kadastro Genel Müdürlüğü", href: "https://www.tkgm.gov.tr/", key: "tkgm" },
  { label: "TKGM Web Tapu", href: "https://webtapu.tkgm.gov.tr/", key: "webtapu" },
  { label: "TKGM Parsel Sorgu", href: "https://parselsorgu.tkgm.gov.tr/", key: "parcel" },
];

export const CITIZENSHIP_SOURCES: OfficialSource[] = [
  { label: "Invest in Türkiye", href: "https://www.invest.gov.tr/en/investmentguide/pages/acquisition-of-turkish-citizenship-by-investment.aspx", key: "invest" },
  { label: "NVI – Nüfus ve Vatandaşlık İşleri", href: "https://www.nvi.gov.tr/", key: "nvi" },
  { label: "Göç İdaresi – e-İkamet", href: "https://e-ikamet.goc.gov.tr/", key: "ikamet" },
  { label: "GİB – Gelir İdaresi Başkanlığı", href: "https://www.gib.gov.tr/", key: "gib" },
  ...TKGM_SOURCES.slice(0, 2),
];

export function OfficialSources({ sources = TKGM_SOURCES }: { sources?: OfficialSource[] }) {
  const { lang } = useTranslation();
  const c = newPagesShared(lang).sources;
  return (
    <aside className="mt-8 rounded-lg border border-gold/40 bg-ivory p-5 sm:p-6">
      <p className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase text-gold-foreground">
        <Landmark className="h-4 w-4" /> {c.title}
      </p>
      <ul className="space-y-3">
        {sources.map((s) => (
          <li key={s.href}>
            <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-foreground underline-offset-4 hover:underline">
              {s.label} <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <p className="text-sm text-muted-foreground">{c[s.key]}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
