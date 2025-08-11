-- Delete recent testimonials imported today
DELETE FROM public.testimonials 
WHERE created_at >= '2025-08-03';