import { Quote, ShieldCheck, Star } from "lucide-react";
import { motion } from "motion/react";
import { getOptimizedImageUrl } from "@/utils/imageOptimization";

interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

interface RollingTestimonialsProps {
  testimonials: Testimonial[];
  title: string;
  subtitle: string;
  eyebrow: string;
}

const ReviewCard = ({ review }: { review: Testimonial }) => (
  <article className="group w-full rounded-md border border-navy-foreground/10 bg-navy-foreground/[0.055] p-5 backdrop-blur-sm transition-colors duration-300 hover:border-gold/40 hover:bg-navy-foreground/[0.09] sm:p-6">
    <div className="flex items-center justify-between gap-4">
      <div className="flex gap-1 text-gold" aria-label="5 out of 5 stars">
        {[0, 1, 2, 3, 4].map((star) => <Star key={star} className="h-3.5 w-3.5 fill-current" />)}
      </div>
      <Quote className="h-6 w-6 text-gold/40 transition-transform duration-300 group-hover:-translate-y-1" />
    </div>
    <blockquote className="mt-5 text-sm leading-7 text-navy-foreground/80 sm:text-base">
      “{review.text}”
    </blockquote>
    <footer className="mt-6 flex items-center gap-3 border-t border-navy-foreground/10 pt-5">
      <img
        src={getOptimizedImageUrl(review.image, 96, 72)}
        alt=""
        width={48}
        height={48}
        loading="lazy"
        decoding="async"
        className="h-12 w-12 rounded-full border border-gold/30 object-cover"
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-navy-foreground notranslate" translate="no">{review.name}</p>
        <p className="mt-1 truncate text-xs text-navy-foreground/50">{review.role}</p>
      </div>
    </footer>
  </article>
);

const ReviewColumn = ({ reviews, duration, reverse = false, className = "" }: { reviews: Testimonial[]; duration: number; reverse?: boolean; className?: string }) => (
  <div className={`min-w-0 overflow-hidden ${className}`}>
    <motion.div
      className="flex flex-col gap-4 py-2"
      animate={{ translateY: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      style={{ willChange: "transform" }}
    >
      {[...reviews, ...reviews].map((review, index) => <ReviewCard key={`${review.name}-${index}`} review={review} />)}
    </motion.div>
  </div>
);

const RollingTestimonials = ({ testimonials, title, subtitle, eyebrow }: RollingTestimonialsProps) => {
  const reviews = testimonials.length ? testimonials.slice(0, 10) : [];
  const first = reviews.filter((_, index) => index % 2 === 0);
  const second = reviews.filter((_, index) => index % 2 !== 0);

  return (
    <section className="relative overflow-hidden bg-navy py-20 text-navy-foreground lg:py-28">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
          <div className="relative z-10 self-center lg:sticky lg:top-28">
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase text-gold">
              <span className="h-px w-10 bg-gold" /> {eyebrow}
            </div>
            <h2 className="mt-7 max-w-lg text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">{title}</h2>
            <p className="mt-6 max-w-md text-base leading-8 text-navy-foreground/65 sm:text-lg">{subtitle}</p>

            <div className="mt-10 grid max-w-md grid-cols-2 gap-px overflow-hidden rounded-md border border-navy-foreground/10 bg-navy-foreground/10">
              <div className="bg-navy p-5 sm:p-6">
                <p className="text-3xl font-semibold text-gold">4.9/5</p>
                <p className="mt-2 text-xs uppercase text-navy-foreground/55">Google Reviews</p>
              </div>
              <div className="bg-navy p-5 sm:p-6">
                <ShieldCheck className="h-7 w-7 text-gold" />
                <p className="mt-3 text-xs uppercase text-navy-foreground/55">Verified clients</p>
              </div>
            </div>
          </div>

          <div className="relative h-[720px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]">
            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ReviewColumn reviews={first.length ? first : reviews} duration={34} />
                <ReviewColumn reviews={second.length ? second : reviews} duration={39} reverse className="hidden sm:block" />
              </div>
            ) : (
              <div className="grid h-full place-items-center text-navy-foreground/60">{subtitle}</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RollingTestimonials;