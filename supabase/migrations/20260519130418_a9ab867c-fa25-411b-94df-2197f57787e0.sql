
-- 1. Make is_admin also recognise user_roles 'admin'
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE admin_users.user_id = $1
  ) OR EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_roles.user_id = $1 AND role = 'admin'::public.app_role
  );
$function$;

-- 2. Heatmap clicks table
CREATE TABLE IF NOT EXISTS public.heatmap_clicks (
  id bigserial PRIMARY KEY,
  ts timestamptz NOT NULL DEFAULT now(),
  page text NOT NULL,
  x_pct numeric NOT NULL,
  y_pct numeric NOT NULL,
  viewport_w integer,
  viewport_h integer,
  tag text,
  visitor_id text,
  session_id text,
  device text
);

ALTER TABLE public.heatmap_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "heatmap_clicks_insert_public" ON public.heatmap_clicks
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "heatmap_clicks_select_staff" ON public.heatmap_clicks
  FOR SELECT TO public USING (public.is_staff());

CREATE INDEX IF NOT EXISTS heatmap_clicks_page_ts_idx ON public.heatmap_clicks (page, ts DESC);
CREATE INDEX IF NOT EXISTS analytics_events_ts_idx ON public.analytics_events (ts DESC);
