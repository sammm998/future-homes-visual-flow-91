import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topics, mode = 'single', customPrompt } = await req.json();
    console.log('Generating articles for topics:', topics, 'Mode:', mode);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const results = [];

    for (const topic of (Array.isArray(topics) ? topics : [topics])) {
      try {
        console.log('Generating article for topic:', topic.title || topic);
        
        const prompt = customPrompt || `Write a comprehensive article about "${topic.title || topic}" with the following requirements:

1. Target audience: People interested in international real estate, investment, and living abroad
2. Length: At least 1000 words
3. Structure: Use HTML with proper headings (h2, h3), paragraphs, lists, and div containers with Tailwind classes
4. Style: Professional, informative, and engaging
5. Include practical information, tips, and actionable advice
6. Format using colored section boxes like this example:
   <div class="bg-blue-50 p-6 rounded-lg">
     <h3 class="text-xl font-semibold text-blue-800 mb-4">Section Title</h3>
     <div class="space-y-4 text-gray-700">
       <p>Content here...</p>
     </div>
   </div>

Create sections with different background colors (blue-50, green-50, purple-50, orange-50, red-50, yellow-50, indigo-50, etc.) and matching text colors.

Write the complete article content as HTML that can be directly inserted into a blog post.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4.1-2025-04-14',
            messages: [
              { 
                role: 'system', 
                content: 'You are an expert content writer specializing in international real estate, investment, and expatriate living. Write comprehensive, well-structured articles with practical value.' 
              },
              { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 4000,
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const generatedContent = data.choices[0].message.content;

        // Generate slug from title
        const slug = (topic.title || topic)
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-');

        // Create excerpt from first paragraph - clean HTML and get meaningful text
        const textContent = generatedContent
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .trim();
        
        // Get first meaningful sentence or paragraph
        const sentences = textContent.split(/[.!?]+/);
        let excerpt = sentences[0];
        
        // If first sentence is too short, add more sentences
        if (excerpt.length < 100 && sentences.length > 1) {
          for (let i = 1; i < sentences.length && excerpt.length < 200; i++) {
            if (sentences[i].trim()) {
              excerpt += '. ' + sentences[i].trim();
            }
          }
        }
        
        excerpt = excerpt.substring(0, 250).trim();
        if (!excerpt.endsWith('.')) {
          excerpt += '...';
        }

        if (mode === 'generate') {
          // Save to database
          const { data: articleData, error } = await supabase
            .from('blog_posts')
            .insert({
              title: topic.title || topic,
              slug,
              excerpt,
              content: generatedContent,
              published: false
            })
            .select()
            .single();

          if (error) {
            console.error('Database error:', error);
            throw error;
          }

          results.push({
            success: true,
            article: articleData,
            topic: topic.title || topic
          });
        } else {
          // Return content without saving
          results.push({
            success: true,
            content: generatedContent,
            title: topic.title || topic,
            slug,
            excerpt,
            topic: topic.title || topic
          });
        }

        console.log('Successfully generated article for:', topic.title || topic);

      } catch (error) {
        console.error('Error generating article for topic:', topic.title || topic, error);
        results.push({
          success: false,
          error: error.message,
          topic: topic.title || topic
        });
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      results,
      generated: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-article function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});