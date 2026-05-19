DELETE FROM course_modules WHERE course_id IN (SELECT id FROM courses WHERE country_code IN ('greece','spain'));
DELETE FROM courses WHERE country_code IN ('greece','spain');