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
  const { t } = useTranslation();

  return (
    <RollingTestimonials
      testimonials={testimonials}
      eyebrow={t("home.customer_reviews")}
      title={t("home.what_people_say")}
      subtitle={t("home.what_people_say_subtitle")}
    />
  );
};

export default RollingTestimonialsSection;
