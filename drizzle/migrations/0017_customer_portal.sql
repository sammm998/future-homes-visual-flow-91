CREATE TABLE public.customer_accounts (
  user_id uuid PRIMARY KEY,
  email text NOT NULL,
  lead_id uuid,
  full_name text,
  phone text,
  preferred_language text DEFAULT 'en',
  budget text,
  wishes text,
  stage text NOT NULL DEFAULT 'viewing',
  last_seen_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.customer_accounts TO authenticated;
GRANT ALL ON public.customer_accounts TO service_role;
ALTER TABLE public.customer_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own account read" ON public.customer_accounts FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own account update" ON public.customer_accounts FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- customers may not change their own stage or lead link
CREATE OR REPLACE FUNCTION public.guard_customer_account() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN
    NEW.stage := OLD.stage; NEW.lead_id := OLD.lead_id; NEW.email := OLD.email; NEW.user_id := OLD.user_id;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_guard_customer_account BEFORE UPDATE ON public.customer_accounts FOR EACH ROW EXECUTE FUNCTION public.guard_customer_account();

CREATE TABLE public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  category text NOT NULL DEFAULT 'question',
  subject text NOT NULL,
  property_ref text,
  preferred_at timestamptz,
  status text NOT NULL DEFAULT 'open',
  assigned_to uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.support_tickets TO authenticated;
GRANT ALL ON public.support_tickets TO service_role;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own tickets read" ON public.support_tickets FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own tickets create" ON public.support_tickets FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admins update tickets" ON public.support_tickets FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.ticket_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  from_staff boolean NOT NULL DEFAULT false,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.ticket_messages TO authenticated;
GRANT ALL ON public.ticket_messages TO service_role;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ticket msgs read" ON public.ticket_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin') OR EXISTS (SELECT 1 FROM public.support_tickets t WHERE t.id = ticket_id AND t.user_id = auth.uid()));
CREATE POLICY "ticket msgs write" ON public.ticket_messages FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid() AND (public.has_role(auth.uid(),'admin') OR EXISTS (SELECT 1 FROM public.support_tickets t WHERE t.id = ticket_id AND t.user_id = auth.uid())));

CREATE TABLE public.portal_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL,
  author_id uuid NOT NULL,
  from_staff boolean NOT NULL DEFAULT false,
  body text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.portal_messages TO authenticated;
GRANT ALL ON public.portal_messages TO service_role;
ALTER TABLE public.portal_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "portal msgs read" ON public.portal_messages FOR SELECT TO authenticated USING (customer_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "portal msgs write" ON public.portal_messages FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid() AND (customer_id = auth.uid() OR public.has_role(auth.uid(),'admin')));
CREATE POLICY "portal msgs mark read" ON public.portal_messages FOR UPDATE TO authenticated USING (customer_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- from_staff is always derived from the author's role, never trusted from the client
CREATE OR REPLACE FUNCTION public.set_from_staff() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  NEW.from_staff := public.has_role(NEW.author_id,'admin');
  RETURN NEW;
END $$;
CREATE TRIGGER trg_ticket_msg_staff BEFORE INSERT ON public.ticket_messages FOR EACH ROW EXECUTE FUNCTION public.set_from_staff();
CREATE TRIGGER trg_portal_msg_staff BEFORE INSERT ON public.portal_messages FOR EACH ROW EXECUTE FUNCTION public.set_from_staff();

CREATE TABLE public.investment_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  property_ref text NOT NULL,
  title text,
  result jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, DELETE ON public.investment_analyses TO authenticated;
GRANT ALL ON public.investment_analyses TO service_role;
ALTER TABLE public.investment_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own analyses" ON public.investment_analyses FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own analyses delete" ON public.investment_analyses FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.shared_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  kind text NOT NULL CHECK (kind IN ('document','quote','invoice','signature')),
  item_id uuid NOT NULL,
  title text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, kind, item_id)
);
GRANT SELECT, INSERT, DELETE ON public.shared_items TO authenticated;
GRANT ALL ON public.shared_items TO service_role;
ALTER TABLE public.shared_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own shared read" ON public.shared_items FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins share" ON public.shared_items FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins unshare" ON public.shared_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.is_shared_with_me(_kind text, _item uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT EXISTS (SELECT 1 FROM public.shared_items WHERE user_id = auth.uid() AND kind = _kind AND item_id = _item)
$$;
CREATE POLICY "customers read shared documents" ON public.documents FOR SELECT TO authenticated USING (public.is_shared_with_me('document', id));
CREATE POLICY "customers read shared quotes" ON public.quotes FOR SELECT TO authenticated USING (public.is_shared_with_me('quote', id));
CREATE POLICY "customers read shared invoices" ON public.invoices FOR SELECT TO authenticated USING (public.is_shared_with_me('invoice', id));
CREATE POLICY "customers read shared signatures" ON public.signature_requests FOR SELECT TO authenticated USING (public.is_shared_with_me('signature', id));
CREATE POLICY "customers read payments of shared invoices" ON public.invoice_payments FOR SELECT TO authenticated USING (public.is_shared_with_me('invoice', invoice_id));

