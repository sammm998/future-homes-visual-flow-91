import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured');

    const { imageUrl, imageBase64, prompt } = await req.json();
    if (!prompt || (!imageUrl && !imageBase64)) {
      return new Response(JSON.stringify({ error: 'imageUrl or imageBase64 and prompt are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Resolve source image to raw base64 + mime type
    let mimeType = 'image/jpeg';
    let base64Data = '';
    if (imageBase64) {
      if (imageBase64.startsWith('data:')) {
        const match = imageBase64.match(/^data:([^;]+);base64,(.*)$/);
        if (!match) throw new Error('Invalid imageBase64 data URL');
        mimeType = match[1];
        base64Data = match[2];
      } else {
        base64Data = imageBase64;
      }
    } else {
      const imgResp = await fetch(imageUrl);
      if (!imgResp.ok) throw new Error(`Failed to fetch source image: ${imgResp.status}`);
      const buf = new Uint8Array(await imgResp.arrayBuffer());
      mimeType = imgResp.headers.get('content-type') || 'image/jpeg';
      let b64 = '';
      const chunk = 0x8000;
      for (let i = 0; i < buf.length; i += chunk) {
        b64 += String.fromCharCode.apply(null, Array.from(buf.subarray(i, i + chunk)) as any);
      }
      base64Data = btoa(b64);
    }

    const systemPrompt = `You are an expert interior and exterior designer for luxury international real estate. Re-design the provided property image according to the user's request. Keep the architectural structure (walls, windows, ceiling, room layout) recognizable so it is clearly the same space, but transform finishes, furniture, lighting, materials, colors and styling. Output a single photorealistic, high-quality redesigned image.`;

    const model = 'gemini-2.5-flash-image-preview';
    const aiResp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: `${systemPrompt}\n\nUser request: ${prompt}` },
                { inline_data: { mime_type: mimeType, data: base64Data } },
              ],
            },
          ],
          generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
        }),
      }
    );

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error('Gemini API error', aiResp.status, errText);
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded, please try again shortly.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`Gemini API ${aiResp.status}: ${errText}`);
    }

    const data = await aiResp.json();
    const parts = data?.candidates?.[0]?.content?.parts ?? [];
    let generatedUrl: string | undefined;
    for (const p of parts) {
      const inline = p.inline_data || p.inlineData;
      if (inline?.data) {
        const mt = inline.mime_type || inline.mimeType || 'image/png';
        generatedUrl = `data:${mt};base64,${inline.data}`;
        break;
      }
    }

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
