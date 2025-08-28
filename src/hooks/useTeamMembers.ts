import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTeamMembers = () => {
  const { data: teamMembers = [], isLoading, error } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: async () => {
      // Use the safe view that doesn't expose email/phone
      const { data, error } = await supabase
        .from('team_members_public')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
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