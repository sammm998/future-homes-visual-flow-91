import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Property } from './types';

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProperties: Property[] = data.map(prop => ({
        id: prop.id,
        title: prop.title,
        location: prop.location,
        price: prop.price,
        image: prop.property_image || prop.property_images?.[0] || '/placeholder.svg',
        images: prop.property_images || [prop.property_image || '/placeholder.svg'],
        description: prop.description || '',
        type: prop.property_type || 'Villa',
        bedrooms: parseInt(prop.bedrooms) || 0,
        bathrooms: parseInt(prop.bathrooms) || 0,
        size: prop.sizes_m2 || '',
        facilities: prop.property_facilities || [],
        amenities: prop.amenities || [],
        agent: {
          name: prop.agent_name || 'Future Homes',
          phone: prop.agent_phone_number || '+90 555 000 0000'
        },
        distanceToBeach: prop.distance_to_beach_km,
        distanceToAirport: prop.distance_to_airport_km,
        completionDate: prop.building_complete_date,
        propertyUrl: prop.property_url,
        refNo: prop.ref_no,
        googleMapsEmbed: prop.google_maps_embed,
        slug: prop.slug
      }));

      setProperties(formattedProperties);
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();

    // Set up real-time subscription for property changes
    const channel = supabase
      .channel('properties-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties'
        },
        () => {
          // Refetch properties when any change occurs
          fetchProperties();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { properties, loading, error, refetch: fetchProperties };
};

export const usePropertyBySlug = (slug: string) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          const formattedProperty: Property = {
            id: data.id,
            title: data.title,
            location: data.location,
            price: data.price,
            image: data.property_image || data.property_images?.[0] || '/placeholder.svg',
            images: data.property_images || [data.property_image || '/placeholder.svg'],
            description: data.description || '',
            type: data.property_type || 'Villa',
            bedrooms: parseInt(data.bedrooms) || 0,
            bathrooms: parseInt(data.bathrooms) || 0,
            size: data.sizes_m2 || '',
            facilities: data.property_facilities || [],
            amenities: data.amenities || [],
            agent: {
              name: data.agent_name || 'Future Homes',
              phone: data.agent_phone_number || '+90 555 000 0000'
            },
            distanceToBeach: data.distance_to_beach_km,
            distanceToAirport: data.distance_to_airport_km,
            completionDate: data.building_complete_date,
            propertyUrl: data.property_url,
            refNo: data.ref_no,
            googleMapsEmbed: data.google_maps_embed,
            slug: data.slug
          };

          setProperty(formattedProperty);
        } else {
          setProperty(null);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch property');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [slug]);

  return { property, loading, error };
};

export const useFilteredProperties = (filters: {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  propertyType?: string;
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFilteredProperties = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'available');

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters.propertyType) {
        query = query.eq('property_type', filters.propertyType);
      }

      if (filters.bedrooms) {
        query = query.eq('bedrooms', filters.bedrooms.toString());
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      let formattedProperties: Property[] = data.map(prop => ({
        id: prop.id,
        title: prop.title,
        location: prop.location,
        price: prop.price,
        image: prop.property_image || prop.property_images?.[0] || '/placeholder.svg',
        images: prop.property_images || [prop.property_image || '/placeholder.svg'],
        description: prop.description || '',
        type: prop.property_type || 'Villa',
        bedrooms: parseInt(prop.bedrooms) || 0,
        bathrooms: parseInt(prop.bathrooms) || 0,
        size: prop.sizes_m2 || '',
        facilities: prop.property_facilities || [],
        amenities: prop.amenities || [],
        agent: {
          name: prop.agent_name || 'Future Homes',
          phone: prop.agent_phone_number || '+90 555 000 0000'
        },
        distanceToBeach: prop.distance_to_beach_km,
        distanceToAirport: prop.distance_to_airport_km,
        completionDate: prop.building_complete_date,
        propertyUrl: prop.property_url,
        refNo: prop.ref_no,
        googleMapsEmbed: prop.google_maps_embed,
        slug: prop.slug
      }));

      // Client-side price filtering since we store prices as text
      if (filters.minPrice || filters.maxPrice) {
        formattedProperties = formattedProperties.filter(prop => {
          const priceStr = prop.price.replace(/[^\d]/g, '');
          const price = parseInt(priceStr) || 0;
          
          if (filters.minPrice && price < filters.minPrice) return false;
          if (filters.maxPrice && price > filters.maxPrice) return false;
          
          return true;
        });
      }

      setProperties(formattedProperties);
      setError(null);
    } catch (err) {
      console.error('Error fetching filtered properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProperties();

    // Set up real-time subscription
    const channel = supabase
      .channel('filtered-properties-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties'
        },
        () => {
          fetchFilteredProperties();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filters.location, filters.minPrice, filters.maxPrice, filters.bedrooms, filters.propertyType]);

  return { properties, loading, error, refetch: fetchFilteredProperties };
};