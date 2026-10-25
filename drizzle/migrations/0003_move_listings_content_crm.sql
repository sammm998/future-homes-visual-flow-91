CREATE TABLE public.properties (
agent_id uuid, agent_name text, agent_phone_number text, amenities text[], apartment_types jsonb, bathrooms text, bedrooms text,
building_complete_date date, buyer_fee_percent numeric, citizenship_eligible boolean, country text,
created_at timestamptz NOT NULL DEFAULT now(), description text, distance_to_airport_km text, distance_to_beach_km text, facilities text,
floor_plan_url text, floors numeric, google_maps_embed text, id uuid PRIMARY KEY DEFAULT gen_random_uuid(), interior_images text[],
interior_scanned_at timestamptz, is_active boolean NOT NULL DEFAULT true, language_code text, location text NOT NULL, meta_description text,
meta_title text, og_image text, parent_property_id text, price text NOT NULL, price_currency text, property_district text,
property_facilities text[], property_image text, property_images text[], property_prices_by_room text, property_subtype text,
property_type text, property_url text, ref_no text, related_property_ids text[], roi_percent numeric, sizes_m2 text, slug text,
slug_ar text, slug_da text, slug_de text, slug_es text, slug_fa text, slug_fr text, slug_id text, slug_no text, slug_ru text, slug_sv text,
slug_tr text, slug_ur text, starting_price_eur text, status text, title text NOT NULL, tour_url text,
updated_at timestamptz NOT NULL DEFAULT now(), video_url text, views_count numeric NOT NULL DEFAULT 0, year_built numeric
);
CREATE TABLE public.property_translations (
created_at timestamptz NOT NULL DEFAULT now(), description text, id uuid PRIMARY KEY DEFAULT gen_random_uuid(), language_code text NOT NULL,
location text, property_id uuid NOT NULL, title text, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.blog_posts (
author_id text, category text, content text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), excerpt text, featured_image text,
id uuid PRIMARY KEY DEFAULT gen_random_uuid(), language_code text, meta_description text, meta_title text, parent_post_id uuid,
published boolean NOT NULL DEFAULT true, published_at timestamptz, scheduled_at timestamptz, slug text NOT NULL, tags text[], title text NOT NULL,
updated_at timestamptz NOT NULL DEFAULT now(), views_count numeric NOT NULL DEFAULT 0
);
CREATE TABLE public.team_members (
bio text, created_at timestamptz NOT NULL DEFAULT now(), display_order numeric NOT NULL DEFAULT 0, email text,
id uuid PRIMARY KEY DEFAULT gen_random_uuid(), image_url text, is_active boolean NOT NULL DEFAULT true, linkedin_url text, name text NOT NULL,
phone text, position text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.testimonials (
company_name text, company_url text, created_at timestamptz NOT NULL DEFAULT now(), customer_country text, customer_name text NOT NULL,
designation text, id uuid PRIMARY KEY DEFAULT gen_random_uuid(), image_url text, location text, property_type text, rating numeric,
review_text text NOT NULL, social_links jsonb, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.testimonial_translations (
created_at timestamptz NOT NULL DEFAULT now(), designation text, id uuid PRIMARY KEY DEFAULT gen_random_uuid(), language_code text NOT NULL,
review_text text NOT NULL, testimonial_id uuid NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.about_us_content (
content text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
language_code text NOT NULL DEFAULT 'en', section_key text NOT NULL, title text, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.website_content (
content_sections jsonb NOT NULL DEFAULT '{}'::jsonb, created_at timestamptz NOT NULL DEFAULT now(), id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
meta_description text, page_slug text NOT NULL, page_title text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.website_media (
alt_text text, created_at timestamptz NOT NULL DEFAULT now(), filename text NOT NULL, id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
url text NOT NULL, usage_context text
);
CREATE TABLE public.text_keys (
component_source text, context text, created_at timestamptz NOT NULL DEFAULT now(), found_at timestamptz NOT NULL DEFAULT now(),
id uuid PRIMARY KEY DEFAULT gen_random_uuid(), is_active boolean NOT NULL DEFAULT true, key_path text NOT NULL,
last_seen timestamptz NOT NULL DEFAULT now(), original_text text NOT NULL, page_source text, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.languages (
code text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), flag text, id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
is_active boolean NOT NULL DEFAULT true, is_default boolean NOT NULL DEFAULT false, name text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.courses (
country_code text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), description text NOT NULL, difficulty text NOT NULL DEFAULT '',
estimated_minutes numeric NOT NULL DEFAULT 0, final_pass_threshold numeric NOT NULL DEFAULT 0, final_quiz jsonb NOT NULL DEFAULT '[]'::jsonb,
hero_image text, id uuid PRIMARY KEY DEFAULT gen_random_uuid(), is_published boolean NOT NULL DEFAULT true, language_code text NOT NULL DEFAULT 'en',
order_index numeric NOT NULL DEFAULT 0, slug text NOT NULL, title text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.course_modules (
body_html text NOT NULL, course_id uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
image_url text, is_published boolean NOT NULL DEFAULT true, key_takeaways jsonb NOT NULL DEFAULT '[]'::jsonb, order_index numeric NOT NULL DEFAULT 0,
quiz jsonb NOT NULL DEFAULT '[]'::jsonb, slug text NOT NULL, summary text, title text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.leads (
assigned_to text, budget_currency text, budget_max numeric, budget_min numeric, created_at timestamptz NOT NULL DEFAULT now(), email text,
id uuid PRIMARY KEY DEFAULT gen_random_uuid(), message text, name text NOT NULL, nationality text, phone text, preferred_countries text[],
preferred_types text[], property_id text, score numeric NOT NULL DEFAULT 0, source text, status text NOT NULL DEFAULT 'new', tags text[],
updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.email_campaigns (
created_at timestamptz NOT NULL DEFAULT now(), created_by text, from_name text, html text NOT NULL, id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
recipient_count numeric NOT NULL DEFAULT 0, reply_to text, scheduled_at timestamptz, segment jsonb NOT NULL DEFAULT '{}'::jsonb, sent_at timestamptz,
stats jsonb NOT NULL DEFAULT '{}'::jsonb, status text NOT NULL DEFAULT 'draft', subject text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.presentations (
created_at timestamptz NOT NULL DEFAULT now(), created_by text, id uuid PRIMARY KEY DEFAULT gen_random_uuid(), property_id text,
slides jsonb NOT NULL DEFAULT '[]'::jsonb, theme jsonb NOT NULL DEFAULT '{}'::jsonb, title text NOT NULL DEFAULT '', updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.tasks (
assigned_to text, completed_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), created_by text, description text, due_date text,
id uuid PRIMARY KEY DEFAULT gen_random_uuid(), lead_id text, title text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.newsletter_subscriptions (
created_at timestamptz NOT NULL DEFAULT now(), email text NOT NULL, id uuid PRIMARY KEY DEFAULT gen_random_uuid(), is_active boolean NOT NULL DEFAULT true,
source text, subscribed_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.email_templates (
created_at timestamptz NOT NULL DEFAULT now(), created_by text, html text NOT NULL, id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL,
subject text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now(), variables jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE TABLE public.analytics_events (
browser text, channel text, city text, country text, device text, event_type text NOT NULL, id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
os text, page text, payload jsonb, property_id text, referrer text, session_id text, ts timestamptz NOT NULL DEFAULT now(), visitor_id text
);
CREATE TABLE public.lead_notes (
author_id text, body text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), id uuid PRIMARY KEY DEFAULT gen_random_uuid(), lead_id text NOT NULL
);
CREATE TABLE public.lead_activities (
actor_id text, created_at timestamptz NOT NULL DEFAULT now(), id uuid PRIMARY KEY DEFAULT gen_random_uuid(), lead_id text NOT NULL,
payload jsonb NOT NULL DEFAULT '{}'::jsonb, type text NOT NULL
);
CREATE TABLE public.heatmap_clicks (
device text, id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY, page text NOT NULL, session_id text, tag text, ts timestamptz NOT NULL DEFAULT now(),
viewport_h numeric, viewport_w numeric, visitor_id text, x_pct numeric NOT NULL, y_pct numeric NOT NULL
);
CREATE TABLE public.property_insertion_log (
created_at timestamptz NOT NULL DEFAULT now(), id uuid PRIMARY KEY DEFAULT gen_random_uuid(), insertion_rate_check boolean, ip_address text,
property_id text, source_info jsonb, user_agent text, user_id text
);
CREATE TABLE public.contacts (
collected_at timestamptz, conversation_id text, created_at timestamptz NOT NULL DEFAULT now(), email text, id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
language text, name text NOT NULL, phone text
);
CREATE TABLE public.campaign_recipients (
bounced_at timestamptz, campaign_id text NOT NULL, clicked_at timestamptz, email text NOT NULL, error text, id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
opened_at timestamptz, sent_at timestamptz, subscriber_id text, unsubscribed_at timestamptz
);
CREATE TABLE public.conversations (
contact_collected boolean, contact_id text, conversation_data jsonb NOT NULL DEFAULT '{}'::jsonb, created_at timestamptz NOT NULL DEFAULT now(),
id uuid PRIMARY KEY DEFAULT gen_random_uuid(), message_count numeric, session_id uuid NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.property_translations ADD CONSTRAINT property_translations_property_lang_key UNIQUE (property_id, language_code);
ALTER TABLE public.property_translations ADD CONSTRAINT property_translations_property_fk FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;
ALTER TABLE public.testimonial_translations ADD CONSTRAINT testimonial_translations_lang_key UNIQUE (testimonial_id, language_code);
ALTER TABLE public.testimonial_translations ADD CONSTRAINT testimonial_translations_fk FOREIGN KEY (testimonial_id) REFERENCES public.testimonials(id) ON DELETE CASCADE;
ALTER TABLE public.course_modules ADD CONSTRAINT course_modules_course_fk FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
CREATE INDEX properties_ref_no_idx ON public.properties (ref_no);
CREATE INDEX properties_location_idx ON public.properties (location);
CREATE INDEX blog_posts_slug_idx ON public.blog_posts (slug, language_code);
CREATE INDEX analytics_events_ts_idx ON public.analytics_events (ts);
CREATE INDEX heatmap_clicks_page_idx ON public.heatmap_clicks (page);
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT NULL)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT public.has_role(COALESCE(user_id, auth.uid()), 'admin'::public.app_role) $$;
DO $do$
DECLARE t text;
BEGIN
FOREACH t IN ARRAY ARRAY['properties','property_translations','blog_posts','team_members','testimonials','testimonial_translations','about_us_content','website_content','website_media','text_keys','languages','courses','course_modules','leads','email_campaigns','presentations','tasks','newsletter_subscriptions','email_templates','analytics_events','lead_notes','lead_activities','heatmap_clicks','property_insertion_log','contacts','campaign_recipients','conversations'] LOOP
EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
EXECUTE format('CREATE POLICY "admins manage %s" ON public.%I FOR ALL TO authenticated USING (public.has_role(auth.uid(), ''admin''::public.app_role)) WITH CHECK (public.has_role(auth.uid(), ''admin''::public.app_role))', t, t);
IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=t AND column_name='updated_at') THEN
EXECUTE format('CREATE TRIGGER %s_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t, t);
END IF;
END LOOP;
FOREACH t IN ARRAY ARRAY['properties','property_translations','blog_posts','team_members','testimonials','testimonial_translations','about_us_content','website_content','website_media','text_keys','languages','courses','course_modules'] LOOP
EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
EXECUTE format('CREATE POLICY "public reads %s" ON public.%I FOR SELECT TO anon, authenticated USING (true)', t, t);
END LOOP;
FOREACH t IN ARRAY ARRAY['leads','newsletter_subscriptions','analytics_events','heatmap_clicks','contacts','conversations','property_insertion_log'] LOOP
EXECUTE format('GRANT INSERT ON public.%I TO anon', t);
EXECUTE format('CREATE POLICY "visitors add %s" ON public.%I FOR INSERT TO anon, authenticated WITH CHECK (true)', t, t);
END LOOP;
END $do$;