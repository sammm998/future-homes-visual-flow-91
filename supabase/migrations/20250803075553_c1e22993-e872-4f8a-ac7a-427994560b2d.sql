-- Remove all duplicate properties, keeping only the first one for each ref_no
DELETE FROM properties 
WHERE id NOT IN (
  SELECT DISTINCT ON (ref_no) id 
  FROM properties 
  ORDER BY ref_no, created_at ASC
);