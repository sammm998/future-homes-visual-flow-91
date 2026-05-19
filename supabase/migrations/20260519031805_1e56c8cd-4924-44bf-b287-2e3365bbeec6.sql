-- 2. Extend properties
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS views_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS roi_percent numeric,
  ADD COLUMN IF NOT EXISTS citizenship_eligible boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS meta_title text,
  ADD COLUMN IF NOT EXISTS meta_description text,
  ADD COLUMN IF NOT EXISTS og_image text,
  ADD COLUMN IF NOT EXISTS floor_plan_url text,
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS tour_url text,
  ADD COLUMN IF NOT EXISTS year_built integer,
  ADD COLUMN IF NOT EXISTS floors integer,
  ADD COLUMN IF NOT EXISTS price_currency text DEFAULT 'EUR',
  ADD COLUMN IF NOT EXISTS related_property_ids uuid[] DEFAULT '{}'::uuid[],
  ADD COLUMN IF NOT EXISTS country text;

-- 3. Extend blog_posts
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS author_id uuid,
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS scheduled_at timestamptz,
  ADD COLUMN IF NOT EXISTS meta_title text,
  ADD COLUMN IF NOT EXISTS meta_description text,
  ADD COLUMN IF NOT EXISTS views_count integer NOT NULL DEFAULT 0;

-- 4. Helpers
CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT public.is_admin($1)
      OR public.has_role($1, 'editor'::app_role);
$$;

CREATE OR REPLACE FUNCTION public.is_agent_or_staff(_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT public.is_staff($1)
      OR public.has_role($1, 'agent'::app_role);
$$;

-- 5. Leads
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  nationality text,
  budget_min numeric,
  budget_max numeric,
  budget_currency text DEFAULT 'EUR',
  message text,
  property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  preferred_countries text[] DEFAULT '{}'::text[],
  preferred_types text[] DEFAULT '{}'::text[],
  source text,
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new','contacted','qualified','proposal','won','lost')),
  score integer NOT NULL DEFAULT 0,
  tags text[] DEFAULT '{}'::text[],
  assigned_to uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads(status);
CREATE INDEX IF NOT EXISTS leads_assigned_to_idx ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads(created_at DESC);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY leads_insert_public ON public.leads
  FOR INSERT WITH CHECK (true);
CREATE POLICY leads_select_staff ON public.leads
  FOR SELECT USING (
    public.is_staff()
    OR (public.has_role(auth.uid(), 'agent'::app_role) AND assigned_to = auth.uid())
  );
CREATE POLICY leads_update_staff ON public.leads
  FOR UPDATE USING (
    public.is_staff()
    OR (public.has_role(auth.uid(), 'agent'::app_role) AND assigned_to = auth.uid())
  ) WITH CHECK (
    public.is_staff()
    OR (public.has_role(auth.uid(), 'agent'::app_role) AND assigned_to = auth.uid())
  );
CREATE POLICY leads_delete_admin ON public.leads
  FOR DELETE USING (public.is_admin());

CREATE TRIGGER leads_set_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Lead notes
CREATE TABLE IF NOT EXISTS public.lead_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  author_id uuid,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS lead_notes_lead_idx ON public.lead_notes(lead_id);

ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY lead_notes_rw_staff ON public.lead_notes
  FOR ALL USING (
    public.is_staff()
    OR EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.id = lead_notes.lead_id
        AND public.has_role(auth.uid(), 'agent'::app_role)
        AND l.assigned_to = auth.uid()
    )
  ) WITH CHECK (
    public.is_staff()
    OR EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.id = lead_notes.lead_id
        AND public.has_role(auth.uid(), 'agent'::app_role)
        AND l.assigned_to = auth.uid()
    )
  );

