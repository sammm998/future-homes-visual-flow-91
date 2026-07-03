
CREATE OR REPLACE FUNCTION public.get_top_properties(days_back int DEFAULT 30, top_n int DEFAULT 20)
RETURNS TABLE(id uuid, title text, location text, price text, views bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH seg AS (
    -- localized first path segments that represent a property detail page
    SELECT unnest(ARRAY['property','fastighet','mulk','aqar','nedvizhimost','eiendom','ejendom','melk','jaidad','propiedad','immobilie','propriete','properti']) AS s
  ),
  views AS (
    SELECT
      lower(decode_slug) AS slug,
      count(*) AS c
    FROM (
      SELECT
        -- extract the 2nd path segment, strip query/hash
        split_part(split_part(split_part(trim(both '/' from page), '?', 1), '#', 1), '/', 2) AS decode_slug,
        split_part(trim(both '/' from page), '/', 1) AS first_seg
      FROM public.analytics_events
      WHERE event_type = 'pageview'
        AND ts >= now() - make_interval(days => days_back)
        AND page IS NOT NULL
    ) x
    WHERE lower(first_seg) IN (SELECT s FROM seg)
      AND decode_slug <> ''
    GROUP BY 1
  ),
  matched AS (
    SELECT p.id, p.title, p.location, p.price, sum(v.c) AS views
    FROM public.properties p
    JOIN views v ON lower(v.slug) IN (
      lower(p.slug), lower(p.slug_sv), lower(p.slug_tr), lower(p.slug_ar), lower(p.slug_ru),
      lower(p.slug_no), lower(p.slug_da), lower(p.slug_fa), lower(p.slug_ur), lower(p.slug_es),
      lower(p.slug_de), lower(p.slug_fr), lower(p.slug_id)
    )
    GROUP BY p.id, p.title, p.location, p.price
  )
  SELECT id, title, location, price, views
  FROM matched
  ORDER BY views DESC
  LIMIT top_n;
$$;

GRANT EXECUTE ON FUNCTION public.get_top_properties(int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_top_properties(int, int) TO service_role;
