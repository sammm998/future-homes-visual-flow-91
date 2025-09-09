import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CleanupStats {
  duplicatesFound: number;
  duplicatesRemoved: number;
  errors: number;
}

interface InsertionLog {
  created_at: string;
  user_id: string | null;
  source_info: any;
  ip_address: unknown;
  title: string | null;
  location: string | null;
  ref_no: string | null;
  is_active: boolean | null;
}

interface MonitoringStats {
  totalProperties: number;
  recentInsertions: number;
  suspiciousPatterns: number;
  rateLimitHits: number;
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

  // NEW: Get monitoring statistics
  const getMonitoringStats = async (): Promise<MonitoringStats> => {
    try {
      // Get total properties
      const { count: totalProperties } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });

      // Get recent insertions (last hour)
      const { count: recentInsertions } = await supabase
        .from('property_insertion_log')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

      // Count suspicious patterns (more than 3 insertions in 5 minutes)
      const { data: suspiciousData } = await supabase
        .from('property_insertion_log')
        .select('user_id')
        .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString());
      
      const userCounts = suspiciousData?.reduce((acc: Record<string, number>, item) => {
        if (item.user_id) {
          acc[item.user_id] = (acc[item.user_id] || 0) + 1;
        }
        return acc;
      }, {});

      const suspiciousPatterns = Object.values(userCounts || {}).filter(count => count >= 3).length;

      return {
        totalProperties: totalProperties || 0,
        recentInsertions: recentInsertions || 0,
        suspiciousPatterns,
        rateLimitHits: 0 // This would require error log analysis
      };
    } catch (error) {
      console.error('Error getting monitoring stats:', error);
      return { totalProperties: 0, recentInsertions: 0, suspiciousPatterns: 0, rateLimitHits: 0 };
    }
  };

  // NEW: Get recent insertion logs
  const getInsertionLogs = async (limit = 50): Promise<InsertionLog[]> => {
    try {
      const { data, error } = await supabase
        .from('property_insertion_monitoring')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting insertion logs:', error);
      return [];
    }
  };

  // NEW: Check for duplicates before insertion
  const checkForDuplicates = async (title: string, location: string, refNo?: string) => {
    try {
      const duplicates = [];

      // Check title + location duplicates
      const { data: titleLocationDupes, error: tlError } = await supabase
        .from('properties')
        .select('id, title, location, created_at')
        .ilike('title', title.trim())
        .ilike('location', location.trim())
        .eq('is_active', true);

      if (tlError) throw tlError;
      if (titleLocationDupes && titleLocationDupes.length > 0) {
        duplicates.push({
          type: 'title_location',
          count: titleLocationDupes.length,
          matches: titleLocationDupes
        });
      }

      // Check ref_no duplicates if provided
      if (refNo && refNo.trim()) {
        const { data: refNoDupes, error: refError } = await supabase
          .from('properties')
          .select('id, ref_no, title, created_at')
          .eq('ref_no', refNo.trim())
          .eq('is_active', true);

        if (refError) throw refError;
        if (refNoDupes && refNoDupes.length > 0) {
          duplicates.push({
            type: 'ref_no',
            count: refNoDupes.length,
            matches: refNoDupes
          });
        }
      }

      return duplicates;
    } catch (error) {
      console.error('Error checking for duplicates:', error);
      return [];
    }
  };

  return {
    removeDuplicateProperties,
    getPropertyStats,
    getMonitoringStats,
    getInsertionLogs,
    checkForDuplicates,
    isProcessing,
    cleanupStats
  };
};
