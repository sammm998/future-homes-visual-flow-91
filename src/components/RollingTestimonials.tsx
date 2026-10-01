import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";

interface RollingTestimonialsProps {
  testimonials: any[];
  title: string;
  subtitle: string;
}

const RollingTestimonials = ({ testimonials, title, subtitle }: RollingTestimonialsProps) => (
  <section className="py-20 bg-secondary/30 overflow-hidden">
    <div className="container mx-auto px-4 mb-16">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-foreground mb-4">{title}</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
      </div>
    </div>

    <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
      <TestimonialsColumn testimonials={testimonials.slice(0, 3)} className="w-80" duration={15} />
      <TestimonialsColumn testimonials={testimonials.slice(3, 6)} className="w-80 hidden md:block" duration={19} />
      <TestimonialsColumn testimonials={testimonials.slice(6, 9)} className="w-80 hidden lg:block" duration={17} />
    </div>
  </section>
);

export default RollingTestimonials;
