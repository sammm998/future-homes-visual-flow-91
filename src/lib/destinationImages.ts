// Responsive AVIF variants of the destination and page hero photos.
// The original WebP stays the <img> fallback, so every existing import keeps
// working; ResponsiveImage swaps in the AVIF srcset when one exists.

import antalyaWebp from '@/assets/destinations/antalya-cinematic.webp';
import antalya480 from '@/assets/destinations/antalya-cinematic-480.avif';
import antalya768 from '@/assets/destinations/antalya-cinematic-768.avif';
import antalya1024 from '@/assets/destinations/antalya-cinematic-1024.avif';
import baliWebp from '@/assets/destinations/bali-cinematic.webp';
import bali480 from '@/assets/destinations/bali-cinematic-480.avif';
import bali768 from '@/assets/destinations/bali-cinematic-768.avif';
import bali1024 from '@/assets/destinations/bali-cinematic-1024.avif';
import cyprusWebp from '@/assets/destinations/cyprus-cinematic.webp';
import cyprus480 from '@/assets/destinations/cyprus-cinematic-480.avif';
import cyprus768 from '@/assets/destinations/cyprus-cinematic-768.avif';
import cyprus1024 from '@/assets/destinations/cyprus-cinematic-1024.avif';
import dubaiWebp from '@/assets/destinations/dubai-cinematic.webp';
import dubai480 from '@/assets/destinations/dubai-cinematic-480.avif';
import dubai768 from '@/assets/destinations/dubai-cinematic-768.avif';
import dubai1024 from '@/assets/destinations/dubai-cinematic-1024.avif';
import istanbulWebp from '@/assets/destinations/istanbul-cinematic.webp';
import istanbul480 from '@/assets/destinations/istanbul-cinematic-480.avif';
import istanbul768 from '@/assets/destinations/istanbul-cinematic-768.avif';
import istanbul1024 from '@/assets/destinations/istanbul-cinematic-1024.avif';
import mersinWebp from '@/assets/destinations/mersin-cinematic.webp';
import mersin480 from '@/assets/destinations/mersin-cinematic-480.avif';
import mersin768 from '@/assets/destinations/mersin-cinematic-768.avif';
import mersin1024 from '@/assets/destinations/mersin-cinematic-1024.avif';

import aboutHero from '@/assets/about-hero.jpg';
import aboutHero480 from '@/assets/about-hero-480.avif';
import aboutHero768 from '@/assets/about-hero-768.avif';
import aboutHero1200 from '@/assets/about-hero-1200.avif';
import investment from '@/assets/property-investment.jpg';
import investment480 from '@/assets/property-investment-480.avif';
import investment768 from '@/assets/property-investment-768.avif';
import luxuryInvestment from '@/assets/luxury-property-investment.jpg';
import luxuryInvestment480 from '@/assets/luxury-property-investment-480.avif';
import luxuryInvestment768 from '@/assets/luxury-property-investment-768.avif';
import modernEstate from '@/assets/hero-modern-estate.jpg';
import { homeHeroImage } from '@/lib/homeHeroImage';

const AVIF_SRCSET: Record<string, string> = {
  [antalyaWebp]: `${antalya480} 480w, ${antalya768} 768w, ${antalya1024} 1024w`,
  [baliWebp]: `${bali480} 480w, ${bali768} 768w, ${bali1024} 1024w`,
  [cyprusWebp]: `${cyprus480} 480w, ${cyprus768} 768w, ${cyprus1024} 1024w`,
  [dubaiWebp]: `${dubai480} 480w, ${dubai768} 768w, ${dubai1024} 1024w`,
  [istanbulWebp]: `${istanbul480} 480w, ${istanbul768} 768w, ${istanbul1024} 1024w`,
  [mersinWebp]: `${mersin480} 480w, ${mersin768} 768w, ${mersin1024} 1024w`,
  [aboutHero]: `${aboutHero480} 480w, ${aboutHero768} 768w, ${aboutHero1200} 1200w`,
  [investment]: `${investment480} 480w, ${investment768} 768w`,
  [luxuryInvestment]: `${luxuryInvestment480} 480w, ${luxuryInvestment768} 768w`,
  // Same photo as the homepage hero, which already has AVIF variants.
  [modernEstate]: homeHeroImage.srcSet,
};

export const avifSrcSetFor = (src?: string | null): string | undefined => (src ? AVIF_SRCSET[src] : undefined);