-- 7. Lead activities (timeline)
CREATE TABLE IF NOT EXISTS public.lead_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  actor_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS lead_activities_lead_idx ON public.lead_activities(lead_id, created_at DESC);

ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY lead_activities_rw_staff ON public.lead_activities
  FOR ALL USING (
    public.is_staff()
    OR EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.id = lead_activities.lead_id
        AND public.has_role(auth.uid(), 'agent'::app_role)
        AND l.assigned_to = auth.uid()
    )
  ) WITH CHECK (
    public.is_staff()
    OR EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.id = lead_activities.lead_id
        AND public.has_role(auth.uid(), 'agent'::app_role)
        AND l.assigned_to = auth.uid()
    )
  );

-- 8. Tasks
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  assigned_to uuid,
  due_date timestamptz,
  completed_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS tasks_assigned_idx ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS tasks_due_idx ON public.tasks(due_date);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY tasks_rw ON public.tasks
  FOR ALL USING (
    public.is_staff()
    OR assigned_to = auth.uid()
    OR created_by = auth.uid()
  ) WITH CHECK (
    public.is_staff()
    OR assigned_to = auth.uid()
    OR created_by = auth.uid()
  );

CREATE TRIGGER tasks_set_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Email templates
CREATE TABLE IF NOT EXISTS public.email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL,
  html text NOT NULL,
  variables jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY email_templates_rw_staff ON public.email_templates
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());
CREATE TRIGGER email_templates_set_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 10. Email campaigns
CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  from_name text DEFAULT 'Future Homes International',
  reply_to text,
  html text NOT NULL,
  segment jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','scheduled','sending','sent','failed')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  recipient_count integer NOT NULL DEFAULT 0,
  stats jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY email_campaigns_rw_staff ON public.email_campaigns
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());
CREATE TRIGGER email_campaigns_set_updated_at
  BEFORE UPDATE ON public.email_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 11. Campaign recipients
CREATE TABLE IF NOT EXISTS public.campaign_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
  subscriber_id uuid REFERENCES public.newsletter_subscriptions(id) ON DELETE SET NULL,
  email text NOT NULL,
  sent_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  unsubscribed_at timestamptz,
  bounced_at timestamptz,
  error text
);
CREATE INDEX IF NOT EXISTS campaign_recipients_campaign_idx ON public.campaign_recipients(campaign_id);
ALTER TABLE public.campaign_recipients ENABLE ROW LEVEL SECURITY;
CREATE POLICY campaign_recipients_rw_staff ON public.campaign_recipients
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

-- 12. Analytics events
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id bigserial PRIMARY KEY,
  event_type text NOT NULL,
  page text,
  property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  session_id text,
  visitor_id text,
  country text,
  city text,
  device text,
  browser text,
  os text,
  channel text,
  referrer text,
  payload jsonb DEFAULT '{}'::jsonb,
  ts timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS analytics_events_ts_idx ON public.analytics_events(ts DESC);
CREATE INDEX IF NOT EXISTS analytics_events_type_ts_idx ON public.analytics_events(event_type, ts DESC);
CREATE INDEX IF NOT EXISTS analytics_events_property_ts_idx ON public.analytics_events(property_id, ts DESC) WHERE property_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS analytics_events_session_idx ON public.analytics_events(session_id);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY analytics_events_insert_public ON public.analytics_events
  FOR INSERT WITH CHECK (true);
CREATE POLICY analytics_events_select_staff ON public.analytics_events
  FOR SELECT USING (public.is_staff());

-- 13. Storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('floor-plans','floor-plans', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public)
VALUES ('email-assets','email-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Floor plans public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'floor-plans');
CREATE POLICY "Floor plans staff write" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'floor-plans' AND public.is_staff());
CREATE POLICY "Floor plans staff delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'floor-plans' AND public.is_staff());

CREATE POLICY "Email assets public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'email-assets');
CREATE POLICY "Email assets staff write" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'email-assets' AND public.is_staff());
CREATE POLICY "Email assets staff delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'email-assets' AND public.is_staff());