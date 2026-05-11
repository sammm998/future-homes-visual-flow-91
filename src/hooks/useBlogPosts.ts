import { useQuery, useQueryClient } from '@tanstack/react-query';
import { enhancedSupabase, resilientQuery } from '@/lib/supabase-enhanced';
import { getCurrentLanguage } from '@/utils/seoUtils';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

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
  language_code?: string | null;
  parent_post_id?: string | null;
}

/**
 * Returns blog posts for the current language. Logic:
 *  - Always fetch all English (parent) posts.
 *  - If current lang !== 'en', also fetch translated child posts in that lang.
 *  - For each English parent, prefer its translation if available, else fall
 *    back to English. Slug remains the English slug so existing routes work.
 */
export const useBlogPosts = (includeUnpublished = false) => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const lang = useMemo(() => getCurrentLanguage() || 'en', [location.search]);

  const { data: blogPosts = [], isLoading: loading, error } = useQuery({
    queryKey: ['blog_posts', includeUnpublished, lang],
    queryFn: async () => {
      return await resilientQuery(async () => {
        // Fetch English parent posts
        let parentQuery = enhancedSupabase
          .from('blog_posts')
          .select('*')
          .eq('language_code', 'en')
          .is('parent_post_id', null);
        if (!includeUnpublished) parentQuery = parentQuery.eq('published', true);
        const { data: parents, error: pErr } = await parentQuery.order('created_at', { ascending: false });
        if (pErr) throw pErr;

        if (lang === 'en' || !parents) return parents || [];

        // Fetch translations in target language
        const parentIds = parents.map((p: any) => p.id);
        if (parentIds.length === 0) return [];
        const { data: translations, error: tErr } = await enhancedSupabase
          .from('blog_posts')
          .select('*')
          .eq('language_code', lang)
          .in('parent_post_id', parentIds);
        if (tErr) throw tErr;

        const transByParent = new Map<string, any>();
        (translations || []).forEach((t: any) => transByParent.set(t.parent_post_id, t));

        // Merge: keep parent slug & id (so URLs stay stable), use translated title/excerpt/content if present
        return parents.map((p: any) => {
          const tr = transByParent.get(p.id);
          if (!tr) return p;
          return {
            ...p,
            title: tr.title,
            excerpt: tr.excerpt,
            content: tr.content,
          };
        });
      }, 3, 2000);
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
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
  const location = useLocation();
  const lang = useMemo(() => getCurrentLanguage() || 'en', [location.search]);

  const { data: blogPost, isLoading: loading, error } = useQuery({
    queryKey: ['blog_post', slug, lang],
    queryFn: async () => {
      return await resilientQuery(async () => {
        // Find the English parent by slug
        const { data: parent, error: pErr } = await enhancedSupabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .maybeSingle();
        if (pErr) throw pErr;
        if (!parent) return null;

        if (lang === 'en') return parent;

        // Try to find translation in current language
        const { data: tr } = await enhancedSupabase
          .from('blog_posts')
          .select('*')
          .eq('parent_post_id', parent.id)
          .eq('language_code', lang)
          .maybeSingle();

        if (!tr) return parent;
        return {
          ...parent,
          title: tr.title,
          excerpt: tr.excerpt,
          content: tr.content,
        };
      }, 3, 2000);
    },
    enabled: !!slug,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return {
    blogPost,
    loading,
    error: error?.message
  };
};
