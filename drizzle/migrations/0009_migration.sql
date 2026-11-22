
CREATE OR REPLACE FUNCTION public.list_admin_users()
RETURNS TABLE(id uuid, email text) LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'not allowed'; END IF;
  RETURN QUERY SELECT u.id, u.email::text FROM auth.users u JOIN public.user_roles r ON r.user_id = u.id AND r.role = 'admin' ORDER BY u.email;
END $$;
GRANT EXECUTE ON FUNCTION public.list_admin_users() TO authenticated;

CREATE TABLE public.deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  lead_id uuid,
  client_name text,
  client_email text,
  property_ref text,
  country text,
  value_eur numeric NOT NULL DEFAULT 0,
  stage text NOT NULL DEFAULT 'new',
  owner_id uuid,
  expected_close date,
  position numeric NOT NULL DEFAULT 0,
  stage_changed_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.deal_stage_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  from_stage text, to_stage text NOT NULL, changed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.chat_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  is_direct boolean NOT NULL DEFAULT false,
  member_ids uuid[] NOT NULL DEFAULT '{}',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid NOT NULL REFERENCES public.chat_channels(id) ON DELETE CASCADE,
  author_id uuid, body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.chat_reads (
  user_id uuid NOT NULL, channel_id uuid NOT NULL REFERENCES public.chat_channels(id) ON DELETE CASCADE,
  last_read_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (user_id, channel_id)
);
CREATE TABLE public.feed_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid, body text NOT NULL, kind text NOT NULL DEFAULT 'post',
  entity_type text, entity_id uuid, likes uuid[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.feed_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.feed_posts(id) ON DELETE CASCADE,
  entity_type text, entity_id uuid,
  author_id uuid, body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, kind text NOT NULL DEFAULT 'viewing',
  starts_at timestamptz NOT NULL, ends_at timestamptz,
  owner_id uuid, lead_id uuid, deal_id uuid REFERENCES public.deals(id) ON DELETE SET NULL,
  property_ref text, location text, notes text,
  client_email text, notify_client boolean NOT NULL DEFAULT false,
  remind_minutes integer NOT NULL DEFAULT 60,
  reminder_sent_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.automation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  trigger_event text NOT NULL,
  conditions jsonb NOT NULL DEFAULT '{}',
  actions jsonb NOT NULL DEFAULT '[]',
  active boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.automation_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id uuid REFERENCES public.automation_rules(id) ON DELETE CASCADE,
  event text NOT NULL, entity_id uuid,
  status text NOT NULL DEFAULT 'done',
  detail jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['deals','deal_stage_history','chat_channels','chat_messages','chat_reads','feed_posts','feed_comments','calendar_events','automation_rules','automation_runs'] LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "Admins manage %s" ON public.%I FOR ALL TO authenticated USING (public.has_role(auth.uid(), ''admin'')) WITH CHECK (public.has_role(auth.uid(), ''admin''))', t, t);
  END LOOP;
END $$;

CREATE TRIGGER deals_updated_at BEFORE UPDATE ON public.deals FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER calendar_events_updated_at BEFORE UPDATE ON public.calendar_events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER automation_rules_updated_at BEFORE UPDATE ON public.automation_rules FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Automation engine (in-database actions; email actions are queued for the scheduled sender)
CREATE OR REPLACE FUNCTION public.run_automations(_event text, _entity_id uuid, _ctx jsonb)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r record; a jsonb; c jsonb; ok boolean; assignee uuid;
BEGIN
  FOR r IN SELECT * FROM automation_rules WHERE active AND trigger_event = _event LOOP
    c := r.conditions; ok := true;
    IF c ? 'to_stage' AND COALESCE(c->>'to_stage','') <> '' AND c->>'to_stage' <> COALESCE(_ctx->>'to_stage','') THEN ok := false; END IF;
    IF c ? 'source' AND COALESCE(c->>'source','') <> '' AND c->>'source' <> COALESCE(_ctx->>'source','') THEN ok := false; END IF;
    IF NOT ok THEN CONTINUE; END IF;
    FOR a IN SELECT * FROM jsonb_array_elements(r.actions) LOOP
      assignee := NULLIF(a->>'assignee','')::uuid;
      IF a->>'type' = 'create_task' THEN
        INSERT INTO tasks(title, description, lead_id, assigned_to, due_date)
        VALUES (COALESCE(a->>'title','Follow up') || COALESCE(' – ' || (_ctx->>'name'), ''), a->>'description',
          CASE WHEN _ctx ? 'lead_id' THEN _ctx->>'lead_id' END, COALESCE(assignee::text, _ctx->>'owner_id'),
          to_char(now() + make_interval(mins => COALESCE((a->>'due_minutes')::int, 60)), 'YYYY-MM-DD"T"HH24:MI'));
      ELSIF a->>'type' = 'assign' AND assignee IS NOT NULL THEN
        IF _event = 'lead_created' THEN UPDATE leads SET assigned_to = assignee::text WHERE id = _entity_id;
        ELSE UPDATE deals SET owner_id = assignee WHERE id = _entity_id; END IF;
      ELSIF a->>'type' = 'feed_post' THEN
        INSERT INTO feed_posts(body, kind, entity_type, entity_id)
        VALUES (replace(COALESCE(a->>'text','{name}'), '{name}', COALESCE(_ctx->>'name','')), 'system', _ctx->>'entity_type', _entity_id);
      ELSIF a->>'type' = 'move_deal' AND _ctx->>'entity_type' = 'deal' AND COALESCE(a->>'stage','') <> '' THEN
        UPDATE deals SET stage = a->>'stage' WHERE id = _entity_id AND stage <> a->>'stage';
      ELSIF a->>'type' = 'send_email' THEN
        INSERT INTO automation_runs(rule_id, event, entity_id, status, detail)
        VALUES (r.id, _event, _entity_id, 'pending_email', jsonb_build_object('action', a, 'ctx', _ctx));
        CONTINUE;
      END IF;
    END LOOP;
    INSERT INTO automation_runs(rule_id, event, entity_id, status, detail) VALUES (r.id, _event, _entity_id, 'done', _ctx);
  END LOOP;
END $$;
REVOKE EXECUTE ON FUNCTION public.run_automations(text, uuid, jsonb) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.trg_lead_created() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO feed_posts(body, kind, entity_type, entity_id) VALUES ('New lead: ' || NEW.name || COALESCE(' (' || NEW.source || ')', ''), 'system', 'lead', NEW.id);
  PERFORM run_automations('lead_created', NEW.id, jsonb_build_object('entity_type','lead','lead_id',NEW.id,'name',NEW.name,'email',NEW.email,'source',NEW.source,'owner_id',NEW.assigned_to));
  RETURN NEW;
END $$;
CREATE TRIGGER leads_automation AFTER INSERT ON public.leads FOR EACH ROW EXECUTE FUNCTION public.trg_lead_created();

CREATE OR REPLACE FUNCTION public.trg_deal_stage() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.stage IS NOT DISTINCT FROM OLD.stage THEN RETURN NEW; END IF;
  NEW.stage_changed_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER deals_stage_ts BEFORE UPDATE ON public.deals FOR EACH ROW EXECUTE FUNCTION public.trg_deal_stage();

CREATE OR REPLACE FUNCTION public.trg_deal_stage_after() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.stage IS NOT DISTINCT FROM OLD.stage THEN RETURN NEW; END IF;
  INSERT INTO deal_stage_history(deal_id, from_stage, to_stage, changed_by) VALUES (NEW.id, CASE WHEN TG_OP='UPDATE' THEN OLD.stage END, NEW.stage, auth.uid());
  IF NEW.stage = 'won' THEN
    INSERT INTO feed_posts(body, kind, entity_type, entity_id) VALUES ('Deal won: ' || NEW.title || ' – €' || to_char(NEW.value_eur, 'FM999G999G999'), 'system', 'deal', NEW.id);
  END IF;
  PERFORM run_automations('deal_stage_changed', NEW.id, jsonb_build_object('entity_type','deal','name',NEW.title,'email',NEW.client_email,'to_stage',NEW.stage,'owner_id',NEW.owner_id,'lead_id',NEW.lead_id));
  RETURN NEW;
END $$;
CREATE TRIGGER deals_stage_history AFTER INSERT OR UPDATE ON public.deals FOR EACH ROW EXECUTE FUNCTION public.trg_deal_stage_after();

CREATE OR REPLACE FUNCTION public.trg_event_created() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.kind = 'viewing' THEN
    PERFORM run_automations('viewing_booked', NEW.id, jsonb_build_object('entity_type','event','name',NEW.title,'email',NEW.client_email,'owner_id',NEW.owner_id,'lead_id',NEW.lead_id));
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER calendar_events_automation AFTER INSERT ON public.calendar_events FOR EACH ROW EXECUTE FUNCTION public.trg_event_created();

ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.feed_posts;

INSERT INTO public.chat_channels(name) VALUES ('Allmänt'), ('Antalya'), ('Dubai');
INSERT INTO public.automation_rules(name, trigger_event, actions) VALUES
 ('Ny lead → ring inom 1 timme + välkomstmejl', 'lead_created',
  '[{"type":"create_task","title":"Ring inom 1 timme","due_minutes":60},{"type":"send_email","to":"client","subject":"Thank you for contacting Future Homes International","body":"Hi {name},\n\nThank you for your interest. One of our advisors will contact you shortly.\n\nFuture Homes International"}]');
