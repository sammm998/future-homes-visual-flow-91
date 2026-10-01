"use client";
import React from "react";
import { motion } from "motion/react";
import { getOptimizedImageUrl } from "@/utils/imageOptimization";
import { Quote, Star } from "lucide-react";


interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={`group/column ${props.className ?? ""}`}>
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
        className="flex flex-col gap-6 pb-6 group-hover/column:[animation-play-state:paused]"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <div key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <article className="group/card relative mb-6 w-full max-w-xs overflow-hidden rounded-md border border-brand-foreground/15 bg-brand-foreground p-7 text-brand-secondary shadow-[0_24px_60px_-36px_hsl(var(--brand-secondary))] transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1 hover:border-brand-accent hover:shadow-[0_30px_70px_-34px_hsl(var(--brand-secondary))]" key={i}>
                  <div className="mb-5 flex items-center justify-between text-primary">
                    <Quote className="h-7 w-7 opacity-80 transition-transform duration-500 group-hover/card:-rotate-6 group-hover/card:scale-110" aria-hidden="true" />
                    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                      {[0, 1, 2, 3, 4].map((star) => <Star key={star} className="h-3.5 w-3.5 fill-current" aria-hidden="true" />)}
                    </div>
                  </div>
                  <blockquote className="text-sm leading-7 text-brand-secondary/85">“{text}”</blockquote>
                  <div className="mt-6 h-px bg-border" />
                  <div className="mt-5 flex items-center gap-3">
                    <img
                      width={40}
                      height={40}
                      src={getOptimizedImageUrl(image, 80, 70)}
                      alt={name}
                      className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-brand-accent transition-transform duration-500 group-hover/card:scale-105"
                      loading="lazy"
                      decoding="async"
                    />

                    <div className="flex min-w-0 flex-col">
                      <div className="truncate font-semibold leading-5 text-brand-secondary">{name}</div>
                      <div className="truncate text-xs leading-5 text-muted-foreground">{role}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )),
        ]}
      </motion.div>
    </div>
  );
};