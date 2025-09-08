import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ContentSection {
  type: string;
  content?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  [key: string]: any;
}

interface WebsiteContent {
  pageTitle: string;
  metaDescription: string;
  contentSections: ContentSection[];
}

interface UseWebsiteContentResult extends WebsiteContent {
  isLoading: boolean;
  error: string | null;
}

const getPageSlugFromPath = (pathname: string): string => {
  const pathToSlugMap: Record<string, string> = {
    '/': '', // Homepage has empty slug
    '/about-us': 'about-us',
    '/contact-us': 'contact-us',
    '/antalya': 'fastigheter-turkiet',
    '/dubai': 'fastigheter-dubai',
    '/cyprus': 'fastigheter-cypern',
    '/mersin': 'fastigheter-mersin',
    '/testimonials': 'kundberattelser',
    '/information': 'information',
    '/articles': 'blog',
  };

  return pathToSlugMap[pathname] || pathname.replace('/', '');
};

export const useWebsiteContent = (customSlug?: string): UseWebsiteContentResult => {
  const [content, setContent] = useState<WebsiteContent>({
    pageTitle: '',
    metaDescription: '',
    contentSections: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const slug = customSlug || getPageSlugFromPath(window.location.pathname);
        
        const { data, error: fetchError } = await supabase
          .from('website_content')
          .select('*')
          .eq('page_slug', slug)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            // No data found, return empty content
            setContent({
              pageTitle: '',
              metaDescription: '',
              contentSections: []
            });
          } else {
            throw fetchError;
          }
        } else if (data) {
          setContent({
            pageTitle: data.page_title || '',
            metaDescription: data.meta_description || '',
            contentSections: Array.isArray(data.content_sections) ? data.content_sections as ContentSection[] : []
          });
        }
      } catch (err) {
        console.error('Error fetching website content:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [customSlug]);

  return {
    ...content,
    isLoading,
    error
  };
};