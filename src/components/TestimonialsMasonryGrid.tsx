import * as React from 'react';
import { MasonryGrid } from '@/components/ui/image-testimonial-grid';
import { useTestimonials } from '@/hooks/useTestimonials';

// --- Reusable Card Component ---
const TestimonialCard = ({ text, name, image }: {
  text: string;
  name: string;
  image?: string;
}) => (
  <div className="relative rounded-2xl overflow-hidden group transition-transform duration-300 ease-in-out hover:scale-105 border bg-card">
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`}
          className="w-10 h-10 rounded-full border-2 border-border"
          alt={name}
          onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`;
          }}
        />
        <span className="font-semibold text-sm">{name}</span>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  </div>
);

// --- Main Component ---
const TestimonialsMasonryGrid = () => {
  const { testimonials, loading } = useTestimonials();
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

  if (loading) {
    return (
      <div className="w-full min-h-[400px] p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold">What People Are Saying</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-muted-foreground/20 rounded-full"></div>
                    <div className="h-4 bg-muted-foreground/20 rounded w-24"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted-foreground/20 rounded w-full"></div>
                    <div className="h-3 bg-muted-foreground/20 rounded w-3/4"></div>
                    <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">What People Are Saying</h2>
          <p className="text-muted-foreground mt-2">Real feedback from our satisfied customers</p>
        </div>
        <MasonryGrid columns={columns} gap={4}>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index} 
              text={testimonial.text}
              name={testimonial.name}
              image={testimonial.image}
            />
          ))}
        </MasonryGrid>
      </div>
    </div>
  );
};

export default TestimonialsMasonryGrid;