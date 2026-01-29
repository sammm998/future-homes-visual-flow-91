
# Plan: Language-Aware URLs and Homepage Performance Optimization

## Overview
This plan addresses two key improvements:
1. Update URLs to reflect the selected language when switching
2. Significantly improve homepage loading speed and ensure images load instantly

---

## Part 1: Language-Aware URL Switching

### Current Behavior
- Language selection uses query parameters (`?lang=sv`, `?lang=tr`, etc.)
- When language is changed, the URL updates via `navigate()` but only adds/removes the `lang` parameter
- The `SimpleLanguageSelector` component handles language switching

### Implementation Changes

**1.1 Update SimpleLanguageSelector.tsx**
- Modify the `handleLanguageChange` function to preserve existing URL parameters when switching languages
- Ensure the language parameter is properly added/removed based on selection
- Force a page reload or React Router navigation to update content

**1.2 Enhance SEO URL handling in seoUtils.ts**
- Add more languages to the supported list (Norwegian `no`, Danish `da`, Urdu `ur`, Farsi `fa`, Russian `ru`)
- Update `getHreflangUrls` to include all 9 supported languages
- Ensure canonical URLs are correctly generated for all language variants

**1.3 Update SEOHead component**
- Ensure hreflang tags are generated for all supported languages
- Update meta tags dynamically based on current language

---

## Part 2: Homepage Performance Optimization

### Current Performance Issues Identified
1. **HeroSlider**: Loads 6 large background images simultaneously
2. **PropertyListingSection**: Fetches 196 properties, displays 4 at a time
3. **TestimonialsMasonryGrid**: Loads 12 testimonial images
4. **PropertyImageGalleryPreview**: Loads 8 Unsplash images
5. **TeamSection**: Loads team member images from database
6. **InteractiveSelector**: Loads 6 destination images
7. **FeatureDemo**: Loads 2 large comparison images
8. **Multiple lazy-loaded components** that still load many images

### Implementation Changes

**2.1 Critical Above-the-Fold Optimizations**

*HeroSlider.tsx*
- Add `loading="eager"` and `fetchPriority="high"` for first slide only
- Preload only the first 2 slides, lazy-load the rest
- Add proper width/height attributes for layout stability

*Hero.tsx*
- Preload hero background image using `<link rel="preload">`
- Reduce animations that cause layout shift

**2.2 Image Loading Strategy**

*OptimizedPropertyImage.tsx*
- Reduce IntersectionObserver rootMargin from 200px to 400px for earlier loading
- Add native `fetchPriority` support
- Simplify fallback logic to reduce processing time

*PropertyCard.tsx*
- Set first 4 property cards to priority loading
- Use smaller thumbnail sizes for grid view

**2.3 Component-Level Optimizations**

*PropertyListingSection.tsx*
- Add `priority={index < 4}` to first 4 PropertyCards
- Implement skeleton loading for smoother perceived performance

*TestimonialsMasonryGrid.tsx*
- Add lazy loading for images below the fold
- Reduce initial load to 8 testimonials instead of 12
- Add `loading="lazy"` to non-critical images

*PropertyImageGalleryPreview.tsx*
- Add `loading="lazy"` to all images
- Use smaller image sizes (300px instead of 400px)

*InteractiveSelector.tsx*
- Preload only the active destination image
- Add `loading="lazy"` to inactive images

*TeamSection.tsx*
- Add `loading="lazy"` to team member images
- Add proper width/height for layout stability

**2.4 Global Performance Enhancements**

*Index.tsx*
- Prioritize critical above-the-fold content
- Defer non-critical sections using dynamic imports
- Reduce popup delay timer impact (already at 60s, keep as is)

*GlobalPerformanceOptimizer.tsx*
- Add critical CSS for hero section
- Implement resource hints for images
- Add fetchPriority hints for critical images

**2.5 Query and Data Fetching Optimizations**

*useProperties.ts*
- Add a `limit` parameter to initial fetch (fetch only what's needed)
- Implement pagination at the database level

*useTestimonials.ts*
- Limit initial fetch to 12 testimonials (what's displayed)
- Add lazy loading for more testimonials

---

## Technical Details

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/SimpleLanguageSelector.tsx` | Update navigation logic for language URLs |
| `src/utils/seoUtils.ts` | Add missing languages (no, da, ur, fa, ru) |
| `src/components/HeroSlider.tsx` | Add priority loading for first image |
| `src/components/OptimizedPropertyImage.tsx` | Increase rootMargin, optimize loading |
| `src/components/PropertyCard.tsx` | Pass priority prop through |
| `src/components/PropertyListingSection.tsx` | Add priority to first 4 cards |
| `src/components/TestimonialsMasonryGrid.tsx` | Reduce initial load, add lazy loading |
| `src/components/PropertyImageGalleryPreview.tsx` | Add lazy loading |
| `src/components/InteractiveSelector.tsx` | Add lazy loading for non-active |
| `src/components/TeamSection.tsx` | Add lazy loading |
| `src/components/ui/testimonials-columns-1.tsx` | Add lazy loading |
| `src/pages/Index.tsx` | Add preload hints |

### Performance Targets
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- All above-the-fold images loaded immediately
- Below-the-fold images lazy-loaded as user scrolls

---

## Implementation Order

1. **Phase 1**: Language URL switching (SimpleLanguageSelector, seoUtils)
2. **Phase 2**: Hero section optimization (HeroSlider, Hero)
3. **Phase 3**: Property section optimization (PropertyListingSection, PropertyCard)
4. **Phase 4**: Testimonials and secondary sections
5. **Phase 5**: Global performance optimizer updates

