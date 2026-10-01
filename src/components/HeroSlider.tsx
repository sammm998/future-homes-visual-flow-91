import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

import baliImage from '@/assets/bali-destination.webp';
import marinaImage from '@/assets/marina-destination.webp';
import istanbulImage from '@/assets/istanbul-destination.webp';

const HeroSlider = () => {
  const slides = [
    {
      image: "/lovable-uploads/hero-antalya-1200.webp",
      srcSet: "/lovable-uploads/hero-antalya-768.webp 768w, /lovable-uploads/hero-antalya-1200.webp 1200w",
      alt: "Antalya - Turkish Riviera Paradise"
    },
    {
      image: istanbulImage,
      alt: "Istanbul - Where East Meets West"
    },
    {
      image: "/lovable-uploads/122a7bd0-5d6b-4bcf-8db9-bfdbcf1565d5.webp",
      alt: "Dubai - Modern Metropolis"
    },
    {
      image: marinaImage,
      alt: "Mersin - Mediterranean Coastal"
    },
    {
      image: "/lovable-uploads/760abba9-43a1-433b-83fd-d578ecda1828.webp",
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

  // Only download slides that have been (or are about to be) shown.
  const [visible, setVisible] = useState<number[]>([0]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const i = emblaApi.selectedScrollSnap();
    const next = (i + 1) % slides.length;
    setVisible((prev) => (prev.includes(i) && prev.includes(next) ? prev : Array.from(new Set([...prev, i, next]))));
  }, [emblaApi, slides.length]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  return (
    <div dir="ltr" className="absolute inset-0 w-full h-full overflow-hidden" ref={emblaRef}>
      <div className="flex h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="flex-[0_0_100%] min-w-0 relative bg-muted"
          >
            {visible.includes(index) && (
              <img
                src={slide.image}
                srcSet={(slide as { srcSet?: string }).srcSet}
                sizes={(slide as { srcSet?: string }).srcSet ? "100vw" : undefined}
                alt={slide.alt}
                width={1200}
                height={675}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "low"}
                decoding={index === 0 ? "sync" : "async"}
              />
            )}
            <div className="absolute inset-0 bg-navy/45"></div>
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy/90 via-navy/25 to-transparent"></div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default HeroSlider;
