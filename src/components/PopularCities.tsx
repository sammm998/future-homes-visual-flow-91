
import { GridMotion } from "@/components/ui/grid-motion";

const PopularCities = () => {
  const cityItems = [
    '/lovable-uploads/739b5c8c-7e7d-42ee-a412-963fad0a408d.png', // Coastal city with harbor
    'DUBAI',
    '/lovable-uploads/6cefa26f-ebbb-490a-ac8c-3e27243dae92.png', // Modern city aerial view
    'CYPRUS',
    '/lovable-uploads/60f987b0-c196-47b5-894d-173d604fa4c8.png', // Mersin
    'MERSIN',
    '/lovable-uploads/956541d2-b461-4acd-a29a-463c5a97983e.png', // Antalya
    'ANTALYA',
    'Properties',
    'Investment',
    '/lovable-uploads/739b5c8c-7e7d-42ee-a412-963fad0a408d.png', // Dubai
    'DUBAI',
    '/lovable-uploads/6cefa26f-ebbb-490a-ac8c-3e27243dae92.png', // Cyprus
    'CYPRUS',
    'Luxury',
    'Modern',
    '/lovable-uploads/60f987b0-c196-47b5-894d-173d604fa4c8.png', // Mersin
    'MERSIN',
    '/lovable-uploads/956541d2-b461-4acd-a29a-463c5a97983e.png', // Antalya
    'ANTALYA',
    'Premium',
    'Locations'
  ];

  return (
    <section className="py-0">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Most Popular Cities
        </h2>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Discover properties in our most sought-after destinations
        </p>
      </div>
      <GridMotion 
        items={cityItems}
        gradientColor="hsl(213 100% 15%)"
        className="bg-gradient-dark"
      />
    </section>
  );
};

export default PopularCities;
