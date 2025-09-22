import { useQuery } from '@tanstack/react-query';
import { enhancedSupabase, resilientQuery } from '@/lib/supabase-enhanced';

export const useTeamMembers = () => {
  const { data: teamMembers = [], isLoading, error } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: async () => {
      return await resilientQuery(async () => {
        const { data, error } = await enhancedSupabase
          .from('team_members')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        
        if (error) throw error;
        return data || [];
      }, 3, 2000);
    },
    staleTime: 15 * 60 * 1000, // Increased to 15 minutes
    gcTime: 30 * 60 * 1000, // Increased to 30 minutes
  });

  return {
    teamMembers,
    isLoading,
    error: error?.message,
  };
};