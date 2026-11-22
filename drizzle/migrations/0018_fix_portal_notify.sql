CREATE OR REPLACE FUNCTION public.notify_portal_activity() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE _cust uuid; _title text; _body text := ''; _assignee uuid; _j jsonb := to_jsonb(NEW);
BEGIN
  IF TG_TABLE_NAME = 'support_tickets' THEN _cust := NEW.user_id; _title := 'New portal ticket: ' || (_j->>'subject');
  ELSE
    IF (_j->>'from_staff')::boolean THEN RETURN NEW; END IF;
    _body := left(coalesce(_j->>'body',''), 200);
    IF TG_TABLE_NAME = 'portal_messages' THEN _cust := (_j->>'customer_id')::uuid; _title := 'New portal message';
    ELSE SELECT user_id INTO _cust FROM public.support_tickets WHERE id = (_j->>'ticket_id')::uuid; _title := 'New reply on portal ticket'; END IF;
  END IF;
  SELECT CASE WHEN l.assigned_to ~ '^[0-9a-f-]{36}$' THEN l.assigned_to::uuid END INTO _assignee
    FROM public.customer_accounts c JOIN public.leads l ON l.id = c.lead_id WHERE c.user_id = _cust;
  IF _assignee IS NOT NULL THEN
    INSERT INTO public.notifications(user_id, title, body, link) VALUES (_assignee, _title, _body, '/admin/portal');
  ELSE
    INSERT INTO public.notifications(user_id, title, body, link) SELECT user_id, _title, _body, '/admin/portal' FROM public.user_roles WHERE role = 'admin';
  END IF;
  RETURN NEW;
END $$;