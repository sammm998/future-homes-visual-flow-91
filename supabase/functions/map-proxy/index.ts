import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Mapbox API key from environment
    const mapboxApiKey = Deno.env.get('MAPBOX_ACCESS_TOKEN');
    
    if (!mapboxApiKey) {
      return new Response(
        JSON.stringify({ error: 'Mapbox API key not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body to check for token request
    const body = req.method === 'POST' ? await req.json() : null;
    
    if (body?.action === 'get-token') {
      // Return the token for client-side use (Mapbox public tokens are safe for client-side)
      return new Response(
        JSON.stringify({ token: mapboxApiKey }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Original proxy functionality for other requests
    const url = new URL(req.url);
    const path = url.pathname.replace('/map-proxy', '');
    
    // Forward request to Mapbox API
    const mapboxUrl = `https://api.mapbox.com${path}?access_token=${mapboxApiKey}&${url.searchParams}`;
    
    const response = await fetch(mapboxUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.text();
    
    return new Response(data, {
      status: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });

  } catch (error) {
    console.error('Map proxy error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});