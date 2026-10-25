import small from '@/assets/hero-modern-estate-480.avif';
import mobile from '@/assets/hero-modern-estate-768.avif';
import laptop from '@/assets/hero-modern-estate-1200.avif';
import desktop from '@/assets/hero-modern-estate-1920.avif';

export const homeHeroImage = {
  src: desktop,
  srcSet: `${small} 480w, ${mobile} 768w, ${laptop} 1200w, ${desktop} 1920w`,
  sizes: '100vw',
};

// Responsive preloads do not need href. Matching React's responsive image
// preload prevents two competing head entries for the same LCP image.
export const homeHeroPreload = {
  rel: 'preload',
  as: 'image',
  imageSrcSet: homeHeroImage.srcSet,
  imageSizes: homeHeroImage.sizes,
  fetchPriority: 'high' as const,
};