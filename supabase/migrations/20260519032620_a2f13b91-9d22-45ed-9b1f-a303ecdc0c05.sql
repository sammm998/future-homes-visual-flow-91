UPDATE course_modules m
SET image_url = '/courses/' || c.country_code || '/' || m.slug || '.jpg',
    updated_at = now()
FROM courses c
WHERE m.course_id = c.id
  AND c.country_code IN ('turkey','dubai','cyprus','bali');