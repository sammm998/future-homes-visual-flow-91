import { useQuery, useQueryClient } from '@tanstack/react-query';
import { enhancedSupabase, resilientQuery } from '@/lib/supabase-enhanced';

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
      return await resilientQuery(async () => {
        let query = enhancedSupabase
          .from('blog_posts')
          .select('*')
          .limit(50);
        
        if (!includeUnpublished) {
          query = query.eq('published', true);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
      }, 3, 2000);
    },
    staleTime: 15 * 60 * 1000, // Increased to 15 minutes for UAE users
    gcTime: 30 * 60 * 1000, // Increased to 30 minutes
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
      return await resilientQuery(async () => {
        const { data, error } = await enhancedSupabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .maybeSingle();
        
        if (error) throw error;
        return data;
      }, 3, 2000);
    },
    enabled: !!slug,
    staleTime: 15 * 60 * 1000, // Increased to 15 minutes for UAE users
    gcTime: 30 * 60 * 1000, // Increased to 30 minutes
  });

  return {
    blogPost,
    loading,
    error: error?.message
  };
};