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
  // Safety check for testimonials array
  const safeTestimonials = Array.isArray(props.testimonials) ? props.testimonials : [];
  
  if (safeTestimonials.length === 0) {
    return (
      <div className={`${props.className} overflow-hidden relative h-64 flex items-center justify-center`}>
        <p className="text-muted-foreground text-center">No testimonials to display</p>
      </div>
    );
  }

  return (
    <div 
      className={`${props.className} overflow-hidden relative`} 
      style={{ 
        transform: 'translateZ(0)', // Force hardware acceleration
      }}
    >
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
          perspective: '1000px',
          isolation: 'isolate', // Create new stacking context
        }}
      >
        {new Array(2).fill(0).map((_, index) => (
          <div 
            key={`testimonial-group-${index}`}
            style={{ transform: 'translateZ(0)' }} // GPU acceleration for each group
          >
            {safeTestimonials.map(({ text, name, role }, i) => (
              <div 
                className="p-6 sm:p-8 md:p-10 rounded-3xl border shadow-lg shadow-primary/10 max-w-xs w-full mb-6 bg-card text-card-foreground" 
                key={`testimonial-${index}-${i}`}
                style={{ 
                  transform: 'translateZ(0)', // GPU acceleration for each card
                  contain: 'layout style',
                }}
              >
                <div className="text-sm sm:text-base leading-relaxed mb-4">{text || 'Great service!'}</div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <div className="font-semibold tracking-tight leading-5 text-sm">{name || 'Anonymous'}</div>
                    <div className="leading-5 text-muted-foreground tracking-tight text-xs">{role || 'Customer'}</div>
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