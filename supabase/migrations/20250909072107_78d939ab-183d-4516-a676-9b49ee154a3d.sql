-- Fix all Security Definer Views by recreating them with security_invoker

-- Fix properties_public view
CREATE OR REPLACE VIEW public.properties_public 
WITH (security_invoker=on) AS
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

-- Fix team_members_public view
CREATE OR REPLACE VIEW public.team_members_public 
WITH (security_invoker=on) AS
SELECT 
    id,
    name,
    position,
    bio,
    image_url,
    linkedin_url,
    display_order,
    is_active,
    created_at
FROM team_members
WHERE is_active = true
ORDER BY display_order;

-- The property_insertion_monitoring view was already fixed earlier, 
-- but let's recreate it to ensure it's properly configured
CREATE OR REPLACE VIEW public.property_insertion_monitoring 
WITH (security_invoker=on) AS
SELECT 
    pil.created_at,
    pil.user_id,
    pil.source_info,
    pil.ip_address,
    p.title,
    p.location,
    p.ref_no,
    p.is_active
FROM property_insertion_log pil
LEFT JOIN properties p ON p.id = pil.property_id
WHERE is_admin() -- Only show data if user is admin
ORDER BY pil.created_at DESC;

-- Log successful view security fixes
DO $$
BEGIN
    RAISE LOG 'Fixed all view security issues: Added security_invoker to properties_public, team_members_public, and property_insertion_monitoring';
END
$$;