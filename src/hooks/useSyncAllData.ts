import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getAllProperties } from '@/data/allPropertiesData';
import { articles } from '@/data/articlesData';

interface SyncStats {
  total: number;
  synced: number;
  updated: number;
  errors: number;
}

export const useSyncAllData = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStats, setSyncStats] = useState<SyncStats | null>(null);
  const { toast } = useToast();

  const syncAllProperties = async () => {
    setIsSyncing(true);
    const allProperties = getAllProperties();
    setSyncStats({ total: allProperties.length, synced: 0, updated: 0, errors: 0 });

    try {
      let synced = 0;
      let updated = 0;
      let errors = 0;

      for (const property of allProperties) {
        try {
          // Check if property exists
          const { data: existing } = await supabase
            .from('properties')
            .select('id')
            .eq('ref_no', property.refNo)
            .maybeSingle();

          // Map property data to database schema - handle different property data structures
          const propertyData = {
            ref_no: property.refNo,
            title: property.title,
            location: property.location,
            price: property.price,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            sizes_m2: property.area,
            status: (property as any).status || 'available',
            property_type: (property as any).propertyType || 'Apartment',
            property_image: property.image,
            property_images: (property as any).images || [],
            description: (property as any).description || `Luxury property in ${property.location}`,
            agent_name: (property as any).agent || 'Future Homes Turkey Team',
            agent_phone_number: (property as any).contactPhone || '+905523032750',
            building_complete_date: (property as any).buildingComplete,
            distance_to_airport_km: (property as any).distanceToAirport,
            distance_to_beach_km: (property as any).distanceToBeach,
            property_facilities: (property as any).features || (property as any).facilities || [],
            starting_price_eur: property.price,
            property_url: `/property/${property.refNo}`,
            google_maps_embed: property.coordinates ? 
              `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2!2d${property.coordinates[1]}!3d${property.coordinates[0]}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDIwJzEyLjkiTiAzM8KwMTknMDguMyJF!5e0!3m2!1sen!2str!4v1234567890123!5m2!1sen!2str` 
              : null,
            amenities: (property as any).features || []
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

      setSyncStats({ total: allProperties.length, synced, updated, errors });
      
      toast({
        title: "Properties sync complete",
        description: `${synced} new properties created, ${updated} updated, ${errors} errors.`
      });

    } catch (error) {
      console.error('Properties sync error:', error);
      toast({
        title: "Properties sync error",
        description: "An error occurred while syncing properties.",
        variant: "destructive"
      });
    }
  };

  const syncBlogPosts = async () => {
    try {
      let synced = 0;
      let updated = 0;
      let errors = 0;

      for (const article of articles) {
        try {
          // Check if blog post exists
          const { data: existing } = await supabase
            .from('blog_posts')
            .select('id')
            .eq('slug', `article-${article.id}`)
            .maybeSingle();

          // Create a clean slug from title
          const cleanSlug = article.title
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .slice(0, 50);

          // Map article data to blog post schema
          const blogPostData = {
            title: article.title,
            slug: cleanSlug,
            content: article.content,
            excerpt: article.description,
            published: true,
            language_code: 'en'
          };

          if (existing) {
            // Update existing blog post
            const { error } = await supabase
              .from('blog_posts')
              .update(blogPostData)
              .eq('id', existing.id);

            if (error) throw error;
            updated++;
          } else {
            // Insert new blog post
            const { error } = await supabase
              .from('blog_posts')
              .insert([blogPostData]);

            if (error) throw error;
            synced++;
          }

        } catch (error) {
          console.error(`Error syncing article ${article.id}:`, error);
          errors++;
        }
      }

      toast({
        title: "Blog posts sync complete",
        description: `${synced} new posts created, ${updated} updated, ${errors} errors.`
      });

    } catch (error) {
      console.error('Blog posts sync error:', error);
      toast({
        title: "Blog posts sync error",
        description: "An error occurred while syncing blog posts.",
        variant: "destructive"
      });
    }
  };

  const syncAllData = async () => {
    setIsSyncing(true);
    
    try {
      await syncAllProperties();
      await syncBlogPosts();
      
      toast({
        title: "Full data sync complete",
        description: "All properties and blog posts have been synced to Supabase."
      });
    } catch (error) {
      console.error('Full sync error:', error);
      toast({
        title: "Sync error",
        description: "An error occurred during the full data sync.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    syncAllProperties,
    syncBlogPosts,
    syncAllData,
    isSyncing,
    syncStats
  };
};