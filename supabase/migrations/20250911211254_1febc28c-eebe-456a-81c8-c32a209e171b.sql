-- Update all properties to remove agent_name since CMS no longer has this field
-- All properties will now use Batuhan Kunt as default contact agent
UPDATE properties 
SET agent_name = NULL
WHERE agent_name IS NOT NULL;