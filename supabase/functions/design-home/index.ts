import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured');

    const { imageBase64, prompt } = await req.json();
    if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 4000 || typeof imageBase64 !== 'string' || !imageBase64 || imageBase64.length > 12 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'An image upload and valid description are required' }), {
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
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(mimeType) || !/^[A-Za-z0-9+/]+={0,2}$/.test(base64Data)) return Response.json({ error: 'Invalid image' }, { status: 400, headers: corsHeaders });

    const systemPrompt = `You are an expert interior and exterior designer for luxury international real estate. Re-design the provided property image according to the user's request. Keep the architectural structure (walls, windows, ceiling, room layout) recognizable so it is clearly the same space, but transform finishes, furniture, lighting, materials, colors and styling. Output a single photorealistic, high-quality redesigned image.`;

    const model = 'gemini-2.5-flash-image';
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
