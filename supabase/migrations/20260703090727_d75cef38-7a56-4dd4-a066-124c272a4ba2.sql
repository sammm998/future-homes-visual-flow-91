
CREATE OR REPLACE FUNCTION public.get_traffic_summary(days_back int DEFAULT 30)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH src AS (
    SELECT * FROM public.analytics_events
    WHERE ts >= now() - make_interval(days => days_back)
  )
  SELECT jsonb_build_object(
    'totals', (
      SELECT jsonb_build_object(
        'events', count(*),
        'visitors', count(DISTINCT visitor_id),
        'sessions', count(DISTINCT session_id),
        'pageviews', count(*) FILTER (WHERE event_type = 'pageview')
      ) FROM src
    ),
    'daily', (
      SELECT coalesce(jsonb_agg(jsonb_build_object('day', d, 'count', c) ORDER BY d), '[]'::jsonb)
      FROM (SELECT date_trunc('day', ts) AS d, count(*) AS c FROM src GROUP BY 1) t
    ),
    'countries', (SELECT coalesce(jsonb_agg(jsonb_build_object('name', name, 'value', c)), '[]'::jsonb) FROM (SELECT country AS name, count(*) c FROM src WHERE country IS NOT NULL GROUP BY 1 ORDER BY c DESC LIMIT 10) t),
    'devices', (SELECT coalesce(jsonb_agg(jsonb_build_object('name', name, 'value', c)), '[]'::jsonb) FROM (SELECT device AS name, count(*) c FROM src WHERE device IS NOT NULL GROUP BY 1 ORDER BY c DESC LIMIT 10) t),
    'browsers', (SELECT coalesce(jsonb_agg(jsonb_build_object('name', name, 'value', c)), '[]'::jsonb) FROM (SELECT browser AS name, count(*) c FROM src WHERE browser IS NOT NULL GROUP BY 1 ORDER BY c DESC LIMIT 10) t),
    'oses', (SELECT coalesce(jsonb_agg(jsonb_build_object('name', name, 'value', c)), '[]'::jsonb) FROM (SELECT os AS name, count(*) c FROM src WHERE os IS NOT NULL GROUP BY 1 ORDER BY c DESC LIMIT 10) t),
    'pages', (SELECT coalesce(jsonb_agg(jsonb_build_object('name', name, 'value', c)), '[]'::jsonb) FROM (SELECT page AS name, count(*) c FROM src WHERE page IS NOT NULL GROUP BY 1 ORDER BY c DESC LIMIT 15) t),
    'referrers', (SELECT coalesce(jsonb_agg(jsonb_build_object('name', name, 'value', c)), '[]'::jsonb) FROM (SELECT referrer AS name, count(*) c FROM src WHERE referrer IS NOT NULL AND referrer <> '' GROUP BY 1 ORDER BY c DESC LIMIT 40) t),
    'channel_raw', (SELECT coalesce(jsonb_agg(jsonb_build_object('referrer', referrer, 'channel', channel, 'value', c)), '[]'::jsonb) FROM (SELECT referrer, channel, count(*) c FROM src GROUP BY 1,2 ORDER BY c DESC LIMIT 300) t)
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_traffic_summary(int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_traffic_summary(int) TO service_role;
