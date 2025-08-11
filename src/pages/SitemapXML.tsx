import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

const SitemapXML = () => {
  useEffect(() => {
    const generateSitemap = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('generate-sitemap');
        
        if (error) {
          console.error('Error generating sitemap:', error);
          return;
        }

        // Set the response as XML
        const response = new Response(data, {
          headers: {
            'Content-Type': 'application/xml',
          },
        });
        
        // Replace the current page content with the XML
        document.open();
        document.write(await response.text());
        document.close();
      } catch (error) {
        console.error('Error fetching sitemap:', error);
      }
    };

    generateSitemap();
  }, []);

  return (
    <div>
      <p>Generating sitemap...</p>
    </div>
  );
};

export default SitemapXML;