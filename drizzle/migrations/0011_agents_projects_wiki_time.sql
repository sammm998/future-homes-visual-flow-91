CREATE TABLE public.agent_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  title text NOT NULL DEFAULT 'New conversation',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.agent_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.agent_conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  role text NOT NULL,
  agent text NOT NULL DEFAULT 'assistant',
  content text NOT NULL DEFAULT '',
  actions jsonb NOT NULL DEFAULT '[]'::jsonb,
  pending_action jsonb,
  action_status text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX agent_messages_conv_idx ON public.agent_messages(conversation_id, created_at);
CREATE TABLE public.composio_sessions (
  user_id uuid NOT NULL,
  agent text NOT NULL,
  session_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, agent)
);
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  owner_id uuid,
  status text NOT NULL DEFAULT 'active',
  starts_on date,
  ends_on date,
  deal_id uuid,
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.project_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  assignee_id uuid,
  status text NOT NULL DEFAULT 'todo',
  starts_on date,
  ends_on date,
  depends_on uuid REFERENCES public.project_tasks(id) ON DELETE SET NULL,
  checklist jsonb NOT NULL DEFAULT '[]'::jsonb,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  project_task_id uuid REFERENCES public.project_tasks(id) ON DELETE SET NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.wiki_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  body text NOT NULL DEFAULT '',
  updated_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.absences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  kind text NOT NULL DEFAULT 'vacation',
  starts_on date NOT NULL,
  ends_on date NOT NULL,
  note text,
  status text NOT NULL DEFAULT 'pending',
  decided_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text,
  website text,
  email text,
  phone text,
  notes text,
  owner_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL;
CREATE TABLE public.approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'discount',
  title text NOT NULL,
  details text,
  amount_eur numeric,
  entity_type text,
  entity_id uuid,
  requested_by uuid DEFAULT auth.uid(),
  approver_id uuid,
  status text NOT NULL DEFAULT 'pending',
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX notifications_user_idx ON public.notifications(user_id, created_at DESC);

DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['agent_conversations','agent_messages','composio_sessions','projects','project_tasks','time_entries','wiki_pages','absences','companies','approvals','notifications'] LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
  END LOOP;
  FOREACH t IN ARRAY ARRAY['projects','project_tasks','time_entries','wiki_pages','absences','companies','approvals'] LOOP
    EXECUTE format('CREATE POLICY "Admins manage %s" ON public.%I FOR ALL TO authenticated USING (public.has_role(auth.uid(), ''admin'')) WITH CHECK (public.has_role(auth.uid(), ''admin''))', t, t);
  END LOOP;
  FOREACH t IN ARRAY ARRAY['agent_conversations','agent_messages','composio_sessions','notifications'] LOOP
    EXECUTE format('CREATE POLICY "Admins own %s" ON public.%I FOR ALL TO authenticated USING (user_id = auth.uid() AND public.has_role(auth.uid(), ''admin'')) WITH CHECK (public.has_role(auth.uid(), ''admin''))', t, t);
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.notify_approval() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.approver_id IS NOT NULL THEN
    INSERT INTO public.notifications(user_id, title, body, link) VALUES (NEW.approver_id, 'Approval requested', NEW.title, '/admin/approvals');
  ELSIF TG_OP = 'UPDATE' AND NEW.status <> OLD.status AND NEW.requested_by IS NOT NULL THEN
    INSERT INTO public.notifications(user_id, title, body, link) VALUES (NEW.requested_by, 'Approval ' || NEW.status, NEW.title, '/admin/approvals');
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER approvals_notify AFTER INSERT OR UPDATE ON public.approvals FOR EACH ROW EXECUTE FUNCTION public.notify_approval();

CREATE OR REPLACE FUNCTION public.notify_lead_assigned() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.assigned_to IS NOT NULL AND (TG_OP = 'INSERT' OR NEW.assigned_to IS DISTINCT FROM OLD.assigned_to) THEN
    INSERT INTO public.notifications(user_id, title, body, link) VALUES (NEW.assigned_to, 'New lead assigned', NEW.name, '/admin/crm/leads/' || NEW.id);
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER leads_notify_assigned AFTER INSERT OR UPDATE OF assigned_to ON public.leads FOR EACH ROW EXECUTE FUNCTION public.notify_lead_assigned();
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;