
# Plan: Fix Property URLs with Slugs, Language Support, and Performance

## Problem Summary

Based on my investigation, I identified the following issues:

1. **URLs use UUIDs instead of slugs**: The `handlePropertyClick` functions in listing pages use `property.uuid` or `property.id` as the URL path instead of `property.slug`
2. **PropertyCard uses correct slug logic** but listing pages bypass PropertyCard's click handler with their own `handlePropertyClick` that uses wrong identifiers
3. **Language parameter not preserved**: When navigating to property pages, the `?lang=` parameter from the current URL is not carried over
4. **Additional performance issues**: Some pages still have logging and could benefit from optimization

## Root Cause Analysis

### Issue 1: Wrong URL identifiers in handlePropertyClick

In AntalyaPropertySearch.tsx (line 209):
```javascript
navigate(`/property/${(property as any).uuid || property.refNo || property.id}`, {...}
```

The priority order is wrong. It should be:
```javascript
navigate(`/property/${property.slug || property.refNo || property.id}`, {...}
```

Similar issues exist in:
- CyprusPropertySearch.tsx (line 217): Uses `property.id` directly
- MersinPropertySearch.tsx: Same pattern
- All other listing pages

### Issue 2: Language parameter not preserved

When clicking a property, the current language is lost because the navigation doesn't include the `?lang=` parameter. The fix requires:
1. Reading current language from URL
2. Appending it to the property URL when navigating

## Implementation Plan

### Phase 1: Fix handlePropertyClick in All Listing Pages

Update the `handlePropertyClick` function in each listing page to:
1. Use `property.slug` as the primary URL identifier
2. Preserve the `?lang=` parameter from the current URL

**Files to modify:**
- `src/pages/AntalyaPropertySearch.tsx`
- `src/pages/DubaiPropertySearch.tsx`
- `src/pages/CyprusPropertySearch.tsx`
- `src/pages/IstanbulPropertySearch.tsx`
- `src/pages/MersinPropertySearch.tsx`
- `src/pages/BaliPropertySearch.tsx`

**New handlePropertyClick pattern:**
```javascript
const handlePropertyClick = (property: any) => {
  const currentUrl = `${location.pathname}${location.search}`;
  const currentScrollY = window.scrollY;
  
  // Get current language parameter
  const searchParams = new URLSearchParams(location.search);
  const lang = searchParams.get('lang');
  
  // Use slug as primary identifier
  const propertyPath = property.slug || property.refNo || property.ref_no || property.id;
  const langParam = lang ? `?lang=${lang}` : '';
  
  navigate(`/property/${propertyPath}${langParam}`, {
    state: {
      from: '/antalya',
      returnUrl: currentUrl,
      savedPage: currentPage,
      savedScrollY: currentScrollY
    }
  });
};
```

### Phase 2: Update PropertyCard Link Generation

Update PropertyCard to also include language parameter in its generated URLs.

**File:** `src/components/PropertyCard.tsx`

Change:
```javascript
const propertyUrl = property.slug 
  ? `/property/${property.slug}` 
  : property.refNo || property.ref_no 
    ? `/property/${property.refNo || property.ref_no}` 
    : `/property/${property.id}`;
```

To:
```javascript
// Get current language from URL
const location = useLocation();
const searchParams = new URLSearchParams(location.search);
const lang = searchParams.get('lang');
const langParam = lang ? `?lang=${lang}` : '';

const propertyPath = property.slug 
  || property.refNo 
  || property.ref_no 
  || property.id;
  
const propertyUrl = `/property/${propertyPath}${langParam}`;
```

### Phase 3: Update SEO Schema URLs

Fix the SEO schema URLs in listing pages to use slugs instead of refNo or uuid.

**Example change in AntalyaPropertySearch.tsx:**
```javascript
generatePropertyListSchema(
  antalyaProperties.slice(0, 10).map(p => ({
    title: p.title,
    price: p.price,
    url: `https://futurehomesinternational.com/property/${p.slug || p.refNo || p.uuid}`,
    image: p.image
  })),
  'Properties for Sale in Antalya'
)
```

### Phase 4: Update PropertyDetail canonical URL

Update the SEOHead canonical URL in PropertyDetail to use slug.

**File:** `src/pages/PropertyDetail.tsx`

Change:
```javascript
canonicalUrl={`https://futurehomesinternational.com/property/${property.refNo || property.id}`}
```

To:
```javascript
canonicalUrl={`https://futurehomesinternational.com/property/${property.slug || property.refNo || property.id}`}
```

### Phase 5: Performance Optimizations

1. Remove remaining console.log statements in PropertyDetail.tsx (lines 401-406, 409, 419)
2. Add proper image preloading hints

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/AntalyaPropertySearch.tsx` | Fix handlePropertyClick to use slug + lang param |
| `src/pages/DubaiPropertySearch.tsx` | Fix handlePropertyClick to use slug + lang param |
| `src/pages/CyprusPropertySearch.tsx` | Fix handlePropertyClick to use slug + lang param |
| `src/pages/IstanbulPropertySearch.tsx` | Fix handlePropertyClick to use slug + lang param |
| `src/pages/MersinPropertySearch.tsx` | Fix handlePropertyClick to use slug + lang param |
| `src/pages/BaliPropertySearch.tsx` | Fix handlePropertyClick to use slug + lang param |
| `src/components/PropertyCard.tsx` | Add language parameter to property URLs |
| `src/pages/PropertyDetail.tsx` | Fix canonical URL, remove debug logs |

## Expected Results

After implementation:
- Property URLs will use SEO-friendly slugs (e.g., `/property/luxury-apartments-in-antalya-altintas`)
- Language parameter will be preserved when navigating (e.g., `/property/luxury-apartments?lang=sv`)
- When switching language, property pages will update their content
- Canonical URLs will use slugs for better SEO
- Faster page loads with removed debug logging
