import { useEffect, useState } from 'react';

const SitemapXML = () => {
  const [sitemap, setSitemap] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        // Call the edge function directly via fetch
        const response = await fetch(
          'https://kiogiyemoqbnuvclneoe.supabase.co/functions/v1/generate-sitemap',
          {
            headers: {
              'Content-Type': 'application/xml',
            },
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch sitemap');
        }

        const xmlText = await response.text();
        setSitemap(xmlText);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sitemap:', error);
        setLoading(false);
      }
    };

    fetchSitemap();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <p>Generating sitemap...</p>
      </div>
    );
  }

  // Render as pre-formatted XML
  return (
    <pre
      style={{
        margin: 0,
        padding: 0,
        fontFamily: 'monospace',
        fontSize: '12px',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
      }}
      dangerouslySetInnerHTML={{ __html: sitemap }}
    />
  );
};

export default SitemapXML;