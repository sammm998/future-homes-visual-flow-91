-- Remove duplicate properties with same ref_no, keeping the first one
DELETE FROM properties 
WHERE id NOT IN (
  SELECT DISTINCT ON (ref_no) id 
  FROM properties 
  ORDER BY ref_no, created_at ASC
);