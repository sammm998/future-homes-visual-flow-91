import SEOInternalLinks from "@/components/SEOInternalLinks";
import { useTranslation } from "@/hooks/useTranslation";

const HomeSeoContent = () => {
  const { t } = useTranslation();

  return (
    <>
      <section className="bg-secondary/20 py-16">
        <div className="container mx-auto max-w-4xl space-y-5 px-4 leading-relaxed text-muted-foreground">
          <h2 className="text-3xl font-bold text-foreground">{t("seo.home.h2")}</h2>
          <p>{t("seo.home.p1")}</p>
          <h3 className="text-xl font-semibold text-foreground">{t("seo.home.h3_1")}</h3>
          <p>{t("seo.home.p2")}</p>
          <h3 className="text-xl font-semibold text-foreground">{t("seo.home.h3_2")}</h3>
          <p>{t("seo.home.p3")}</p>
          <h3 className="text-xl font-semibold text-foreground">{t("seo.home.h3_3")}</h3>
          <p>{t("seo.home.p4")}</p>
          <SEOInternalLinks heading={t("seo.home.links_heading")} className="border-t-0" />
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-foreground">{t("home.faq_title")}</h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">{t("home.faq_subtitle")}</p>
          </div>
          <div className="mx-auto max-w-4xl space-y-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="rounded-lg border bg-card p-6">
                <h3 className="mb-3 text-lg font-semibold">{t(`home.faq${item}_q`)}</h3>
                <p className="text-muted-foreground">{t(`home.faq${item}_a`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeSeoContent;