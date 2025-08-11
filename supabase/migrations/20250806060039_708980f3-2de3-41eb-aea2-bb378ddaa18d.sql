-- Simply remove -tr from all slugs that have it, let any duplicates fail for now
-- We'll handle them one by one
UPDATE blog_posts 
SET slug = REPLACE(slug, '-tr', '')
WHERE slug LIKE '%-tr'
  AND slug NOT IN (
    -- Exclude ones that would create duplicates
    SELECT DISTINCT tr_slug 
    FROM (
      SELECT tr_posts.slug as tr_slug
      FROM blog_posts tr_posts
      JOIN blog_posts base_posts ON base_posts.slug = REPLACE(tr_posts.slug, '-tr', '')
      WHERE tr_posts.slug LIKE '%-tr'
        AND tr_posts.id != base_posts.id
    ) duplicates
  );