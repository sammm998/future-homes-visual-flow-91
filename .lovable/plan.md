# Admin Dashboard — Future Homes International

This is a very large scope. To ship something usable (and not a half-finished mega-PR), I propose a phased build on top of what already exists in this project, instead of starting from scratch.

## What already exists (will be reused, not rebuilt)

- Supabase auth + `admin_users` table + `is_admin()` function
- `ProtectedAdminRoute` wrapper and `/admin-login`, `/admin-dashboard` routes
- `AdminDashboard` page (current skeleton)
- Tables: `properties`, `blog_posts`, `property_translations`, `contacts`, `conversations`, `newsletter_subscriptions`, `homepage_testimonials`, `team_members`, `cms_users`, `cms_user_roles`, `courses`, `course_modules`, `website_content`, `website_media`, `languages`
- Edge functions for translation, image generation, lead capture
- 13-language hybrid translation system
- TipTap-like RTE is not yet installed; shadcn/ui + Tailwind + React Query + Recharts will be added as needed

## Brand

- Sidebar `#1a365d`, accent `#c9a84c`, light bg `#f8fafc`, white surfaces
- Inter (already loaded), semantic tokens added to `index.css` + `tailwind.config.ts` (no hardcoded colors in components)
- New admin shell with collapsible shadcn `Sidebar`, top bar, breadcrumbs, toast (sonner), confirmation modals, skeletons, empty states

## Architecture

```text
/admin                       → new shell layout (replaces current /admin-dashboard)
  /                          → Overview
  /properties                → list + filters + bulk
  /properties/new            → form
  /properties/:id/edit       → form
  /blog                      → list
  /blog/new                  → editor
  /blog/ai                   → AI creator (Gemini via existing edge fn)
  /crm/leads                 → kanban + list
  /crm/contacts              → profiles + timeline
  /crm/tasks                 → tasks
  /email/inbox               → contacts/leads inbox
  /email/campaigns           → list + composer
  /email/subscribers         → newsletter_subscriptions
  /email/templates           → reusable HTML blocks
  /analytics/traffic
  /analytics/properties
  /analytics/leads
  /analytics/email
  /analytics/realtime
  /settings                  → roles, integrations, branding
```

Routes mounted under a single `AdminLayout` guarded by `ProtectedAdminRoute`. Old `/admin-dashboard` redirects to `/admin`.

## Schema additions (single migration)

Reuse existing tables; add only what is missing:

- `app_role` enum extended: `'admin' | 'editor' | 'agent' | 'viewer'` (uses existing `user_roles` table — no new role table, keeps RLS pattern)
- `leads` (name, email, phone, nationality, budget, message, property_id → properties, source, status enum [new|contacted|qualified|proposal|won|lost], score int, assigned_to uuid, tags text[], created_at, updated_at)
- `lead_notes` (lead_id, author_id, body, created_at)
- `lead_activities` (lead_id, type [email_sent|email_opened|call|meeting|note|status_change|page_view], payload jsonb, created_at)
- `tasks` (title, description, lead_id?, assigned_to, due_date, completed_at)
- `email_templates` (name, subject, html, variables jsonb)
- `email_campaigns` (subject, from_name, reply_to, html, segment jsonb, status, scheduled_at, sent_at, recipient_count, stats jsonb)
- `campaign_recipients` (campaign_id, subscriber_id, sent_at, opened_at, clicked_at, unsubscribed_at)
- `analytics_events` (event_type, page, property_id?, session_id, country, city, device, browser, os, channel, referrer, ts) + indexes on (ts), (event_type, ts), (property_id, ts)
- `property_views` materialised counter via trigger (cheaper than counting events for the property table)
- Extend `properties` (only if missing): `views_count int default 0`, `roi_percent numeric`, `citizenship_eligible bool`, `meta_title`, `meta_description`, `og_image`, `floor_plan_url`, `video_url`, `tour_url`, `year_built int`, `floors int`, `price_currency text`, `related_property_ids uuid[]`
- Extend `blog_posts`: `author_id`, `category`, `tags text[]`, `published_at`, `meta_title`, `meta_description`, `views_count`, `scheduled_at`
- Storage buckets reused: `property-images`, `blog-images`, `uploads` (add `floor-plans`, `email-assets`, `og-images`)
- RLS: public can SELECT published rows; all writes require `has_role(auth.uid(), 'admin'|'editor')`; agents see only their assigned leads via `assigned_to = auth.uid()`

## Phase plan (each phase is shippable)

**Phase 1 — Shell + Auth + Properties CMS** (this PR)
- Admin layout, sidebar, top bar, role guard
- Properties list (table, filters, search, bulk, sort, pagination) backed by existing `properties` table
- Property add/edit form with TipTap RTE, gallery upload to `property-images` (drag & drop, reorder, cover), Mapbox pin (token already a secret), SEO section, related properties, draft/publish
- Schema migration with all additions above + new tables created (empty) so later phases just wire UI

**Phase 2 — Blog + AI Creator**
- Blog list, editor, schedule
- "Create with AI" modal calling existing Gemini edge function; cover image via Gemini image gen
- Categories + tags

**Phase 3 — CRM + Inbox**
- Leads kanban + list, lead profile, timeline, notes, tasks, assignments
- Email inbox (inquiries) with Resend reply
- Contact merging from `contacts` + `leads`

**Phase 4 — Email marketing**
- Campaign composer (block-based HTML), segments, test send, schedule
- Subscriber list + CSV import/export
- Templates library
- Sending via Resend edge function; open/click tracking pixel + redirect

**Phase 5 — Analytics**
- Client tracking snippet writing to `analytics_events`
- Overview cards, traffic line/bar, country choropleth (`react-simple-maps`), device donut
- Property performance table + funnel
- Lead analytics, email analytics, realtime (last 30 min via Supabase realtime channel on `analytics_events`)
- Hotjar / Microsoft Clarity integration UI in Settings

**Phase 6 — Settings + polish**
- Team management, role assignment, branding, integrations, notifications
- Empty states, skeletons, error boundaries, mobile/tablet polish

## What this plan deliberately does NOT promise

- A pixel-perfect, fully-populated 6-phase product in one go — it would be ~40–80 files and inevitably break things
- Auto-tracked analytics for the public site without me also instrumenting the public pages (will be done in Phase 5)
- Replacing the existing `/admin-dashboard` route until the new shell is stable (kept as fallback during Phase 1)

## What I need from you to start

1. **Approve this plan** so I can begin Phase 1.
2. Confirm role model: `admin / editor / agent / viewer` on the existing `user_roles` table (recommended), or keep just `admin` for now and add granular roles in Phase 3?
3. Confirm I can run the schema migration adding the new tables and columns listed above.
4. For lead reply emails in Phase 3, OK to send from `info@futurehomesturkey.com` via the existing Resend setup?

Once you approve, I'll start with Phase 1 (shell + properties CMS + migration) in the next message.
