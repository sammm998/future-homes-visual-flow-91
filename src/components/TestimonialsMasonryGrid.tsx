import * as React from 'react';
import { useTestimonials } from '@/hooks/useTestimonials';

// --- Reusable Card Component ---
const TestimonialCard = ({ image, name, text }: { image: string; name: string; text: string }) => (
  <div className="relative rounded-2xl overflow-hidden group transition-transform duration-300 ease-in-out hover:scale-105 h-80">
    <img
      src={image}
      alt={name}
      className="w-full h-full object-cover"
      onError={(e) => {
        e.currentTarget.src = 'https://placehold.co/400x320/1a1a1a/ffffff?text=Image';
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
    <div className="absolute top-0 left-0 p-4 text-white">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-xs font-semibold">{name.charAt(0)}</span>
        </div>
        <span className="font-semibold text-sm drop-shadow-md">{name}</span>
      </div>
      <p className="text-sm font-medium leading-tight drop-shadow-md line-clamp-4">{text}</p>
    </div>
  </div>
);

const TestimonialsMasonryGrid = () => {
  const { testimonials } = useTestimonials();

  // Use a subset of testimonials for the grid
  const gridTestimonials = testimonials.slice(0, 8);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            What People Are Saying
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real experiences from our satisfied customers
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {gridTestimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index} 
              image={testimonial.image}
              name={testimonial.name}
              text={testimonial.text}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsMasonryGrid;