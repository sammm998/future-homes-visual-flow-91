import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.54.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactRequest {
  name?: string;
  email?: string;
  phone?: string;
  conversation_id?: string;
  language?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body: ContactRequest = await req.json();
    console.log('Received contact submission:', body);

    // Validate that at least one contact method is provided
    if (!body.name && !body.email && !body.phone) {
      return new Response(
        JSON.stringify({ 
          error: 'At least one contact method (name, email, or phone) is required' 
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Insert contact with service role (bypasses RLS)
    const { data, error } = await supabase
      .from('contacts')
      .insert([{
        name: body.name || 'Anonymous',  // Provide default since name is NOT NULL
        email: body.email || null,
        phone: body.phone || null,
        conversation_id: body.conversation_id || null,
        language: body.language || 'en'
      }])
      .select();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Contact saved successfully:', data);

    // Try to send email notification if we have the function
    try {
      const emailResponse = await supabase.functions.invoke('send-contact-notification', {
        body: {
          name: body.name || 'Anonymous',
          email: body.email,
          phone: body.phone,
          source: 'ai-chat'
        }
      });

      if (emailResponse.error) {
        console.error('Email notification error:', emailResponse.error);
      } else {
        console.log('Email notification sent successfully');
      }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the whole request if email fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: data?.[0] || null,
        message: 'Contact information saved successfully' 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error: any) {
    console.error('Error in save-contact function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to save contact information',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
};

serve(handler);