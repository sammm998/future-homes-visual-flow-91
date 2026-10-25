CREATE OR REPLACE FUNCTION public.get_traffic_summary(days_back integer DEFAULT 30)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE since timestamptz := now() - make_interval(days => days_back); result jsonb;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN RAISE EXCEPTION 'not allowed'; END IF;
  WITH e AS (SELECT * FROM public.analytics_events WHERE ts >= since),
  pv AS (SELECT * FROM e WHERE event_type = 'pageview')
  SELECT jsonb_build_object(
    'totals', jsonb_build_object('events', (SELECT count(*) FROM e), 'pageviews', (SELECT count(*) FROM pv),
      'visitors', (SELECT count(DISTINCT visitor_id) FROM e), 'sessions', (SELECT count(DISTINCT session_id) FROM e)),
    'daily', COALESCE((SELECT jsonb_agg(jsonb_build_object('day', d, 'count', c) ORDER BY d) FROM (SELECT date_trunc('day', ts) d, count(*) c FROM pv GROUP BY 1) x), '[]'::jsonb),
    'countries', COALESCE((SELECT jsonb_agg(jsonb_build_object('name', n, 'value', c)) FROM (SELECT COALESCE(country,'Unknown') n, count(*) c FROM pv GROUP BY 1 ORDER BY 2 DESC LIMIT 15) x), '[]'::jsonb),
    'devices', COALESCE((SELECT jsonb_agg(jsonb_build_object('name', n, 'value', c)) FROM (SELECT COALESCE(device,'Unknown') n, count(*) c FROM pv GROUP BY 1 ORDER BY 2 DESC) x), '[]'::jsonb),
    'browsers', COALESCE((SELECT jsonb_agg(jsonb_build_object('name', n, 'value', c)) FROM (SELECT COALESCE(browser,'Unknown') n, count(*) c FROM pv GROUP BY 1 ORDER BY 2 DESC LIMIT 10) x), '[]'::jsonb),
    'oses', COALESCE((SELECT jsonb_agg(jsonb_build_object('name', n, 'value', c)) FROM (SELECT COALESCE(os,'Unknown') n, count(*) c FROM pv GROUP BY 1 ORDER BY 2 DESC LIMIT 10) x), '[]'::jsonb),
    'pages', COALESCE((SELECT jsonb_agg(jsonb_build_object('name', n, 'value', c)) FROM (SELECT COALESCE(page,'/') n, count(*) c FROM pv GROUP BY 1 ORDER BY 2 DESC LIMIT 20) x), '[]'::jsonb),
    'referrers', COALESCE((SELECT jsonb_agg(jsonb_build_object('name', n, 'value', c)) FROM (SELECT referrer n, count(*) c FROM pv WHERE COALESCE(referrer,'') <> '' GROUP BY 1 ORDER BY 2 DESC LIMIT 20) x), '[]'::jsonb),
    'channel_raw', COALESCE((SELECT jsonb_agg(jsonb_build_object('referrer', r, 'channel', ch, 'value', c)) FROM (SELECT referrer r, channel ch, count(*) c FROM pv GROUP BY 1, 2) x), '[]'::jsonb)
  ) INTO result;
  RETURN result;
END $$;
CREATE OR REPLACE FUNCTION public.get_top_properties(days_back integer DEFAULT 30, top_n integer DEFAULT 20)
RETURNS TABLE (id text, title text, location text, price text, views bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN RAISE EXCEPTION 'not allowed'; END IF;
  RETURN QUERY SELECT p.id::text, p.title, p.location, p.price, count(*) AS views
  FROM public.analytics_events e JOIN public.properties p ON p.id::text = e.property_id
  WHERE e.ts >= now() - make_interval(days => days_back) AND e.property_id IS NOT NULL
  GROUP BY p.id, p.title, p.location, p.price ORDER BY views DESC LIMIT top_n;
END $$;
REVOKE EXECUTE ON FUNCTION public.get_traffic_summary(integer) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_top_properties(integer, integer) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_traffic_summary(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_top_properties(integer, integer) TO authenticated;