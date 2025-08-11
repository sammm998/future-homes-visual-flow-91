-- Remove the 7 latest Dubai properties that were just added
DELETE FROM public.properties 
WHERE ref_no IN ('10052', '10053', '10054', '10055', '10056', '10057', '10058');