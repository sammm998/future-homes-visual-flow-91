import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { brand = "Future Homes International", competitors = [], mentions = [], focus = "" } =
      await req.json().catch(() => ({}));

    const userMentionsBlock =
      mentions.length > 0
        ? `\n\nThe team also pasted these real mentions/comments to include in the analysis:\n${mentions
            .map((m: string, i: number) => `${i + 1}. ${m}`)
            .join("\n")}`
        : "";

    const systemPrompt = `You are a senior social-listening and brand-diagnostics analyst for a real-estate company.
You analyse what people say online about the brand "${brand}", a company selling international property (Turkey, Dubai, Cyprus, Spain, Bali/Indonesia, France).
Competitors to compare against: ${competitors.length ? competitors.join(", ") : "typical international real-estate agencies"}.
Focus area from the team: ${focus || "general brand health"}.
${userMentionsBlock}

Return ONLY valid JSON (no markdown) with EXACTLY this shape:
{
  "summary": "2-3 sentence executive summary of the current brand perception",
  "sentiment": { "positive": <int 0-100>, "neutral": <int 0-100>, "negative": <int 0-100> },
  "sentiment_trend": "improving | stable | declining",
  "mentions": [ { "author": "handle or source", "source": "platform", "text": "what they said", "sentiment": "positive|neutral|negative" } ],
  "top_mentioners": [ { "name": "who", "reach": "reach/why they matter" } ],
  "themes": [ { "theme": "topic", "sentiment": "positive|neutral|negative", "note": "detail" } ],
  "competitors": [ { "name": "competitor", "perception": "what people say vs us", "gap": "opportunity for us" } ],
  "business_tips": [ "actionable tip" ],
  "recommendations": [ "prioritised strategic recommendation" ]
}
The percentages in "sentiment" must sum to 100. Provide 5-8 mentions, 4-6 themes, 2-4 competitors, 4-6 tips and 4-6 recommendations. Be realistic and specific to international real estate.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate the social-listening and diagnostic report for ${brand}.` },
        ],
        temperature: 0.6,
        max_tokens: 2500,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      return new Response(JSON.stringify({ error: "AI request failed", detail: t }), {
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
      report = { summary: content, sentiment: { positive: 0, neutral: 0, negative: 0 } };
    }

    return new Response(JSON.stringify({ report, generated_at: new Date().toISOString() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
