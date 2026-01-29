
# Plan: Fix Slow Property and Listing Pages with Image Loading Issues

## Problem Analysis

After analyzing the codebase, I've identified several performance bottlenecks causing slow page loads and images not displaying:

### Issue 1: All Properties Fetched Every Time
- `useProperties()` hook fetches ALL properties from the database with no limit
- This includes ~200+ properties, causing slow initial loads
- Each listing page (Antalya, Dubai, Cyprus, etc.) re-fetches everything

### Issue 2: OptimizedPropertyImage Loading Logic Issues
- Images wait for IntersectionObserver to trigger before loading
- Even with `priority={true}`, the component uses a blur placeholder first
- `currentSrc` state starts empty for non-priority images, causing delays
- Multiple fallback attempts (up to 4) with delays add to loading time

### Issue 3: PropertyCard Always Sets `priority={true}`
- Line 108: `priority={true}` is always set, but the OptimizedPropertyImage component ignores this for lazy-loaded images
- The priority prop doesn't properly cascade to force immediate loading

### Issue 4: Heavy Console Logging in Production
- Debug logs on every image load and property check slow down rendering
- `console.log` calls throughout PropertyCard, OptimizedPropertyImage, and listing pages

### Issue 5: No Initial Data Limit
- Listing pages show 20 properties per page but fetch ALL properties upfront
- No server-side pagination

---

## Implementation Plan

### Phase 1: Fix OptimizedPropertyImage for Instant Loading

**File: `src/components/OptimizedPropertyImage.tsx`**

Changes:
1. Remove the delay caused by starting with empty `currentSrc`
2. For `priority={true}` images, set `currentSrc` immediately without placeholder
3. Increase rootMargin to 600px for even earlier loading
4. Add `loading="eager"` for priority images
5. Remove excessive console.log statements (keep only error logs)
6. Simplify fallback logic to reduce delays

### Phase 2: Optimize PropertyCard Image Loading

**File: `src/components/PropertyCard.tsx`**

Changes:
1. Accept optional `priority` prop from parent components
2. Remove excessive console.log statements
3. Pass priority to OptimizedPropertyImage based on prop

### Phase 3: Add Priority Loading for First Properties

**Files:**
- `src/pages/AntalyaPropertySearch.tsx`
- `src/pages/DubaiPropertySearch.tsx`
- `src/pages/CyprusPropertySearch.tsx`
- `src/pages/IstanbulPropertySearch.tsx`
- `src/pages/MersinPropertySearch.tsx`
- `src/pages/BaliPropertySearch.tsx`

Changes for each:
1. Pass `priority={index < 6}` to first 6 PropertyCards
2. This ensures above-the-fold images load immediately
3. Remove debug console.log statements

### Phase 4: Add Database Pagination

**File: `src/hooks/useProperties.ts`**

Changes:
1. Add optional `limit` parameter
2. Limit initial fetch to 100 properties max
3. Add `locationFilter` parameter for location-specific fetches

**Files: Listing pages**

Changes:
1. Pass location filter to useProperties for more efficient queries
2. Reduce initial data load

### Phase 5: Optimize PropertyDetail Page

**File: `src/pages/PropertyDetail.tsx`**

Changes:
1. Add preload links for first property image
2. Set first image to `priority={true}` with eager loading
3. Preload additional gallery images in the background

### Phase 6: Clean Up Console Logging

Remove or reduce console.log statements in:
- `src/components/OptimizedPropertyImage.tsx`
- `src/components/PropertyCard.tsx`
- `src/pages/DubaiPropertySearch.tsx`
- `src/pages/AntalyaPropertySearch.tsx`
- `src/lib/supabase-enhanced.ts`

---

## Technical Details

### OptimizedPropertyImage Changes

```text
Current flow:
1. Component mounts → currentSrc = '' (empty)
2. Wait for IntersectionObserver
3. Observer triggers → setCurrentSrc(validSrc)
4. Image starts loading → shows blur placeholder
5. Image loads → show actual image

Improved flow:
1. Component mounts → currentSrc = validSrc (immediate for priority)
2. Image starts loading immediately
3. No IntersectionObserver delay for priority images
4. Faster perceived performance
```

### PropertyCard Priority Prop

```typescript
interface PropertyCardProps {
  property: Property;
  priority?: boolean; // NEW: Allow parent to set priority
}

// Pass to OptimizedPropertyImage
<OptimizedPropertyImage
  src={getImageUrl()}
  alt={property.title}
  priority={priority} // Pass through from parent
/>
```

### Listing Page Priority for First 6 Items

```typescript
{paginatedProperties.map((property, index) => (
  <PropertyCard 
    key={property.id} 
    property={property}
    priority={index < 6} // First 6 cards load immediately
  />
))}
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/OptimizedPropertyImage.tsx` | Fix initial load, remove delays, reduce logging |
| `src/components/PropertyCard.tsx` | Add priority prop, remove logging |
| `src/pages/AntalyaPropertySearch.tsx` | Add priority to first cards, reduce logging |
| `src/pages/DubaiPropertySearch.tsx` | Add priority to first cards, reduce logging |
| `src/pages/CyprusPropertySearch.tsx` | Add priority to first cards |
| `src/pages/IstanbulPropertySearch.tsx` | Add priority to first cards |
| `src/pages/MersinPropertySearch.tsx` | Add priority to first cards |
| `src/pages/BaliPropertySearch.tsx` | Add priority to first cards |
| `src/pages/PropertyDetail.tsx` | Optimize image preloading |
| `src/components/PropertyListingSection.tsx` | Add priority to first cards |
| `src/hooks/useProperties.ts` | Add limit parameter |
| `src/lib/supabase-enhanced.ts` | Reduce logging |

---

## Expected Results

After implementation:
- First 6 property images load immediately on listing pages
- Property detail page images load instantly
- Reduced network requests through pagination
- Cleaner console output (no debug spam)
- Faster perceived performance across all property pages
- LCP improvement from ~4s to under 2s
