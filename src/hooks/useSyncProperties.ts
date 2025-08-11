import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { dubaiProperties } from '@/data/dubaiProperties';

interface SyncStats {
  total: number;
  synced: number;
  updated: number;
  errors: number;
}

export const useSyncProperties = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStats, setSyncStats] = useState<SyncStats | null>(null);
  const { toast } = useToast();

  const syncDubaiProperties = async () => {
    setIsSyncing(true);
    setSyncStats({ total: dubaiProperties.length, synced: 0, updated: 0, errors: 0 });

    try {
      let synced = 0;
      let updated = 0;
      let errors = 0;

      for (const property of dubaiProperties) {
        try {
          // Check if property exists
          const { data: existing } = await supabase
            .from('properties')
            .select('id')
            .eq('ref_no', property.refNo)
            .maybeSingle();

          const propertyData = {
            ref_no: property.refNo,
            title: property.title,
            location: property.location,
            price: property.price,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            sizes_m2: property.area,
            status: property.status,
            property_type: 'Apartment',
            property_image: property.image,
            property_images: property.images,
            description: `Luxury property in ${property.location}`,
            agent_name: 'Dubai Properties Team',
            agent_phone_number: '+971-50-123-4567'
          };

          if (existing) {
            // Update existing property
            const { error } = await supabase
              .from('properties')
              .update(propertyData)
              .eq('id', existing.id);

            if (error) throw error;
            updated++;
          } else {
            // Insert new property
            const { error } = await supabase
              .from('properties')
              .insert([propertyData]);

            if (error) throw error;
            synced++;
          }

          setSyncStats(prev => prev ? {
            ...prev,
            synced,
            updated,
            errors
          } : null);

        } catch (error) {
          console.error(`Error syncing property ${property.refNo}:`, error);
          errors++;
        }
      }

      setSyncStats({ total: dubaiProperties.length, synced, updated, errors });
      
      toast({
        title: "Sync complete",
        description: `${synced} new properties created, ${updated} updated, ${errors} errors.`
      });

    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: "Sync error",
        description: "An error occurred while syncing properties.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    syncDubaiProperties,
    isSyncing,
    syncStats
  };
};