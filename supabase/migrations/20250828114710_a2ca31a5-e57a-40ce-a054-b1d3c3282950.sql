-- Fix Security Definer View vulnerability by recreating views with proper security settings
-- This ensures views respect the Row Level Security policies of the underlying tables

-- Drop existing views first
DROP VIEW IF EXISTS public.properties_public;
DROP VIEW IF EXISTS public.team_members_public;

-- Recreate properties_public view with security_invoker to respect RLS
CREATE VIEW public.properties_public
WITH (security_invoker = true) AS
SELECT 
    p.id,
    p.title,
    p.location,
    p.price,
    p.description,
    p.property_type,
    p.property_subtype,
    p.bedrooms,
    p.bathrooms,
    p.sizes_m2,
    p.amenities,
    p.property_facilities,
    p.property_district,
    p.distance_to_beach_km,
    p.distance_to_airport_km,
    p.building_complete_date,
    p.property_images,
    p.property_image,
    p.property_url,
    p.google_maps_embed,
    p.apartment_types,
    p.facilities,
    p.property_prices_by_room,
    p.starting_price_eur,
    p.status,
    p.ref_no,
    p.language_code,
    p.is_active,
    p.parent_property_id,
    p.slug,
    p.created_at,
    p.updated_at,
    pa.name AS agent_name
FROM properties p
LEFT JOIN property_agents pa ON p.agent_id = pa.id
WHERE p.is_active = true;

-- Recreate team_members_public view with security_invoker to respect RLS  
CREATE VIEW public.team_members_public
WITH (security_invoker = true) AS
SELECT 
    id,
    name,
    position,
    bio,
    image_url,
    display_order,
    is_active,
    created_at
FROM team_members
WHERE is_active = true;

-- Add comments to document the security fix
COMMENT ON VIEW public.properties_public IS 'Public view of active properties with security_invoker to respect RLS policies';
COMMENT ON VIEW public.team_members_public IS 'Public view of active team members with security_invoker to respect RLS policies';