"use client";
import React from "react";
import { motion } from "motion/react";

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
    <div className={`${props.className} overflow-hidden relative`} style={{ contain: 'layout style' }}>
      <motion.div
        animate={{
          y: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
        style={{
          willChange: 'transform',
          transform: 'translate3d(0,0,0)',
          backfaceVisibility: 'hidden',
        }}
      >
        {new Array(2).fill(0).map((_, index) => (
          <div key={`testimonial-group-${index}`}>
            {props.testimonials.map(({ text, name, role }, i) => (
              <div className="p-10 rounded-3xl border shadow-lg shadow-primary/10 max-w-xs w-full mb-6" key={`testimonial-${index}-${i}`}>
                <div>{text}</div>
                <div className="flex items-center gap-2 mt-5">
                  <div className="flex flex-col">
                    <div className="font-medium tracking-tight leading-5">{name}</div>
                    <div className="leading-5 opacity-60 tracking-tight">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};