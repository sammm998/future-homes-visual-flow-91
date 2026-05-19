import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const { imageUrl, imageBase64, prompt } = await req.json();
    if (!prompt || (!imageUrl && !imageBase64)) {
      return new Response(JSON.stringify({ error: 'imageUrl or imageBase64 and prompt are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build data URL for the source image
    let dataUrl: string;
    if (imageBase64) {
      dataUrl = imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`;
    } else {
      // Fetch the image and convert to base64
      const imgResp = await fetch(imageUrl);
      if (!imgResp.ok) throw new Error(`Failed to fetch source image: ${imgResp.status}`);
      const buf = new Uint8Array(await imgResp.arrayBuffer());
      const contentType = imgResp.headers.get('content-type') || 'image/jpeg';
      let b64 = '';
      const chunk = 0x8000;
      for (let i = 0; i < buf.length; i += chunk) {
        b64 += String.fromCharCode.apply(null, Array.from(buf.subarray(i, i + chunk)) as any);
      }
      dataUrl = `data:${contentType};base64,${btoa(b64)}`;
    }

    const systemPrompt = `You are an expert interior and exterior designer for luxury international real estate. Re-design the provided property image according to the user's request. Keep the architectural structure (walls, windows, ceiling, room layout) recognizable so it is clearly the same space, but transform finishes, furniture, lighting, materials, colors and styling. Output a single photorealistic, high-quality redesigned image.`;

    const aiResp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: `${systemPrompt}\n\nUser request: ${prompt}` },
              { type: 'image_url', image_url: { url: dataUrl } },
            ],
          },
        ],
        modalities: ['image', 'text'],
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error('AI gateway error', aiResp.status, errText);
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded, please try again shortly.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits in workspace settings.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway ${aiResp.status}: ${errText}`);
    }

    const data = await aiResp.json();
    const msg = data?.choices?.[0]?.message;
    const generatedUrl: string | undefined =
      msg?.images?.[0]?.image_url?.url ?? msg?.images?.[0]?.url;

    if (!generatedUrl) {
      console.error('No image in response', JSON.stringify(data).slice(0, 800));
      throw new Error('Model returned no image');
    }

    return new Response(JSON.stringify({ imageUrl: generatedUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    console.error('design-home error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
