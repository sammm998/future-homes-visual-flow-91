"use client";
import * as React from "react";
import { motion } from "motion/react";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

interface TestimonialsColumnProps {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}

export const TestimonialsColumn: React.FC<TestimonialsColumnProps> = (props) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <div key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="p-10 rounded-3xl border shadow-lg shadow-primary/10 max-w-xs w-full bg-card mb-6" key={i}>
                  <div className="text-card-foreground leading-relaxed">{text}</div>
                  <div className="mt-6">
                    <div className="flex flex-col">
                      <div className="font-semibold tracking-tight leading-5 text-card-foreground">{name}</div>
                      <div className="leading-5 text-muted-foreground tracking-tight text-sm">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )),
        ]}
      </motion.div>
    </div>
  );
};


interface TestimonialsProps {
  title?: string;
  subtitle?: string;
}

const TestimonialsColumns: React.FC<TestimonialsProps> = ({ 
  title = "What our clients say",
  subtitle = "Read testimonials from our satisfied customers worldwide"
}) => {
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>([]);

  React.useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from('testimonials' as any)
        .select('*')
        .limit(10)
        .order('created_at', { ascending: false });
      
      if (data && !error) {
        const formattedTestimonials = data.map((item: any) => ({
          text: item.review_text,
          image: "https://randomuser.me/api/portraits/men/1.jpg", // placeholder
          name: item.customer_name,
          role: item.property_type || "Customer"
        }));
        setTestimonials(formattedTestimonials);
      }
    };

    fetchTestimonials();
  }, []);

  // Distribute testimonials evenly across columns
  const redistributeTestimonials = (items: Testimonial[], numColumns: number) => {
    const columns: Testimonial[][] = Array.from({ length: numColumns }, () => []);
    items.forEach((item, index) => {
      columns[index % numColumns].push(item);
    });
    return columns;
  };

  const [firstColumn, secondColumn, thirdColumn] = redistributeTestimonials(testimonials, 3);

  return (
    <section className="bg-background py-24 relative">
      <div className="container z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
            Testimonials
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {subtitle}
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-16 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={100} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={120} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={140} />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsColumns;