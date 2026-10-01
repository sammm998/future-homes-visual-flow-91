import { GridMotion } from "@/components/ui/grid-motion";
import { useTranslation } from "@/hooks/useTranslation";

const PopularCities = () => {
  const { t } = useTranslation();
  const cityItems = [
    '/lovable-uploads/739b5c8c-7e7d-42ee-a412-963fad0a408d.webp',
    'DUBAI',
    '/lovable-uploads/6cefa26f-ebbb-490a-ac8c-3e27243dae92.webp',
    'CYPRUS',
    '/lovable-uploads/60f987b0-c196-47b5-894d-173d604fa4c8.webp',
    'MERSIN',
    '/lovable-uploads/956541d2-b461-4acd-a29a-463c5a97983e.webp',
    'ANTALYA',
    t('common.properties'),
    t('info.investment'),
    '/lovable-uploads/739b5c8c-7e7d-42ee-a412-963fad0a408d.webp',
    'DUBAI',
    '/lovable-uploads/6cefa26f-ebbb-490a-ac8c-3e27243dae92.webp',
    'CYPRUS',
    t('home.premium_properties'),
    t('home.explore_destinations'),
    '/lovable-uploads/60f987b0-c196-47b5-894d-173d604fa4c8.webp',
    'MERSIN',
    '/lovable-uploads/956541d2-b461-4acd-a29a-463c5a97983e.webp',
    'ANTALYA',
    'Premium',
    t('search.location')
  ];

  return (
    <section className="py-20 lg:py-28 bg-brand-secondary cinematic-section overflow-hidden">
      <div className="text-center mb-12 px-4">
        <span className="section-kicker cinematic-rule text-brand-accent mb-4">Future Homes</span>
        <h2 className="text-4xl md:text-6xl font-bold text-brand-foreground mb-4">
          {t('home.explore_destinations')}
        </h2>
        <p className="text-xl text-brand-foreground/75 max-w-2xl mx-auto">
          {t('home.explore_subtitle')}
        </p>
      </div>
      <GridMotion 
        items={cityItems}
        gradientColor="var(--brand-secondary)"
        className="bg-brand-secondary"
      />
    </section>
  );
};

export default PopularCities;