-- Link the signed-in user to a customer account using their verified e-mail only
CREATE OR REPLACE FUNCTION public.link_customer_account() RETURNS public.customer_accounts LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE _email text; _confirmed timestamptz; _lead uuid; _row public.customer_accounts;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not signed in'; END IF;
  SELECT email, email_confirmed_at INTO _email, _confirmed FROM auth.users WHERE id = auth.uid();
  IF _confirmed IS NOT NULL THEN
    SELECT id INTO _lead FROM public.leads WHERE lower(email) = lower(_email) ORDER BY created_at DESC LIMIT 1;
  END IF;
  INSERT INTO public.customer_accounts(user_id, email, lead_id) VALUES (auth.uid(), _email, _lead)
  ON CONFLICT (user_id) DO UPDATE SET last_seen_at = now(), lead_id = COALESCE(public.customer_accounts.lead_id, EXCLUDED.lead_id)
  RETURNING * INTO _row;
  RETURN _row;
END $$;
REVOKE ALL ON FUNCTION public.link_customer_account() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.link_customer_account() TO authenticated;

-- Notify the assigned seller (or all admins) when a customer writes
CREATE OR REPLACE FUNCTION public.notify_portal_activity() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE _cust uuid; _title text; _assignee uuid;
BEGIN
  IF TG_TABLE_NAME = 'support_tickets' THEN _cust := NEW.user_id; _title := 'New portal ticket: ' || NEW.subject;
  ELSIF TG_TABLE_NAME = 'portal_messages' THEN
    IF NEW.from_staff THEN RETURN NEW; END IF; _cust := NEW.customer_id; _title := 'New portal message';
  ELSE
    IF NEW.from_staff THEN RETURN NEW; END IF; SELECT user_id INTO _cust FROM public.support_tickets WHERE id = NEW.ticket_id; _title := 'New reply on portal ticket';
  END IF;
  SELECT CASE WHEN l.assigned_to ~ '^[0-9a-f-]{36}$' THEN l.assigned_to::uuid END INTO _assignee
    FROM public.customer_accounts c JOIN public.leads l ON l.id = c.lead_id WHERE c.user_id = _cust;
  IF _assignee IS NOT NULL THEN
    INSERT INTO public.notifications(user_id, title, body, link) VALUES (_assignee, _title, left(coalesce(NEW.body, ''), 200), '/admin/portal');
  ELSE
    INSERT INTO public.notifications(user_id, title, body, link)
      SELECT user_id, _title, '', '/admin/portal' FROM public.user_roles WHERE role = 'admin';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_notify_ticket AFTER INSERT ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.notify_portal_activity();
CREATE TRIGGER trg_notify_portal_msg AFTER INSERT ON public.portal_messages FOR EACH ROW EXECUTE FUNCTION public.notify_portal_activity();
CREATE TRIGGER trg_notify_ticket_msg AFTER INSERT ON public.ticket_messages FOR EACH ROW EXECUTE FUNCTION public.notify_portal_activity();