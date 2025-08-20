import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

interface DbTestimonial {
  id: string;
  customer_name: string;
  customer_country?: string;
  review_text: string;
  rating?: number;
  property_type?: string;
  location?: string;
  image_url?: string;
  designation?: string;
  company_name?: string;
}

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Transform database testimonials to the format expected by components
        const transformedTestimonials: Testimonial[] = data.map((testimonial: DbTestimonial) => ({
          text: testimonial.review_text,
          image: testimonial.image_url || '/placeholder.svg',
          name: testimonial.customer_name,
          role: testimonial.designation || 
                (testimonial.customer_country ? `Customer - ${testimonial.customer_country}` : 'Customer')
        }));

        setTestimonials(transformedTestimonials);
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch testimonials');
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return { testimonials, loading, error, refetch: fetchTestimonials };
};