

# Plan: Remove Elfsight Widget and Hardcode All Translations

## Overview
Remove the Elfsight third-party translation widget completely and replace it with a fully hardcoded, in-app translation system for 13 languages. This will eliminate the translation bugs (Mersin -> Myrtle, name mangling), improve performance (no external script load), and give full control over every translated string.

## Current State
- Elfsight widget loaded in `index.html` (script + div element)
- `src/utils/translations.ts` already has a `t()` function and translations for 9 languages (en, sv, no, da, tr, ar, ru, fa, ur) — but ar, ru, fa, ur are incomplete (only ~15 keys vs ~200+ for en/sv)
- `SimpleLanguageSelector` component exists but was removed from the navigation bar
- Only 2 pages (`Testimonials.tsx`, `PropertyDetail.tsx`) currently use the `t()` function
- Most pages render hardcoded English strings with no translation calls

## Languages (13 total)
**Existing (9):** English, Svenska, Norsk, Dansk, Türkçe, Русский, اردو, العربية, فارسی
**New (4):** Español, Deutsch, Français, Bahasa Indonesia

## Plan

### Step 1: Remove Elfsight completely
- Remove Elfsight `<script>` tag and `<div>` widget from `index.html`
- Remove DNS prefetch for `static.elfsight.com` from `PerformanceOptimizer.tsx`
- Clean up Elfsight-related comments in `useLanguageUrlSync.ts` and `App.tsx`
- Remove all `notranslate` / `translate="no"` attributes that were added specifically to fight Elfsight bugs (no longer needed)

### Step 2: Add SimpleLanguageSelector back to Navigation
- Re-add the `SimpleLanguageSelector` component to `Navigation.tsx` header bar
- Update the language list to include all 13 languages (add es, de, fr, id)
- Update `seoUtils.ts` supported languages array to match

### Step 3: Complete all translation keys for all 13 languages
- Expand `translations.ts` to have complete translations for all ~200+ keys across all 13 languages
- Add the 4 new language sections (es, de, fr, id)
- Fill in missing keys for ar, ru, fa, ur (currently only have ~15 keys each, need ~200+)
- This is the largest step — will produce a file of roughly 3000+ lines

### Step 4: Wire up `t()` function across all components
- Create a `useTranslation` hook that provides `t()` with the current language automatically
- Update major components to use `t()` instead of hardcoded English:
  - `Hero.tsx` — search labels, CTAs
  - `Sidebar.tsx` — menu items
  - `Navigation.tsx` — contact bar text
  - `ContactUs.tsx` — form labels, headings
  - `AboutUs.tsx` — page content
  - `PropertyFilter.tsx` — filter labels
  - `PropertyCard.tsx` — status badges, labels
  - `PropertyWizardComponent.tsx` — wizard steps
  - `Newsletter.tsx` — subscribe section
  - `TeamSection.tsx` — titles (not names)
  - `FounderSection.tsx` — titles
  - `PopularCities.tsx` / `DynamicCitiesGrid.tsx` — section headings
  - `Information.tsx` — filter categories
  - `Footer` / other shared components

### Step 5: Handle RTL languages
- For Arabic (ar), Farsi (fa), and Urdu (ur), add `dir="rtl"` to the `<html>` element when those languages are selected
- Ensure the language selector updates `document.documentElement.dir` alongside `document.documentElement.lang`

## Technical Details

**New `useTranslation` hook:**
```typescript
export const useTranslation = () => {
  const lang = getCurrentLanguage();
  return {
    t: (key: string) => t(key, lang),
    lang,
    isRTL: ['ar', 'fa', 'ur'].includes(lang)
  };
};
```

**Translation file structure** — each language will have the same ~200 keys covering: navigation, hero, property wizard (5 steps), contact page, about page, services, cities, filters, common UI strings, property detail labels, footer, newsletter, testimonials section.

**Performance benefit**: Removing the Elfsight external script eliminates ~200KB+ of JavaScript and multiple network requests on every page load.

## What Will NOT Change
- Property names/descriptions from Supabase stay as-is (database content)
- Personnel names remain untranslated (intentional)
- City names (Mersin, Antalya, etc.) stay the same in all languages
- URL slug translation system (`slugHelpers.ts`) continues working as before
- Currency selector remains independent

