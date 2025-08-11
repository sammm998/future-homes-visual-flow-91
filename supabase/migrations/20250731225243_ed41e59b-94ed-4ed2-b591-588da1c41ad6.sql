-- Delete all Dubai properties from the database
DELETE FROM public.properties 
WHERE location ILIKE '%Dubai%' OR location ILIKE '%دبي%';