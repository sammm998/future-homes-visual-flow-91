-- Delete the remaining -tr posts since they are duplicates
DELETE FROM blog_posts 
WHERE slug LIKE '%-tr';