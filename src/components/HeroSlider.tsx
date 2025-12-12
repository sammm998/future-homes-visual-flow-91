import { useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import baliImage from '@/assets/bali-destination.jpg';
import marinaImage from '@/assets/marina-destination.jpg';
import istanbulImage from '@/assets/istanbul-destination.jpg';

const HeroSlider = () => {
  const slides = [
    {
      image: "/lovable-uploads/37669c23-a476-4550-84f1-f370ce4333a1.png",
      alt: "Antalya - Turkish Riviera Paradise"
    },
    {
      image: istanbulImage,
      alt: "Istanbul - Where East Meets West"
    },
    {
      image: "/lovable-uploads/122a7bd0-5d6b-4bcf-8db9-bfdbcf1565d5.png",
      alt: "Dubai - Modern Metropolis"
    },
    {
      image: marinaImage,
      alt: "Mersin - Mediterranean Coastal"
    },
    {
      image: "/lovable-uploads/760abba9-43a1-433b-83fd-d578ecda1828.png",
      alt: "Cyprus - Island Paradise"
    },
    {
      image: baliImage,
      alt: "Bali - Island of Gods Paradise"
    }
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      duration: 30
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden" ref={emblaRef}>
      <div className="flex h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="flex-[0_0_100%] min-w-0 relative"
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
