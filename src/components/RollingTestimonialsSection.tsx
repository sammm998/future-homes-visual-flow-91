import RollingTestimonials from "@/components/RollingTestimonials";
import { useTestimonials } from "@/hooks/useTestimonials";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * Wrapper that owns the testimonials data fetch so the query (and the
 * Supabase client it pulls in) is only loaded once this below-the-fold
 * section is actually mounted.
 */
const RollingTestimonialsSection = () => {
  const { testimonials } = useTestimonials();
  const { t, lang } = useTranslation();
  const labels: Record<string, [string, string]> = {
    en: ["Google reviews", "Verified clients"], sv: ["Google-omdömen", "Verifierade kunder"],
    no: ["Google-anmeldelser", "Verifiserte kunder"], da: ["Google-anmeldelser", "Verificerede kunder"],
    tr: ["Google yorumları", "Doğrulanmış müşteriler"], de: ["Google-Bewertungen", "Verifizierte Kunden"],
    fr: ["Avis Google", "Clients vérifiés"], es: ["Reseñas de Google", "Clientes verificados"],
    id: ["Ulasan Google", "Klien terverifikasi"], ru: ["Отзывы Google", "Проверенные клиенты"],
    ar: ["تقييمات Google", "عملاء موثّقون"], fa: ["نظرات Google", "مشتریان تأییدشده"], ur: ["Google جائزے", "تصدیق شدہ صارفین"],
  };
  const [ratingLabel, verifiedLabel] = labels[lang] ?? labels.en;

  return (
    <RollingTestimonials
      testimonials={testimonials}
      eyebrow={t("home.customer_reviews")}
      title={t("home.what_people_say")}
      subtitle={t("home.what_people_say_subtitle")}
      ratingLabel={ratingLabel}
      verifiedLabel={verifiedLabel}
    />
  );
};

export default RollingTestimonialsSection;
