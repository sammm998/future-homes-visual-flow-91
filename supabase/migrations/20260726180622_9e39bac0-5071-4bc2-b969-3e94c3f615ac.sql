CREATE OR REPLACE FUNCTION public.get_top_properties(days_back int DEFAULT 30, top_n int DEFAULT 20)
RETURNS TABLE(id uuid, title text, location text, price text, views bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH seg AS (
    SELECT unnest(ARRAY['property','fastighet','mulk','aqar','nedvizhimost','eiendom','ejendom','melk','jaidad','propiedad','immobilie','propriete','properti']) AS s
  ),
  parsed_page_views AS (
    SELECT
      lower(nullif(split_part(clean_page, '/', 2), '')) AS identifier,
      count(*) AS c
    FROM (
      SELECT
        trim(both '/' from split_part(split_part(page, '?', 1), '#', 1)) AS clean_page
      FROM public.analytics_events
      WHERE event_type = 'pageview'
        AND ts >= now() - make_interval(days => days_back)
        AND page IS NOT NULL
        AND property_id IS NULL
    ) x
    WHERE lower(split_part(clean_page, '/', 1)) IN (SELECT s FROM seg)
      AND nullif(split_part(clean_page, '/', 2), '') IS NOT NULL
    GROUP BY 1
  ),
  property_id_views AS (
    SELECT
      property_id AS property_id,
      count(*) AS c
    FROM public.analytics_events
    WHERE event_type IN ('pageview', 'property_view')
      AND ts >= now() - make_interval(days => days_back)
      AND property_id IS NOT NULL
    GROUP BY property_id
  ),
  matched_from_urls AS (
    SELECT p.id AS property_id, sum(v.c) AS c
    FROM public.properties p
    JOIN parsed_page_views v ON v.identifier IN (
      lower(p.ref_no),
      lower(p.slug), lower(p.slug_sv), lower(p.slug_tr), lower(p.slug_ar), lower(p.slug_ru),
      lower(p.slug_no), lower(p.slug_da), lower(p.slug_fa), lower(p.slug_ur), lower(p.slug_es),
      lower(p.slug_de), lower(p.slug_fr), lower(p.slug_id), lower(p.id::text)
    )
    GROUP BY p.id
  ),
  combined AS (
    SELECT property_id, c FROM property_id_views
    UNION ALL
    SELECT property_id, c FROM matched_from_urls
  ),
  totals AS (
    SELECT property_id, sum(c)::bigint AS views
    FROM combined
    GROUP BY property_id
  )
  SELECT p.id, p.title, p.location, p.price, t.views
  FROM totals t
  JOIN public.properties p ON p.id = t.property_id
  ORDER BY t.views DESC
  LIMIT top_n;
$$;

GRANT EXECUTE ON FUNCTION public.get_top_properties(int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_top_properties(int, int) TO service_role;