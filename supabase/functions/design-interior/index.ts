import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { imageUrl, prompt, propertyContext } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: 'prompt required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'Missing LOVABLE_API_KEY' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const content: any[] = [];

    // If editing an existing generated image, include it. Otherwise generate from scratch.
    if (imageUrl) {
      let dataUrl = imageUrl;
      if (imageUrl.startsWith('http')) {
        const imgRes = await fetch(imageUrl);
        if (imgRes.ok) {
          const buf = new Uint8Array(await imgRes.arrayBuffer());
          const mime = imgRes.headers.get('content-type') || 'image/jpeg';
          let bin = '';
          for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
          dataUrl = `data:${mime};base64,${btoa(bin)}`;
        }
      }
      content.push({
        type: 'text',
        text: `Edit this interior render: ${prompt}. Keep the same room, perspective and overall structure. Only change/add what is requested. Photorealistic interior photography, high quality.`,
      });
      content.push({ type: 'image_url', image_url: { url: dataUrl } });
    } else {
      // Generate a fresh interior from scratch
      const ctx = propertyContext ? ` Property context: ${propertyContext}.` : '';
      content.push({
        type: 'text',
        text: `Generate a photorealistic interior photograph of a modern apartment LIVING ROOM. Do NOT show any building exterior, facade, balcony view from outside, or street view. Show only the inside of the apartment.${ctx} User design request: ${prompt}. Style: high-end interior design photography, natural lighting, magazine quality, 4K, wide angle.`,
      });
    }

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        messages: [{ role: 'user', content }],
        modalities: ['image', 'text'],
      }),
    });

    if (!aiRes.ok) {
      const t = await aiRes.text();
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits to your workspace.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error ${aiRes.status}: ${t}`);
    }

    const data = await aiRes.json();
    const generatedUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!generatedUrl) {
      return new Response(JSON.stringify({ error: 'No image returned', raw: data }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ imageUrl: generatedUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('design-interior error:', e);
    return new Response(JSON.stringify({ error: String((e as any)?.message || e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
