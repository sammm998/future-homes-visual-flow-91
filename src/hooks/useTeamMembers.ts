import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTeamMembers = () => {
  const { data: teamMembers = [], isLoading, error } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: async () => {
      console.log('Fetching team members...');
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      console.log('Team members query result:', { data, error });
      
      if (error) {
        console.error('Error fetching team members:', error);
        throw error;
      }
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    teamMembers,
    isLoading,
    error: error?.message,
  };
};