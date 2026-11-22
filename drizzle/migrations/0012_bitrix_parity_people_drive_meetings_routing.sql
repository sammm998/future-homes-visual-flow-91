CREATE TABLE public.departments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, office text, head_id uuid, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.employee_profiles (user_id uuid PRIMARY KEY, full_name text, title text, department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL, office text, phone text, photo_url text, manager_id uuid, scope text NOT NULL DEFAULT 'all', languages text[] NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.drive_folders (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, parent_id uuid REFERENCES public.drive_folders(id) ON DELETE CASCADE, created_by uuid, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.drive_files (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), folder_id uuid REFERENCES public.drive_folders(id) ON DELETE CASCADE, path text NOT NULL, filename text NOT NULL, mime text, size_bytes bigint, uploaded_by uuid, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.share_links (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(18),'hex'), file_id uuid NOT NULL REFERENCES public.drive_files(id) ON DELETE CASCADE, expires_at timestamptz NOT NULL, created_by uuid, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.meetings (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, room_url text NOT NULL, starts_at timestamptz NOT NULL DEFAULT now(), lead_id uuid, deal_id uuid, calendar_event_id uuid, notes text, summary text, created_by uuid, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.lead_routing_rules (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, match_country text, match_source text, match_language text, assignees uuid[] NOT NULL DEFAULT '{}', next_index integer NOT NULL DEFAULT 0, priority integer NOT NULL DEFAULT 100, active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.task_comments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), task_id uuid NOT NULL, author_id uuid, body text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.saved_reports (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, config jsonb NOT NULL DEFAULT '{}', created_by uuid, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.call_logs (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), lead_id uuid, phone text, direction text NOT NULL DEFAULT 'outbound', outcome text NOT NULL DEFAULT 'answered', duration_min integer, notes text, user_id uuid, created_at timestamptz NOT NULL DEFAULT now());
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS first_response_at timestamptz;

DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['departments','employee_profiles','drive_folders','drive_files','share_links','meetings','lead_routing_rules','task_comments','saved_reports','call_logs'] LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "Admins manage %s" ON public.%I FOR ALL TO authenticated USING (public.has_role(auth.uid(), ''admin'')) WITH CHECK (public.has_role(auth.uid(), ''admin''))', t, t);
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.sees_all_crm(_uid uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE((SELECT scope <> 'own' FROM public.employee_profiles WHERE user_id = _uid), true)
$$;
GRANT EXECUTE ON FUNCTION public.sees_all_crm(uuid) TO authenticated;

CREATE POLICY "Own-scope staff see own leads" ON public.leads AS RESTRICTIVE FOR SELECT TO authenticated USING (public.sees_all_crm(auth.uid()) OR assigned_to = auth.uid()::text OR NOT public.has_role(auth.uid(),'admin'));
CREATE POLICY "Own-scope staff see own deals" ON public.deals AS RESTRICTIVE FOR SELECT TO authenticated USING (public.sees_all_crm(auth.uid()) OR owner_id = auth.uid());

CREATE OR REPLACE FUNCTION public.route_new_lead() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r public.lead_routing_rules; n int;
BEGIN
  IF NEW.assigned_to IS NOT NULL AND NEW.assigned_to <> '' THEN RETURN NEW; END IF;
  SELECT * INTO r FROM public.lead_routing_rules
   WHERE active AND cardinality(assignees) > 0
     AND (match_source IS NULL OR match_source = '' OR lower(coalesce(NEW.source,'')) = lower(match_source))
     AND (match_country IS NULL OR match_country = '' OR EXISTS (SELECT 1 FROM unnest(coalesce(NEW.preferred_countries,'{}')) c WHERE lower(c) = lower(r_country(match_country))))
     AND (match_language IS NULL OR match_language = '' OR lower(coalesce(NEW.nationality,'')) = lower(match_language))
   ORDER BY priority, created_at LIMIT 1 FOR UPDATE;
  IF NOT FOUND THEN RETURN NEW; END IF;
  n := r.next_index % cardinality(r.assignees);
  NEW.assigned_to := r.assignees[n + 1]::text;
  UPDATE public.lead_routing_rules SET next_index = n + 1 WHERE id = r.id;
  RETURN NEW;
END $$;
