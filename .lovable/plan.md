
# Plan: Translated Property URL Slugs + Performance Boost

## Problem Analysis

Currently, property URLs show English slugs regardless of language selection:
- English: `/property/peaceful-spacious-apartments-in-antalya`
- Swedish (selected): `/property/peaceful-spacious-apartments-in-antalya?lang=sv`

The user expects the slug to be translated when changing language.

## Technical Findings

1. **Database State**: All 159 properties only have English slugs. The `parent_property_id` column exists for translation linking but is unused.
2. **Translation Infrastructure**: The `translate-text` edge function exists and uses Google Translate API.
3. **Current Flow**: Language switching adds `?lang=` but doesn't modify the URL path.

## Proposed Solution

### Option A: Database-Stored Translated Slugs (Recommended)
Store pre-translated slugs for each language combination in the database:

```text
properties table:
- id: abc123
- title: "Peaceful apartments in Antalya"
- slug: "peaceful-apartments-in-antalya"  (English)
- slug_sv: "fridfulla-lagenheter-i-antalya" (Swedish)
- slug_tr: "antalyada-huzurlu-daireler" (Turkish)
- ...etc
```

**Pros**: Fast lookups, SEO-friendly, cacheable
**Cons**: Requires database migration and batch translation of ~159 properties × 8 languages

### Option B: Dynamic Slug Translation with Caching
Translate slugs on-the-fly using the edge function, with aggressive caching:

1. When navigating to a property with `?lang=sv`, fetch the translated slug
2. Cache the translation in localStorage/sessionStorage
3. Update the URL to show the translated slug

**Pros**: No database changes needed
**Cons**: Initial translation latency, API costs

### Option C: Hybrid Approach (Recommended Implementation)
1. Add translated slug columns to database
2. Create a migration script to batch-translate all slugs
3. Update navigation to use language-specific slugs
4. Update property lookup to search all slug columns

---

## Implementation Plan

### Phase 1: Database Schema Update
Add translated slug columns to the `properties` table:
```sql
ALTER TABLE properties
ADD COLUMN slug_sv TEXT,
ADD COLUMN slug_tr TEXT,
ADD COLUMN slug_ar TEXT,
ADD COLUMN slug_ru TEXT,
ADD COLUMN slug_no TEXT,
ADD COLUMN slug_da TEXT,
ADD COLUMN slug_fa TEXT,
ADD COLUMN slug_ur TEXT;
```

### Phase 2: Create Batch Translation Edge Function
New edge function `translate-slugs` that:
1. Fetches all properties with missing translated slugs
2. Translates titles to each language
3. Generates URL-safe slugs from translated titles
4. Updates the database

### Phase 3: Update Property Lookup
Modify `useProperty.ts` to:
1. Check current language from URL
2. Search for property by language-specific slug column first
3. Fall back to English slug if not found

### Phase 4: Update Navigation with Translated URLs
Modify listing pages and PropertyCard to:
1. Get current language
2. Use the correct language slug for property links
3. Generate language-specific URLs

### Phase 5: Performance Optimizations
Additional speed improvements:
1. Add database index on all slug columns
2. Implement preloading for property images
3. Add prefetching for next page of properties
4. Reduce stale time for faster perceived updates

---

## Files to Modify/Create

| File | Changes |
|------|---------|
| `supabase/migrations/add_translated_slugs.sql` | Add translated slug columns |
| `supabase/functions/translate-slugs/index.ts` | New batch translation function |
| `src/hooks/useProperty.ts` | Language-aware slug lookup |
| `src/hooks/useProperties.ts` | Fetch all slug columns |
| `src/components/PropertyCard.tsx` | Use language-specific slug in URL |
| `src/pages/AntalyaPropertySearch.tsx` | Use language slug in handlePropertyClick |
| `src/pages/DubaiPropertySearch.tsx` | Use language slug in handlePropertyClick |
| `src/pages/CyprusPropertySearch.tsx` | Use language slug in handlePropertyClick |
| `src/pages/IstanbulPropertySearch.tsx` | Use language slug in handlePropertyClick |
| `src/pages/MersinPropertySearch.tsx` | Use language slug in handlePropertyClick |
| `src/pages/BaliPropertySearch.tsx` | Use language slug in handlePropertyClick |
| `src/components/OptimizedPropertyImage.tsx` | Further optimize loading |

---

## Performance Optimizations

### Image Loading (Additional)
1. Add `<link rel="preload">` for first 4 property images on listing pages
2. Implement native lazy loading with `loading="lazy"` for below-fold images
3. Use smaller image sizes for thumbnails (300px instead of 400px)

### Data Fetching
1. Add database indexes on slug columns for faster lookups
2. Reduce query timeout from 15s to 5s stale time
3. Prefetch next page of properties when user nears bottom

### Rendering
1. Use `React.memo` on PropertyCard to prevent unnecessary re-renders
2. Virtualize property grid for large result sets
3. Add skeleton loading states for smoother perceived performance

---

## Expected Results

After implementation:
- URLs display translated slugs when language is changed
  - EN: `/property/luxury-apartments-in-antalya`
  - SV: `/property/lyxiga-lagenheter-i-antalya?lang=sv`
  - TR: `/property/antalyada-luks-daireler?lang=tr`
- Property pages load faster with optimized image preloading
- Better SEO with language-specific URLs for search engines
- Improved user experience with consistent language throughout the browsing journey
