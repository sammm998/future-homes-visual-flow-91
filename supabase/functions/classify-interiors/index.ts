import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

// Classifies a list of image URLs as interior or exterior using Gemini vision.
// Returns the subset that are interior shots (inside the apartment/house).

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { imageUrls } = await req.json();
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return new Response(JSON.stringify({ interiors: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'Missing LOVABLE_API_KEY' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Limit to avoid huge payloads
    const urls = imageUrls.slice(0, 30);

    const content: any[] = [
      {
        type: 'text',
        text: `You are classifying real estate photos. For each image below (in order, indexed from 0), decide if it is an INTERIOR shot (inside a room: living room, bedroom, kitchen, bathroom, hallway, indoor view) or NOT interior (building facade, exterior, pool area, garden, street view, floor plan, map, aerial, amenity outside the unit). Respond with ONLY a JSON array of the indices (numbers) that are interior shots. Example: [1,3,4]. No other text.`,
      },
      ...urls.map((u: string) => ({ type: 'image_url', image_url: { url: u } })),
    ];

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content }],
      }),
    });

    if (!aiRes.ok) {
      const t = await aiRes.text();
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error ${aiRes.status}: ${t}`);
    }

    const data = await aiRes.json();
    const text: string = data.choices?.[0]?.message?.content || '[]';
    const match = text.match(/\[[\d,\s]*\]/);
    let indices: number[] = [];
    try {
      indices = JSON.parse(match ? match[0] : '[]');
    } catch {
      indices = [];
    }
    const interiors = indices
      .filter((i) => Number.isInteger(i) && i >= 0 && i < urls.length)
      .map((i) => urls[i]);

    return new Response(JSON.stringify({ interiors }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('classify-interiors error:', e);
    return new Response(JSON.stringify({ error: String((e as any)?.message || e), interiors: [] }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
