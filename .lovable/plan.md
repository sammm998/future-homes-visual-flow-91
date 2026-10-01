# Editorial Estate redesign for public pages

## Goal
Bring every public-facing page into the same Midnight Riviera visual system as the homepage, using the selected Editorial Estate direction. Preserve existing content, translations, URLs, forms, search behavior, and SEO.

## What will change

### 1. Shared public-page design system
- Create reusable page-header, editorial section, image-card, conversion banner, stat row, and empty/loading-state patterns.
- Use the existing navy, champagne, ivory, and white tokens with Sora headings and Manrope body text.
- Standardize spacing, image ratios, borders, shadows, buttons, focus states, and restrained scroll/hover animation.
- Keep the shared navigation, footer behavior, WhatsApp action, language switching, and mobile layout consistent.

### 2. Easy Find
- Turn the current standalone white chat screen into a premium property-concierge experience.
- Add a branded editorial introduction, clearer Emma presence, refined write/speak controls, destination shortcuts, and a stronger prompt/search area.
- Restyle conversation messages, property results, article results, loading feedback, and error states without changing the existing AI behavior.
- Ensure the selected language remains visible and controls all labels, prompts, and replies.

### 3. Information and articles
- Replace the blank loading screen with a polished editorial loading state.
- Add an image-led introduction, refined category navigation, featured content, and cinematic article cards.
- Apply the same card and typography system to the article index and individual article presentation where shared components allow it.
- Preserve filtering, remembered category state, localized links, and current article data.

### 4. Property discovery pages
- Redesign the main property-for-sale page and its related landing-page family with cinematic image headers, concise benefit rows, editorial property-type cards, visual destination cards, an easier buying-process timeline, and cleaner FAQs.
- Reuse the existing cinematic property cards for actual listings and keep all property links and filters working.
- Apply the same structure to city and category pages without changing their SEO text or localized URLs.

### 5. Company and conversion pages
- Modernize About, Contact, Our Story, Testimonials, Design Your Home, Property Wizard, gallery, and map/search shells using the same reusable sections.
- Make Contact more conversion-focused with a clear advisor panel, office information, and a premium form while preserving CRM and email submission behavior.
- Keep page-specific visual identity where already stronger than the old layouts, rather than flattening every page into one template.

### 6. Validation
- Check every public route and its locale-prefixed counterpart for metadata, layout consistency, loading/empty states, and working navigation.
- Verify Easy Find, forms, filters, listing links, and articles on desktop and mobile.
- Confirm no overlaps, horizontal overflow, runtime errors, or build errors.

## Technical notes
- Implement shared presentation components instead of duplicating large page layouts.
- Keep all color and shadow values in semantic design tokens; no page-level hardcoded palette.
- Keep the existing TanStack route structure and generated route tree untouched.
- Preserve the browser storage shim and existing server/client boundaries.
- Update the project architecture notes when shared page structures change.
