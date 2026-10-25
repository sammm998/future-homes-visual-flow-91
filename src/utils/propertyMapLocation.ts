type MapProperty = {
  refNo?: string | number;
  ref_no?: string | number;
  property_district?: string | null;
  location?: string | null;
  google_maps_embed?: string | null;
};

export function propertyMapLocation(property: MapProperty) {
  const ref = String(property.refNo ?? property.ref_no ?? '');
  // The saved REF 1389 embed contains a Cyprus pin despite its Antalya address.
  // Use a qualified district search rather than pretending to know the exact building coordinates.
  const query = ref === '1389'
    ? 'Güzelyurt, Aksu, Antalya, Türkiye'
    : [property.property_district, property.location].filter(Boolean).join(', ');
  const savedEmbed = property.google_maps_embed;
  const embed = ref !== '1389' && savedEmbed?.startsWith('https://www.google.com/maps/embed')
    ? savedEmbed
    : `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=13&output=embed`;
  return { embed, mapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` };
}