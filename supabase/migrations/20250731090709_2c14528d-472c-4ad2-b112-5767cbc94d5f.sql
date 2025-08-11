-- Ta bort alla lägenheter som inte är från Antalya
-- Behåller endast de 83 Antalya-lägenheterna som användaren specificerade
DELETE FROM properties 
WHERE location NOT LIKE '%Antalya%';