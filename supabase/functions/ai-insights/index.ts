import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { days = 30, traffic = {}, topProperties = [], leads = {} } =
      await req.json().catch(() => ({}));

    const t = traffic?.totals ?? {};
    const visitors = Number(t.visitors ?? 0);
    const sessions = Number(t.sessions ?? 0);
    const pageviews = Number(t.pageviews ?? 0);
    const leadTotal = Number(leads?.total ?? 0);
    const propertyViews = (topProperties ?? []).reduce(
      (sum: number, p: any) => sum + Number(p.views ?? 0),
      0
    );

    const dataBlock = JSON.stringify(
      {
        period_days: days,
        totals: { visitors, sessions, pageviews, property_detail_views: propertyViews, leads: leadTotal },
        conversion_rate_pct: visitors > 0 ? Number(((leadTotal / visitors) * 100).toFixed(2)) : 0,
        top_pages: (traffic?.pages ?? []).slice(0, 10),
        channels: traffic?.channel_raw ?? [],
        countries: traffic?.countries ?? [],
        devices: traffic?.devices ?? [],
        top_properties: (topProperties ?? []).slice(0, 12).map((p: any) => ({
          title: p.title,
          location: p.location,
          price: p.price,
          views: p.views,
        })),
        leads_by_status: leads?.byStatus ?? [],
        leads_by_source: leads?.bySource ?? [],
      },
      null,
      2
    );

    const systemPrompt = `You are a senior growth & analytics advisor for "Future Homes International", a company selling international property (Turkey, Dubai, Cyprus, Spain, Bali/Indonesia, France).
You are given REAL aggregated analytics from the company's website for the last ${days} days. Analyse the marketing funnel, traffic quality and conversion performance, and write concrete, prioritised recommendations. Base every number and claim on the data provided — do not invent metrics.

Return ONLY valid JSON (no markdown) with EXACTLY this shape:
{
  "summary": "3-4 sentence executive summary of performance this period",
  "health_score": <int 0-100>,
  "funnel": [ { "stage": "Visitors|Sessions|Property views|Leads", "value": <int>, "note": "insight about this stage / drop-off" } ],
  "conversion": { "rate_pct": <number>, "assessment": "how good/bad vs typical real-estate benchmarks", "biggest_leak": "where the funnel loses the most people" },
  "traffic_insights": [ "insight about channels, countries, devices or top pages" ],
  "property_insights": [ "insight about which listings/locations attract demand" ],
  "opportunities": [ { "title": "short", "impact": "high|medium|low", "detail": "what to do and why" } ],
  "recommendations": [ "prioritised, specific, actionable recommendation" ],
  "quick_wins": [ "something they can do this week" ]
}
Provide 3-4 funnel stages, 3-5 traffic insights, 2-4 property insights, 3-5 opportunities, 5-7 recommendations and 3-5 quick wins. Be specific to this dataset and to international real estate.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Here is the analytics data:\n\n${dataBlock}\n\nProduce the diagnostic report as JSON.` },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "rate_limited" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "payment_required" }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!response.ok) {
      const detail = await response.text();
      return new Response(JSON.stringify({ error: "AI request failed", detail }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    let report;
    try {
      report = JSON.parse(content);
    } catch {
      report = { summary: content };
    }

    return new Response(
      JSON.stringify({
        report,
        raw: {
          visitors,
          sessions,
          pageviews,
          property_views: propertyViews,
          leads: leadTotal,
          conversion_rate_pct: visitors > 0 ? Number(((leadTotal / visitors) * 100).toFixed(2)) : 0,
        },
        generated_at: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
