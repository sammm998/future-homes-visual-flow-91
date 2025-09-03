import * as React from 'react';
import { MasonryGrid } from '@/components/ui/image-testimonial-grid';
import { useTestimonials } from '@/hooks/useTestimonials';

// --- Reusable Card Component ---
const TestimonialCard = ({ image, name, text, mainImage }: { image: string; name: string; text: string; mainImage?: string }) => (
  <div className="relative rounded-2xl overflow-hidden group transition-transform duration-300 ease-in-out hover:scale-105">
    <img
      src={mainImage || `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1506905925346-21bda4d32df4' : '1494500764479-0c8f2919a3d8'}?auto=format&fit=crop&w=800&h=${Math.floor(Math.random() * 400) + 800}&q=80`}
      alt={text}
      className="w-full h-auto object-cover"
      onError={(e) => {
        e.currentTarget.src = 'https://placehold.co/800x600/1a1a1a/ffffff?text=Image';
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
    <div className="absolute top-0 left-0 p-4 text-white">
      <div className="flex items-center gap-3 mb-2">
        <img
          src={image}
          className="w-8 h-8 rounded-full border-2 border-white/80"
          alt={name}
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/40x40/EFEFEF/333333?text=A';
          }}
        />
        <span className="font-semibold text-sm drop-shadow-md">{name}</span>
      </div>
      <p className="text-sm font-medium leading-tight drop-shadow-md">{text}</p>
    </div>
  </div>
);

const TestimonialsMasonryGrid = () => {
  const { testimonials } = useTestimonials();
  const [columns, setColumns] = React.useState(4);

  // Function to determine columns based on screen width
  const getColumns = (width: number) => {
    if (width < 640) return 1;    // sm
    if (width < 1024) return 2;   // lg
    if (width < 1280) return 3;   // xl
    return 4;                     // 2xl and up
  };

  React.useEffect(() => {
    const handleResize = () => {
      setColumns(getColumns(window.innerWidth));
    };

    handleResize(); // Set initial columns on mount

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        
        <div className="max-w-7xl mx-auto">
          <MasonryGrid columns={columns} gap={4}>
            {gridTestimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={index} 
                image={testimonial.image}
                name={testimonial.name}
                text={testimonial.text}
              />
            ))}
          </MasonryGrid>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsMasonryGrid;