# Project Memory

## Core
- Brand is "Future Homes International". Forms/Resend use `info@futurehomesturkey.com`.
- 13 languages. Hybrid translation: `translations.ts` for UI, DB for dynamic content. RTL for ar, fa, ur.
- ElevenLabs and Elfsight widgets permanently removed. Visual Gallery removed from homepage.
- Emma AI banner links to internal `/ai-property-search` (NOT external futurehomesai.one).
- Properties: default sort `refNo` DESC. Inactive/sold properties hidden. Strict prefix location filtering.
- Admin dashboard protected by login at `/admin-login`. Admin email: samincroseo@gmail.com (auto-assigned admin role on signup).

## Memories
- [Company Branding & Email](mem://branding/company-rebranding) — Rebranded to Future Homes International, email config
- [Hero Design](mem://hero/image-carousel-replacing-video) — Hero uses image carousel (5 slides), no video
- [ElevenLabs Constraint](mem://integrations/elevenlabs-widget-removed) — ElevenLabs widget is permanently removed
- [Property Sorting](mem://properties/default-sorting-descending) — Default sorting by refNo descending
- [Navigation State](mem://ui/navigation-state-persistence) — Preserve search state on back navigation
- [Default Sales Rep](mem://sales/default-representative-batuhan) — Batuhan Kunt is the default sales representative
- [Localized Slugs](mem://seo/localized-slug-urls) — Localized URL segments for 13 languages
- [Language Persistence](mem://navigation/language-persistence) — Storing language preference
- [Image Loading Fallback](mem://properties/image-loading-fallback) — Fallbacks for missing property images
- [URL Redirection](mem://seo/url-redirection-logic) — Redirect mismatched language URLs
- [Indexing and Sitemap](mem://seo/indexing-and-sitemap-configuration) — Supported languages and dynamic metadata
- [Location Filtering](mem://properties/filtering-location-logic) — Strict prefix matching for locations
- [Slug Generation](mem://seo/localized-slug-generation) — Slugs generated via Gemini
- [Form Error Handling](mem://features/form-error-handling) — Resend API error handling
- [Live Exchange Rates](mem://features/live-exchange-rates) — Currency conversion logic
- [Homepage Modifications](mem://ui/homepage-content-modifications) — Visual Gallery removed, logo dimensions
- [Visibility Filtering](mem://properties/visibility-filtering) — Hide inactive and sold properties
- [Translation System](mem://integrations/internal-translation-system) — Elfsight removed, replaced by internal system
- [Language Navigation](mem://ui/language-selector-navigation) — Manual language switching
- [RTL Support](mem://ui/rtl-language-support) — Right-to-Left layout support
- [Hybrid Architecture](mem://architecture/translation-hybrid-system) — Dictionary for UI, DB for dynamic content
