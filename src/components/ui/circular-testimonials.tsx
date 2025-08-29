import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
}

interface CircularTestimonialsProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  colors?: {
    name: string;
    designation: string;
    testimony: string;
    arrowBackground: string;
    arrowForeground: string;
    arrowHoverBackground: string;
  };
}

const CircularTestimonials: React.FC<CircularTestimonialsProps> = ({
  testimonials,
  autoplay = false,
  colors = {
    name: "hsl(var(--foreground))",
    designation: "hsl(var(--muted-foreground))",
    testimony: "hsl(var(--foreground))",
    arrowBackground: "hsl(var(--primary))",
    arrowForeground: "hsl(var(--primary-foreground))",
    arrowHoverBackground: "hsl(var(--primary-glow))"
  }
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        No testimonials available
      </div>
    );
  }

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-card rounded-2xl shadow-lg p-8 text-center">
        {/* Testimonial Content */}
        <div className="mb-8">
          <blockquote 
            className="text-lg md:text-xl font-medium leading-relaxed mb-6"
            style={{ color: colors.testimony }}
          >
            "{currentTestimonial.quote}"
          </blockquote>
          
          {/* Author Info */}
          <div className="flex flex-col items-center space-y-2">
            {currentTestimonial.src && (
              <img
                src={currentTestimonial.src}
                alt={currentTestimonial.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-border"
              />
            )}
            <div>
              <p 
                className="font-semibold text-lg"
                style={{ color: colors.name }}
              >
                {currentTestimonial.name}
              </p>
              <p 
                className="text-sm"
                style={{ color: colors.designation }}
              >
                {currentTestimonial.designation}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={prevTestimonial}
            className={cn(
              "p-2 rounded-full transition-colors duration-200",
              "hover:scale-105 transform"
            )}
            style={{
              backgroundColor: colors.arrowBackground,
              color: colors.arrowForeground
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.arrowHoverBackground;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.arrowBackground;
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors duration-200",
                  index === currentIndex ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>

          <button
            onClick={nextTestimonial}
            className={cn(
              "p-2 rounded-full transition-colors duration-200",
              "hover:scale-105 transform"
            )}
            style={{
              backgroundColor: colors.arrowBackground,
              color: colors.arrowForeground
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.arrowHoverBackground;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.arrowBackground;
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CircularTestimonials;