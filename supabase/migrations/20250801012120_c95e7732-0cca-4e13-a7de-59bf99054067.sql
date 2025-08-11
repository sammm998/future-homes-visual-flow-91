-- Ta bort de fastigheter jag lade till som inte finns i användarens lista
DELETE FROM properties 
WHERE ref_no IN ('10001', '10002', '10004', '10006', '10015');