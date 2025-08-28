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
    const { conversationId } = await req.json();
    
    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!elevenLabsApiKey) {
      throw new Error('ElevenLabs API key not found');
    }

    if (!conversationId) {
      throw new Error('Conversation ID is required');
    }

    // Fetch detailed conversation data from ElevenLabs API
    const response = await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`, {
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

    // Also fetch audio URL if available
    let audioUrl = null;
    if (data.has_audio) {
      try {
        const audioResponse = await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${conversationId}/audio`, {
          method: 'GET',
          headers: {
            'xi-api-key': elevenLabsApiKey,
          },
        });
        
        if (audioResponse.ok) {
          // Create a blob URL for the audio
          const audioBlob = await audioResponse.blob();
          if (audioBlob.size > 0) {
            // Convert to base64 for embedding
            const arrayBuffer = await audioBlob.arrayBuffer();
            const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
            audioUrl = `data:audio/mpeg;base64,${base64Audio}`;
          }
        } else {
          console.warn(`Audio fetch failed with status: ${audioResponse.status}`);
        }
      } catch (audioError) {
        console.warn('Could not fetch audio:', audioError);
      }
    }

    // Transform the data for frontend consumption
    const conversationDetails = {
      id: data.conversation_id,
      agentId: data.agent_id,
      status: data.status,
      transcript: data.transcript || [],
      metadata: data.metadata || {},
      hasAudio: data.has_audio || false,
      hasUserAudio: data.has_user_audio || false,
      hasResponseAudio: data.has_response_audio || false,
      userId: data.user_id || null,
      analysis: data.analysis || null,
      conversationInitiationClientData: data.conversation_initiation_client_data || null,
      audioUrl: audioUrl,
      // Format dates properly
      startTime: data.metadata?.start_time_unix_secs ? 
        new Date(data.metadata.start_time_unix_secs * 1000).toLocaleString() : null,
      duration: data.metadata?.call_duration_secs || 0,
      // Additional useful metadata
      callSuccessful: data.metadata?.call_successful || 'unknown',
      endReason: data.metadata?.end_reason || null,
      language: data.conversation_initiation_client_data?.language || 'unknown'
    };

    return new Response(JSON.stringify(conversationDetails), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching conversation details:', error);
    return new Response(JSON.stringify({ 
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});