import * as React from 'react';
import { useTestimonials } from '@/hooks/useTestimonials';
import { useTranslation } from '@/hooks/useTranslation';
import { getOptimizedImageUrl } from '@/utils/imageOptimization';

const TestimonialCard = ({ image, name, text, priority = false }: { image: string; name: string; text: string; priority?: boolean }) => (
  <div className="relative rounded-md overflow-hidden group cinematic-card h-80 bg-brand-secondary">
    <img src={getOptimizedImageUrl(image, 600, 70)} alt={name} width={400} height={320} className="w-full h-full object-cover" loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x320/1a1a1a/ffffff?text=Image'; }} />

    <div className="absolute inset-0 bg-gradient-to-b from-brand-secondary/80 via-brand-secondary/20 to-brand-secondary/70" />
    <div className="absolute top-0 left-0 p-5 text-brand-foreground">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-brand-foreground/20 flex items-center justify-center"><span className="text-xs font-semibold">F</span></div>
        <span className="font-semibold text-sm drop-shadow-md notranslate" translate="no">{name}</span>
      </div>
      <p className="text-sm font-medium leading-tight drop-shadow-md line-clamp-4">{text}</p>
    </div>
  </div>
);

const TestimonialsMasonryGrid = () => {
  const { testimonials } = useTestimonials();
  const { t } = useTranslation();
  const gridTestimonials = testimonials.slice(0, 8);

  return (
    <section className="py-20 lg:py-28 bg-background cinematic-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="section-kicker cinematic-rule mb-4">Future Homes</span>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">{t('home.what_people_say')}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('home.what_people_say_subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {gridTestimonials.map((testimonial, index) => (
            <TestimonialCard key={index} image={testimonial.image} name={testimonial.name} text={testimonial.text} priority={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsMasonryGrid;
