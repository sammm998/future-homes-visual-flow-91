import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export const useBlogPosts = (includeUnpublished = false) => {
  const queryClient = useQueryClient();

  const { data: blogPosts = [], isLoading: loading, error } = useQuery({
    queryKey: ['blog_posts', includeUnpublished],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .limit(50); // Increased limit to show more articles
      
      if (!includeUnpublished) {
        query = query.eq('published', true);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const refreshBlogPosts = () => {
    queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
  };

  return {
    blogPosts,
    loading,
    error: error?.message,
    refreshBlogPosts
  };
};

export const useBlogPost = (slug: string) => {
  const { data: blogPost, isLoading: loading, error } = useQuery({
    queryKey: ['blog_post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    blogPost,
    loading,
    error: error?.message
  };
};