-- Update Cyprus properties to have the correct agent assigned
UPDATE properties 
SET agent_name = 'Cyprus Properties Team'
WHERE location ILIKE '%cyprus%' 
  AND (agent_name IS NULL OR agent_name = 'Dubai Properties Team' OR agent_name = 'Ervina Köksel');