import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";

interface RollingTestimonialsProps {
  testimonials: any[];
  title: string;
  subtitle: string;
}

const RollingTestimonials = ({ testimonials, title, subtitle }: RollingTestimonialsProps) => (
  <section className="relative overflow-hidden bg-brand-secondary py-20 text-brand-foreground lg:py-28 cinematic-section">
    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-brand-accent/40" />
    <div className="container mx-auto mb-14 px-4 lg:mb-16">
      <div className="text-center">
        <span className="section-kicker cinematic-rule text-brand-accent mb-4">Future Homes</span>
        <h2 className="text-4xl md:text-6xl font-bold text-brand-foreground mb-4">{title}</h2>
        <p className="mx-auto max-w-2xl text-lg leading-8 text-brand-foreground/75 md:text-xl">{subtitle}</p>
      </div>
    </div>

    <div className="mx-auto flex max-h-[740px] max-w-6xl justify-center gap-5 overflow-hidden px-5 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] md:gap-6">
      <TestimonialsColumn testimonials={testimonials.slice(0, 3)} className="w-full max-w-80" duration={26} />
      <TestimonialsColumn testimonials={testimonials.slice(3, 6)} className="hidden w-80 md:block" duration={32} />
      <TestimonialsColumn testimonials={testimonials.slice(6, 9)} className="hidden w-80 lg:block" duration={29} />
    </div>
  </section>
);

export default RollingTestimonials;
