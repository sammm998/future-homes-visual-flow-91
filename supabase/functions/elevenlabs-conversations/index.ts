import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agentId, limit = 50, offset = 0 } = await req.json();
    
    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!elevenLabsApiKey) {
      throw new Error('ElevenLabs API key not found');
    }

    // Fetch conversation history from ElevenLabs API
    const response = await fetch(`https://api.elevenlabs.io/v1/convai/conversations?agent_id=${agentId}&limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'xi-api-key': elevenLabsApiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Transform the data to match our needs
    const conversations = data.conversations?.map((conv: any) => ({
      id: conv.conversation_id,
      date: conv.start_time_unix_secs ? new Date(conv.start_time_unix_secs * 1000).toLocaleString() : 'Invalid Date',
      agent: conv.agent_name || 'Future Homes',
      duration: conv.call_duration_secs ? formatDuration(conv.call_duration_secs) : '0:00',
      messages: conv.message_count || 0,
      evaluation: conv.call_successful === 'success' ? 'Successful' : 
                 conv.call_successful === 'failure' ? 'Error' : 
                 conv.status === 'done' ? 'Completed' :
                 conv.status || 'Unknown',
      rawData: conv
    })) || [];

    return new Response(JSON.stringify({ 
      conversations,
      total: data.total || conversations.length,
      hasMore: data.has_more || false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      conversations: [],
      total: 0,
      hasMore: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}