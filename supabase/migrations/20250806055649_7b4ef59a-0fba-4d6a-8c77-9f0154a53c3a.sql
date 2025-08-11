-- Let's check which posts have -tr and handle them step by step
-- First, list posts with -tr to understand what we're dealing with
SELECT slug, REPLACE(slug, '-tr', '') as new_slug, COUNT(*) as count
FROM blog_posts 
WHERE slug LIKE '%-tr'
GROUP BY slug, REPLACE(slug, '-tr', '');