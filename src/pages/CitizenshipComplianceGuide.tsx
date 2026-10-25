import { useState } from "react";
import Navigation from "@/components/Navigation";
import { EditorialCta, EditorialSectionHeader, PublicPageHero } from "@/components/PublicEditorial";
import { CITIZENSHIP_SOURCES, OfficialSources } from "@/components/OfficialSources";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/destinations/istanbul-cinematic.webp";

type Lang = "en" | "tr";
type Step = { title: Record<Lang, string>; body: Record<Lang, string>; docs: Record<Lang, string[]>; link?: { label: string; href: string } };

const STEPS: Step[] = [
  {
    title: { en: "Get a Turkish tax number", tr: "Vergi numarası alın" },
    body: { en: "Every foreign buyer needs a tax number (vergi numarası) from the tax office or online.", tr: "Her yabancı alıcının vergi dairesinden veya online olarak vergi numarası alması gerekir." },
    docs: { en: ["Passport", "Translated passport copy (if required)"], tr: ["Pasaport", "Pasaport tercümesi (gerekirse)"] },
    link: { label: "GİB – Revenue Administration", href: "https://www.gib.gov.tr/" },
  },
  {
    title: { en: "Open a Turkish bank account", tr: "Türk banka hesabı açın" },
    body: { en: "The purchase money must arrive from abroad in foreign currency and be converted through a Turkish bank. Keep every transfer receipt.", tr: "Satış bedeli yurt dışından döviz olarak gelmeli ve Türk bankasında çevrilmelidir. Tüm dekontları saklayın." },
    docs: { en: ["Passport", "Tax number", "SWIFT transfer receipts"], tr: ["Pasaport", "Vergi numarası", "SWIFT dekontları"] },
  },
  {
    title: { en: "Reserve a property worth at least USD 400,000", tr: "En az 400.000 USD değerinde mülk seçin" },
    body: { en: "The value must meet the official minimum and be confirmed by a licensed valuation report (SPK-licensed expert).", tr: "Değer resmi alt sınırı karşılamalı ve SPK lisanslı değerleme raporuyla doğrulanmalıdır." },
    docs: { en: ["Valuation report (değerleme raporu)", "Reservation agreement"], tr: ["Değerleme raporu", "Rezervasyon sözleşmesi"] },
    link: { label: "Invest in Türkiye – official rules", href: "https://www.invest.gov.tr/en/investmentguide/pages/acquisition-of-turkish-citizenship-by-investment.aspx" },
  },
  {
    title: { en: "Transfer the title deed at the land registry", tr: "Tapu devrini tapu müdürlüğünde yapın" },
    body: { en: "The sale is completed at the TKGM land registry office. A 3-year no-sale annotation (şerh) is added to the deed.", tr: "Satış TKGM tapu müdürlüğünde tamamlanır. Tapuya 3 yıl satılmama şerhi eklenir." },
    docs: { en: ["Passport + sworn translator", "Biometric photos", "DASK earthquake insurance", "Valuation report", "Tax and fee receipts"], tr: ["Pasaport + yeminli tercüman", "Biyometrik fotoğraf", "DASK sigortası", "Değerleme raporu", "Harç ve vergi dekontları"] },
    link: { label: "TKGM – Land Registry", href: "https://www.tkgm.gov.tr/" },
  },
  {
    title: { en: "Get the certificate of conformity", tr: "Uygunluk belgesini alın" },
    body: { en: "The land registry issues a certificate confirming the investment meets citizenship requirements.", tr: "Tapu müdürlüğü yatırımın vatandaşlık şartlarına uygun olduğunu gösteren belgeyi düzenler." },
    docs: { en: ["Title deed (tapu)", "Bank currency-conversion certificate (DAB)"], tr: ["Tapu", "Döviz alım belgesi (DAB)"] },
  },
  {
    title: { en: "Apply for a residence permit", tr: "İkamet izni başvurusu yapın" },
    body: { en: "A residence permit on investment grounds is applied for through e-İkamet.", tr: "Yatırım yoluyla ikamet izni e-İkamet üzerinden başvurulur." },
    docs: { en: ["Passport", "Photos", "Health insurance", "Title deed", "Certificate of conformity"], tr: ["Pasaport", "Fotoğraf", "Sağlık sigortası", "Tapu", "Uygunluk belgesi"] },
    link: { label: "Göç İdaresi – e-İkamet", href: "https://e-ikamet.goc.gov.tr/" },
  },
  {
    title: { en: "Submit the citizenship application", tr: "Vatandaşlık başvurusunu yapın" },
    body: { en: "The application is filed with the citizenship authorities (NVI) for you and your eligible family members.", tr: "Başvuru sizin ve uygun aile üyeleriniz için NVI'ye yapılır." },
    docs: { en: ["Birth and marriage certificates (apostilled + translated)", "Passports for each family member", "All documents above"], tr: ["Apostilli ve tercümeli doğum/evlilik belgeleri", "Her aile üyesi için pasaport", "Yukarıdaki tüm belgeler"] },
    link: { label: "NVI – Population and Citizenship", href: "https://www.nvi.gov.tr/" },
  },
];

