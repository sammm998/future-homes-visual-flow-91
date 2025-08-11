import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CleanupStats {
  duplicatesFound: number;
  duplicatesRemoved: number;
  errors: number;
}

export const usePropertyCleanup = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cleanupStats, setCleanupStats] = useState<CleanupStats | null>(null);
  const { toast } = useToast();

  const removeDuplicateProperties = async () => {
    setIsProcessing(true);
    setCleanupStats({ duplicatesFound: 0, duplicatesRemoved: 0, errors: 0 });

    try {
      // Find all properties with duplicates
      const { data: duplicateRefNos, error: findError } = await supabase
        .from('properties')
        .select('ref_no')
        .not('ref_no', 'is', null);

      if (findError) throw findError;

      // Group by ref_no and find duplicates
      const refNoCounts = duplicateRefNos?.reduce((acc: Record<string, number>, item) => {
        if (item.ref_no) {
          acc[item.ref_no] = (acc[item.ref_no] || 0) + 1;
        }
        return acc;
      }, {});

      const duplicateRefNoList = Object.keys(refNoCounts || {}).filter(
        refNo => (refNoCounts?.[refNo] || 0) > 1
      );

      let totalDuplicatesFound = 0;
      let totalDuplicatesRemoved = 0;
      let errors = 0;

      for (const refNo of duplicateRefNoList) {
        try {
          // Get all properties with this ref_no, ordered by creation date
          const { data: properties, error: fetchError } = await supabase
            .from('properties')
            .select('id, created_at')
            .eq('ref_no', refNo)
            .order('created_at', { ascending: true });

          if (fetchError) throw fetchError;
          if (!properties || properties.length <= 1) continue;

          totalDuplicatesFound += properties.length - 1;

          // Keep the first (oldest) entry, delete the rest
          const duplicateIds = properties.slice(1).map(p => p.id);

          if (duplicateIds.length > 0) {
            const { error: deleteError } = await supabase
              .from('properties')
              .delete()
              .in('id', duplicateIds);

            if (deleteError) throw deleteError;
            totalDuplicatesRemoved += duplicateIds.length;
          }

        } catch (error) {
          console.error(`Error processing ref_no ${refNo}:`, error);
          errors++;
        }
      }

      setCleanupStats({
        duplicatesFound: totalDuplicatesFound,
        duplicatesRemoved: totalDuplicatesRemoved,
        errors
      });

      toast({
        title: "Duplikatstädning klar",
        description: `${totalDuplicatesRemoved} dubletter borttagna av ${totalDuplicatesFound} hittade. ${errors} fel.`
      });

    } catch (error) {
      console.error('Cleanup error:', error);
      toast({
        title: "Fel vid städning",
        description: "Ett fel uppstod vid borttagning av dubletter.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getPropertyStats = async () => {
    try {
      const { count } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });

      return { total: count || 0 };
    } catch (error) {
      console.error('Error getting stats:', error);
      return { total: 0 };
    }
  };

  return {
    removeDuplicateProperties,
    getPropertyStats,
    isProcessing,
    cleanupStats
  };
};
