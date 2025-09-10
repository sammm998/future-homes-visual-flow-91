import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import NetflixPropertyCard from './NetflixPropertyCard';

interface Property {
  id: string;
  title: string;
  location: string;
  property_image: string;
  property_images: string[];
  price: string;
  bedrooms?: string;
  bathrooms?: string;
  sizes_m2?: string;
  area?: string;
  status?: string;
}

interface PropertyRowProps {
  title: string;
  properties: Property[];
  onViewGallery: (property: Property) => void;
}

const PropertyRow: React.FC<PropertyRowProps> = ({ title, properties, onViewGallery }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 640; // Width of 2 cards (320px each)
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  if (properties.length === 0) return null;

  return (
    <div className="relative group mb-12">
      {/* Row Title */}
      <h2 className="text-2xl font-bold text-foreground mb-6 px-4 sm:px-6 lg:px-8">
        {title}
      </h2>

      {/* Scroll Container */}
      <div className="relative">
        {/* Left Scroll Button */}
        <Button
          onClick={() => scroll('left')}
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full w-12 h-12"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        {/* Right Scroll Button */}
        <Button
          onClick={() => scroll('right')}
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full w-12 h-12"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {properties.map((property, index) => (
            <NetflixPropertyCard
              key={property.id}
              property={property}
              onViewGallery={onViewGallery}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyRow;