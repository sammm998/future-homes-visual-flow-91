import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

// Batch-classifies property images as interior vs facade and stores
// the interior URLs in properties.interior_images.
// Call with optional { limit: number, force: boolean } to control batch.

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { limit = 25, force = false } = (await req.json().catch(() => ({}))) as {
      limit?: number;
      force?: boolean;
    };

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SERVICE_ROLE) {
      return new Response(JSON.stringify({ error: 'Missing env' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    let q = supabase
      .from('properties')
      .select('id, property_images, interior_scanned_at')
      .eq('is_active', true)
      .not('property_images', 'is', null)
      .limit(limit);

    if (!force) q = q.is('interior_scanned_at', null);

    const { data: rows, error } = await q;
    if (error) throw error;

    const results: any[] = [];
    let creditsExhausted = false;

    for (const row of rows || []) {
      if (creditsExhausted) break;
      const imgs: string[] = Array.isArray(row.property_images) ? row.property_images.slice(0, 12) : [];
      if (imgs.length === 0) {
        await supabase
          .from('properties')
          .update({ interior_images: [], interior_scanned_at: new Date().toISOString() })
          .eq('id', row.id);
        results.push({ id: row.id, interiors: 0 });
        continue;
      }

      const content: any[] = [
        {
          type: 'text',
          text: `Classify each real estate photo as INTERIOR (inside a room: living room, bedroom, kitchen, bathroom, hallway, indoor view) or NOT interior (building facade, exterior, pool area, garden, street view, floor plan, map, aerial, amenity outside the unit). Respond ONLY with a JSON array of the indices that are interior shots. Example: [1,3,4]. No other text.`,
        },
        ...imgs.map((u) => ({ type: 'image_url', image_url: { url: u } })),
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
        console.error(`AI ${aiRes.status} for ${row.id}: ${t}`);
        if (aiRes.status === 402 || aiRes.status === 429) {
          creditsExhausted = true;
          results.push({ id: row.id, error: aiRes.status === 402 ? 'credits' : 'rate-limit' });
          break;
        }
        results.push({ id: row.id, error: `ai-${aiRes.status}` });
        continue;
      }

      const data = await aiRes.json();
      const text: string = data.choices?.[0]?.message?.content || '[]';
      const match = text.match(/\[[\d,\s]*\]/);
      let indices: number[] = [];
      try { indices = JSON.parse(match ? match[0] : '[]'); } catch { indices = []; }
      const interiors = indices
        .filter((i) => Number.isInteger(i) && i >= 0 && i < imgs.length)
        .map((i) => imgs[i]);

      await supabase
        .from('properties')
        .update({ interior_images: interiors, interior_scanned_at: new Date().toISOString() })
        .eq('id', row.id);

      results.push({ id: row.id, interiors: interiors.length });
    }

    return new Response(
      JSON.stringify({
        processed: results.length,
        creditsExhausted,
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (e) {
    console.error('precompute-interiors error:', e);
    return new Response(JSON.stringify({ error: String((e as any)?.message || e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
