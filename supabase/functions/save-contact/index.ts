import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Use service role to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { name, email, phone, conversationId, language = 'en', source = 'website' } = await req.json();

    console.log('Saving contact:', { name, email, phone, conversationId, language, source });

    // Validate that at least one contact field is provided
    if (!name && !email && !phone) {
      return new Response(
        JSON.stringify({ error: 'At least one contact field (name, email, or phone) is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Save contact to database
    const { data: contactData, error: contactError } = await supabase
      .from('contacts')
      .insert([{
        name: name || null,
        email: email || null,
        phone: phone || null,
        conversation_id: conversationId || null,
        language: language,
      }])
      .select()
      .single();

    if (contactError) {
      console.error('Contact save error:', contactError);
      return new Response(
        JSON.stringify({ error: 'Failed to save contact information', details: contactError }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Contact saved successfully:', contactData);

    // Send email notification
    try {
      console.log('Sending email notification for contact:', { name, email, phone, source });
      
      const emailResponse = await supabase.functions.invoke('send-contact-notification', {
        body: { name, email, phone, source }
      });

      if (emailResponse.error) {
        console.error('Email notification error:', emailResponse.error);
        // Don't fail the whole request if email fails
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
        message: 'Contact saved successfully',
        contactId: contactData.id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in save-contact function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});