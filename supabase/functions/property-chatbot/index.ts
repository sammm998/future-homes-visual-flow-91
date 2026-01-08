import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const resendApiKey = Deno.env.get('RESEND_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Language detection
const detectLanguage = (text: string): string => {
  const swedishWords = ['är', 'jag', 'du', 'vi', 'och', 'för', 'med', 'på', 'till', 'vill', 'kan', 'ska', 'har', 'att', 'det', 'en', 'ett'];
  const words = text.toLowerCase().split(/\s+/);
  const swedishCount = words.filter(word => swedishWords.includes(word)).length;
  return swedishCount > 2 ? 'sv' : 'en';
};

// Search properties from database
const searchProperties = async (query: string) => {
  try {
    const supabase = createClient(supabaseUrl!, supabaseKey!);
    
    const { data: properties, error } = await supabase
      .from('properties')
      .select('id, title, price, location, property_image, property_images, bedrooms, bathrooms, sizes_m2, description, property_type, slug')
      .eq('is_active', true)
      .limit(100);
    
    if (error || !properties) {
      console.error('Error fetching properties:', error);
      return [];
    }

    const queryLower = query.toLowerCase();
    let filtered = properties;

    // Location filtering
    if (queryLower.includes('dubai')) {
      filtered = filtered.filter(p => p.location?.toLowerCase().includes('dubai'));
    } else if (queryLower.includes('antalya') || queryLower.includes('turkey') || queryLower.includes('turkiet')) {
      filtered = filtered.filter(p => p.location?.toLowerCase().includes('antalya') || p.location?.toLowerCase().includes('turkey'));
    } else if (queryLower.includes('cyprus') || queryLower.includes('cypern')) {
      filtered = filtered.filter(p => p.location?.toLowerCase().includes('cyprus'));
    }

    // Bedroom filtering
    const bedroomMatch = query.match(/(\d+)\s*(?:bedroom|sovrum|rum|\+1)/i);
    if (bedroomMatch) {
      const count = parseInt(bedroomMatch[1]);
      filtered = filtered.filter(p => {
        const beds = parseInt(p.bedrooms || '0');
        return beds === count;
      });
    }

    // Price filtering
    if (queryLower.includes('budget') || queryLower.includes('cheap') || queryLower.includes('billig')) {
      filtered = filtered.filter(p => {
        const price = parseInt((p.price || '0').replace(/[^\d]/g, ''));
        return price < 200000;
      });
    } else if (queryLower.includes('luxury') || queryLower.includes('lyx')) {
      filtered = filtered.filter(p => {
        const price = parseInt((p.price || '0').replace(/[^\d]/g, ''));
        return price > 400000;
      });
    }

    // Limit and format results
    const results = filtered.slice(0, 5).map(p => ({
      id: p.id,
      title: p.title,
      price: p.price,
      location: p.location,
      image: p.property_image || (p.property_images && p.property_images[0]),
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      size: p.sizes_m2,
      slug: p.slug
    }));

    return results;
  } catch (error) {
    console.error('Error in searchProperties:', error);
    return [];
  }
};

// Send booking email
const sendBookingEmail = async (bookingDetails: { name: string; email: string; phone: string; date: string; time: string; propertyInterest?: string }) => {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Future Homes <noreply@futurehomesinternational.com>',
        to: ['info@futurehomesinternational.com'],
        subject: `New Meeting Booking - ${bookingDetails.name}`,
        html: `
          <h2>New Meeting Booking Request</h2>
          <p><strong>Name:</strong> ${bookingDetails.name}</p>
          <p><strong>Email:</strong> ${bookingDetails.email}</p>
          <p><strong>Phone:</strong> ${bookingDetails.phone}</p>
          <p><strong>Preferred Date:</strong> ${bookingDetails.date}</p>
          <p><strong>Preferred Time:</strong> ${bookingDetails.time}</p>
          ${bookingDetails.propertyInterest ? `<p><strong>Property Interest:</strong> ${bookingDetails.propertyInterest}</p>` : ''}
          <p><em>Sent from AI Property Assistant</em></p>
        `,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Email send failed:', errorText);
      return { success: false, error: errorText };
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [], action, bookingDetails } = await req.json();
    
    console.log('Received request:', { message, action, hasHistory: conversationHistory.length > 0 });

    // Handle booking action
    if (action === 'book_meeting' && bookingDetails) {
      const result = await sendBookingEmail(bookingDetails);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const detectedLanguage = detectLanguage(message);
    
    // Search for properties based on user query
    const properties = await searchProperties(message);
    console.log(`Found ${properties.length} matching properties`);

    // Build system prompt
    const systemPrompt = detectedLanguage === 'sv' ? 
      `Du är en hjälpsam AI-assistent för Future Homes International, ett fastighetsmäkleri som säljer fastigheter i Turkiet, Dubai och Cypern.

Dina förmågor:
1. Hjälpa användare hitta fastigheter baserat på deras preferenser (plats, pris, storlek)
2. Visa och rekommendera fastigheter från vår portfölj
3. Boka visningar och möten med våra säljare
4. Svara på frågor om fastighetsmarknaden

När du rekommenderar fastigheter, beskriv dem kortfattat och fråga om användaren vill veta mer eller boka en visning.

Om användaren vill boka ett möte, be om: namn, email, telefon, önskat datum och tid.

Var vänlig, professionell och hjälpsam. Håll svaren koncisa.`
      :
      `You are a helpful AI assistant for Future Homes International, a real estate agency selling properties in Turkey, Dubai, and Cyprus.

Your capabilities:
1. Help users find properties based on their preferences (location, price, size)
2. Display and recommend properties from our portfolio
3. Book viewings and meetings with our sales representatives
4. Answer questions about the property market

When recommending properties, describe them briefly and ask if the user wants to know more or book a viewing.

If the user wants to book a meeting, ask for: name, email, phone, preferred date and time.

Be friendly, professional, and helpful. Keep responses concise.`;

    // Build messages array with conversation history
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg: { sender: string; text: string }) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: message }
    ];

    // Add property context if properties were found
    if (properties.length > 0) {
      const propertyContext = `
Available properties matching the user's query:
${properties.map((p, i) => `${i + 1}. ${p.title} - ${p.price} in ${p.location} (${p.bedrooms} bedrooms)`).join('\n')}

Include these properties in your response and ask if they'd like more details or to book a viewing.`;
      messages.push({ role: 'system', content: propertyContext });
    }

    // Call OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({
      response: aiResponse,
      properties: properties,
      language: detectedLanguage
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in property-chatbot:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
