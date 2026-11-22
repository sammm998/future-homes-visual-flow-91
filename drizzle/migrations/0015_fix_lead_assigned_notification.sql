CREATE OR REPLACE FUNCTION public.notify_lead_assigned() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  IF NEW.assigned_to ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' AND (TG_OP = 'INSERT' OR NEW.assigned_to IS DISTINCT FROM OLD.assigned_to) THEN
    INSERT INTO public.notifications(user_id, title, body, link) VALUES (NEW.assigned_to::uuid, 'New lead assigned', NEW.name, '/admin/crm/leads/' || NEW.id);
  END IF;
  RETURN NEW;
END $function$;