import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSearchParams } from 'react-router-dom';

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
  const [searchParams] = useSearchParams();
  const language = searchParams.get('lang') || 'en';

  const { data: testimonials = [], isLoading: loading, error } = useQuery({
    queryKey: ['testimonials', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!data) return [];

      // Fetch translations if not English
      let translationsMap = new Map<string, { review_text: string; designation: string | null }>();
      if (language && language !== 'en') {
        const { data: translations } = await supabase
          .from('testimonial_translations')
          .select('testimonial_id, review_text, designation')
          .eq('language_code', language)
          .in('testimonial_id', data.map((d: any) => d.id));
        if (translations) {
          translations.forEach((t: any) => {
            translationsMap.set(t.testimonial_id, {
              review_text: t.review_text,
              designation: t.designation,
            });
          });
        }
      }

      const transformed: Testimonial[] = data.map((t: DbTestimonial) => {
        const tr = translationsMap.get(t.id);
        const reviewText = tr?.review_text || t.review_text;
        const designation = tr?.designation || t.designation;
        return {
          text: reviewText,
          image: t.image_url || '/placeholder.svg',
          name: t.customer_name,
          role:
            designation ||
            (t.location ? `Customer - ${t.location}` : 'Customer'),
        };
      });

      return transformed;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    networkMode: 'offlineFirst',
  });

  return {
    testimonials,
    loading,
    error: error?.message,
    refetch: () => {},
  };
};
