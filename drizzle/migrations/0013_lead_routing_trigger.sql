CREATE OR REPLACE FUNCTION public.route_new_lead() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r public.lead_routing_rules; n int;
BEGIN
  IF NEW.assigned_to IS NOT NULL AND NEW.assigned_to <> '' THEN RETURN NEW; END IF;
  SELECT * INTO r FROM public.lead_routing_rules x
   WHERE x.active AND cardinality(x.assignees) > 0
     AND (coalesce(x.match_source,'') = '' OR lower(coalesce(NEW.source,'')) = lower(x.match_source))
     AND (coalesce(x.match_country,'') = '' OR EXISTS (SELECT 1 FROM unnest(coalesce(NEW.preferred_countries,'{}'::text[])) c WHERE lower(c) = lower(x.match_country)))
     AND (coalesce(x.match_language,'') = '' OR lower(coalesce(NEW.nationality,'')) = lower(x.match_language))
   ORDER BY x.priority, x.created_at LIMIT 1 FOR UPDATE;
  IF NOT FOUND THEN RETURN NEW; END IF;
  n := r.next_index % cardinality(r.assignees);
  NEW.assigned_to := r.assignees[n + 1]::text;
  UPDATE public.lead_routing_rules SET next_index = n + 1 WHERE id = r.id;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_route_new_lead ON public.leads;
CREATE TRIGGER trg_route_new_lead BEFORE INSERT ON public.leads FOR EACH ROW EXECUTE FUNCTION public.route_new_lead();

CREATE OR REPLACE FUNCTION public.mark_lead_first_response() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.first_response_at IS NULL AND OLD.status = 'new' AND NEW.status <> 'new' THEN NEW.first_response_at := now(); END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_lead_first_response ON public.leads;
CREATE TRIGGER trg_lead_first_response BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.mark_lead_first_response();