const UI = {
  en: { docs: "Documents", note: "This guide is general information, not legal advice. Rules and thresholds change — always confirm on the official pages before you act." },
  tr: { docs: "Belgeler", note: "Bu rehber genel bilgi amaçlıdır, hukuki tavsiye değildir. Kurallar değişebilir — işlem öncesi resmi sayfalardan teyit edin." },
};

export default function CitizenshipComplianceGuide() {
  const [lang, setLang] = useState<Lang>("en");
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <PublicPageHero compact eyebrow="Citizenship compliance" title={lang === "en" ? "From purchase to Turkish citizenship, step by step" : "Satın almadan Türk vatandaşlığına, adım adım"} description={lang === "en" ? "Every step, every document, and the official government page for each — in English and Turkish." : "Her adım, her belge ve ilgili resmi devlet sayfası — İngilizce ve Türkçe."} image={heroImage} imageAlt="Istanbul skyline" primaryLabel={lang === "en" ? "Citizenship properties" : "Vatandaşlığa uygun mülkler"} primaryTo="/turkish-citizenship-by-investment" />

        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 inline-flex rounded-lg border border-navy/15 p-1" role="group" aria-label="Language">
            {(["en", "tr"] as Lang[]).map((l) => (
              <button key={l} type="button" onClick={() => setLang(l)} aria-pressed={lang === l} className={cn("rounded-md px-4 py-2 text-sm font-semibold", lang === l ? "bg-navy text-navy-foreground" : "text-muted-foreground")}>
                {l === "en" ? "English" : "Türkçe"}
              </button>
            ))}
          </div>
          <EditorialSectionHeader eyebrow={lang === "en" ? "7 steps" : "7 adım"} title={lang === "en" ? "The compliance checklist" : "Uyum kontrol listesi"} />
          <ol className="space-y-5">
            {STEPS.map((s, i) => (
              <li key={i} className="rounded-lg border border-navy/10 p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase text-gold-foreground">{lang === "en" ? "Step" : "Adım"} {i + 1}</p>
                <h3 className="mt-1 text-xl font-semibold text-foreground">{s.title[lang]}</h3>
                <p className="mt-2 text-muted-foreground">{s.body[lang]}</p>
                <p className="mt-4 text-sm font-semibold text-foreground">{UI[lang].docs}</p>
                <ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground">{s.docs[lang].map((d) => <li key={d}>{d}</li>)}</ul>
                {s.link ? <a href={s.link.href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold underline underline-offset-4">{s.link.label} ↗</a> : null}
              </li>
            ))}
          </ol>
          <OfficialSources title={lang === "en" ? "Official government sources" : "Resmi devlet kaynakları"} sources={CITIZENSHIP_SOURCES} />
          <p className="mt-6 text-sm text-muted-foreground">{UI[lang].note}</p>
        </section>

        <EditorialCta eyebrow="Citizenship support" title="We handle the paperwork with you" description="Our team and partner lawyers guide you through every document and appointment." primaryLabel="Book a consultation" primaryTo="/contact-us" />
      </main>
    </div>
  );
}
