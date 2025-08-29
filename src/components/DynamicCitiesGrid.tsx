import { DynamicFrameLayout } from "@/components/ui/dynamic-frame-layout";
import { Button } from "@/components/ui/button";

const DynamicCitiesGrid = () => {
  
  
  const cityFrames = [
    {
      id: 1,
      image: '/lovable-uploads/2209cb13-f5ad-47af-ad83-fac59b9edd3b.png',
      title: 'DUBAI',
      defaultPos: { x: 0, y: 0, w: 4, h: 4 },
      mediaSize: 1,
      isHovered: false,
    },
    {
      id: 2,
      image: '/lovable-uploads/0d7b0c8a-f652-488b-bfca-3a11c1694220.png',
      title: 'CYPRUS',
      defaultPos: { x: 4, y: 0, w: 4, h: 4 },
      mediaSize: 1,
      isHovered: false,
    },
    {
      id: 4,
      image: '/lovable-uploads/60f987b0-c196-47b5-894d-173d604fa4c8.png',
      title: 'MERSIN',
      defaultPos: { x: 0, y: 4, w: 4, h: 4 },
      mediaSize: 1,
      isHovered: false,
    },
    {
      id: 5,
      image: '/lovable-uploads/0d7b0c8a-f652-488b-bfca-3a11c1694220.png',
      title: 'CYPRUS',
      defaultPos: { x: 4, y: 4, w: 4, h: 4 },
      mediaSize: 1,
      isHovered: false,
    },
    {
      id: 6,
      image: '/lovable-uploads/2209cb13-f5ad-47af-ad83-fac59b9edd3b.png',
      title: 'DUBAI',
      defaultPos: { x: 8, y: 4, w: 4, h: 4 },
      mediaSize: 1,
      isHovered: false,
    },
    {
      id: 7,
      image: '/lovable-uploads/0d7b0c8a-f652-488b-bfca-3a11c1694220.png',
      title: 'CYPRUS',
      defaultPos: { x: 0, y: 8, w: 4, h: 4 },
      mediaSize: 1,
      isHovered: false,
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=500&fit=crop',
      title: 'TALK TO AI',
      defaultPos: { x: 4, y: 8, w: 4, h: 4 },
      mediaSize: 1,
      isHovered: false,
      isButton: true,
    },
    {
      id: 9,
      image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=500&fit=crop',
      title: 'SEE ALL',
      defaultPos: { x: 8, y: 8, w: 4, h: 4 },
      mediaSize: 1,
      isHovered: false,
      isButton: true,
    },
  ];

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Discover properties in our most sought-after destinations
          </h2>
        </div>
        <div className="h-[600px] w-full">
          <DynamicFrameLayout 
            frames={cityFrames} 
            className="w-full h-full" 
            hoverSize={6}
            gapSize={8}
          />
        </div>
      </div>
    </section>
  );
};

export default DynamicCitiesGrid;
