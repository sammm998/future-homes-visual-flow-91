-- Update all properties to use Batuhan as the agent
UPDATE properties 
SET 
  agent_name = 'Batuhan Kunt',
  agent_phone_number = '+905523032750'
WHERE agent_name IS NULL OR agent_name != 'Batuhan Kunt';